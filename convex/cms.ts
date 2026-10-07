import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { editorialFields, editorialKind, validateEditorial } from "./editorialModel";
import { requireRole } from "./security";
import { authComponent } from "./auth";
import type { Doc } from "./_generated/dataModel";
import { z } from "zod";

function publicFields(row: Doc<"editorialPosts">) {
  return {_id:row._id,_creationTime:row._creationTime,kind:row.kind,title:row.title,slug:row.slug,
    excerpt:row.excerpt,author:row.author,category:row.category,tags:row.tags,coverUrl:row.coverUrl,coverAlt:row.coverAlt,
    status:row.status,publishedAt:row.publishedAt,createdAt:row.createdAt,updatedAt:row.updatedAt,version:row.version,sourceUrl:row.sourceUrl};
}

const conflict = (message: string): never => { throw new ConvexError({ code: "CONFLICT", message }); };
export const access = query({args: {}, handler: async ctx => {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) return {allowed: false, role: null};
  const profile = await ctx.db.query("profiles").withIndex("by_auth_user", q => q.eq("authUserId", user._id)).unique();
  return {allowed: profile?.role === "editor" || profile?.role === "admin", role: profile?.role ?? null};
}});

export const listStaff = query({args: {}, handler: async ctx => {
  await requireRole(ctx, ["editor", "admin"]);
  return ctx.db.query("editorialPosts").withIndex("by_updated").order("desc").take(500);
}});
export const preview = query({args: {id: v.id("editorialPosts")}, handler: async (ctx, {id}) => {
  await requireRole(ctx, ["editor", "admin"]); return ctx.db.get(id);
}});
export const revisions = query({args: {id: v.id("editorialPosts")}, handler: async (ctx, {id}) => {
  await requireRole(ctx, ["editor", "admin"]);
  return ctx.db.query("editorialRevisions").withIndex("by_post", q => q.eq("postId", id)).order("desc").take(50);
}});
export const listPublic = query({args: {kind: editorialKind, category: v.optional(v.string()), search: v.optional(v.string()), paginationOpts: paginationOptsValidator}, handler: async (ctx, args) => {
  if (args.paginationOpts.numItems < 1 || args.paginationOpts.numItems > 50) throw new ConvexError("Invalid page size");
  const needle = args.search?.trim();
  if (needle) {
    const result = await ctx.db.query("editorialPosts").withSearchIndex("search_editorial", q => {
      const search = q.search("searchText", needle).eq("kind", args.kind).eq("status", "published");
      return args.category ? search.eq("category", args.category) : search;
    }).paginate(args.paginationOpts);
    return {...result,page:result.page.map(publicFields)};
  }
  let rows = ctx.db.query("editorialPosts").withIndex("by_kind_status_date", q => q.eq("kind", args.kind).eq("status", "published")).order("desc");
  if (args.category) rows = rows.filter(q => q.eq(q.field("category"), args.category));
  const result = await rows.paginate(args.paginationOpts);
  return {...result, page: result.page.map(publicFields)};
}});
export const bySlug = query({args: {slug: v.string(), kind: editorialKind}, handler: async (ctx, args) => {
  const row = await ctx.db.query("editorialPosts").withIndex("by_slug", q => q.eq("slug", args.slug)).unique();
  if (!row || row.status !== "published" || row.kind !== args.kind) return null;
  return {...publicFields(row),blocks:row.blocks};
}});

export const categories = query({args:{kind:editorialKind},handler:async(ctx,args)=>{
 const rows=await ctx.db.query("editorialPosts").withIndex("by_kind_status_date",q=>q.eq("kind",args.kind).eq("status","published")).take(1000);
 return [...new Set(rows.map(row=>row.category).filter(Boolean))].sort();
}});
export const sitemap = query({args:{},handler:async ctx=>{
 const kinds=["blog","quick_bite","short_read","outtake"] as const;
 const groups=await Promise.all(kinds.map(kind=>ctx.db.query("editorialPosts").withIndex("by_kind_status_date",q=>q.eq("kind",kind).eq("status","published")).take(1000)));
 const rows=groups.flat();
 return rows.map(row=>({slug:row.slug,kind:row.kind,updatedAt:row.updatedAt}));
}});

export const save = mutation({args: {id: v.optional(v.id("editorialPosts")), expectedVersion: v.optional(v.number()), ...editorialFields}, handler: async (ctx, args) => {
  const {user} = await requireRole(ctx, ["editor", "admin"]);
  const {id, expectedVersion, ...input} = args; validateEditorial(input);
  const duplicate = await ctx.db.query("editorialPosts").withIndex("by_slug", q => q.eq("slug", input.slug)).unique();
  if (duplicate && duplicate._id !== id) conflict("That slug is already used.");
  const existing = id ? await ctx.db.get(id) : null;
  if (id && (!existing || existing.version !== expectedVersion)) conflict("This post changed. Reload before saving.");
  const now = Date.now(); const version = (existing?.version ?? 0) + 1;
  const values = {...input, searchText:`${input.title} ${input.excerpt} ${input.tags.join(" ")}`, publishedAt: input.publishedAt ?? existing?.publishedAt ?? (input.status === "published" && !existing?.sourceUrl ? now : undefined), updatedBy: user._id, updatedAt: now, version};
  let postId = id;
  if (existing && id) {
    await ctx.db.insert("editorialRevisions", {postId: id, version: existing.version, snapshot: JSON.stringify(existing), actor: user._id, createdAt: now});
    await ctx.db.patch(id, values);
  } else postId = await ctx.db.insert("editorialPosts", {...values, createdAt: now});
  if (!postId) throw new ConvexError("Unable to save content");
  await ctx.db.insert("auditLog", {actorAuthUserId:user._id,action:`cms.${input.status}`,entityType:"editorialPost",entityId:postId,createdAt:now});
  return {id: postId, version};
}});

