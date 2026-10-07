import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Operator-only import of the author's approved free chapter. No client can
// call this mutation or choose a different access tier.
export const bestBadIdea = internalMutation({
  args: { body: v.string() },
  handler: async (ctx, { body }) => {
    if (!body.startsWith("The party was at Griffin and Mel’s new place.") || !body.trim().endsWith('“Maya’s husband.”')) {
      throw new Error("Unexpected chapter source");
    }
    const now = Date.now();
    const slug = "the-best-bad-idea";
    const existing = await ctx.db.query("content").withIndex("by_slug", q => q.eq("slug", slug)).unique();
    if (existing && existing.kind !== "serial") throw new Error("Slug belongs to another content type");
    const values = { slug, kind: "serial" as const, title: "The Best Bad Idea", subtitle: "A Romance", excerpt: "Chapter 1 · Free to Read", coverUrl: "/images/the-best-bad-idea.png", status: "published" as const, visibility: "public" as const, accessTier: "free" as const, tags: [], sortOrder: 0, updatedAt: now };
    const contentId = existing?._id ?? await ctx.db.insert("content", { ...values, publishedAt: now, createdAt: now });
    if (existing) await ctx.db.patch(contentId, values);
    const chapter = await ctx.db.query("chapters").withIndex("by_content_number", q => q.eq("contentId", contentId).eq("number", 1)).unique();
    const chapterValues = { contentId, slug: `${slug}-chapter-1`, number: 1, title: "ONE", body, status: "published" as const, accessTier: "free" as const, updatedAt: now };
    const chapterId = chapter?._id ?? await ctx.db.insert("chapters", { ...chapterValues, publishedAt: now, createdAt: now });
    if (chapter) await ctx.db.patch(chapterId, chapterValues);
    await ctx.db.insert("auditLog", { actorAuthUserId: "operator:author-supplied-serial", action: "serial.chapter.published", entityType: "chapters", entityId: chapterId, createdAt: now });
    return { contentId, chapterId };
  },
});
