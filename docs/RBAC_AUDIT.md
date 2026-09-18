# Local RBAC audit — September 18, 2026

Result: NOT ready for production authorization sign-off.

Follow-up: the Events integration now enforces active-tier registration and protects meeting URLs. The original event registration finding below is repaired; the other authorization findings remain open.

## Browser evidence

Verified in the requested Codex in-app Browser at http://127.0.0.1:4321:

- Existing synthetic reader can sign in with email/password.
- Incorrect password is rejected with "Invalid email or password".
- Sign-out removes the session; direct /dashboard navigation redirects to /signin?next=/dashboard.
- Canceled paid reader cannot join/read the community; counts show zero members, discussions, and clubs.
- Dashboard is still a prototype: displays Maya Okafor, Inner Circle membership, fabricated reading progress and community threads instead of the signed-in reader's records.

The earlier Chrome Stripe test verified a real sandbox subscription grants community eligibility, joining increments the count, duplicate checkout is rejected, billing portal opens, and immediate cancellation revokes access and restores zero active members. No new Stripe transaction was performed in this audit.

## Isolated backend evidence

Run: `npx vitest run scripts/rbac-audit.test.mjs scripts/community.test.mjs`

22 passed, 6 failed. Fixtures exist only in convex-test's isolated database; no persistent staff roles or paid entitlements were granted.

Twelve role checks pass: editor/admin content editing; moderator/admin club creation; admin-only contact inbox; other roles denied. Ten existing paid-community tests pass.

Six security acceptance failures reproduced:

1. `content.listPublished` exposes the body of paid content to anonymous callers.
2. `content.bySlug` exposes a paid audio URL even when body access is denied.
3. Content authorization trusts cached profile tier after subscription expiry.
4. `profiles.ensure` assigns admin to an unverified account whose email matches ADMIN_EMAILS. Email/password signup does not require verification.
5. A Reader-tier member can read an Inner-tier club discussion without joining that club.
6. A free account can register for a Writers-tier event.

Additional source-inspection concerns: chapter queries use the same stale profile tier; community reply/list paths lack club-tier enforcement; public upcoming events returns meeting URLs without tier checks.

## Scope and next acceptance

This is an audit, not a completed remediation. The failing assertions intentionally preserve the security requirements for a repair pass. No production deployment was changed. Full browser journeys for moderator/editor/admin and Inner/Writers tiers are not certified: there is no tested staff management interface or provisioned browser account matrix. Repair authorization boundaries, replace dashboard fixtures with real records, and then rerun backend and role-specific browser acceptance before enabling live memberships.
