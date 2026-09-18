import type { MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError } from "convex/values";
import { authComponent } from "./auth";
import { canWriteCatalog } from "./catalogPolicy";

type AppCtx = QueryCtx | MutationCtx;

export async function requireAuth(ctx: AppCtx) {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "Authentication required",
    });
  }
  return user;
}

export async function getProfile(ctx: AppCtx) {
  const user = await requireAuth(ctx);
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", user._id))
    .unique();
  return { user, profile };
}

export async function requireRole(
  ctx: AppCtx,
  roles: Array<"moderator" | "editor" | "admin">,
) {
  const { user, profile } = await getProfile(ctx);
  if (!profile || !roles.includes(profile.role as (typeof roles)[number])) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action",
    });
  }
  return { user, profile };
}

export async function requireCatalogWriter(ctx: AppCtx) {
  const { user, profile } = await getProfile(ctx);
  if (!profile || !canWriteCatalog(profile.role)) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: "Catalog changes require the editor or admin role",
    });
  }
  return { user, profile };
}

const tierRank = {
  free: 0,
  reader: 1,
  inner: 2,
  writers: 3,
} as const;

export function hasTier(
  current: keyof typeof tierRank,
  required: keyof typeof tierRank,
) {
  return tierRank[current] >= tierRank[required];
}
