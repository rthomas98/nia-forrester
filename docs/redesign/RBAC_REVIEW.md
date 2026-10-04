# Reciprocal review — approved RBAC repair (task_be740b64528e)

Reviewer: Claude Opus 5.5 (`claude-opus-5-5`, medium), frontend owner, 2026-10-03.
Read-only review. I read `AGENTS.md`, `.agents/skills/nia-agent-pair/SKILL.md` and
`docs/ORCA_WORKFLOW.md` first. No backend, frontend product, env, dependency, provider
or browser action was taken; this file is the only write. Dirty work in both worktrees
was preserved.

**Disposition: ACCEPTED, no blocking findings.** The repair enforces the two approved
policies correctly in every application consumer, with no leakage and no staff bypass.
N1 needs an operational decision before production admin onboarding.

## Reviewed bytes

All six final hashes match `docs/REDESIGN_RBAC_FIX.md` (lines 36–41), both at the start
and at the end of the review.

| File (`nia-relume-contracts`) | SHA-256 |
| --- | --- |
| `convex/profiles.ts` | `84a58b261809bbc38460b1ea52113b58013d71690e12ab321eef52f5477f8cf4` |
| `convex/communityAccess.ts` | `7d69fe99d9c601f2dd1f8a8315fd021f6303ba09fbe73a52c894e8be0f8e6b85` |
| `convex/community.ts` | `3d37836d9309e1a91070ba77f33f37b163971047b1e428e178a15dbad410b5a6` |
| `convex/readerCircle.ts` | `6361cbd654c01a598d5ee5b8879e89961cd0c6a64ad41b639e210bc39a312f0b` |
| `convex/dashboard.ts` | `a8eb15d84f39fb6ee1580870aa9738c7d7626b10fb0854d4e79e7de59f702e9c` |
| `scripts/rbac-audit.test.mjs` | `8ef5ce29adebea61c173397524c50fa4b33a2769f6741d3f3146fa20de0bfd38` |
| `docs/REDESIGN_RBAC_FIX.md` (report) | `de95bb4db831a932fee71c1b7ecfa0c331e9b9b83245a64f47829ad2c6953241` |

Snapshots (unchanged during the review): contracts worktree including `docs/`, 216
files, `affa3cf97061c99f48f305567ae1b90054ef1c7f3720ab26513d37e108b6e687`; frontend
product, 232 files, `b38d30d1c37ca82888fde143201c6b2b5103abb98188111504b894bf5f2e01cf`.

## Verification

| Requirement | Evidence | Result |
| --- | --- | --- |
| Verified allowlist bootstrap, insert-only | `profiles.ts` diff: `role = user.emailVerified === true && adminEmails.includes(user.email.trim().toLowerCase())`, used only on insert. The existing-profile branch patches name/preferences only, never `role` | Verified |
| Existing explicit roles preserved | No `role` patch exists anywhere in application code (`grep` across `convex/*.ts`). Tests cover 4 roles × allowlisted × verified (`rbac-audit.test.mjs:62-75`) | Verified |
| Eligible active paid subscription | `canAccessClub` (`communityAccess.ts:6-24`) requires the server-resolved subscription to satisfy `isPaidSubscription` (active, non-free, defined future `currentPeriodEnd`) and `hasTier(planKey, club.accessTier)`. Profile tier and member count are not consulted | Verified |
| Persisted joined open-club membership | Same predicate: club exists with `status === "open"`, plus a `clubMemberships` row via `by_club_user`. Deleted club, nonopen states and removed membership fail closed | Verified |
| Enforced on list, detail, create, reply, dashboard | `community.listThreads` and `readerCircle.discussions` filter before the limit and before author/post projection. `readerCircle.discussion` throws after the existing hidden→null check. `community.createThread` and `community.reply` call `requireClubAccess` before any write. `dashboard.summary` uses the shared predicate. Callers keep `requirePaidMember` (paid plus Circle join) | Verified |
| No data leakage | 15 denial scenarios (`rbac-audit.test.mjs:127-171`) check both lists (with `limit: 1` and the club thread most recent, proving filter-before-limit), detail, create, reply with a parent, dashboard, `SECRET CLUB` absence and unchanged thread/post/reply counts | Verified |
| No staff bypass | The predicate ignores role. `staff-unjoined` (admin) is denied; an unpaid moderator gets `PAID_MEMBERSHIP_REQUIRED` on detail (`:187-191`) | Verified |
| Non-club and moderation behaviour preserved | Non-club threads skip the predicate. Positive test covers non-club read/create/reply and paid-through cancellation (`:173-186`). `moderatePost` and `createClub` are unchanged and role-gated | Verified |
| All `threads`/`posts` consumers | `grep` over `convex/*.ts`: only `community.ts` (listThreads, createThread, reply, moderatePost), `readerCircle.ts` (overview aggregate count, discussions, discussion), `dashboard.ts`, `schema.ts` and the isolated `redesignJourneyFixtures.ts` internal helper. Frontend consumers are `community-page.tsx` (discussions, discussion, clubs, sessions, createThread, joinClub, overview, join, reply) and `dashboard-page.tsx` (summary); `community.listThreads` has no frontend consumer | Matches report |

