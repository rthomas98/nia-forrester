import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./security";

export const mine = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query("readingProgress")
      .withIndex("by_user_updated", (q) => q.eq("authUserId", user._id))
      .order("desc")
      .take(50);
  },
});

export const currentBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!content) return null;
    const progress = await ctx.db
      .query("readingProgress")
      .withIndex("by_user_content", (q) =>
        q.eq("authUserId", user._id).eq("contentId", content._id),
      )
      .unique();
    if (!progress) return null;
    const chapter = progress.chapterId
      ? await ctx.db.get(progress.chapterId)
      : null;
    return { ...progress, chapterNumber: chapter?.number };
  },
});

export const save = mutation({
  args: {
    contentId: v.id("content"),
    chapterId: v.optional(v.id("chapters")),
    percent: v.number(),
    position: v.optional(v.number()),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const percent = Math.max(0, Math.min(100, args.percent));
    const existing = await ctx.db
      .query("readingProgress")
      .withIndex("by_user_content", (q) =>
        q.eq("authUserId", user._id).eq("contentId", args.contentId),
      )
      .unique();
    const values = { ...args, percent, updatedAt: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, values);
      return existing._id;
    }
    return ctx.db.insert("readingProgress", {
      authUserId: user._id,
      ...values,
    });
  },
});

export const saveBySlug = mutation({
  args: {
    slug: v.string(),
    chapterNumber: v.number(),
    percent: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!content) throw new Error("Content not found");
    const chapter = await ctx.db
      .query("chapters")
      .withIndex("by_content_number", (q) =>
        q.eq("contentId", content._id).eq("number", args.chapterNumber),
      )
      .unique();
    const existing = await ctx.db
      .query("readingProgress")
      .withIndex("by_user_content", (q) =>
        q.eq("authUserId", user._id).eq("contentId", content._id),
      )
      .unique();
    const values = {
      contentId: content._id,
      chapterId: chapter?._id,
      percent: Math.max(0, Math.min(100, args.percent)),
      completed: args.percent >= 100,
      updatedAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, values);
      return existing._id;
    }
    return ctx.db.insert("readingProgress", {
      authUserId: user._id,
      ...values,
    });
  },
});
