import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, requireRole } from "./security";

export const listThreads = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) =>
    ctx.db
      .query("threads")
      .withIndex("by_status_activity", (q) => q.eq("status", "open"))
      .order("desc")
      .take(Math.min(args.limit ?? 30, 50)),
});

export const createThread = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
    contentId: v.optional(v.id("content")),
    clubId: v.optional(v.id("clubs")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const now = Date.now();
    const slug = `${args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64)}-${now.toString(36)}`;
    return ctx.db.insert("threads", {
      ...args,
      slug,
      authorAuthUserId: user._id,
      status: "open",
      pinned: false,
      replyCount: 0,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const reply = mutation({
  args: {
    threadId: v.id("threads"),
    body: v.string(),
    parentPostId: v.optional(v.id("posts")),
    spoilerChapter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const thread = await ctx.db.get(args.threadId);
    if (!thread || thread.status !== "open") {
      throw new Error("This discussion is not open for replies");
    }
    const now = Date.now();
    const postId = await ctx.db.insert("posts", {
      ...args,
      authorAuthUserId: user._id,
      status: "visible",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(thread._id, {
      replyCount: thread.replyCount + 1,
      lastActivityAt: now,
      updatedAt: now,
    });
    return postId;
  },
});

export const moderatePost = mutation({
  args: {
    postId: v.id("posts"),
    status: v.union(v.literal("visible"), v.literal("hidden"), v.literal("removed")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireRole(ctx, ["moderator", "admin"]);
    await ctx.db.patch(args.postId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("auditLog", {
      actorAuthUserId: user._id,
      action: `post.${args.status}`,
      entityType: "post",
      entityId: args.postId,
      metadata: args.reason,
      createdAt: Date.now(),
    });
  },
});
