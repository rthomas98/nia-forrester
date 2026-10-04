# Backend handoff review

Reviewer: Claude Opus 5.5 (`claude-opus-5-5`, medium) in the frontend worktree, 2026-10-03.
Scope: review only. No product source, lockfile, provider, test or security-policy change
was made. The frontend product source and lockfile are frozen for independent review.
Preview on 127.0.0.1:3417 (PID 36076) was left running.

## Reviewed files (exact bytes)

| File (in `nia-relume-contracts`) | SHA-256 |
| --- | --- |
| `docs/REDESIGN_FEATURE_PARITY.md` | `267d8a8429377e16e35f56ac4d288c69f7b2d1c2543c4e5b3f401dbb186dc220` |
| `scripts/redesign-source.test.mjs` | `f9d19aa7c680420e42d4f120fc9c54cd70743f907295654a1056dafd0aa5afcf` |
| `scripts/rbac-audit.test.mjs` | `149a10899c1d7121793ce04258a97e9e61adfa094343dd6c44dd5efa48ad4eed` |

Compared against: primary `/Users/robthomas/Development/nia-forrester` (HEAD `fefc16b`,
uncommitted working tree) and this frontend worktree (HEAD `fefc16b` plus the redesign).
`convex/events.ts`, `convex/readerCircle.ts`, `convex/profiles.ts`, `convex/schema.ts` and
`app/api/**` are byte-identical between primary and this worktree, and unchanged from HEAD.

## Checks re-run during review

| Check | Result |
| --- | --- |
| `REDESIGN_SOURCE_ROOT=<frontend> node --test scripts/redesign-source.test.mjs` | 7 pass, 0 fail (final frozen frontend) |
| `REDESIGN_SOURCE_ROOT=<primary> node --test scripts/redesign-source.test.mjs` | 7 pass, 0 fail |
| `./node_modules/.bin/vitest run scripts/rbac-audit.test.mjs` (contracts worktree, isolated `convex-test`) | 16 pass, 2 fail, 18 total |

This resolves the contract's open note (line 218) that the frontend source-check result
needed a final rerun: it is 7/7 against the frozen redesign.

## Findings

### A. Accuracy — the contract document

1. **Contact response ordering is misstated (low).** The HTTP table says contact returns
   `200 { sent: true }` "after `contact.submit`, before optional email notification".
   In `app/api/contact/route.ts` the Resend send is awaited *before* the final
   `return NextResponse.json({ sent: true })`. Email failure is caught and logged, so the
   200 still means "stored, email not guaranteed" — the conclusion holds, but the order is
   wrong and response latency includes the Resend call when configured.
2. **Search paragraph is stale (low).** Line 68 still frames text search as an outstanding
   coordinator acceptance request. The coordinator later withdrew that request (Read has
   category filters only and no search is required). The paragraph should say so.
3. **Admin-bootstrap wording could be more exact (informational).** `profiles.ensure`
   assigns `admin` from `ADMIN_EMAILS` without checking `emailVerified`, but only when it
   *creates* a profile; an existing profile's role is never patched. The contract's
   description is correct but does not state this insert-only limitation.
4. **Test-event local-origin bypass is undocumented (informational).** `events.register`
   accepts `isTest` events when `SITE_URL === "http://127.0.0.1:4321"` (as do
   `eventFixtures` and an academy preview helper). The contract says test records are
   excluded from `upcoming` (true) but does not mention this registration bypass tied to
   one local origin. Not a redesign issue; record it for security review.
5. **Verified as accurate:** `authIsConfigured` conditions; release-flag behavior
   (`=== "false"` only, checkout 409); `site.summary`, `content.listPublished`
   (`{_id, slug, title, kind, excerpt, coverUrl, accessTier, publishedAt}`),
   `events.upcoming` projection, limits and meeting/ticket gating; `events.register`
   arguments and validation order; `dashboard.summary` fields and 24-title display limit;
   newsletter, progress, avatar, checkout, portal and webhook status codes; the honeypot
   note (a nonempty `website` is rejected by Zod, so the route's `if (website)` success
   branch is unreachable); the six asset SHA-256 values (also enforced by the script).
6. **No false certification found in the document.** It says repeatedly that it does
   not certify the frontend, browser usability, persistence, provider delivery or
   release (lines 3, 44, 188, 194, 218), and it keeps RBAC defects separate from redesign
   regressions (line 192).

### B. Source check — `scripts/redesign-source.test.mjs`

Its header and the contract (line 188) limit its claim to source preservation. That
limit is correct and necessary, because several assertions are token presence over a
concatenation of every file in `components/`, `app/` and `lib/`:

