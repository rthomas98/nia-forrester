import { ConvexError } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { requireAuth } from "./security";

export function isPaidSubscription(
  subscription: Pick<
    Doc<"subscriptions">,
    "status" | "planKey" | "currentPeriodEnd"
  >,
  now: number,
) {
  return (
    subscription.status === "active" &&
    subscription.planKey !== "free" &&
    subscription.currentPeriodEnd !== undefined &&
    subscription.currentPeriodEnd > now
  );
}
export async function paidSubscription(
  ctx: QueryCtx | MutationCtx,
  userId: string,
) {
  const subscriptions = await ctx.db
    .query("subscriptions")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
    .collect();
  return (
    subscriptions.find((subscription) =>
      isPaidSubscription(subscription, Date.now()),
    ) ?? null
  );
}
export async function requirePaidMember(
  ctx: QueryCtx | MutationCtx,
  joined = true,
) {
  const user = await requireAuth(ctx);
  const subscription = await paidSubscription(ctx, user._id);
  if (!subscription)
    throw new ConvexError({
      code: "PAID_MEMBERSHIP_REQUIRED",
      message:
        "An active paid membership is required to join the Reader Circle.",
    });
  const membership = await ctx.db
    .query("communityMembers")
    .withIndex("by_user", (q) => q.eq("authUserId", user._id))
    .unique();
  if (joined && !membership)
    throw new ConvexError({
      code: "JOIN_REQUIRED",
      message: "Join the Reader Circle to participate.",
    });
  return { user, subscription, membership };
}