export const uploadUrl = mutation({args: {}, handler: async ctx => {
  await requireRole(ctx, ["editor", "admin"]); return ctx.storage.generateUploadUrl();
}});
export const acceptMedia = mutation({args: {storageId: v.id("_storage")}, handler: async (ctx, args) => {
  const {user} = await requireRole(ctx, ["editor", "admin"]);
  const meta = await ctx.db.system.get(args.storageId);
  if (!meta || meta.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(meta.contentType ?? "")) throw new ConvexError("Use JPEG, PNG, or WebP images up to 5 MB.");
  const url = await ctx.storage.getUrl(args.storageId); if (!url) throw new ConvexError("Upload not found");
  const existing = await ctx.db.query("editorialMedia").withIndex("by_storage", q => q.eq("storageId", args.storageId)).unique();
  if (!existing) await ctx.db.insert("editorialMedia", {...args,url,uploadedBy:user._id,createdAt:Date.now()});
  return {url, storageId:args.storageId};
}});

export const stageImports = mutation({args: {records: v.array(v.object({sourceUrl:v.string(),checksum:v.string(),payload:v.string()}))}, handler: async (ctx, args) => {
  await requireRole(ctx, ["editor", "admin"]);
  if (args.records.length > 25) throw new ConvexError("Stage up to 25 records per batch.");
  let staged=0, unchanged=0;
  for (const record of args.records) {
    let url: URL;
    try {url = new URL(record.sourceUrl);} catch {throw new ConvexError("Invalid import source URL");}
    if (url.origin !== "https://www.niaforrester.com" || url.username || url.password || !/^[a-f0-9]{64}$/.test(record.checksum) || record.payload.length > 800000) throw new ConvexError("Invalid import source or payload");
    const old = await ctx.db.query("editorialImports").withIndex("by_source", q => q.eq("sourceUrl",record.sourceUrl)).unique();
    if (old?.checksum === record.checksum) {unchanged++; continue;}
    if (old?.status === "drafted") conflict("Previously imported source changed; review it without overwriting published content.");
    const now=Date.now();
    if(old) await ctx.db.patch(old._id,{...record,status:"staged",updatedAt:now});
    else await ctx.db.insert("editorialImports",{...record,status:"staged",createdAt:now,updatedAt:now});
    staged++;
  }
  return {staged,unchanged};
}});
export const importQueue = query({args: {}, handler: async ctx => {
  await requireRole(ctx,["editor","admin"]); return ctx.db.query("editorialImports").withIndex("by_status", q=>q.eq("status","staged")).take(500);
}});
export const reviewImport = mutation({args: {id:v.id("editorialImports"),decision:v.union(v.literal("approve"),v.literal("skip")),expectedChecksum:v.string()}, handler: async (ctx,args) => {
  const {user}=await requireRole(ctx,["editor","admin"]); const record=await ctx.db.get(args.id);
  if(!record || record.status!=="staged" || record.checksum!==args.expectedChecksum) return conflict("Import changed. Reload the review queue.");
  const now=Date.now();
  if(args.decision==="skip") {
    await ctx.db.patch(args.id,{status:"skipped",updatedAt:now});
    await ctx.db.insert("auditLog",{actorAuthUserId:user._id,action:"cms.import.skipped",entityType:"editorialImport",entityId:args.id,createdAt:now});
    return null;
  }
  // Run the same strict validators as authored content before trusting imported JSON.
  let parsed: unknown;
  try {parsed=JSON.parse(record.payload);} catch {throw new ConvexError("Invalid import JSON; review the source before approval.");}
  const input = editorialImportValue(parsed);
  validateEditorial(input);
  if(!input.blocks.length) throw new ConvexError("This source has no extracted content. Review manually.");
  if(await ctx.db.query("editorialPosts").withIndex("by_slug",q=>q.eq("slug",input.slug)).unique()) conflict("Slug exists. Resolve the duplicate before importing.");
  const postId=await ctx.db.insert("editorialPosts",{...input,searchText:`${input.title} ${input.excerpt} ${input.tags.join(" ")}`,status:"draft",sourceUrl:record.sourceUrl,sourceChecksum:record.checksum,version:1,updatedBy:user._id,createdAt:now,updatedAt:now});
  await ctx.db.patch(args.id,{status:"drafted",targetId:postId,updatedAt:now});
  await ctx.db.insert("auditLog",{actorAuthUserId:user._id,action:"cms.import.drafted",entityType:"editorialPost",entityId:postId,createdAt:now});
  return postId;
}});

const text = z.string();
const importSchema = z.object({
  kind:z.enum(["blog","quick_bite","short_read","outtake"]), title:text,slug:text,excerpt:text,author:text,category:text,tags:z.array(text),
  coverUrl:text.optional(),coverAlt:text.optional(),publishedAt:z.number().optional(),status:z.literal("draft"),
  blocks:z.array(z.discriminatedUnion("type",[
    z.object({type:z.literal("paragraph"),text}),z.object({type:z.literal("heading"),text,level:z.union([z.literal(2),z.literal(3)])}),
    z.object({type:z.literal("quote"),text}),z.object({type:z.literal("link"),text,url:text}),
    z.object({type:z.literal("image"),url:text,alt:text,caption:text.optional()}),z.object({type:z.literal("video"),url:text,title:text}),
  ])),
});
function editorialImportValue(value: unknown) {const result=importSchema.safeParse(value);if(!result.success)throw new ConvexError("Unsupported import payload; map the source before approval.");return result.data;}
