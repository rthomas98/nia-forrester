# Approved RBAC repair

Completed locally on 2026-10-03 for task `task_be740b64528e`, dispatch `ctx_6464640b563b`, in `nia-relume-contracts`. Base HEAD is `fefc16b83a5a8e0124d8cb8bce9a228dd9064ae7`; this is an uncommitted backend delta awaiting independent Claude review. Provider push and coordinator CUA acceptance are separate later gates.

## Approved decisions and implementation

The user explicitly approved requiring verified email before allowlisted admin bootstrap and requiring an appropriate active paid tier plus persisted joined club membership for club discussions. `profiles.ensure` now assigns admin only on insertion when `user.emailVerified === true` and the trimmed, lowercased email matches the normalized `ADMIN_EMAILS` list. Existing reader, moderator, editor and admin roles remain unchanged by ensure, regardless of verification or allowlist changes; verifying an existing reader does not automatically promote it.

`communityAccess.canAccessClub` and `requireClubAccess` centralize the open-club, real paid subscription, tier and persisted `clubMemberships` checks. Callers retain the existing paid Circle membership prerequisite. No profile tier, club member count or staff role substitutes for entitlement. Active, nonfree subscriptions require a defined future `currentPeriodEnd`; trial/free/expired subscriptions fail, and cancellation at period end continues to grant access through the paid period. Missing, draft, paused and archived clubs fail closed; a deleted club or removed membership revokes access.

The predicate filters `community.listThreads`, `readerCircle.discussions` and `dashboard.summary`; the guard protects `readerCircle.discussion`, `community.createThread` and `community.reply`. List filtering occurs before applying visible-result limits and before resolving author/post projections. The first two lists iterate in activity order and stop when the existing result limit is reached. Hidden-detail null behavior, existing result shapes and nonclub Circle behavior remain intact. Role-based `moderatePost` and club administration remain unchanged, with no new staff read/write bypass.

## Consumer inspection

A complete `threads`/`posts` search under `convex` found all application consumers in community, readerCircle and dashboard, plus schema definitions and the existing isolated `redesignJourneyFixtures` operator helper. The helper uses internal functions and its existing exact isolated-deployment guard; it was preserved. `readerCircle.overview` still returns public aggregate counts only. Club discovery contains club metadata rather than thread titles/bodies. No alternate application query returning thread titles, bodies or replies was found outside the protected paths.

## Validation

- Explicit eight-suite Vitest run: **83/83 pass**, eight files pass. Files: `community`, `events`, `academy`, `avatars`, `dashboard`, `rbac-audit`, `site-data`, `redesign-fixtures`, all under `scripts/*.test.mjs`.
- Original unverified-bootstrap and inner-club-denial assertions retained and passing. RBAC coverage adds verified normalized allowlist success, verified nonallowlist denial, all four existing roles under both verification/allowlist states, correct-tier unjoined denial, joined lower tier and downgrade denial, expired/trial/free/missing-period denial, anonymous and missing Circle join denial, removed club membership, all nonopen club states, deleted club, eligible joined success and staff denial without bypass.
- Each denied club scenario checks both lists, detail, create, reply with parent, dashboard leakage and unchanged stored thread/post counts. Positive tests check private title/body/reply access, club writes, nonclub reads/writes, paid-through cancellation and unpaid moderator permissions.
- `npm run typecheck`: pass.
- `npm run lint`: zero errors; five baseline warnings (four generated eslint-disable directives and one unused academy-test variable).
- `git diff --check`: pass.
- Node source preservation/negative controls: **16/16 pass**, using `REDESIGN_SOURCE_ROOT=/Users/robthomas/orca/workspaces/nia-forrester/nia-relume-frontend` and `node --test scripts/redesign-source.test.mjs scripts/redesign-source-negative.test.mjs`.
- Node catalog contract suite: **11/11 pass**, using experimental strip types. No Node test-runner or Playwright files were run under Vitest.

The initial source run against this backend worktree failed because it lacks final author photo/serial assets and the negative suite requires an explicit frontend root. Rerunning read-only against the complete frontend checkout passed. One new closed-club fixture initially used nonexistent schema status `closed`; it was corrected to test every actual nonopen state (`draft`, `paused`, `archived`) without changing the denial assertions.

## Exact file identity and task delta

SHA-256 before values were captured from the dirty starting worktree. Only the six files below and this report were changed by this dispatch. The RBAC test file already had coordinator-approved audit corrections at the baseline, which remain present. Other existing dirty files, generated API edits, fixtures and reports were preserved.

| File | Before SHA-256 | Final SHA-256 |
| --- | --- | --- |
| `convex/profiles.ts` | `c774fe033083e54f9fcbcfc17c6f936de3e08ee308088e1e75ed6bcbf3238417` | `84a58b261809bbc38460b1ea52113b58013d71690e12ab321eef52f5477f8cf4` |
| `convex/communityAccess.ts` | `72a137d8148c6fa0aad05e9d8e61a0731ad1de62414fce49eac4f39343870fdc` | `7d69fe99d9c601f2dd1f8a8315fd021f6303ba09fbe73a52c894e8be0f8e6b85` |
| `convex/community.ts` | `ad19c3fdfb3f9a68ce4abaecb02708c8f5ebe05e9acb82ead8ad0a08d70d29f0` | `3d37836d9309e1a91070ba77f33f37b163971047b1e428e178a15dbad410b5a6` |
| `convex/readerCircle.ts` | `914014d3ace3ce5fdb0a0a2c526ba6212c5672bbfd479e25fffc6d1e82628477` | `6361cbd654c01a598d5ee5b8879e89961cd0c6a64ad41b639e210bc39a312f0b` |
| `convex/dashboard.ts` | `434208a299d585e0f2ab5ea8789824f39543a5983f994865dd85417a8dcd0506` | `a8eb15d84f39fb6ee1580870aa9738c7d7626b10fb0854d4e79e7de59f702e9c` |
| `scripts/rbac-audit.test.mjs` | `b62e03296b1159ed197afd0d095e3f1fb014d15f163bc47298422f0f42578357` | `8ef5ce29adebea61c173397524c50fa4b33a2769f6741d3f3146fa20de0bfd38` |

Source implementation delta: profiles +1/-1, communityAccess +35/-2, community +16/-19, readerCircle +14/-6, dashboard +2/-6 (relative to HEAD; these five files were clean at dispatch start). The test file's complete HEAD delta is +115/-4, including its preexisting +8/-2 audit edits; this dispatch adds +107/-2 relative to the dirty baseline. This report is a new file.

## No migration and remaining gates

No data migration, bulk promotion/demotion or production record modification occurred. Existing roles, including admins originally bootstrapped under the old policy, remain explicit and untouched; this repair does not audit or revoke them. Persisted club membership alone no longer grants access after downgrade/expiry/closure. Subscription selection semantics and the persisted membership schema remain unchanged.

No frontend edits, dependencies, environment/credential/provider mutations, commit, Git push, Convex push/deploy or browser commands occurred. All source edits used apply_patch. Claude reciprocal review of these exact hashes, any review corrections, separately authorized isolated dev code push, and coordinator-owned CUA acceptance remain outstanding. Local Convex tests do not prove deployed behavior, real billing/mail delivery or production readiness.
