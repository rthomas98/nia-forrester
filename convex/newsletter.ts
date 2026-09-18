import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const subscribe = mutation({
  args: { email: v.string(), source: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid email address");
    }
    const now = Date.now();
    const existing = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "subscribed",
        source: args.source,
        consentedAt: now,
        updatedAt: now,
      });
      return existing._id;
    }
    return ctx.db.insert("newsletterSubscriptions", {
      email,
      status: "subscribed",
      source: args.source,
      consentedAt: now,
      updatedAt: now,
    });
  },
});
