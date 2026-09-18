import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { requireAuth } from "./security";

const tier = v.union(
  v.literal("free"),
  v.literal("reader"),
  v.literal("inner"),
  v.literal("writers"),
);

export const current = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", user._id))
      .unique();
    return { user, profile };
  },
});

export const ensure = mutation({
  args: {
    displayName: v.string(),
    selectedTier: v.optional(tier),
    preferences: v.optional(v.array(v.string())),
    chapterAlerts: v.optional(v.boolean()),
    newsletterOptIn: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", user._id))
      .unique();

    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const role = adminEmails.includes(user.email.toLowerCase())
      ? ("admin" as const)
      : ("reader" as const);

    if (existing) {
      await ctx.db.patch(existing._id, {
        displayName: args.displayName,
        preferences: args.preferences ?? existing.preferences,
        chapterAlerts: args.chapterAlerts ?? existing.chapterAlerts,
        newsletterOptIn:
          args.newsletterOptIn ?? existing.newsletterOptIn,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("profiles", {
      authUserId: user._id,
      email: user.email,
      displayName: args.displayName,
      imageUrl: user.image ?? undefined,
      role,
      membershipTier: "free",
      membershipStatus: "free",
      preferences: args.preferences ?? [],
      chapterAlerts: args.chapterAlerts ?? true,
      newsletterOptIn: args.newsletterOptIn ?? true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updatePreferences = mutation({
  args: {
    preferences: v.array(v.string()),
    chapterAlerts: v.boolean(),
    newsletterOptIn: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", user._id))
      .unique();
    if (!profile) throw new Error("Profile not initialized");
    await ctx.db.patch(profile._id, { ...args, updatedAt: Date.now() });
  },
});
