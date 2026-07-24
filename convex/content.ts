import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasTier, requireRole } from "./security";
import { authComponent } from "./auth";

const kind = v.union(
  v.literal("book"),
  v.literal("serial"),
  v.literal("essay"),
  v.literal("audio"),
  v.literal("quick_bite"),
  v.literal("outtake"),
);

const accessTier = v.union(
  v.literal("free"),
  v.literal("reader"),
  v.literal("inner"),
  v.literal("writers"),
);

export const listPublished = query({
  args: { kind: v.optional(kind), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 100, 100);
    if (args.kind) {
      return ctx.db
        .query("content")
        .withIndex("by_kind_status", (q) =>
          q.eq("kind", args.kind!).eq("status", "published"),
        )
        .take(limit);
    }
    return ctx.db
      .query("content")
      .withIndex("by_status_published", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!item || item.status !== "published") return null;

    const user = await authComponent.getAuthUser(ctx);
    let memberTier: "free" | "reader" | "inner" | "writers" = "free";
    if (user) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_auth_user", (q) => q.eq("authUserId", user._id))
        .unique();
      memberTier = profile?.membershipTier ?? "free";
    }

    return {
      ...item,
      body: hasTier(memberTier, item.accessTier) ? item.body : undefined,
      hasAccess: hasTier(memberTier, item.accessTier),
    };
  },
});

export const chaptersForContent = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    let memberTier: "free" | "reader" | "inner" | "writers" = "free";
    if (user) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_auth_user", (q) => q.eq("authUserId", user._id))
        .unique();
      memberTier = profile?.membershipTier ?? "free";
    }
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_content_number", (q) => q.eq("contentId", args.contentId))
      .collect();
    return chapters
      .filter((chapter) => chapter.status === "published")
      .map((chapter) => ({
        ...chapter,
        body: hasTier(memberTier, chapter.accessTier)
          ? chapter.body
          : undefined,
        hasAccess: hasTier(memberTier, chapter.accessTier),
      }));
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("content")),
    slug: v.string(),
    kind,
    title: v.string(),
    subtitle: v.optional(v.string()),
    excerpt: v.string(),
    body: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
      v.literal("archived"),
    ),
    accessTier,
    tags: v.array(v.string()),
    publishedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    coverUrl: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    externalPurchaseUrl: v.optional(v.string()),
    amazonAffiliateUrl: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireRole(ctx, ["editor", "admin"]);
    const now = Date.now();
    const { id, ...values } = args;
    let contentId = id;
    if (id) {
      await ctx.db.patch(id, { ...values, updatedAt: now });
    } else {
      contentId = await ctx.db.insert("content", {
        ...values,
        createdAt: now,
        updatedAt: now,
      });
    }
    await ctx.db.insert("auditLog", {
      actorAuthUserId: user._id,
      action: id ? "content.updated" : "content.created",
      entityType: "content",
      entityId: contentId!,
      createdAt: now,
    });
    return contentId;
  },
});
