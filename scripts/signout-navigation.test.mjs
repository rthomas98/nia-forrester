// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test scripts/signout-navigation.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { revokeAfterUnsubscribe, signOutToHome } from "../lib/sign-out.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

test("navigates exactly once, to home, only after sign-out settles", async () => {
  const events = [];
  let release;
  const signOut = () => new Promise((resolve) => { events.push("signOut:start"); release = () => { events.push("signOut:end"); resolve(); }; });
  const pending = signOutToHome(signOut, (url) => events.push(`navigate:${url}`));
  await Promise.resolve();
  assert.deepEqual(events, ["signOut:start"], "must not navigate before the session is cleared");
  release();
  await pending;
  assert.deepEqual(events, ["signOut:start", "signOut:end", "navigate:/"]);
});

test("still leaves with one navigation when sign-out fails", async () => {
  const urls = [];
  await assert.rejects(signOutToHome(() => Promise.reject(new Error("network")), (url) => urls.push(url)), /network/);
  assert.deepEqual(urls, ["/"]);
});

test("authenticated subscribers are unmounted before the session is revoked", async () => {
  const events = [];
  await revokeAfterUnsubscribe(
    () => events.push("unsubscribeAll"),
    async () => { events.push("revoke:start"); await Promise.resolve(); events.push("revoke:end"); },
  );
  assert.deepEqual(events, ["unsubscribeAll", "revoke:start", "revoke:end"]);
});

test("full sign-out order: unmount, revoke, then one navigation", async () => {
  const events = [];
  const signOut = () => revokeAfterUnsubscribe(() => events.push("unmount"), async () => events.push("revoke"));
  await signOutToHome(signOut, (url) => events.push(`navigate:${url}`));
  assert.deepEqual(events, ["unmount", "revoke", "navigate:/"]);
});

test("auth provider commits the unmount synchronously before authClient.signOut", () => {
  const provider = source("components/auth-context.tsx");
  assert.match(provider, /revokeAfterUnsubscribe\(\s*\(\) => flushSync\(\(\) => setSigningOut\(true\)\),\s*\(\) => authClient\.signOut\(\),?\s*\)/, "flushSync unmount precedes revocation");
  assert.ok(provider.includes("{signingOut ? <SigningOut /> : children}"), "page tree (all subscribers) is replaced while signing out");
  assert.ok(!provider.includes(".close()"), "the shared Convex client is not closed");
});

test("site header uses the single full navigation, not push+refresh", () => {
  const header = source("components/site-header.tsx");
  assert.ok(header.includes("signOutToHome(signOut)"), "sign-out goes through signOutToHome");
  assert.ok(!/router\.push\(\s*["']\/["']\s*\)/.test(header), "no client router.push('/') on sign-out");
  assert.ok(!header.includes("router.refresh()"), "no router.refresh() racing the sign-out transition");
  const helper = source("lib/sign-out.ts");
  assert.ok(helper.includes("window.location.assign(url)"), "default navigation is a full document load");
});
