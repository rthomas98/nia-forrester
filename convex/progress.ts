import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { ownsReaderRecord } from "./catalogPolicy";
import { requireAuth } from "./security";
import { saveShelf } from "./library";

function progressError(
  code: "NOT_FOUND" | "VALIDATION_ERROR",
  message: string,
): never {
  throw new ConvexError({ code, message });
}

function validateProgress(percent: number, position: number | undefined) {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    progressError("VALIDATION_ERROR", "percent must be between 0 and 100");
  }
  if (position !== undefined && (!Number.isFinite(position) || position < 0)) {
    progressError("VALIDATION_ERROR", "position must be a nonnegative number");
  }
}

function isReadableContent(content: {
  status: "draft" | "scheduled" | "published" | "archived";
  visibility?: "public" | "unlisted" | "hidden";
}) {
  return content.status === "published" && content.visibility !== "hidden";
}

async function requireReadableContent(ctx: MutationCtx, contentId: Id<"content">) {
  const content = await ctx.db.get(contentId);
  if (!content || !isReadableContent(content)) {
    progressError("NOT_FOUND", "Published content not found");
  }
  return content;
}

async function validateChapter(
  ctx: MutationCtx,
  contentId: Id<"content">,
  chapterId: Id<"chapters"> | undefined,
) {
  if (!chapterId) return;
  const chapter = await ctx.db.get(chapterId);
  if (!chapter || chapter.contentId !== contentId || chapter.status !== "published") {
    progressError("VALIDATION_ERROR", "chapter must be published and belong to content");
  }
}

export const mine = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const records = await ctx.db
      .query("readingProgress")
      .withIndex("by_user_updated", (q) => q.eq("authUserId", user._id))
      .order("desc")
      .take(50);
    return records.map((record) => ({
      _id: record._id,
      _creationTime: record._creationTime,
      contentId: record.contentId,
      chapterId: record.chapterId,
      percent: record.percent,
      position: record.position,
      completed: record.completed,
      updatedAt: record.updatedAt,
    }));
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
    if (!content || !isReadableContent(content)) return null;
    const progress = await ctx.db
      .query("readingProgress")
      .withIndex("by_user_content", (q) =>
        q.eq("authUserId", user._id).eq("contentId", content._id),
      )
      .unique();
    if (!progress) return null;
    const chapter = progress.chapterId ? await ctx.db.get(progress.chapterId) : null;
    return {
      _id: progress._id,
      _creationTime: progress._creationTime,
      contentId: progress.contentId,
      chapterId: progress.chapterId,
      percent: progress.percent,
      position: progress.position,
      completed: progress.completed,
      updatedAt: progress.updatedAt,
      chapterNumber: chapter?.number,
    };
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
    validateProgress(args.percent, args.position);
    await requireReadableContent(ctx, args.contentId);
    await validateChapter(ctx, args.contentId, args.chapterId);
    await saveShelf(ctx, user._id, args.contentId);
    const existing = await ctx.db
      .query("readingProgress")
      .withIndex("by_user_content", (q) =>
        q.eq("authUserId", user._id).eq("contentId", args.contentId),
      )
      .unique();
    const values = { ...args, updatedAt: Date.now() };
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
    chapterNumber: v.optional(v.number()),
    percent: v.number(),
    position: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    validateProgress(args.percent, args.position);
    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!content || !isReadableContent(content)) {
      progressError("NOT_FOUND", "Published content not found");
    }
    const chapterNumber = args.chapterNumber;
    const chapter = chapterNumber === undefined
      ? null
      : await ctx.db
          .query("chapters")
          .withIndex("by_content_number", (q) =>
            q.eq("contentId", content._id).eq("number", chapterNumber),
          )
          .unique();
    if (args.chapterNumber !== undefined && (!chapter || chapter.status !== "published")) {
      progressError("NOT_FOUND", "Published chapter not found");
    }
    const existing = await ctx.db
      .query("readingProgress")
      .withIndex("by_user_content", (q) =>
        q.eq("authUserId", user._id).eq("contentId", content._id),
      )
      .unique();
    const values = {
      contentId: content._id,
      chapterId: chapter?._id,
      percent: args.percent,
      position: args.position,
      completed: args.completed ?? args.percent === 100,
      updatedAt: Date.now(),
    };
    await saveShelf(ctx, user._id, content._id);
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

export const listBookmarks = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const content = await ctx.db.get(args.contentId);
    if (!content || !isReadableContent(content)) return [];
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_content", (q) =>
        q.eq("authUserId", user._id).eq("contentId", args.contentId),
      )
      .collect();
    return bookmarks.map((bookmark) => ({
      _id: bookmark._id,
      _creationTime: bookmark._creationTime,
      contentId: bookmark.contentId,
      chapterId: bookmark.chapterId,
      position: bookmark.position,
      note: bookmark.note,
      createdAt: bookmark.createdAt,
    }));
  },
});

export const addBookmark = mutation({
  args: {
    contentId: v.id("content"),
    chapterId: v.optional(v.id("chapters")),
    position: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    validateProgress(0, args.position);
    await requireReadableContent(ctx, args.contentId);
    await validateChapter(ctx, args.contentId, args.chapterId);
    const note = args.note?.trim();
    if (note && note.length > 2_000) {
      progressError("VALIDATION_ERROR", "bookmark note is too long");
    }
    return ctx.db.insert("bookmarks", {
      authUserId: user._id,
      contentId: args.contentId,
      chapterId: args.chapterId,
      position: args.position,
      note: note || undefined,
      createdAt: Date.now(),
    });
  },
});

export const removeBookmark = mutation({
  args: { bookmarkId: v.id("bookmarks") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const bookmark = await ctx.db.get(args.bookmarkId);
    if (!bookmark || !ownsReaderRecord(user._id, bookmark.authUserId)) {
      progressError("NOT_FOUND", "Bookmark not found");
    }
    await ctx.db.delete(bookmark._id);
  },
});
