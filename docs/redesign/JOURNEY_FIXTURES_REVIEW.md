# Reciprocal review — TEST REDESIGN journey fixtures (task_811d2f7a698b)

Reviewer: Claude Opus 5.5 (`claude-opus-5-5`, medium), frontend owner, 2026-10-03.
Read-only review. This file is the only thing written. No provider mutation, secret
read, environment/source/lock change, browser automation, install/build/download, or
commit was performed. Read `.agents/skills/nia-agent-pair/SKILL.md` and
`docs/ORCA_WORKFLOW.md` beforehand.

**Disposition: ACCEPTED, no blocking findings.** This accepts fixture safety and data
provenance on the isolated dev deployment only. It does **not** accept live payments,
Stripe checkout, email delivery, or production readiness.

## Reviewed bytes (unchanged before and after review)

| File (`nia-relume-contracts`) | SHA-256 | Lines |
| --- | --- | --- |
| `convex/redesignJourneyFixtures.ts` | `aeac7d5e60165c2354559847dab2ebcd7cb05dc962e555343ae6f1f739a35611` | 107 |
| `scripts/redesign-journeys.mjs` | `234a726de4e55e50eaa6ce5a5050e493da6214b0852f51bfee5efa6c4b35898d` | 164 |
| `docs/REDESIGN_JOURNEY_FIXTURES.md` | `615f87b014af5b1dc898a184fd9d996bfa6cc4185c3dab17756ccb6773bfd626` | 143 |

The first two hashes match the report's own table (doc lines 136–137). The report-file
hash is recorded here because the report intentionally does not hash itself.

Snapshots, using the manifest scope rules from `FIX_VERIFICATION.md`:

| Snapshot | Before | After |
| --- | --- | --- |
| Frontend product (229 files) | `c39571c5ec9e9cbb12f4658317d2708ed5ea36cddc997fa9482e1cd7c4c4829a` | identical |
| Contracts worktree including `docs/` (214 files, `.env*` excluded) | `c56f747373cce9674c9ee64ba0c9c8eb9d75d1660487071e9329153865819822` | identical |

## Verification by claim

| Claim | Evidence | Result |
| --- | --- | --- |
| Exact dev-only environment guard | `redesignJourneyFixtures.ts:6-13`. `guard()` requires the system `CONVEX_SITE_URL === https://dutiful-firefly-917.convex.site`, `TEST_FIXTURE_SCOPE === redesign-oct03-4978ed34033f` and `SITE_URL === http://127.0.0.1:3417`, and rejects any `RESEND_API_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`. It is called first in `seed` (:18), `publishCatalog` (:71) and `report` (:99). Self-test covers each failing variable with zero writes (`redesign-journeys.mjs:117-123`) | Verified |
| Harness pinned to the exact deployment | `redesign-journeys.mjs:8-21`. Every CLI call appends `--deployment empuls3-agancy:nia-forrester:dev/redesign-oct03-4978ed34033f`; only `seed` pushes (`--codegen disable`). `identity()` (:22-38) asserts dev type, project 3065332, team 396842, `isDefault:false` and name. Stderr is suppressed (:16) | Verified by source; not executed (see limits) |
| Identity prerequisites, no account/role/policy edits | `seed` (:19-23) requires the original free/member synthetic profiles and TEST book, and inserts no profiles, subscriptions or roles. The self-test asserts no subscriptions are created (:137); the source regex forbids `ctx.db.patch/delete`, `fetch`, scheduler, actions and subscription inserts in the module (:146) | Verified |
| Additive idempotency; browser QA records preserved | Each fixture is looked up by slug/key and reused when present. Collision checks validate only identity fields (title prefix, format/tier, capacity, no URLs, linked book, author, requester), not mutable counters, so browser-changed `memberCount`, `replyCount`, booking status/`staffReply` and registrations survive repeat seeds (:28-53). Self-test: repeat seed returns identical IDs, keeps a pre-existing Circle member and browser thread (4 threads), and rejects a non-test plan conflict (:124-142) | Verified |
| Canonical 48 books / 7 series from local assets | `publishCatalog` (:70-96) enforces exactly 48/7, unique `catalog:amazon-author-*` public keys, canonical validators, `retailer_source` covers under `/images/books/amazon/` with SHA-256, and insert-only for absent `catalogKey`s. The upsert helpers in unchanged `convex/catalog.ts:372,400` are keyed by `catalogKey` and throw on a slug collision inside the single atomic mutation, so nothing is partially patched. I ran `prepare` (local only): 48 books / 7 series, source `2de5e874…7eb2`, bootstrap `e600a502…7db7`, matching doc line 53 | Verified |
| 49 listings → 48 books | Listing 48 (`B0DSCJPY8G`, *The Wanderer*, Audible) is the audiobook edition of listing 3 (`B0DNRMVSJH`) and merges into book 03, which is why cover `48-B0DSCJPY8G.jpg` is absent from the doc table | Verified |
| Local cover bytes | All 48 prepared covers hash identically in primary `public/`, frontend `public/` and `coverAsset.sha256` (0 mismatches) | Verified (bytes and metadata only, not browser image loading) |
| Artificial TEST plan prices, no Stripe IDs | `seed` (:56-64) plans reader/inner/writers, monthly 100/200/300 and annual 1000/2000/3000 cents, names `TEST REDESIGN Journey … Plan`, description "not author pricing; checkout unavailable", no `stripe*PriceId` fields. The collision check rejects any existing plan carrying Stripe price IDs | Verified. These are QA values, not commercial prices |
| Original backend / generated API untouched | `convex/catalog.ts`, `schema.ts`, `security.ts`, `billing.ts` unchanged vs HEAD. Preserved hashes match doc lines 138–141 (`redesignFixtures.ts 93de1838…`, `serialBootstrap.ts cff0935f…`, `content.ts c9b339e6…`, `_generated/api.d.ts 7d3a01ae…`). `api.d.ts` has 0 references to `redesignJourneyFixtures`; dynamic `makeFunctionReference` and CLI names are used | Verified |
| Frontend unaffected | Frontend product manifest unchanged; hardened source suite 7/7 against the frontend | Verified |

