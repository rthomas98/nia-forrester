import { it, expect } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api, internal, components } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");
async function setup() {
  const t = convexTest(schema, modules); betterAuth.register(t);
  const now = Date.now();
  const user = await t.mutation(components.betterAuth.adapter.create, { input: { model: "user", data: { name: "Avatar Test", email: "avatar@example.test", emailVerified: true, createdAt: now, updatedAt: now } } });
  const session = await t.mutation(components.betterAuth.adapter.create, { input: { model: "session", data: { userId: user._id, token: "avatar-test", expiresAt: now+86400000, createdAt: now, updatedAt: now } } });
  return { t, user, actor: t.withIdentity({ subject: user._id, sessionId: session._id }) };
}
it("denies anonymous changes and forged direct uploads", async () => {
  const { t, actor } = await setup();
  await expect(t.query(api.avatars.mine)).rejects.toThrow();
  await expect(t.mutation(api.avatars.remove)).rejects.toThrow();
  await expect(actor.action(api.avatars.upload, { secret: "forged", bytes: new ArrayBuffer(1) })).rejects.toThrow(/Forbidden/);
  expect(await actor.query(api.avatars.mine)).toBeNull();
});
it("isolates avatars and cleans up replacement/removal storage", async () => {
  const { t, user, actor } = await setup();
  const first = await t.run(ctx => ctx.storage.store(new Blob(["first"], { type: "image/webp" })));
  const other = await t.run(ctx => ctx.storage.store(new Blob(["other"], { type: "image/webp" })));
  await t.mutation(internal.avatars.attach, { authUserId: "another-reader", storageId: other });
  expect(await actor.query(api.avatars.mine)).toBeNull();
  await actor.mutation(api.avatars.remove);
  expect(await t.run(async ctx => Boolean(await ctx.storage.get(other)))).toBe(true);
  await t.mutation(internal.avatars.attach, { authUserId: user._id, storageId: first });
  expect(await actor.query(api.avatars.mine)).toBeTruthy();
  const next = await t.run(ctx => ctx.storage.store(new Blob(["next"], { type: "image/webp" })));
  await t.mutation(internal.avatars.attach, { authUserId: user._id, storageId: next });
  expect(await t.run(async ctx => Boolean(await ctx.storage.get(first)))).toBe(false);
  await actor.mutation(api.avatars.remove);
  expect(await actor.query(api.avatars.mine)).toBeNull();
  expect(await t.run(async ctx => Boolean(await ctx.storage.get(next)))).toBe(false);
  expect(await t.run(async ctx => Boolean(await ctx.storage.get(other)))).toBe(true);
});
