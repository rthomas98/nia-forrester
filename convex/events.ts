import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, hasTier } from "./security";
import { authComponent } from "./auth";
import { paidSubscription } from "./communityAccess";

export const upcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    const subscription = user ? await paidSubscription(ctx, user._id) : null;
    const rows = await ctx.db
      .query("events")
      .withIndex("by_status_start", (q) => q.eq("status", "published"))
      .filter((q) => q.gte(q.field("startsAt"), Date.now()))
      .collect();
    const visible = rows.filter(e => !e.isTest).slice(0, Math.max(1, Math.min(Math.floor(args.limit ?? 50), 100)));
    return Promise.all(visible.map(async event => {
      const eligible = hasTier(subscription?.planKey ?? "free", event.accessTier);
      const registration = user ? await ctx.db.query("eventRegistrations").withIndex("by_event_user", q => q.eq("eventId", event._id).eq("authUserId", user._id)).unique() : null;
      const registrations = await ctx.db.query("eventRegistrations").withIndex("by_event_user", q => q.eq("eventId", event._id)).collect();
      const occupied = registrations.filter(r => r.status === "registered").reduce((n,r) => n + 1 + r.guests, 0);
      const full = event.capacity !== undefined && occupied >= event.capacity;
      return { _id: event._id, title: event.title, description: event.description, category: event.category, format: event.format, startsAt: event.startsAt, endsAt: event.endsAt, timezone: event.timezone, venue: event.venue, city: event.city, accessTier: event.accessTier, isTest: event.isTest ?? false, eligible, full, waitlistEnabled: event.waitlistEnabled, registration: registration?.status ?? null,
        meetingUrl: eligible && registration?.status === "registered" ? event.meetingUrl : undefined,
        ticketUrl: eligible ? event.ticketUrl : undefined };
    }));
  },
});

export const register = mutation({
  args: { eventId: v.id("events"), guests: v.optional(v.number()), attendeeName: v.string(), attendance: v.union(v.literal("in_person"), v.literal("virtual")), note: v.optional(v.string()), acknowledged: v.boolean() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event || event.status !== "published" || event.startsAt <= Date.now() || (event.isTest && process.env.SITE_URL !== "http://127.0.0.1:4321")) {
      throw new Error("This event is not available");
    }
    const subscription = await paidSubscription(ctx, user._id);
    if (!hasTier(subscription?.planKey ?? "free", event.accessTier)) throw new Error("An active membership at the required tier is needed.");
    if (event.ticketUrl) throw new Error("Use the event ticket provider to register.");
    const guests = args.guests ?? 0;
    const attendeeName = args.attendeeName.trim();
    const note = args.note?.trim() ?? "";
    if (attendeeName.length < 2 || attendeeName.length > 100) throw new Error("Enter your name (2–100 characters).");
    if (!args.acknowledged) throw new Error("Please acknowledge the registration details.");
    if (note.length > 1000) throw new Error("Keep your note under 1,000 characters.");
    if (event.format !== "hybrid" && event.format !== args.attendance) throw new Error("Choose an available attendance option.");
    if (args.attendance === "virtual" && guests !== 0) throw new Error("Online attendees must register individually.");
    const details = { attendeeName, attendeeEmail: user.email, attendance: args.attendance, note, acknowledgedAt: Date.now() };
    if (!Number.isInteger(guests) || guests < 0 || guests > 5) throw new Error("Choose between 0 and 5 guests.");
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
      registrations.filter((item) => item.status === "registered").reduce((n, item) => n + 1 + item.guests, 0) + 1 + guests >
        event.capacity;
    if (atCapacity && !event.waitlistEnabled) {
      throw new Error("This event is full");
    }
    const now = Date.now();
    const status = atCapacity ? ("waitlisted" as const) : ("registered" as const);
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...details,
        status,
        guests: args.guests ?? 0,
        updatedAt: now,
      });
      return existing._id;
    }
    return ctx.db.insert("eventRegistrations", {
      ...details,
      eventId: event._id,
      authUserId: user._id,
      status,
      guests: args.guests ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const mine = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const user = await requireAuth(ctx);
    return ctx.db.query("eventRegistrations").withIndex("by_event_user", q => q.eq("eventId", eventId).eq("authUserId", user._id)).unique();
  },
});

export const cancel = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const user = await requireAuth(ctx);
    const event = await ctx.db.get(eventId);
    if (!event || event.startsAt <= Date.now()) throw new Error("This event has already started.");
    const row = await ctx.db.query("eventRegistrations").withIndex("by_event_user", q => q.eq("eventId", eventId).eq("authUserId", user._id)).unique();
    if (row && (row.status === "registered" || row.status === "waitlisted")) await ctx.db.patch(row._id, { status: "canceled", updatedAt: Date.now() });
  },
});
