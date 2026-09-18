import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api, components } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");

async function setup(
  status = "active",
  planKey = "reader",
  expiry = Date.now() + 86400000,
) {
  const t = convexTest(schema, modules);
  betterAuth.register(t);
  const now = Date.now();
  const user = await t.mutation(components.betterAuth.adapter.create, {
    input: {
      model: "user",
      data: {
        name: "Test Reader",
        email: "reader@example.test",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    },
  });
  const session = await t.mutation(components.betterAuth.adapter.create, {
    input: {
      model: "session",
      data: {
        userId: user._id,
        token: "test-session",
        expiresAt: now + 86400000,
        createdAt: now,
        updatedAt: now,
      },
    },
  });
  const reader = t.withIdentity({ subject: user._id, sessionId: session._id });
  const sub = await t.run((ctx) =>
    ctx.db.insert("subscriptions", {
      authUserId: user._id,
      status,
      planKey,
      currentPeriodEnd: expiry,
      stripeCustomerId: "test",
      stripeSubscriptionId: "test",
      stripePriceId: "test",
      cancelAtPeriodEnd: false,
      createdAt: now,
      updatedAt: now,
    }),
  );
  return { t, reader, sub };
}

describe("paid Reader Circle", () => {
  it("starts with real zeros and denies anonymous private access", async () => {
    const t = convexTest(schema, modules);
    betterAuth.register(t);
    expect(await t.query(api.readerCircle.overview)).toEqual({
      members: 0,
      threads: 0,
      clubs: 0,
      access: "anonymous",
    });
    await expect(t.mutation(api.readerCircle.join)).rejects.toThrow();
    await expect(t.query(api.community.listThreads, {})).rejects.toThrow();
  });
  for (const [status, plan, expiry] of [
    ["trialing", "reader", Date.now() + 86400000],
    ["active", "free", Date.now() + 86400000],
    ["past_due", "reader", Date.now() + 86400000],
    ["canceled", "reader", Date.now() + 86400000],
    ["paused", "reader", Date.now() + 86400000],
    ["active", "reader", Date.now() - 1000],
    ["active", "reader", undefined],
  ]) {
    it(`denies ${status}/${plan}/${expiry}`, async () => {
      const { reader, t, sub } = await setup(status, plan, expiry);
      if (expiry === undefined)
        await t.run((ctx) =>
          ctx.db.patch(sub, { currentPeriodEnd: undefined }),
        );
      await expect(reader.mutation(api.readerCircle.join)).rejects.toThrow(
        /PAID_MEMBERSHIP_REQUIRED/,
      );
      await expect(
        reader.query(api.readerCircle.discussions),
      ).rejects.toThrow();
      await expect(
        reader.mutation(api.community.createThread, {
          title: "Test",
          body: "Test",
          tags: [],
        }),
      ).rejects.toThrow();
    });
  }
  it("joins once, persists discussion/replies, and revokes expired access", async () => {
    const { reader, t, sub } = await setup();
    await expect(reader.query(api.readerCircle.discussions)).rejects.toThrow(
      /JOIN_REQUIRED/,
    );
    const member = await reader.mutation(api.readerCircle.join);
    expect(await reader.mutation(api.readerCircle.join)).toBe(member);
    expect((await t.query(api.readerCircle.overview)).members).toBe(1);
    const id = await reader.mutation(api.community.createThread, {
      title: "The ending",
      body: "What did you think?",
      tags: [],
    });
    await reader.mutation(api.community.reply, {
      threadId: id,
      body: "I loved it.",
    });
    expect(
      (await reader.query(api.readerCircle.discussion, { threadId: id }))
        .posts[0].body,
    ).toBe("I loved it.");
    await t.run((ctx) => ctx.db.patch(sub, { cancelAtPeriodEnd: true }));
    expect((await reader.query(api.readerCircle.overview)).access).toBe(
      "member",
    );
    await t.run((ctx) =>
      ctx.db.patch(sub, { currentPeriodEnd: Date.now() - 1 }),
    );
    expect((await t.query(api.readerCircle.overview)).members).toBe(0);
    await expect(
      reader.query(api.readerCircle.discussion, { threadId: id }),
    ).rejects.toThrow();
    await expect(
      reader.mutation(api.community.reply, { threadId: id, body: "Denied" }),
    ).rejects.toThrow();
  });
  it("checks club membership, tier, duplicate joins, and moderation visibility", async () => {
    const { reader, t } = await setup();
    await reader.mutation(api.readerCircle.join);
    const club = await t.run((ctx) =>
      ctx.db.insert("clubs", {
        name: "Club",
        description: "Club",
        slug: "club",
        accessTier: "inner",
        status: "open",
        memberCount: 999,
        createdAt: 1,
        updatedAt: 1,
      }),
    );
    expect((await reader.query(api.readerCircle.clubs))[0].members).toBe(0);
    await expect(
      reader.mutation(api.readerCircle.joinClub, { clubId: club }),
    ).rejects.toThrow();
    await t.run((ctx) => ctx.db.patch(club, { accessTier: "reader" }));
    const membership = await reader.mutation(api.readerCircle.joinClub, {
      clubId: club,
    });
    expect(
      await reader.mutation(api.readerCircle.joinClub, { clubId: club }),
    ).toBe(membership);
    expect((await reader.query(api.readerCircle.clubs))[0].members).toBe(1);
    const id = await reader.mutation(api.community.createThread, {
      title: "Club discussion",
      body: "Hello",
      tags: [],
      clubId: club,
    });
    const post = await reader.mutation(api.community.reply, {
      threadId: id,
      body: "Hidden",
    });
    await expect(
      reader.mutation(api.community.moderatePost, {
        postId: post,
        status: "hidden",
      }),
    ).rejects.toThrow();
    await t.run((ctx) => ctx.db.patch(post, { status: "hidden" }));
    expect(
      (await reader.query(api.readerCircle.discussion, { threadId: id })).posts,
    ).toHaveLength(0);
    await t.run((ctx) => ctx.db.patch(id, { status: "hidden" }));
    expect(
      await reader.query(api.readerCircle.discussion, { threadId: id }),
    ).toBeNull();
  });
});