## Tests (run by me in the contracts checkout)

| Command | Result |
| --- | --- |
| `./node_modules/.bin/vitest run scripts/{community,events,academy,avatars,dashboard,rbac-audit,site-data,redesign-fixtures}.test.mjs` | **8 files, 83/83 pass** (matches report) |
| `./node_modules/.bin/tsc --noEmit --incremental false` | pass |

Both previously failing security assertions (unverified bootstrap, inner-club detail)
now pass. I did not re-run lint or the source/negative suites; the report's results
are cited as the backend worker's.

## Findings

**N1 — Decision required (not a security blocker): admin bootstrap is now unreachable
through the app.** `convex/auth.ts` sets `requireEmailVerification: false` and
configures no verification-email sender. The only `profiles.ensure` caller is the
signup server action (`app/signup/actions.ts:24`), which the signup page invokes
immediately after password `signUp.email` (`components/pages/signup-page.tsx:91`), while
`emailVerified` is still false. The profile is therefore created as `reader`, and
`ensure` never promotes an existing profile, so an allowlisted owner can never become
admin through the product. This fails closed and is consistent with the approved
"insert-only, verified" policy, but production admin onboarding will need an approved
operator path or a verified-email flow that runs before profile insertion. Do not loosen
the guard to fix this.

**N2 — Low, scalability.** `listThreads` and `discussions` scan open threads in activity
order until the limit, doing two reads per club thread with no per-request memo by
`clubId`. A member without access to many club threads causes a full scan of the open
index. `dashboard.summary` already `.collect()`s every open thread (pre-existing) and now
adds the same per-row checks. This is fine at current data volumes, but can approach
Convex per-function read limits as threads grow. Suggested follow-up: memoize
`canAccessClub` per `clubId` within a call; longer term, index threads by club or
precompute the user's accessible club set.

**N3 — Low, existence oracle.** `reply` validates `parentPostId` and the thread's
open/closed status before the club check, and `discussion` returns `null` for hidden
threads before the club check. A non-member holding opaque IDs can distinguish
"invalid parent", "not open", "hidden" and FORBIDDEN, but no content is exposed.
Moving the club check directly after the thread fetch would remove this.

**N4 — Low, frontend follow-up (owner: me).** If access is lost while a discussion is
open, `readerCircle.discussion` now throws FORBIDDEN instead of returning `null`. In
`community-page.tsx` that reaches the section-level `QueryBoundary` ("We Couldn't Load
the Circle") rather than an inline message. The list no longer shows inaccessible
threads, so this is reachable only on a race. An inline FORBIDDEN state in `Discussion`
would be nicer; no change was made under this review-only dispatch.

**N5 — Informational.** `readerCircle.overview` still counts club threads in its public
aggregate (count only, no titles/bodies), as documented. The earlier proposal to exclude
`isTest` events from `readerCircle.sessions` was not part of this approval and remains
open. Admins bootstrapped under the old policy are untouched; no audit or revocation was
performed.

## Remaining gates

- Separately authorized code push of these exact hashes to the isolated dev deployment
  (`dutiful-firefly-917`). Local `convex-test` does not prove deployed behaviour.
- Coordinator CUA on 127.0.0.1:3417:
  - A writers member joins a club and sees and replies to its thread.
  - The same member, unjoined from another club, does not see that club's threads in the
    Circle list or the dashboard.
  - A free reader is denied.
  - The staff account without a subscription is denied.
- Decision on N1 before production admin onboarding.
- No commit, push or deployment occurred.
