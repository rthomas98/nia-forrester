import { describe, it, expect, afterEach, vi } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api, components } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");
afterEach(() => vi.unstubAllEnvs());

async function setup(role = "reader", plan = "free", verified = true) {
  const t = convexTest(schema, modules);
  betterAuth.register(t);
  const now = Date.now();
  const user = await t.mutation(components.betterAuth.adapter.create, { input: { model: "user", data: { name: "RBAC Audit", email: "rbac@example.test", emailVerified: verified, createdAt: now, updatedAt: now } } });
  const session = await t.mutation(components.betterAuth.adapter.create, { input: { model: "session", data: { userId: user._id, token: "rbac-test", expiresAt: now + 86400000, createdAt: now, updatedAt: now } } });
  const actor = t.withIdentity({ subject: user._id, sessionId: session._id });
  if (role) await t.run(ctx => ctx.db.insert("profiles", { authUserId: user._id, email: user.email, displayName: "RBAC Audit", role, membershipTier: plan, membershipStatus: plan === "free" ? "free" : "active", preferences: [], chapterAlerts: false, newsletterOptIn: false, createdAt: now, updatedAt: now }));
  if (plan !== "free") {
    await t.run(ctx => ctx.db.insert("subscriptions", { authUserId: user._id, status: "active", planKey: plan, currentPeriodEnd: now + 86400000, stripeCustomerId: "audit", stripeSubscriptionId: "audit", stripePriceId: "audit", cancelAtPeriodEnd: false, createdAt: now, updatedAt: now }));
    await actor.mutation(api.readerCircle.join);
  }
  return { t, actor, user };
}
const content = { slug: "audit-paid", kind: "essay", title: "Audit", excerpt: "Public summary", body: "PRIVATE PAID BODY", audioUrl: "https://example.test/private.mp3", status: "published", accessTier: "inner", tags: [], sortOrder: 0 };
async function addContent(t) { return t.run(ctx => ctx.db.insert("content", { ...content, createdAt: 1, updatedAt: 1 })); }

describe("staff role matrix (isolated backend)", () => {
  for (const role of ["reader", "moderator", "editor", "admin"]) {
    it(`${role}: content editing`, async () => {
      const { actor } = await setup(role);
      const operation = actor.mutation(api.content.upsert, content);
      if (["editor", "admin"].includes(role)) await expect(operation).resolves.toBeTruthy();
      else await expect(operation).rejects.toThrow(/FORBIDDEN/);
    });
    it(`${role}: community administration`, async () => {
      const { actor } = await setup(role);
      const operation = actor.mutation(api.readerCircle.createClub, { name: "Audit Club", description: "Test only" });
      if (["moderator", "admin"].includes(role)) await expect(operation).resolves.toBeTruthy();
      else await expect(operation).rejects.toThrow(/FORBIDDEN/);
    });
    it(`${role}: private contact inbox`, async () => {
      const { actor } = await setup(role);
      const operation = actor.query(api.contact.inbox, {});
      if (role === "admin") await expect(operation).resolves.toEqual([]);
      else await expect(operation).rejects.toThrow(/FORBIDDEN/);
    });
  }
});

describe("security acceptance requirements", () => {
  it("public content listing must not expose paid bodies", async () => {
    const { t } = await setup(); await addContent(t);
    expect((await t.query(api.content.listPublished, {}))[0].body).toBeUndefined();
  });
  it("locked content must not expose its private audio URL", async () => {
    const { t } = await setup(); await addContent(t);
    expect((await t.query(api.content.bySlug, { slug: content.slug })).audioUrl).toBeUndefined();
  });
  it("expired subscriptions must override stale paid profile tiers", async () => {
    const { t, actor } = await setup("reader", "inner"); await addContent(t);
    await t.run(async ctx => { const sub = (await ctx.db.query("subscriptions").collect())[0]; await ctx.db.patch(sub._id, { currentPeriodEnd: Date.now() - 1 }); });
    expect((await actor.query(api.content.bySlug, { slug: content.slug })).hasAccess).toBe(false);
  });
  it("unverified email must not bootstrap an admin", async () => {
    vi.stubEnv("ADMIN_EMAILS", "rbac@example.test");
    const { actor } = await setup(null, "free", false);
    await actor.mutation(api.profiles.ensure, { displayName: "Unverified" });
    expect((await actor.query(api.profiles.current)).profile.role).toBe("reader");
  });
  it("reader tier must not read an inner-tier club discussion", async () => {
    const { t, actor } = await setup("reader", "reader");
    const threadId = await t.run(async ctx => {
      const clubId = await ctx.db.insert("clubs", { name: "Inner", slug: "inner", description: "Private", accessTier: "inner", status: "open", memberCount: 0, createdAt: 1, updatedAt: 1 });
      return ctx.db.insert("threads", { clubId, slug: "private", title: "Private", body: "INNER ONLY", tags: [], authorAuthUserId: "other", status: "open", pinned: false, replyCount: 0, lastActivityAt: 1, createdAt: 1, updatedAt: 1 });
    });
    await expect(actor.query(api.readerCircle.discussion, { threadId })).rejects.toThrow();
  });
  it("free reader must not register for a paid event", async () => {
    const { t, actor } = await setup();
    const eventId = await t.run(ctx => ctx.db.insert("events", { slug: "paid", title: "Paid", description: "Private", category: "qa", format: "virtual", status: "published", accessTier: "writers", startsAt: Date.now()+86400000, endsAt: Date.now()+90000000, timezone: "UTC", waitlistEnabled: false, createdAt: 1, updatedAt: 1 }));
    await expect(actor.mutation(api.events.register, { eventId })).rejects.toThrow();
  });
});
