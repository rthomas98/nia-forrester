import { it, expect, vi, afterEach } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api, internal, components } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");
afterEach(() => vi.unstubAllEnvs());
async function setup() {
  const t = convexTest(schema, modules); betterAuth.register(t);
  const now = Date.now();
  const user = await t.mutation(components.betterAuth.adapter.create, { input: { model: "user", data: { name: "Event Test", email: "event@example.test", emailVerified: true, createdAt: now, updatedAt: now } } });
  const session = await t.mutation(components.betterAuth.adapter.create, { input: { model: "session", data: { userId: user._id, token: "event-test", expiresAt: now+86400000, createdAt: now, updatedAt: now } } });
  return { t, actor: t.withIdentity({ subject: user._id, sessionId: session._id }) };
}
it("empty calendar has no fabricated events and fixtures cannot be seeded outside local", async () => {
  const { t } = await setup(); expect(await t.query(api.events.upcoming, {})).toEqual([]);
  vi.stubEnv("SITE_URL", "https://example.test"); await expect(t.mutation(internal.eventFixtures.seedLocal)).rejects.toThrow();
});
it("renders real records, deduplicates registrations, enforces paid tier, and waitlists", async () => {
  const { t, actor } = await setup(); vi.stubEnv("SITE_URL", "http://127.0.0.1:4321");
  await t.mutation(internal.eventFixtures.seedLocal); await t.mutation(internal.eventFixtures.seedLocal);
  expect(await t.query(api.events.upcoming, {})).toEqual([]);
  await t.run(async ctx => { for (const row of await ctx.db.query("events").collect()) await ctx.db.patch(row._id, {isTest:false}); });
  const events = await t.query(api.events.upcoming, {}); expect(events).toHaveLength(3);
  const [free, full, paid] = events;
  await t.run(ctx => ctx.db.patch(free._id, { meetingUrl: "https://example.test/private" }));
  expect((await t.query(api.events.upcoming, {}))[0].meetingUrl).toBeUndefined();
  await expect(t.mutation(api.events.register, { attendeeName: "Test Reader", attendance: "virtual", acknowledged: true, eventId: free._id })).rejects.toThrow();
  const id = await actor.mutation(api.events.register, { attendeeName: "Test Reader", attendance: "virtual", acknowledged: true, eventId: free._id });
  expect(await actor.mutation(api.events.register, { attendeeName: "Test Reader", attendance: "virtual", acknowledged: true, eventId: free._id })).toBe(id);
  expect((await actor.query(api.events.upcoming, {}))[0].meetingUrl).toBe("https://example.test/private");
  await actor.mutation(api.events.register, { attendeeName: "Test Reader", attendance: "in_person", acknowledged: true, eventId: full._id });
  expect((await actor.query(api.events.upcoming, {}))[1].registration).toBe("waitlisted");
  await expect(actor.mutation(api.events.register, { attendeeName: "Test Reader", attendance: "virtual", acknowledged: true, eventId: paid._id })).rejects.toThrow(/membership/);
  await expect(actor.mutation(api.events.register, { attendeeName: "Test Reader", attendance: "in_person", acknowledged: true, eventId: full._id, guests: -1 })).rejects.toThrow();
  vi.stubEnv("SITE_URL", "https://example.test"); expect(await t.query(api.events.upcoming, {})).toHaveLength(3);
});
it("validates form details, keeps them private, and supports cancellation and re-registration", async () => {
  const { t, actor } = await setup(); vi.stubEnv("SITE_URL", "http://127.0.0.1:4321");
  await t.mutation(internal.eventFixtures.seedLocal);
  await t.run(async ctx => { for (const row of await ctx.db.query("events").collect()) await ctx.db.patch(row._id, {isTest:false}); });
  const [event] = await t.query(api.events.upcoming, {});
  const args = { eventId: event._id, attendeeName: " Test Reader ", attendance: "virtual", acknowledged: true, note: "Captioning requested" };
  for (const invalid of [{ attendeeName: " " }, { acknowledged: false }, { attendance: "in_person" }, { guests: 1 }, { note: "x".repeat(1001) }]) await expect(actor.mutation(api.events.register, { ...args, ...invalid })).rejects.toThrow();
  await actor.mutation(api.events.register, args);
  const mine = await actor.query(api.events.mine, { eventId: event._id });
  expect(mine.attendeeName).toBe("Test Reader"); expect(mine.attendeeEmail).toBe("event@example.test");
  expect(JSON.stringify(await t.query(api.events.upcoming, {}))).not.toContain("Captioning requested");
  await expect(t.query(api.events.mine, { eventId: event._id })).rejects.toThrow();
  await expect(t.mutation(api.events.cancel, { eventId: event._id })).rejects.toThrow();
  await actor.mutation(api.events.cancel, { eventId: event._id });
  expect((await actor.query(api.events.mine, { eventId: event._id })).status).toBe("canceled");
  expect((await actor.query(api.events.upcoming, {}))[0].meetingUrl).toBeUndefined();
  await actor.mutation(api.events.register, args);
  expect((await actor.query(api.events.mine, { eventId: event._id }))._id).toBe(mine._id);
});
