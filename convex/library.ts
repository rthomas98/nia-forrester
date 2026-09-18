import { v, ConvexError } from "convex/values";
import { query, mutation, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireAuth } from "./security";

export async function saveShelf(ctx: MutationCtx, userId: string, contentId: Id<"content">, active = true) {
  const existing = await ctx.db.query("savedBooks").withIndex("by_user_content", q => q.eq("authUserId", userId).eq("contentId", contentId)).unique();
  if (existing) return ctx.db.patch(existing._id, { active, updatedAt: Date.now() });
  await ctx.db.insert("savedBooks", { authUserId: userId, contentId, active, updatedAt: Date.now() });
}
export const current = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const user = await requireAuth(ctx);
    const book = await ctx.db.query("content").withIndex("by_slug", q => q.eq("slug", slug)).unique();
    if (!book || book.status !== "published" || book.visibility === "hidden") return null;
    const saved = await ctx.db.query("savedBooks").withIndex("by_user_content", q => q.eq("authUserId", user._id).eq("contentId", book._id)).unique();
    const progress = await ctx.db.query("readingProgress").withIndex("by_user_content", q => q.eq("authUserId", user._id).eq("contentId", book._id)).unique();
    const active = saved ? saved.active : !!progress;
    return { saved: active, status: !active ? null : progress?.completed ? "Finished" : (progress?.percent ?? 0) > 0 ? "Reading" : "Want to Read" };
  },
});
export const setSaved = mutation({
  args: { slug: v.string(), saved: v.boolean() },
  handler: async (ctx, { slug, saved }) => {
    const user = await requireAuth(ctx);
    const book = await ctx.db.query("content").withIndex("by_slug", q => q.eq("slug", slug)).unique();
    if (!book || book.status !== "published" || book.visibility === "hidden") throw new ConvexError({ code: "NOT_FOUND", message: "Book unavailable" });
    await saveShelf(ctx, user._id, book._id, saved);
  },
});
