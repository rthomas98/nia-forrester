import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./security";

const tier = v.union(
  v.literal("free"),
  v.literal("reader"),
  v.literal("inner"),
  v.literal("writers"),
);

export const plans = query({
  args: {},
  handler: async (ctx) =>
    ctx.db
      .query("membershipPlans")
      .withIndex("by_active_sort", (q) => q.eq("active", true))
      .collect(),
});

export const mySubscription = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query("subscriptions")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", user._id))
      .unique();
  },
});

/**
 * Called only after a Stripe signature has been verified by the Next.js
 * webhook route. The shared secret prevents clients from forging entitlements.
 */
export const applyStripeEvent = mutation({
  args: {
    internalSecret: v.string(),
    eventId: v.string(),
    eventType: v.string(),
    authUserId: v.optional(v.string()),
    planKey: v.optional(tier),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    status: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (
      !process.env.INTERNAL_API_SECRET ||
      args.internalSecret !== process.env.INTERNAL_API_SECRET
    ) {
      throw new Error("Unauthorized webhook mutation");
    }
    const processed = await ctx.db
      .query("webhookEvents")
      .withIndex("by_provider_event", (q) =>
        q.eq("provider", "stripe").eq("eventId", args.eventId),
      )
      .unique();
    if (processed) return { duplicate: true };

    const now = Date.now();
    await ctx.db.insert("webhookEvents", {
      provider: "stripe",
      eventId: args.eventId,
      eventType: args.eventType,
      processedAt: now,
    });

    if (
      args.authUserId &&
      args.planKey &&
      args.stripeCustomerId &&
      args.stripeSubscriptionId &&
      args.stripePriceId &&
      args.status
    ) {
      const existing = await ctx.db
        .query("subscriptions")
        .withIndex("by_stripe_subscription", (q) =>
          q.eq("stripeSubscriptionId", args.stripeSubscriptionId!),
        )
        .unique();
      const subscription = {
        authUserId: args.authUserId,
        planKey: args.planKey,
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        stripePriceId: args.stripePriceId,
        status: args.status,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd ?? false,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: now,
      };
      if (existing) {
        await ctx.db.patch(existing._id, subscription);
      } else {
        await ctx.db.insert("subscriptions", {
          ...subscription,
          createdAt: now,
        });
      }

      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_auth_user", (q) =>
          q.eq("authUserId", args.authUserId!),
        )
        .unique();
      if (profile) {
        const active = ["active", "trialing"].includes(args.status);
        await ctx.db.patch(profile._id, {
          membershipTier: active ? args.planKey : "free",
          membershipStatus:
            args.status === "active"
              ? "active"
              : args.status === "trialing"
                ? "trialing"
                : args.status === "past_due"
                  ? "past_due"
                  : args.status === "paused"
                    ? "paused"
                    : "canceled",
          updatedAt: now,
        });
      }
    }
    return { duplicate: false };
  },
});
