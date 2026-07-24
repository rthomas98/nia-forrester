import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./security";

export const upcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) =>
    ctx.db
      .query("events")
      .withIndex("by_status_start", (q) => q.eq("status", "published"))
      .filter((q) => q.gte(q.field("startsAt"), Date.now()))
      .take(Math.min(args.limit ?? 20, 50)),
});

export const register = mutation({
  args: { eventId: v.id("events"), guests: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event || event.status !== "published") {
      throw new Error("This event is not available");
    }
    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", event._id).eq("authUserId", user._id),
      )
      .unique();
    if (existing && existing.status !== "canceled") return existing._id;

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event_user", (q) => q.eq("eventId", event._id))
      .collect();
    const atCapacity =
      event.capacity !== undefined &&
      registrations.filter((item) => item.status === "registered").length >=
        event.capacity;
    if (atCapacity && !event.waitlistEnabled) {
      throw new Error("This event is full");
    }
    const now = Date.now();
    const status = atCapacity ? ("waitlisted" as const) : ("registered" as const);
    if (existing) {
      await ctx.db.patch(existing._id, {
        status,
        guests: args.guests ?? 0,
        updatedAt: now,
      });
      return existing._id;
    }
    return ctx.db.insert("eventRegistrations", {
      eventId: event._id,
      authUserId: user._id,
      status,
      guests: args.guests ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});
