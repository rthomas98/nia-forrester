import { internalMutation } from "./_generated/server";
export const seedLocal = internalMutation({
  args: {},
  handler: async ctx => {
    if (process.env.SITE_URL !== "http://127.0.0.1:4321") throw new Error("Local test environment required");
    const now = Date.now();
    const specs = [
      { slug: "local-test-reading", title: "TEST · Online Reader Meet-Up", category: "reading" as const, format: "virtual" as const, accessTier: "free" as const, capacity: 25 },
      { slug: "local-test-appearance", title: "TEST · Bookshop Conversation", category: "appearance" as const, format: "in_person" as const, accessTier: "free" as const, capacity: 0 },
      { slug: "local-test-workshop", title: "TEST · Writers Craft Workshop", category: "workshop" as const, format: "virtual" as const, accessTier: "writers" as const, capacity: 10 },
    ];
    for (const [i, spec] of specs.entries()) {
      const existing = await ctx.db.query("events").withIndex("by_slug", q => q.eq("slug", spec.slug)).unique();
      if (existing && !existing.isTest) throw new Error("Refusing to overwrite a real event");
      const fields = { ...spec, description: "Local QA fixture only. Not a real appearance or booking. Used to verify event rendering and registration.", status: "published" as const, startsAt: now + (i+7)*86400000, endsAt: now + (i+7)*86400000 + 3600000, timezone: "America/New_York", venue: spec.format === "in_person" ? "Test Venue — Not a Real Booking" : undefined, waitlistEnabled: true, isTest: true, updatedAt: now };
      if (existing) await ctx.db.patch(existing._id, fields);
      else await ctx.db.insert("events", { ...fields, createdAt: now });
    }
    return { testEvents: 3 };
  },
});
