// Run: node --test scripts/reset-page-state.test.mjs
// Source-level guard for reset-page async state (no DOM test libraries are installed).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(path.join(root, "components/pages/reset-page.tsx"), "utf8");
const body = (name) => {
  const start = page.indexOf(`const ${name} = async`);
  assert.ok(start >= 0, `${name} exists`);
  const next = page.indexOf("\n    const ", start + 1);
  return page.slice(start, next < 0 ? undefined : next);
};

test("resend clears the previous error and sent flag before requesting again", () => {
  const resend = body("resetResend");
  const clearError = resend.indexOf('setResetError("")');
  const clearSent = resend.indexOf("setResetResent(false)");
  const request = resend.indexOf("authClient.requestPasswordReset");
  assert.ok(clearError >= 0 && clearError < request, "stale error cleared before the request");
  assert.ok(clearSent >= 0 && clearSent < request, "stale 'Sent again' cleared before the request");
});

test("every async handler owns pending and clears it in finally", () => {
  for (const name of ["resetSend", "resetResend", "resetSave"]) {
    const handler = body(name);
    assert.ok(handler.includes("setPending(true)"), `${name} sets pending`);
    assert.match(handler, /finally\s*\{\s*setPending\(false\);\s*\}/, `${name} clears pending in finally`);
  }
});

test("reset copy: expiry matches the backend token lifetime and email (one hour)", () => {
  const auth = readFileSync(path.join(root, "convex/auth.ts"), "utf8");
  assert.match(auth, /resetPasswordTokenExpiresIn:\s*60 \* 60\b/, "backend reset token lifetime is one hour");
  assert.ok(auth.includes("It expires in one hour."), "backend reset email says one hour");
  assert.ok(page.includes("Reset links expire in one hour."), "UI states one hour");
  assert.ok(!/30 minutes|thirty minutes/i.test(page), "no stale 30-minute claim");
});

test("reset copy: confirmation is conditional and never asserts delivery (no account enumeration)", () => {
  assert.ok(page.includes("If an account exists for this email address, a reset link will be sent."));
  assert.ok(!/We sent a reset link|has been sent|we(?:’|')ve sent/i.test(page), "no claim that an email was delivered");
  assert.ok(!/no account|not found|isn(?:’|')t registered/i.test(page), "no account-existence disclosure");
});

test("reset copy: success message is general reading copy, not a hardcoded chapter", () => {
  assert.ok(!/Chapter\s+11/i.test(page), "no hardcoded Chapter 11");
  assert.ok(page.includes("pick up your reading where you left off"));
});

test("all three request triggers are disabled while a request is pending (no overlapping requests)", () => {
  assert.equal((page.match(/disabled=\{pending\}/g) ?? []).length, 3);
  assert.match(page, /onClick=\{resetResend\} disabled=\{pending\}/);
});
