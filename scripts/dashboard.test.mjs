import { it, expect } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api, components } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");
async function setup() {
  const t = convexTest(schema, modules); betterAuth.register(t);
  const now = Date.now();
  const user = await t.mutation(components.betterAuth.adapter.create, { input: { model: "user", data: { name: "Real Reader", email: "dashboard@example.test", emailVerified: true, createdAt: now, updatedAt: now } } });
  const session = await t.mutation(components.betterAuth.adapter.create, { input: { model: "session", data: { userId: user._id, token: "dashboard-test", expiresAt: now + 86400000, createdAt: now, updatedAt: now } } });
  return { t, user, actor: t.withIdentity({ subject: user._id, sessionId: session._id }) };
}
it("requires authentication and gives a new reader real empty states", async () => {
  const { t, actor } = await setup();
  await expect(t.query(api.dashboard.summary)).rejects.toThrow(/UNAUTHENTICATED/);
  const data = await actor.query(api.dashboard.summary);
  expect(data).toMatchObject({ name: "Real Reader", tier: "free", library: [], libraryCount: 0, finished: 0, continueReading: null, discussions: [], events: [], communityAccess: "unpaid" });
});
it("saves without progress, deduplicates, removes reversibly, and follows progress transitions", async () => {
  const { t, actor } = await setup();
  await t.run(ctx => ctx.db.insert("content", { title: "Saved", slug: "saved", kind: "book", status: "published", visibility: "public", accessTier: "free", excerpt: "Summary", tags: [], sortOrder: 0, createdAt: 1, updatedAt: 1 }));
  await expect(t.mutation(api.library.setSaved, { slug: "saved", saved: true })).rejects.toThrow(/UNAUTHENTICATED/);
  await actor.mutation(api.library.setSaved, { slug: "saved", saved: true });
  await actor.mutation(api.library.setSaved, { slug: "saved", saved: true });
  let data = await actor.query(api.dashboard.summary);
  expect(data.libraryCount).toBe(1); expect(data.library[0].status).toBe("Want to Read"); expect(data.continueReading).toBeNull();
  expect(await t.run(ctx => ctx.db.query("readingProgress").collect())).toEqual([]);
  await actor.mutation(api.progress.saveBySlug, { slug: "saved", percent: 35 });
  expect((await actor.query(api.library.current, { slug: "saved" })).status).toBe("Reading");
  await actor.mutation(api.library.setSaved, { slug: "saved", saved: false });
  expect((await actor.query(api.dashboard.summary)).libraryCount).toBe(0);
  expect((await actor.query(api.progress.currentBySlug, { slug: "saved" })).percent).toBe(35);
  await actor.mutation(api.progress.saveBySlug, { slug: "saved", percent: 100 });
  data = await actor.query(api.dashboard.summary);
  expect(data.library[0].status).toBe("Finished"); expect(data.finished).toBe(1);
  await expect(actor.mutation(api.library.setSaved, { slug: "missing", saved: true })).rejects.toThrow(/NOT_FOUND/);
});
it("isolates progress by owner and excludes hidden titles and private payloads", async () => {
  const { t, user, actor } = await setup();
  const ids = await t.run(async ctx => {
    const ids = [];
    for (const [title, visibility, owner, completed] of [["Mine", "public", user._id, false], ["Finished", "public", user._id, true], ["Other Reader", "public", "other", true], ["Hidden", "hidden", user._id, true]]) {
      const id = await ctx.db.insert("content", { title, slug: title, kind: "book", status: "published", visibility, accessTier: "free", excerpt: "Summary", body: "PRIVATE", tags: [], sortOrder: 0, createdAt: 1, updatedAt: 1 });
      await ctx.db.insert("readingProgress", { contentId: id, authUserId: owner, percent: completed ? 100 : 35, completed, updatedAt: ids.length }); ids.push(id);
    }
    return ids;
  });
  let data = await actor.query(api.dashboard.summary);
  expect(data.libraryCount).toBe(2); expect(data.finished).toBe(1); expect(data.continueReading.title).toBe("Mine"); expect(JSON.stringify(data)).not.toContain("PRIVATE");
  await actor.mutation(api.progress.save, { contentId: ids[0], percent: 100, completed: true });
  data = await actor.query(api.dashboard.summary); expect(data.finished).toBe(2); expect(data.continueReading).toBeNull();
});
it("filters discussions by paid membership, joining, and club tier; expiry revokes access", async () => {
  const { t, user, actor } = await setup();
  const sub = await t.run(async ctx => {
    const sub = await ctx.db.insert("subscriptions", { authUserId: user._id, planKey: "reader", status: "active", currentPeriodEnd: Date.now()+86400000, stripeCustomerId: "test", stripeSubscriptionId: "test", stripePriceId: "test", cancelAtPeriodEnd: false, createdAt: 1, updatedAt: 1 });
    const clubId = await ctx.db.insert("clubs", { name: "Inner", slug: "inner", description: "Private", accessTier: "inner", status: "open", memberCount: 0, createdAt: 1, updatedAt: 1 });
    for (const club of [undefined, clubId]) await ctx.db.insert("threads", { clubId: club, title: club ? "Private Club" : "General", slug: club ? "private" : "general", body: "SECRET", tags: [], authorAuthUserId: "other", status: "open", pinned: false, replyCount: 0, lastActivityAt: 1, createdAt: 1, updatedAt: 1 });
    return sub;
  });
  expect((await actor.query(api.dashboard.summary)).communityAccess).toBe("eligible");
  expect((await actor.query(api.dashboard.summary)).discussions).toEqual([]);
  await actor.mutation(api.readerCircle.join);
  expect((await actor.query(api.dashboard.summary)).discussions.map(d => d.title)).toEqual(["General"]);
  await t.run(ctx => ctx.db.patch(sub, { currentPeriodEnd: Date.now()-1 }));
  const data = await actor.query(api.dashboard.summary); expect(data.tier).toBe("free"); expect(data.discussions).toEqual([]);
});
it("only returns accessible future published events without meeting URLs", async () => {
  const { t, actor } = await setup();
  await t.run(async ctx => { for (const [title, accessTier, status, startsAt] of [["Public", "free", "published", Date.now()+86400000], ["Paid", "inner", "published", Date.now()+86400000], ["Draft", "free", "draft", Date.now()+86400000], ["Past", "free", "published", 1]]) await ctx.db.insert("events", { title, slug: title, description: "Event", accessTier, status, startsAt, endsAt: startsAt+1000, category: "qa", format: "virtual", timezone: "UTC", meetingUrl: "https://example.test/secret", waitlistEnabled: false, createdAt: 1, updatedAt: 1 }); });
  const data = await actor.query(api.dashboard.summary); expect(data.events.map(e => e.title)).toEqual(["Public"]); expect(JSON.stringify(data)).not.toContain("secret");
});
