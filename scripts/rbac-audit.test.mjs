import { describe, it, expect, afterEach, vi } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api, components } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");
afterEach(() => vi.unstubAllEnvs());

async function setup(role = "reader", plan = "free", verified = true, email = "rbac@example.test") {
  const t = convexTest(schema, modules);
  betterAuth.register(t);
  const now = Date.now();
  const user = await t.mutation(components.betterAuth.adapter.create, { input: { model: "user", data: { name: "RBAC Audit", email, emailVerified: verified, createdAt: now, updatedAt: now } } });
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
  it("verified normalized allowlist email bootstraps only a new admin", async () => {
    vi.stubEnv("ADMIN_EMAILS", " OTHER@example.test, RBAC@EXAMPLE.TEST ");
    const { actor } = await setup(null, "free", true, " RBAC@EXAMPLE.TEST ");
    await actor.mutation(api.profiles.ensure, { displayName: "Verified" });
    expect((await actor.query(api.profiles.current)).profile.role).toBe("admin");
  });
  it("verified nonallowlisted email remains a reader", async () => {
    vi.stubEnv("ADMIN_EMAILS", "other@example.test");
    const { actor } = await setup(null);
    await actor.mutation(api.profiles.ensure, { displayName: "Verified" });
    expect((await actor.query(api.profiles.current)).profile.role).toBe("reader");
  });
  for (const role of ["reader", "moderator", "editor", "admin"]) {
    for (const allowlisted of [true, false]) {
      for (const verified of [true, false]) {
      it(`preserves existing ${role} with allowlisted=${allowlisted}, verified=${verified}`, async () => {
        vi.stubEnv("ADMIN_EMAILS", allowlisted ? "rbac@example.test" : "other@example.test");
        const { actor } = await setup(role, "free", verified);
        await actor.mutation(api.profiles.ensure, { displayName: "Updated" });
        const { profile } = await actor.query(api.profiles.current);
        expect(profile.role).toBe(role);
        expect(profile.displayName).toBe("Updated");
      });
      }
    }
  }
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
    await expect(actor.query(api.readerCircle.discussion, { threadId })).rejects.toThrow(/FORBIDDEN/);
  });
  it("free reader must not register for a paid event", async () => {
    const { t, actor } = await setup();
    const eventId = await t.run(ctx => ctx.db.insert("events", { slug: "paid", title: "Paid", description: "Private", category: "qa", format: "virtual", status: "published", accessTier: "writers", startsAt: Date.now()+86400000, endsAt: Date.now()+90000000, timezone: "UTC", waitlistEnabled: false, createdAt: 1, updatedAt: 1 }));
    await expect(actor.mutation(api.events.register, {
      eventId,
      attendeeName: "RBAC Audit",
      attendance: "virtual",
      guests: 0,
      acknowledged: true,
    })).rejects.toThrow(/active membership at the required tier/);
  });
});

async function clubFixture(t, user, joined = true) {
  return t.run(async ctx => {
    const clubId = await ctx.db.insert("clubs", { name: "Private club", slug: "private-club", description: "Private", accessTier: "inner", status: "open", memberCount: 0, createdAt: 1, updatedAt: 1 });
    if (joined) await ctx.db.insert("clubMemberships", { clubId, authUserId: user._id, role: "member", joinedAt: 1 });
    const threadId = await ctx.db.insert("threads", { clubId, slug: "private", title: "SECRET CLUB TITLE", body: "SECRET CLUB BODY", tags: [], authorAuthUserId: "other", status: "open", pinned: false, replyCount: 0, lastActivityAt: 10, createdAt: 1, updatedAt: 1 });
    const postId = await ctx.db.insert("posts", { threadId, body: "SECRET CLUB REPLY", authorAuthUserId: "other", status: "visible", createdAt: 1, updatedAt: 1 });
    const publicId = await ctx.db.insert("threads", { slug: "circle", title: "Circle title", body: "Circle body", tags: [], authorAuthUserId: "other", status: "open", pinned: false, replyCount: 0, lastActivityAt: 1, createdAt: 1, updatedAt: 1 });
    return { clubId, threadId, publicId, postId };
  });
}

