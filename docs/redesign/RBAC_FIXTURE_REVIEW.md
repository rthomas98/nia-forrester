# Reciprocal review — additive RBAC test fixtures

Reviewer: Claude Opus 5.5 (`claude-opus-5-5`, medium), frontend owner, 2026-10-03.
Read-only review of two contracts-only files, done after reading the project
instructions (`AGENTS.md`, pair skill, `docs/ORCA_WORKFLOW.md`). No backend, source,
env, provider, browser, dependency, commit or push writes. This file is the only write.

**Reviewer disposition for the two files below: ACCEPTED, no blocking findings.**

> **This is reviewer acceptance, not coordinator approval to invoke the helper.** The
> final harness (`bba4e0ed…`) requires a separate coordinator dispatch marker in addition
> to the anchored disposition line below and both hashes (see P1/H1, resolved). Per the
> dispatch, the coordinator must explicitly approve before the helper or harness runs.

## Reviewed bytes

| File (`nia-relume-contracts`) | SHA-256 |
| --- | --- |
| `convex/redesignRbacFixtures.ts` | `faaa86bba3887ebd67bccbe656608431953cb46c533fa650d13dd47edb463525` |
| `scripts/redesign-rbac-fixtures.test.mjs` | `a9dcca28e6103cb9c928449e32c53aa933a610678c91f8040d5bbd0fe99829d2` |

Both matched the dispatch values at the start and the end of the review. The accepted
product repair is unchanged (`profiles 84a58b26…`, `communityAccess 7d69fe99…`,
`community 3d37836d…`, `readerCircle 6361cbd6…`, `dashboard a8eb15d8…`, `rbac-audit
8ef5ce29…`), as is `_generated/api.d.ts` (`7d3a01ae…`, no reference to the new module).
Snapshots were unchanged during the review: contracts including `docs/`, 218 files,
`f150f1f5ceecb16127c60385e90b1b9c43304e22adf36e92c8ec73851ce4b5e4`; frontend product,
232 files, `b38d30d1c37ca82888fde143201c6b2b5103abb98188111504b894bf5f2e01cf`.

## Assessment

| Requirement | Evidence (`redesignRbacFixtures.ts`) | Result |
| --- | --- | --- |
| Internal-only entrypoint | `internalMutation` (:6); not client-callable | Verified |
| Exact nondefault dev site, scope and origin guard | `CONVEX_SITE_URL === https://dutiful-firefly-917.convex.site`, `TEST_FIXTURE_SCOPE === redesign-oct03-4978ed34033f`, `SITE_URL === http://127.0.0.1:3417` (:9-11). This is the first statement, before any read or write | Verified |
| All delivery keys rejected before writes | `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` must be empty (:12). These are the only server delivery credentials the app uses | Verified |
| Exactly two distinct fixed synthetic accounts | Count 2, distinct IDs, distinct tiers from the `reader`/`writers` union, so exactly one of each (:15). Each auth user must have email `redesign-rbac-<tier>-unjoined@example.test` and name `TEST REDESIGN RBAC <tier> Unjoined` (:21-24) | Verified |
| No original fixture mutation or staff promotion | Inserts only; no `patch`/`delete`. Role is always `reader`; an existing profile must already be reader / matching tier / active, or it is refused (:30). The auth user, including `emailVerified`, is never updated | Verified |
| Additive, idempotent, refuses conflicts | Whole batch validated before any write (:18-34). Existing profile, subscription and Circle rows are reused; refuses an email owned by another user, more than one subscription, or a subscription that differs from the exact `TEST-REDESIGN-RBAC-*` shape or is not future-dated (:29-33) | Verified |
| Subscription and Circle shape | Subscription `active`, `planKey = tier`, 30-day `currentPeriodEnd`, `TEST-REDESIGN-RBAC-*` Stripe placeholders, no real Stripe objects (:43). One `communityMembers` row (:45) | Verified |
| No club joins | Never writes `clubMemberships`; any existing membership for the user is refused (:28-29) | Verified |

## Tests

| Command (contracts checkout) | Result |
| --- | --- |
| `./node_modules/.bin/vitest run scripts/redesign-rbac-fixtures.test.mjs` (focused 10) | **10/10 pass** |
| Independent probes (temporary file in my scratchpad, run with a vitest config rooted at contracts; nothing written to either worktree) | **8/8 pass** |

The probes cover cases the suite does not:

1. A profile pre-created by the app signup flow (`free`/`free`) is refused with no
   writes.
2. A swapped tier/ID pairing is refused.
3. A matching email with the wrong name is refused.
4. A pre-existing club membership is refused.
5. An expired seeded subscription is refused rather than silently extended.
6. A partial state (profile only) is completed additively without touching the profile.
7. A foreign subscription with real-looking Stripe IDs on a fixture user is refused.
8. The resulting identities pass the paid Circle gate but have zero club memberships.

## Findings

**P1 — Process: RESOLVED in the final harness `bba4e0ed…` (see H1).** The original text
is kept for the record. The earlier harness drafts (`199c78a8…`, then `09897ba6…`) treated
this review file as their acceptance gate. It then pushes the current contracts
code to the dev deployment (`run("readerCircle:overview", {}, true)`, `:87`), creates
two Better Auth accounts and calls the helper. Two consequences:

- Reviewer acceptance becomes an executable approval token, without separate
  coordinator approval.
- `/ACCEPTED/` also matches text like "NOT ACCEPTED".

Recommended:

- A coordinator-owned approval token, or an exact phrase anchored to these hashes.
- A full review of that harness before it runs.

