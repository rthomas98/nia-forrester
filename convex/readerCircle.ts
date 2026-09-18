import { v, ConvexError } from "convex/values";
import { query, mutation, type QueryCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { hasTier, requireRole } from "./security";
import {
  isPaidSubscription,
  paidSubscription,
  requirePaidMember,
} from "./communityAccess";

async function author(ctx: QueryCtx, id: string) {
  return (
    (
      await ctx.db
        .query("profiles")
        .withIndex("by_auth_user", (q) => q.eq("authUserId", id))
        .unique()
    )?.displayName ?? "Circle member"
  );
}

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const paid = new Set(
      (await ctx.db.query("subscriptions").collect())
        .filter((s) => isPaidSubscription(s, now))
        .map((s) => s.authUserId),
    );
    const members = await ctx.db.query("communityMembers").collect();
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_status_activity", (q) => q.eq("status", "open"))
      .collect();
    const clubs = await ctx.db
      .query("clubs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();
    const user = await authComponent.safeGetAuthUser(ctx);
    const joined = user && members.some((m) => m.authUserId === user._id);
    return {
      members: members.filter((m) => paid.has(m.authUserId)).length,
      threads: threads.length,
      clubs: clubs.length,
      access: !user
        ? ("anonymous" as const)
        : !paid.has(user._id)
          ? ("unpaid" as const)
          : !joined
            ? ("eligible" as const)
            : ("member" as const),
    };
  },
});

export const join = mutation({
  args: {},
  handler: async (ctx) => {
    const { user, membership } = await requirePaidMember(ctx, false);
    return (
      membership?._id ??
      ctx.db.insert("communityMembers", {
        authUserId: user._id,
        joinedAt: Date.now(),
      })
    );
  },
});

export const discussions = query({
  args: {},
  handler: async (ctx) => {
    await requirePaidMember(ctx);
    const rows = await ctx.db
      .query("threads")
      .withIndex("by_status_activity", (q) => q.eq("status", "open"))
      .order("desc")
      .take(50);
    return Promise.all(
      rows.map(async (row) => ({
        _id: row._id,
        title: row.title,
        author: await author(ctx, row.authorAuthUserId),
        replies: (
          await ctx.db
            .query("posts")
            .withIndex("by_thread_created", (q) => q.eq("threadId", row._id))
            .collect()
        ).filter((p) => p.status === "visible").length,
      })),
    );
  },
});

export const discussion = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    await requirePaidMember(ctx);
    const row = await ctx.db.get(threadId);
    if (!row || row.status === "hidden") return null;
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_thread_created", (q) => q.eq("threadId", threadId))
      .collect();
    return {
      title: row.title,
      body: row.body,
      status: row.status,
      author: await author(ctx, row.authorAuthUserId),
      posts: await Promise.all(
        posts
          .filter((p) => p.status === "visible")
          .map(async (p) => ({
            _id: p._id,
            body: p.body,
            spoilerChapter: p.spoilerChapter,
            author: await author(ctx, p.authorAuthUserId),
          })),
      ),
    };
  },
});

export const clubs = query({
  args: {},
  handler: async (ctx) => {
    const { user, subscription } = await requirePaidMember(ctx);
    const rows = await ctx.db
      .query("clubs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();
    return Promise.all(
      rows.map(async (row) => {
        const memberships = await ctx.db
          .query("clubMemberships")
          .withIndex("by_club_user", (q) => q.eq("clubId", row._id))
          .collect();
        const active = await Promise.all(
          memberships.map(async (m) =>
            Boolean(await paidSubscription(ctx, m.authUserId)),
          ),
        );
        return {
          _id: row._id,
          name: row.name,
          description: row.description,
          members: active.filter(Boolean).length,
          joined: memberships.some((m) => m.authUserId === user._id),
          eligible: hasTier(subscription.planKey, row.accessTier),
        };
      }),
    );
  },
});

export const joinClub = mutation({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, { clubId }) => {
    const { user, subscription } = await requirePaidMember(ctx);
    const club = await ctx.db.get(clubId);
    if (!club || club.status !== "open")
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "This club is not open.",
      });
    if (!hasTier(subscription.planKey, club.accessTier))
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "This club requires a higher membership tier.",
      });
    const existing = await ctx.db
      .query("clubMemberships")
      .withIndex("by_club_user", (q) =>
        q.eq("clubId", clubId).eq("authUserId", user._id),
      )
      .unique();
    return (
      existing?._id ??
      ctx.db.insert("clubMemberships", {
        clubId,
        authUserId: user._id,
        role: "member",
        joinedAt: Date.now(),
      })
    );
  },
});

export const createClub = mutation({
  args: { name: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "moderator"]);
    if (
      !args.name.trim() ||
      args.name.length > 120 ||
      !args.description.trim() ||
      args.description.length > 2000
    )
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message: "A name and description are required.",
      });
    const now = Date.now();
    return ctx.db.insert("clubs", {
      ...args,
      slug: `club-${now.toString(36)}`,
      accessTier: "reader",
      status: "open",
      memberCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const sessions = query({
  args: {},
  handler: async (ctx) => {
    const { subscription } = await requirePaidMember(ctx);
    const rows = await ctx.db
      .query("events")
      .withIndex("by_status_start", (q) => q.eq("status", "published"))
      .collect();
    return rows
      .filter(
        (e) =>
          e.accessTier !== "free" &&
          e.startsAt > Date.now() &&
          hasTier(subscription.planKey, e.accessTier),
      )
      .map((e) => ({ _id: e._id, title: e.title, startsAt: e.startsAt }));
  },
});