describe("club discussion access across every consumer", () => {
  const cases = ["unjoined", "lower-tier", "downgraded", "expired", "trial", "free", "missing-period", "deleted-club", "paused-club", "archived-club", "draft-club", "left-club", "not-circle-joined", "anonymous", "staff-unjoined"];
  for (const scenario of cases) {
    it(`denies private lists/detail/create/reply/dashboard for ${scenario}`, async () => {
      const { t, actor, user } = await setup(scenario === "staff-unjoined" ? "admin" : "reader", scenario === "lower-tier" ? "reader" : "inner");
      const { clubId, threadId, publicId, postId } = await clubFixture(t, user, !["unjoined", "staff-unjoined"].includes(scenario));
      await t.run(async ctx => {
        const sub = (await ctx.db.query("subscriptions").collect())[0];
        if (scenario === "downgraded") await ctx.db.patch(sub._id, { planKey: "reader" });
        if (scenario === "expired") await ctx.db.patch(sub._id, { currentPeriodEnd: Date.now() - 1 });
        if (scenario === "trial") await ctx.db.patch(sub._id, { status: "trialing" });
        if (scenario === "free") await ctx.db.patch(sub._id, { planKey: "free" });
        if (scenario === "missing-period") await ctx.db.patch(sub._id, { currentPeriodEnd: undefined });
        if (scenario === "deleted-club") await ctx.db.delete(clubId);
        for (const status of ["paused", "archived", "draft"]) {
          if (scenario === `${status}-club`) await ctx.db.patch(clubId, { status });
        }
        if (scenario === "left-club") await ctx.db.delete((await ctx.db.query("clubMemberships").collect())[0]._id);
        if (scenario === "not-circle-joined") await ctx.db.delete((await ctx.db.query("communityMembers").collect())[0]._id);
      });
      const caller = scenario === "anonymous" ? t : actor;
      const globalDeny = ["expired", "trial", "free", "missing-period", "not-circle-joined", "anonymous"].includes(scenario);
      for (const [query, args] of [[api.community.listThreads, { limit: 1 }], [api.readerCircle.discussions, {}]]) {
        if (globalDeny) await expect(caller.query(query, args)).rejects.toThrow();
        else {
          const rows = await caller.query(query, args);
          expect(rows).toHaveLength(1);
          expect(rows[0]._id).toBe(publicId);
          expect(JSON.stringify(rows)).not.toMatch(/SECRET CLUB/);
        }
      }
      await expect(caller.query(api.readerCircle.discussion, { threadId })).rejects.toThrow(globalDeny ? /UNAUTHENTICATED|PAID_MEMBERSHIP_REQUIRED|JOIN_REQUIRED/ : /FORBIDDEN/);
      const denial = globalDeny ? /UNAUTHENTICATED|PAID_MEMBERSHIP_REQUIRED|JOIN_REQUIRED/ : /FORBIDDEN/;
      await expect(caller.mutation(api.community.createThread, { clubId, title: "Denied", body: "Denied", tags: [] })).rejects.toThrow(denial);
      await expect(caller.mutation(api.community.reply, { threadId, parentPostId: postId, body: "Denied" })).rejects.toThrow(denial);
      if (scenario === "anonymous") await expect(caller.query(api.dashboard.summary, {})).rejects.toThrow(/UNAUTHENTICATED/);
      else {
        const dashboard = await caller.query(api.dashboard.summary, {});
        expect(dashboard.discussions.map(row => row.id)).toEqual(globalDeny ? [] : [publicId]);
        expect(JSON.stringify(dashboard)).not.toMatch(/SECRET CLUB/);
      }
      expect(await t.run(ctx => ctx.db.get(threadId))).toMatchObject({ replyCount: 0 });
      expect(await t.run(ctx => ctx.db.query("posts").collect())).toHaveLength(1);
      expect(await t.run(ctx => ctx.db.query("threads").collect())).toHaveLength(2);
    });
  }
  it("allows eligible joined club access, preserves paid-through cancellation and nonclub behavior", async () => {
    const { t, actor, user } = await setup("reader", "inner");
    const { clubId, threadId, publicId } = await clubFixture(t, user);
    await t.run(async ctx => { const sub = (await ctx.db.query("subscriptions").collect())[0]; await ctx.db.patch(sub._id, { cancelAtPeriodEnd: true }); });
    expect((await actor.query(api.community.listThreads, {})).map(row => row._id)).toEqual([threadId, publicId]);
    expect((await actor.query(api.readerCircle.discussions, {})).map(row => row._id)).toEqual([threadId, publicId]);
    expect((await actor.query(api.dashboard.summary, {})).discussions.map(row => row.id)).toEqual([threadId, publicId]);
    expect(await actor.query(api.readerCircle.discussion, { threadId })).toMatchObject({ title: "SECRET CLUB TITLE", body: "SECRET CLUB BODY", posts: [{ body: "SECRET CLUB REPLY" }] });
    expect(await actor.query(api.readerCircle.discussion, { threadId: publicId })).toMatchObject({ title: "Circle title", body: "Circle body" });
    await expect(actor.mutation(api.community.createThread, { clubId, title: "Allowed", body: "Allowed", tags: [] })).resolves.toBeTruthy();
    await expect(actor.mutation(api.community.reply, { threadId, body: "Allowed" })).resolves.toBeTruthy();
    await expect(actor.mutation(api.community.createThread, { title: "Circle", body: "Circle", tags: [] })).resolves.toBeTruthy();
    await expect(actor.mutation(api.community.reply, { threadId: publicId, body: "Circle" })).resolves.toBeTruthy();
  });
  it("keeps role-based moderation available without a paid club bypass", async () => {
    const { t, actor, user } = await setup("moderator");
    const { postId, threadId } = await clubFixture(t, user, false);
    await expect(actor.mutation(api.community.moderatePost, { postId, status: "hidden" })).resolves.toBeNull();
    await expect(actor.query(api.readerCircle.discussion, { threadId })).rejects.toThrow(/PAID_MEMBERSHIP_REQUIRED/);
  });
});
