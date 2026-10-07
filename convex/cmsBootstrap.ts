import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { editorialFields, validateEditorial } from "./editorialModel";

// Authenticated deployment operators only. No public API or role-granting side
// effects. A source changed after import must be reconciled by a CMS editor.
export const publishLegacy = internalMutation({
  args: { records: v.array(v.object({ ...editorialFields, sourceUrl: v.string(), checksum: v.string() })) },
  handler: async (ctx, { records }) => {
    if (!records.length || records.length > 10) throw new ConvexError("Use batches of 1–10 reviewed articles.");
    let published = 0, unchanged = 0;
    for (const record of records) {
      const { sourceUrl, checksum, ...input } = record;
      const source = new URL(sourceUrl);
      if (source.origin !== "https://www.niaforrester.com" || source.username || source.password || source.hash || !/^[a-f0-9]{64}$/.test(checksum)) throw new ConvexError("Invalid legacy source.");
      if (input.status !== "published" || /^(test(?:ing)?|qa)(-|\s|\b)/i.test(input.slug) || /^(test(?:ing)?|qa)(\s|\b)/i.test(input.title)) throw new ConvexError("Only reviewed public articles may be imported.");
      validateEditorial(input);
      const previous = await ctx.db.query("editorialImports").withIndex("by_source", q => q.eq("sourceUrl", sourceUrl)).unique();
      if (previous?.status === "skipped") throw new ConvexError("Editor skipped this source; reconcile it in the CMS.");
      if (previous?.checksum === checksum && previous.status === "drafted" && previous.targetId) { unchanged++; continue; }
      if (previous?.status === "drafted") throw new ConvexError("Imported source changed; use editorial review.");
      const duplicate = await ctx.db.query("editorialPosts").withIndex("by_slug", q => q.eq("slug", input.slug)).unique();
      if (duplicate) throw new ConvexError("Slug already exists; refusing to overwrite authored content.");
      const now = Date.now(), actor = "operator:approved-legacy-publication";
      const id = await ctx.db.insert("editorialPosts", { ...input, sourceUrl, searchText: `${input.title} ${input.excerpt} ${input.tags.join(" ")}`, version: 1, createdAt: now, updatedAt: now, updatedBy: actor });
      const importValues = { sourceUrl, checksum, payload: JSON.stringify(input), status: "drafted" as const, targetId: id, updatedAt: now };
      if (previous) await ctx.db.patch(previous._id, importValues);
      else await ctx.db.insert("editorialImports", { ...importValues, createdAt: now });
      await ctx.db.insert("auditLog", { actorAuthUserId: actor, action: "cms.legacy.published", entityType: "editorialPost", entityId: id, createdAt: now });
      published++;
    }
    return { published, unchanged };
  },
});

// Narrow repair for numeric entities in legacy metadata; never overwrite an
// editor's work or alter original story blocks, dates, or publication status.
export const repairLegacyExcerpts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("editorialPosts").collect();
    let repaired = 0;
    for (const post of posts) {
      if (post.updatedBy !== "operator:approved-legacy-publication" || post.version !== 1 || !post.sourceUrl?.startsWith("https://www.niaforrester.com/")) continue;
      const excerpt = post.excerpt.replace(/&#(x[\da-f]+|\d+);/gi, (entity, code: string) => {
        const point = code.toLowerCase().startsWith("x") ? parseInt(code.slice(1), 16) : Number(code);
        return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
      });
      if (excerpt === post.excerpt) continue;
      const now = Date.now(), actor = "operator:legacy-excerpt-repair";
      await ctx.db.insert("editorialRevisions", { postId: post._id, version: post.version, snapshot: JSON.stringify(post), actor, createdAt: now });
      await ctx.db.patch(post._id, { excerpt, searchText: `${post.title} ${excerpt} ${post.tags.join(" ")}`, version: 2, updatedAt: now, updatedBy: actor });
      await ctx.db.insert("auditLog", { actorAuthUserId: actor, action: "cms.legacy.excerpt-repaired", entityType: "editorialPost", entityId: post._id, createdAt: now });
      repaired++;
    }
    return { repaired };
  },
});
