import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./security";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    source: v.string(),
    ipHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const name = args.name.trim();
    const message = args.message.trim();
    if (!name || name.length > 120) throw new Error("Enter your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid email address");
    }
    if (message.length < 10 || message.length > 5000) {
      throw new Error("Message must be between 10 and 5,000 characters");
    }

    const recent = await ctx.db
      .query("contactMessages")
      .withIndex("by_email_created", (q) => q.eq("email", email))
      .order("desc")
      .first();
    if (recent && Date.now() - recent.createdAt < 60_000) {
      throw new Error("Please wait a minute before sending another message");
    }
    const now = Date.now();
    return ctx.db.insert("contactMessages", {
      ...args,
      name,
      email,
      message,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const inbox = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("in_progress"),
        v.literal("resolved"),
        v.literal("spam"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);
    if (args.status) {
      return ctx.db
        .query("contactMessages")
        .withIndex("by_status_created", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(Math.min(args.limit ?? 50, 100));
    }
    return ctx.db
      .query("contactMessages")
      .order("desc")
      .take(Math.min(args.limit ?? 50, 100));
  },
});
