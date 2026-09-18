import { ConvexError, v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { requireAuth, requireRole } from "./security";
import type { MutationCtx, QueryCtx } from "./_generated/server";

function text(value: string, label: string, min: number, max: number) {
  const result = value.trim();
  if (result.length < min || result.length > max) throw new ConvexError(`${label} must be ${min}–${max} characters.`);
  return result;
}
async function staff(ctx: QueryCtx | MutationCtx) {
  const result = await requireRole(ctx, ["admin", "editor"]);
  if (!result.user.emailVerified) throw new ConvexError("Verify your email before accessing studio submissions.");
  return result;
}
export const catalog = query({ args: {}, handler: async ctx => {
  const services = await ctx.db.query("services").withIndex("by_status_sort", q => q.eq("status", "published")).collect();
  const courses = (await ctx.db.query("studioCourses").collect()).filter(c => c.status !== "draft").sort((a,b) => a.sortOrder-b.sortOrder);
  return { services, courses };
}});
export const mine = query({ args: {}, handler: async ctx => {
  const user = await requireAuth(ctx);
  const requests = await ctx.db.query("bookings").withIndex("by_auth_user", q => q.eq("authUserId", user._id)).order("desc").collect();
  const interests = await ctx.db.query("studioInterests").withIndex("by_user", q => q.eq("authUserId", user._id)).collect();
  const profile = await ctx.db.query("profiles").withIndex("by_auth_user", q => q.eq("authUserId", user._id)).unique();
  return { requests: await Promise.all(requests.map(async r => ({ ...r, serviceTitle: (await ctx.db.get(r.serviceId))?.title ?? "Archived Service" }))), interests, canManage: Boolean(user.emailVerified && (profile?.role === "admin" || profile?.role === "editor")) };
}});
export const request = mutation({ args: {
  serviceId: v.id("services"), name: v.string(), projectTitle: v.string(), genre: v.string(), wordCount: v.number(), timeline: v.string(), notes: v.string(), sample: v.string(), consent: v.boolean(),
}, handler: async (ctx, args) => {
  const user = await requireAuth(ctx);
  const service = await ctx.db.get(args.serviceId);
  if (!service || service.status !== "published") throw new ConvexError("This service is not accepting requests.");
  if (service.bookingUrl) throw new ConvexError("Use this service’s booking provider.");
  if (!args.consent) throw new ConvexError("Please confirm permission to review your submission.");
  if (!Number.isInteger(args.wordCount) || args.wordCount < 1 || args.wordCount > 1000000) throw new ConvexError("Enter a manuscript word count between 1 and 1,000,000.");
  const data = { name: text(args.name,"Name",2,100), projectTitle: text(args.projectTitle,"Project title",2,200), genre: text(args.genre,"Genre",2,100), timeline: text(args.timeline,"Timeline",2,300), notes: text(args.notes,"Goals",20,5000), sample: text(args.sample,"Sample",service.slug === "first-ten-pages-review" ? 20 : 0,30000) };
  if (data.sample.split(/\s+/).filter(Boolean).length > 3000) throw new ConvexError("Limit your sample to 3,000 words and no more than ten manuscript pages.");
  const previous = await ctx.db.query("bookings").withIndex("by_auth_user", q => q.eq("authUserId", user._id)).collect();
  const active = previous.find(r => r.serviceId === args.serviceId && (r.status === "requested" || r.status === "scheduled"));
  if (active) return active._id;
  if (previous.some(r => Date.now()-r.createdAt < 60000)) throw new ConvexError("Please wait a minute before sending another request.");
  const now = Date.now();
  return ctx.db.insert("bookings", { ...data, serviceId: service._id, authUserId: user._id, email: user.email, wordCount: args.wordCount, consentedAt: now, status: "requested", createdAt: now, updatedAt: now });
}});
export const cancelRequest = mutation({ args: { id: v.id("bookings") }, handler: async (ctx, { id }) => {
  const user = await requireAuth(ctx); const row = await ctx.db.get(id);
  if (!row || row.authUserId !== user._id) throw new ConvexError("Request not found.");
  if (row.status !== "requested") throw new ConvexError("Only pending requests can be withdrawn. Contact the studio about scheduled work.");
  await ctx.db.patch(id, { status: "canceled", updatedAt: Date.now() });
}});
export const interest = mutation({ args: { courseId: v.optional(v.id("studioCourses")), active: v.boolean() }, handler: async (ctx, args) => {
  const user = await requireAuth(ctx);
  if (args.courseId && args.active) { const course = await ctx.db.get(args.courseId); if (!course || course.status === "draft" || course.status === "closed") throw new ConvexError("This course is not accepting interest."); }
  const rows = await ctx.db.query("studioInterests").withIndex("by_user", q => q.eq("authUserId", user._id)).collect();
  const existing = rows.find(r => r.courseId === args.courseId);
  const values = { active: args.active, email: user.email, updatedAt: Date.now() };
  if (existing) { await ctx.db.patch(existing._id, { ...values, ...(args.active && !existing.active ? { consentedAt: Date.now() } : {}) }); return existing._id; }
  if (!args.active) return null;
  return ctx.db.insert("studioInterests", { ...values, authUserId: user._id, courseId: args.courseId, consentedAt: Date.now() });
}});
export const inbox = query({ args: {}, handler: async ctx => {
  await staff(ctx);
  const requests = await ctx.db.query("bookings").order("desc").take(100);
  return Promise.all(requests.map(async r => ({ ...r, serviceTitle: (await ctx.db.get(r.serviceId))?.title ?? "Archived Service" })));
}});
export const interestInbox = query({ args: {}, handler: async ctx => {
  await staff(ctx);
  const rows = await ctx.db.query("studioInterests").filter(q => q.eq(q.field("active"), true)).order("desc").take(100);
  return Promise.all(rows.map(async r => ({ _id: r._id, email: r.email, consentedAt: r.consentedAt, courseTitle: r.courseId ? (await ctx.db.get(r.courseId))?.title ?? "Archived Course" : "Future Studio Classes" })));
}});
export const reply = mutation({ args: { id: v.id("bookings"), reply: v.string(), status: v.union(v.literal("requested"),v.literal("scheduled"),v.literal("completed"),v.literal("canceled")), scheduledAt: v.optional(v.number()) }, handler: async (ctx,args) => {
  await staff(ctx); const row = await ctx.db.get(args.id);
  if (!row) throw new ConvexError("Request not found.");
  if (args.status === "scheduled" && (!args.scheduledAt || !Number.isFinite(args.scheduledAt) || args.scheduledAt <= Date.now())) throw new ConvexError("Choose a future appointment time.");
  await ctx.db.patch(row._id, { staffReply: text(args.reply,"Reply",2,5000), status: args.status, scheduledAt: args.status === "scheduled" ? args.scheduledAt : row.scheduledAt, updatedAt: Date.now() });
}});
// Only supplies already-approved service descriptions to the local preview. No prices or dates are invented.
export const initializeLocal = internalMutation({ args: {}, handler: async ctx => {
  if (process.env.SITE_URL !== "http://127.0.0.1:4321") throw new Error("Local preview only");
  const specs = [
    { slug: "first-ten-pages-review", title: "First 10 Pages Review", description: "A complimentary editorial review of your opening ten manuscript pages.", priceInCents: 0 },
    { slug: "story-critique", title: "Story Critique", description: "Focused feedback on your story’s opening, voice, and direction." },
    { slug: "manuscript-review", title: "Manuscript Review", description: "An assessment of structure, pacing, character, and voice." },
    { slug: "coaching", title: "1:1 Coaching", description: "Request a conversation about plot, craft, or your writing goals." },
    { slug: "developmental-editing", title: "Developmental Editing", description: "Discuss an editorial partnership tailored to your manuscript." },
  ];
  for (const [sortOrder,s] of specs.entries()) {
    if (!await ctx.db.query("services").withIndex("by_slug",q=>q.eq("slug",s.slug)).unique()) await ctx.db.insert("services", { ...s, sortOrder, status: "published", createdAt: Date.now(), updatedAt: Date.now() });
  }
}});
