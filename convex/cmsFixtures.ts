import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { components } from "./_generated/api";

// Operator-only, loopback-only QA setup. Never a browser-accessible role grant.
export const profile = internalMutation({
  args: { authUserId: v.string(), role: v.union(v.literal("reader"), v.literal("editor")) },
  handler: async (ctx, args) => {
    const cloud = new URL(process.env.CONVEX_CLOUD_URL ?? "https://invalid.example");
    if (cloud.origin !== "http://127.0.0.1:3210") throw new Error("CMS fixtures require the local QA backend");
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user", where: [{ field: "_id", value: args.authUserId }],
    });
    if (!user || !["cms-editor@nia.local.invalid", "cms-reader@nia.local.invalid"].includes(user.email)) {
      throw new Error("Only labeled CMS QA accounts can be configured");
    }
    const expected = user.email === "cms-editor@nia.local.invalid" ? "editor" : "reader";
    if (args.role !== expected) throw new Error("QA account role mismatch");
    const existing = await ctx.db.query("profiles").withIndex("by_auth_user", q => q.eq("authUserId", args.authUserId)).unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {role: args.role, chapterAlerts: false, newsletterOptIn: false, updatedAt: now});
      return existing._id;
    }
    return ctx.db.insert("profiles", {
      authUserId: args.authUserId, email: user.email, displayName: `TEST · CMS ${args.role}`,
      role: args.role, membershipTier: "free", membershipStatus: "free", preferences: [],
      chapterAlerts: false, newsletterOptIn: false, createdAt: now, updatedAt: now,
    });
  },
});
