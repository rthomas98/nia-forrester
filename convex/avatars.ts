import { v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { requireAuth } from "./security";

export const mine = query({
  args: {},
  handler: async ctx => {
    const user = await requireAuth(ctx);
    const avatar = await ctx.db.query("avatars").withIndex("by_user", q => q.eq("authUserId", user._id)).unique();
    return avatar ? ctx.storage.getUrl(avatar.storageId) : null;
  },
});
// Only the server image-processing route knows this secret. User identity is
// independently checked using the forwarded Better Auth session.
export const upload = action({
  args: { secret: v.string(), bytes: v.bytes() },
  handler: async (ctx, args): Promise<void> => {
    if (!process.env.INTERNAL_API_SECRET || args.secret !== process.env.INTERNAL_API_SECRET) throw new Error("Forbidden");
    const user = await ctx.runQuery(api.auth.getCurrentUser, {});
    if (!user) throw new Error("Authentication required");
    if (args.bytes.byteLength > 1024 * 1024 || !args.bytes.byteLength) throw new Error("Invalid avatar size");
    const storageId = await ctx.storage.store(new Blob([args.bytes], { type: "image/webp" }));
    try { await ctx.runMutation(internal.avatars.attach, { authUserId: user._id, storageId }); }
    catch (error) { await ctx.storage.delete(storageId); throw error; }
  },
});
export const attach = internalMutation({
  args: { authUserId: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("avatars").withIndex("by_user", q => q.eq("authUserId", args.authUserId)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { storageId: args.storageId, updatedAt: Date.now() });
      await ctx.storage.delete(existing.storageId);
    } else await ctx.db.insert("avatars", { ...args, updatedAt: Date.now() });
  },
});
export const remove = mutation({
  args: {},
  handler: async ctx => {
    const user = await requireAuth(ctx);
    const existing = await ctx.db.query("avatars").withIndex("by_user", q => q.eq("authUserId", user._id)).unique();
    if (existing) { await ctx.storage.delete(existing.storageId); await ctx.db.delete(existing._id); }
  },
});