It does correctly use the Better Auth HTTP sign-up (not the app signup, see P2), and it
writes a sanitized result to `/private/tmp`.

**P2 — Low, operational.** Accounts must be created through the Better Auth HTTP handler,
not the `/signup` UI. App signup calls `profiles.ensure`, which creates a `free`/`free`
profile, and the helper then correctly refuses with a collision (probe 1). It fails
closed.

**P3 — Low, time-bounded.** Seeded subscriptions expire after 30 days, after which a
re-run refuses (probe 5) rather than extending. Plan a fresh fixture or an approved
date change for later passes.

**P4 — Informational.** Never integrate `convex/redesignRbacFixtures.ts` into primary.
The header says so; the guard keeps it inert elsewhere.

## Provider harness safety review (added per coordinator follow-up, 01:16Z)

Reviewed read-only. **Final version:** `scripts/redesign-rbac-provider.mjs`, SHA-256
`bba4e0edcf89cd1811d431d2ddd0e03fbc1645b7d46f3c69b6dd22e1e55046a8` (153 lines). The full
in-depth review was done on the prior version, `09897ba685601d709053410a4cfa8ebe5a3b7007fb007223ecc1ee84f186dd89`.
The final file differs **only** in the gate block at lines 83–87. I proved this by
substituting the three prior gate lines back into the final file in memory, which hashes
exactly to `09897ba6…`. Not executed: both modes read the operator Convex token and the
synthetic credential files.

**Harness disposition: acceptable for the pinned isolated dev deployment. P1/H1 are
resolved. H2 still requires explicit coordinator acknowledgement before `accept` is run.
No invocation is authorized by this review.**

Line references in this table are for `09897ba6…`; in the final `bba4e0ed…` file,
lines after 82 are +2.

| Requirement | Evidence | Result |
| --- | --- | --- |
| Identity/env guard before each write | `guard()` (`:36-53`) re-hashes the six accepted product files, verifies via the management API the dev type, `isDefault:false`, reference, project 3065332 and team 396842, refuses any env name matching `STRIPE\|RESEND\|WEBHOOK`, and requires exact `SITE_URL=http://127.0.0.1:3417` and scope. It is called at start (`:78`), before the push (`:87`), before each POST auth call including both signups and every sign-in (`:61`), before the seed (`:98`) and before every mutation (`:72`) | Verified |
| Pinned nondefault dev only | Every CLI call appends `--deployment empuls3-agancy:nia-forrester:dev/redesign-oct03-4978ed34033f` (`:29`). Auth and Convex clients use the fixed `dutiful-firefly-917` URLs (`:12-13`) with fixed origin 3417 | Verified |
| Original four preserved | Reads the original accounts file only after a 0600 + git-ignored check (`:54-58,78`), asserts exactly four, and compares original profiles/subscriptions before and after the seed and at the end (`:99-101,146`). The positive test requires the original member to already be joined and refuses membership changes (`:122-123`) | Verified |
| Secrets 0600 and ignored | The new `.env.redesign-rbac-accounts.json` is written with mode 0600 and chmod (`:89`), then checked as ignored and 0600 (`:97`); `.gitignore:36 .env*` covers it. Passwords are random and never printed | Verified |
| Sanitized output | `inspect` prints counts, original roles, club IDs/tiers and member join IDs only (`:81`). `accept` writes `/private/tmp/redesign-rbac-provider-result.json` with IDs, hashes and results, no passwords or tokens (`:147-148`). Errors print only the phase (`:151`) | Verified |
| No real payments/email/production | No Stripe/Resend calls; delivery env names must be absent; production is never referenced | Verified |

Harness findings:

- **H1 — Gate (same as P1): RESOLVED in the final version.** `accept` now requires
  `process.argv[3] === "coordinator-approved-ctx_af0ad83d5b4c"` (`:85`), a separate
  dispatch marker to be passed only after explicit coordinator approval. The acceptance
  check is anchored to the exact full disposition line (`:87`, multiline `^…$`), so
  "NOT ACCEPTED" or loose mentions no longer pass, and both helper hashes must still
  appear (`:88`). Residuals, both low:
  - the marker is a procedural control, not a secret;
  - helper/test hashes are checked once at the gate rather than inside `guard()` before
    the push and seed. Adding them to `expectedHashes` would close that window.
- **H2 — Writes beyond push, signups and seed; not idempotent.** The positive check has
  the original member create one TEST thread (`:128`) and one TEST reply on the writers
  journey thread (`:129`) on every `accept` run. Both are labelled TEST REDESIGN and stay
  on dev, but a rerun after a partial failure duplicates them. Run `accept` exactly once,
  or make the positive writes idempotent or skippable.
- **H3 — Low.** The push uploads the whole contracts `convex/` tree, including every
  dev-only fixture module and the accepted RBAC repair, to dev. That is expected for this
  gate, but it is a full code push, not a fixture-only write.
- **H4 — Low.** `snapshot()` reads full profiles, subscriptions, threads and posts
  (synthetic emails included) into memory via `--inline-query`. They are only compared,
  never printed.
- **H5 — Low.** `guard()` runs two management calls and two `env get`s per auth and
  mutation call. That is safe but slow. Error output is fully suppressed apart from the
  phase name, so diagnosing a failure needs a safe manual inspection.

## Remaining gates

- Explicit coordinator approval, then the isolated dev push and helper invocation, then
  provider verification.
- Coordinator CUA of the club matrix with the two new unjoined accounts. Each should see
  the Circle but no club threads until it joins an eligible club; the reader should not
  be able to join inner/writers clubs.
- No live payment or email acceptance is implied.