## Test evidence (this reviewer, installed tooling only)

| Command (contracts worktree) | Result |
| --- | --- |
| `node scripts/redesign-journeys.mjs self-test` (in-memory `convex-test`, temp vitest config in tmpdir) | 9/9 pass |
| `node scripts/redesign-journeys.mjs prepare` (local preparer in a temp copy; reads primary/frontend read-only) | exit 0; 48/7; hashes as above |
| `./node_modules/.bin/vitest run scripts/redesign-fixtures.test.mjs scripts/rbac-audit.test.mjs` | 20 pass, 2 known RBAC policy failures (unverified admin bootstrap; inner-club discussion readable by reader tier), unchanged and not a fixture regression |
| `REDESIGN_SOURCE_ROOT=<frontend> node --test scripts/redesign-source.test.mjs` | 7/7 |

Limits: I did **not** run `seed`, `catalog`, `identity`, `report` or the earlier
`redesign-provider.mjs verify`. `identity` and `report` read the operator's Convex access
token from `~/.convex/config.json`, and `report` also parses the synthetic credentials
file in memory (`redesign-journeys.mjs:24,63-70`). Neither prints values, but both are
secret reads outside this review's constraints. No live provider state was observed by
me, so provider counts and IDs in doc lines 25–47 and 114 are the backend worker's
evidence.

## Findings (non-blocking)

**J1 — Low, documentation precision.** The doc calls `report` the "repeatable read-only
acceptance command" (line 17). It is read-only towards the provider but not secret-free
(see limits). State that explicitly so that reviewers bound by "no secret reads" do not
run it.

**J2 — Low, output contains synthetic PII.** `report` (`redesignJourneyFixtures.ts:98-106`)
returns full booking documents (emails, notes, samples), all thread bodies and all
`communityMembers` IDs, and the harness prints them (`redesign-journeys.mjs:99`). On
this deployment they are synthetic `example.test` data only. Do not reuse this helper,
or paste its output, anywhere real data exists.

**J3 — Low, time-bounded fixtures.** Journey events start `now + 14 days` (:31). After
that date they drop out of `events.upcoming`, and a repeat `seed` reuses the expired
slug rows rather than refreshing dates. Re-seeding a fresh deployment, or an explicitly
authorized date bump, will be needed for later browser passes.

**J4 — Integration hazard, same class as earlier R1.** `convex/redesignJourneyFixtures.ts`
and `scripts/redesign-journeys.mjs` must never be integrated into primary; the doc says
so (line 19). The guard keeps the module inert elsewhere, but it is test scaffolding and
`seed` publishes `active: true` QA plans wherever it can run.

No auth, role, policy or provider change was made or proposed beyond the existing
pending RBAC items.

## Coordinator browser evidence (attributed, not mine)

The coordinator's CUA, not this reviewer, reported:

- Membership showed monthly 1/2/3 and annual 10/20/30 QA values, with safe
  duplicate-membership feedback.
- The authentic *Secret* real cover loaded, and a library save survived reload.
- A hybrid online registration persisted.

These are coordinator observations on the 3417 preview (PID 97863, which this review
left untouched). They do not imply live-payment, Stripe checkout or email acceptance.
