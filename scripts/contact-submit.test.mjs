// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test scripts/contact-submit.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CONTACT_NETWORK_ERROR,
  CONTACT_UNCONFIRMED_ERROR,
  contactHttpError,
  submitContact,
} from "../lib/contact-submit.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const payload = { name: "TEST Reader", email: "reader@example.test", message: "Hello there, a test note.", website: "" };
const json = (status, body) => async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const text = (status, body) => async () => new Response(body, { status, headers: { "Content-Type": "text/html" } });

test("fetch rejection resolves to an actionable network failure (no throw)", async () => {
  const result = await submitContact(payload, async () => { throw new TypeError("Failed to fetch"); });
  assert.deepEqual(result, { ok: false, error: CONTACT_NETWORK_ERROR });
});

test("malformed or non-JSON responses never throw", async () => {
  assert.deepEqual(await submitContact(payload, text(200, "<html>ok</html>")), { ok: false, error: CONTACT_UNCONFIRMED_ERROR });
  assert.deepEqual(await submitContact(payload, text(502, "<html>Bad gateway</html>")), { ok: false, error: contactHttpError(502) });
  assert.deepEqual(await submitContact(payload, json(200, null)), { ok: false, error: CONTACT_UNCONFIRMED_ERROR });
  assert.deepEqual(await submitContact(payload, json(200, ["sent"])), { ok: false, error: CONTACT_UNCONFIRMED_ERROR });
});

test("HTTP failure uses the server's error message when present", async () => {
  assert.deepEqual(await submitContact(payload, json(400, { error: "Please wait a minute before sending again." })), { ok: false, error: "Please wait a minute before sending again." });
  assert.deepEqual(await submitContact(payload, json(503, { error: "   " })), { ok: false, error: contactHttpError(503) });
  assert.deepEqual(await submitContact(payload, json(500, {})), { ok: false, error: contactHttpError(500) });
});

test("success only for the documented 200 { sent: true } contract", async () => {
  assert.deepEqual(await submitContact(payload, json(200, { sent: true })), { ok: true });
  assert.deepEqual(await submitContact(payload, json(200, { sent: "true" })), { ok: false, error: CONTACT_UNCONFIRMED_ERROR });
  assert.deepEqual(await submitContact(payload, json(200, {})), { ok: false, error: CONTACT_UNCONFIRMED_ERROR });
});

test("retry after a failure sends the same payload again and can succeed", async () => {
  const bodies = [];
  let attempt = 0;
  const flaky = async (url, init) => {
    bodies.push({ url, method: init.method, body: init.body });
    attempt += 1;
    if (attempt === 1) throw new TypeError("offline");
    return new Response(JSON.stringify({ sent: true }), { status: 200 });
  };
  assert.equal((await submitContact(payload, flaky)).ok, false);
  assert.equal((await submitContact(payload, flaky)).ok, true);
  assert.equal(bodies.length, 2);
  assert.deepEqual(bodies[0], bodies[1]);
  assert.deepEqual(bodies[0], { url: "/api/contact", method: "POST", body: JSON.stringify(payload) });
});

test("contact page always clears pending and keeps the form mounted on failure", () => {
  const page = readFileSync(path.join(root, "components/pages/contact-page.tsx"), "utf8");
  assert.ok(page.includes("submitContact("), "page submits through the helper");
  assert.match(page, /finally\s*\{\s*setPending\(false\);\s*\}/, "pending cleared in finally");
  assert.ok(!page.includes("response.json()"), "no unguarded JSON parse in the page");
  assert.ok(page.includes("if (result.ok) setSent(true);"), "success only on ok result");
  assert.ok(page.includes('name="website"'), "honeypot preserved");
  assert.ok(page.includes("{sent ? ("), "form is replaced only after confirmed success");
});