1. **Chapter-selector check passes without a chapter selector (medium).** `aria-pressed`
   is currently present in `relume/event1.tsx`, `relume/pricing14.tsx` and
   `signup-page.tsx`. Deleting the serial chapter selector would not fail the test.
2. **Public serial-link check passes from server code (medium).** The
   `encodeURIComponent(<x>.slug)` pattern is matched by `app/sitemap.ts` as well as
   `published-content.tsx`. Removing every public serial link from the UI would not fail
   the test.
3. **Query, mutation, auth and flag checks are string presence only (expected).**
   `api.academy.inbox` being referenced does not prove staff gating, and
   `NEXT_PUBLIC_*_ENABLED === "false"` in a file does not prove it gates rendering.
   Dead or commented code would also pass.
4. **Photo check verifies use, not placement (low).** The contract table lists a
   "Required placement" for each photo; the test only checks that each path appears
   somewhere. In the frozen frontend the required placements are all satisfied (home
   hero/metadata, home About, academy, events invite), and the photos are additionally
   reused on home cards and the reset page.
5. **Secret-leak check is narrow (low).** It scans only `components/` and only for
   `INTERNAL_API_SECRET`. Client files outside `components/` (`app/convex-client-provider.tsx`,
   `app/read/error.tsx`, `lib/auth-client.ts`) and other secrets (`STRIPE_SECRET_KEY`,
   `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `STRIPE_WEBHOOK_SECRET`) are not covered.
   Current source is clean: the only non-route reference is `lib/stripe.ts`
   (`STRIPE_SECRET_KEY`), which is server-only.

Conclusion: a 7/7 result shows the source boundaries survived the redesign. It does not
show any UI is usable, rendered, reachable or persisted, and must not be reported as
UI or provider acceptance. Owner suggestion (backend): scope the chapter-selector and
serial-link assertions to the serial component and `published-content.tsx`, and widen
the secret scan to all client files and all server secrets.

### C. RBAC test — `scripts/rbac-audit.test.mjs`

1. **Valid-form paid-event assertion is correct.** The diff from HEAD replaces
   `register({ eventId })` with a complete valid argument set and requires
   `/active membership at the required tier/`. Before, Convex argument validation
   rejected the call before the handler, so the test passed without exercising
   authorization. In `convex/events.ts` the tier check runs right after the
   availability check and before the ticket/field checks, and its message is
   "An active membership at the required tier is needed." The new assertion therefore
   fails only on a real tier-denial change. Verified passing.
2. **The two failures are existing backend authorization defects, not redesign
   regressions.** Both fail identically against unchanged HEAD/primary backend code:
   - `unverified email must not bootstrap an admin` — `profiles.ensure` grants `admin`
     to an allowlisted but unverified email on profile creation (expected `reader`,
     received `admin`).
   - `reader tier must not read an inner-tier club discussion` — `readerCircle.discussion`
     only calls `requirePaidMember`, with no club membership or tier check, so it
     returned the body `INNER ONLY`. `readerCircle.discussions` (titles) and
     `community.listThreads` have the same gap. Related gap with no test:
     `readerCircle.sessions` does not exclude `isTest` events.
   The redesigned community UI lists `discussions` and opens `discussion` exactly as
   before, so it will display such threads to paid members until the backend is fixed;
   the visual conversion neither introduces nor repairs this.
3. **Weak assertion (low).** The club-discussion test uses `.rejects.toThrow()` with no
   code or message. It fails correctly today (the query resolves), but after a fix it
   would also pass on an unrelated error. Assert the specific `FORBIDDEN` (or chosen)
   code.
4. **No assertion was weakened.** The only change from HEAD is the event test
   tightening above.

### D. Frontend-side notes surfaced by this review (frontend owner, not fixed here)

1. The events page keeps the pre-existing "Test Event" badge and preview notice, but
   `events.upcoming` always filters out `isTest`, so that branch is unreachable with the
   current backend. Harmless; retained for parity.
2. `/api/progress` has no UI consumer. Progress uses the typed Convex mutation directly,
   as in the baseline. The contract lists the endpoint in the API inventory only, which
   is consistent.

## Ownership of follow-ups

- Backend (Codex): contract corrections A1–A4; test hardening B1, B2, B5, C3; the
  defects in C2 (admin bootstrap, club/tier gating, `sessions` test events) need a
  security-policy decision before any fix.
- Frontend: none required by this review. D1 can be revisited if the backend ever
  returns test events.
- Integration gates still open: live-provider and authenticated persisted journeys,
  staff account matrix, provider delivery, and production acceptance.
