# Redesign Behavior Preservation

This is the coordinator's source-inspected acceptance checklist for the Relume conversion, not a test-pass report. Reconcile it against the final integrated diff and rendered site before marking the redesign complete. The existing implementation remains the behavioral authority; the redesign changes presentation.

| Surface | Existing Data or Action Boundary | Required Browser Evidence |
| --- | --- | --- |
| Home | `site.summary`, published content feeds, newsletter POST | Real counts and covers; public serial link; newsletter pending/success/error; no pricing section |
| Read and book detail | `lib/catalog.ts` frozen references; catalog query boundary | Category filters (no existing text search), reading order, optional metadata, local cover, purchase target, empty/unavailable/not-found states |
| Saved library | `library.current` / `library.setSaved` | Anonymous sign-in prompt; authenticated save/unsave and status; persistence after reload |
| Reading progress | `progress.currentBySlug` / `progress.saveBySlug`, `/api/progress` | Owner-specific state, bounds, save/error feedback and reload persistence |
| Serial and essays | `content.bySlug`, `content.chaptersForContent` | Exact author text and cover; chapter selector; free first chapter without login; restricted text stays gated |
| Events | `events.upcoming`, `mine`, `register`, `cancel` | Empty catalog; real event cards; in-person/virtual/hybrid form; guests, capacity, waitlist, cancellation and errors |
| Academy | `academy.catalog`, `mine`, `request`, `cancelRequest`, `interest` | Real services/courses; request and consent forms; request history, cancellation, staff reply; empty states |
| Staff studio inbox | `academy.inbox`, `interestInbox`, `reply` | Authorized staff only; real requests and replies; no claim that email delivery is connected |
| Community | `readerCircle.overview`, `join`, discussions/clubs/sessions; community mutations | Prelaunch gate, zero-real-data states, paid joining gate, thread/reply and club behavior |
| Membership | `billing.plans`, checkout and portal POST routes | Backend prices/features, cadence, prelaunch gate, signed-in checkout/portal error feedback |
| Dashboard | `dashboard.summary`, authenticated Convex context | Anonymous gate; actual saved library, progress, membership and studio records; no fabricated activity |
| Profile image | `avatars.mine`, `/api/avatar`, `avatars.remove` | Auth-only upload/remove; validation, pending/error feedback and refreshed avatar |
| Authentication | Better Auth client/server utilities, signup profile action | Sign-in/signup/reset, session readiness, sign-out and configured/unconfigured feedback |
| Contact | `/api/contact` | Validated submission, pending/success/failure; durable backend storage |
| Legal and accessibility | Existing route copy | Privacy/terms/accessibility remain reachable; legible dark text, navigation, focus and keyboard controls |

## Server Authority

- Auth identity comes from Better Auth/Convex, not a client-supplied user ID. Queries skipped before authentication remain skipped.
- Paid participation requires an `active` non-free subscription whose period end is in the future. Joining the Reader Circle is a separate persisted step. Trialing or expired records do not become paid access through UI styling.
- Membership checkout remains closed when its release flag is false. Redirect query parameters do not grant entitlements; the signed Stripe webhook remains authoritative.
- Event meeting links are returned only to eligible registered users. Virtual guests remain zero; in-person guests remain bounded from zero through five. Capacity is enforced in the mutation, not a local counter.
- Catalog writes remain editor/admin-only; reader progress, library and bookmarks remain owner-isolated. Optional missing descriptions/dates stay absent.
- `isTest` event records remain excluded from the public upcoming query. Real empty states are valid product states.

## Verification Accounting

Run the existing catalog, community, events, academy, avatars, dashboard, RBAC, site-data and serial-publication checks after locked dependencies are restored. The October 3 catalog attempt could not execute because `zod` was absent; this is an environment failure, not evidence of regression or a passing test.

Use a dedicated nonproduction backend for persisted browser journeys. Keep rendered appearance, local regression results, backend persistence and provider acceptance as separate evidence. Production Stripe/email configuration is outside this visual conversion; retain honest unavailable states.

For every row, collect desktop, tablet and phone evidence for the final UI plus keyboard/focus checks. Inspect all loading, empty, validation, unavailable and unauthorized branches. Record authentic Relume component slugs and adaptations separately from retained backend-aware behavior.

## October 3 Connected Browser Checkpoint

Actual Codex in-app browser checks against the frontend worker on `127.0.0.1:3417`, connected only to the approved nondefault dev deployment `dutiful-firefly-917`. These are not production acceptance claims. Test identities and records are explicitly synthetic; credentials remain in ignored owner-only files.

- Library Books/Serials filters change the displayed regions. The Best Bad Idea opens anonymously and its authentic cover loads. The synthetic members-only essay shows Membership Required without revealing its body.
- Duplicate-titled synthetic serial chapters switch by identity on desktop, and at 320px using Enter. Exactly one chapter is pressed, the correct distinct body renders, and the page does not overflow.
- Synthetic paid-member sign-in reaches the dashboard. Existing saved book and 25% progress render. Browser progress save changes it to 30%; reload and dashboard both retain 30%.
- Paid member joins the Circle; backend counts change from zero to one. A labeled browser discussion and reply persist and render with the correct author and reply count.
- Online test event acknowledgement is required and receives focus when missing. Registration persists with honest no-email/no-meeting-link text; the two-step cancellation restores Register. No payment or delivery occurred.
- Member submits a labeled academy brief and saves course interest. Synthetic editor sees the real studio inbox and saves a reply. The request owner sees that exact reply and saved interest, without the staff inbox.
- Sign-out followed by Sign In after academy interactions failed twice: URL becomes `/signin`, but homepage remains and React reports `Cannot read properties of null (reading 'removeChild')`. Reload recovers. Frontend diagnosis/fix task `task_8da24e222d84`, dispatch `ctx_92d2c6b1ca51`, is active; cause and fix are not yet verified.
- Differential navigation probes: fresh member login → Events only → Sign Out → Sign In reproduces the same failure; Academy details → Home → Read without sign-out succeeds; a full reload after sign-out permits correct Sign In navigation. A dashboard sign-out control succeeds but reports `avatars:mine` UNAUTHENTICATED during teardown. This supports investigation of the shared sign-out transition, not a confirmed academy-only root cause.
- Synthetic free-reader login shows zero titles/progress, not the member's shelf. Community exposes only statistics and the paid-membership gate, with no discussion body or join button. The writers event displays Writers Membership Required. Academy shows only the free reader's own earlier request/interest, no member request or staff inbox.

Screenshots: `/private/tmp/nia-redesign-serial-mobile.png` and `/private/tmp/nia-redesign-academy-connected.png`. Further club, hybrid/in-person/waitlist, avatar, free-reader isolation, and final build checks remain open. Full build and additional tooling are deferred while available disk is below the 4 GiB safety floor.

Reciprocal test-backend review `task_b89ed9243426` was accepted with integration exclusions: do not copy the dev-only guarded serial bootstrap, fixture mutation, or worker generated API into the primary product. The initial provider verification helper mutates records and must not be casually rerun. Broader additive test-fixture task `task_811d2f7a698b` is active and must preserve browser-created records.

### Sign-out Fix Retest and Avatar Configuration

Frontend task `task_8da24e222d84` settled succeeded. Final four-file product delta is awaiting reciprocal Codex review `task_0b6197e9ae9a` / `ctx_5f7cb28e6e99` before primary integration. The live worker now unmounts authenticated query subscribers before revocation and makes a single full-document navigation. Actual fresh browser retests passed for member Dashboard, member Events, and free-reader Academy: `/` then `/signin` displays the correct heading, with no new console errors during each measured interval. This supersedes the earlier failed sign-out checks above, but is not a production-build claim.

Avatar chooser testing reached the actual server. Valid JPEG currently returns the honest 503 message `Avatar uploads are not configured`; the preview lacks the fresh dev-only server `INTERNAL_API_SECRET`, not a cover/image-rendering failure. Unsupported SVG is rejected locally with `Choose a JPEG, PNG, or WebP up to 5 MB`. Upload persistence/remove remain unverified pending the scoped server credential handoff. A chooser interruption before selection was not counted as success.

The earlier empty membership table correctly showed `No Plans Available`. After the authorized additive fixtures, actual CUA verified three TEST REDESIGN plans, monthly synthetic amounts $1/$2/$3 and annual $10/$20/$30, with synthetic feature lists and no configured checkout. An existing synthetic member choosing a plan receives the duplicate-membership message directing them to Manage Existing Membership. These are QA values, not author pricing, and no payment occurred.

### Reviewed Integration and Authentic Catalog Checkpoint

Reciprocal sign-out review `task_0b6197e9ae9a` accepted the exact final four-file delta and final 229-file inventory. Its worker was released after settlement. The four product files and owner/review reports are integrated in primary; primary focused sign-out/chapter tests pass 12/12, and hardened source plus synthetic secret-leak negative checks pass 16/16. The review records inherited rejected-promise handling and mounted lifecycle coverage as nonblocking follow-ups, not proven failure-path acceptance.

The approved isolated backend now contains 48 authentic catalog books and seven canonical series from existing local public metadata and hashed covers, plus the preserved synthetic TEST book. Actual CUA lists 49 book links in the Books filter without horizontal overflow, opens Secret's canonical detail route, verifies its cover loaded (400 natural pixels wide), available formats and Amazon link, saves it to the synthetic member library, and confirms Want to Read survives reload. No production catalog was read or changed by this fixture import.

Actual CUA also opens the new TEST hybrid event, selects Online, acknowledges the date/capacity notice, and saves registration. Reload retains Registered, Online, one attendee and the honest no-email/no-joining-details notices. The in-person fixture accepts one additional guest and returns Registered, In Person, two attendees; the public list subsequently shows the capacity-based Waitlist badge. A second-account waitlist, cancellation transitions, club journeys, avatar persistence/remove and final build remain open. Screenshot: `/private/tmp/nia-redesign-authentic-book.png`.

Broader fixture reciprocal review task `task_b9fc6c11d2e0` is dependency-gated on `task_811d2f7a698b`. Test-only provider mutations and their generated API remain excluded from primary. Available disk at this checkpoint is 1,858,768 KiB, below the 4 GiB build/install safety floor; no unrelated cleanup was performed.

### Avatar, Waitlist and Fixture Review Acceptance

Both broader fixture tasks settled succeeded, with exact source/report hashes accepted by reciprocal Claude review. Their terminals were explicitly released/retained by Orca before acknowledgement. Only reports are copied to primary (`docs/redesign/JOURNEY_FIXTURES*.md`); neither dev-only mutation module, provider helper nor generated API is integrated. Review notes distinguish provider-read-only reporting from secret-free operation, synthetic PII in report output, and 14-day event expiry.

The existing isolated dev `INTERNAL_API_SECRET` is now connected to the frontend's owner-only, Git-ignored `.env.local` after validating both public Convex URLs, local site origin and absent Stripe/Resend keys. No production credential was accessed. Next's environment reload picked it up without restarting the owned preview. An initial verification compared the intentionally changed blank secret field as if it were unchanged; corrected scoped verification passes. No secret value was logged or made public.

Actual CUA: free synthetic reader uploads an existing public catalog JPEG, dashboard reports Avatar updated, and a reload shows both header/profile avatars loaded at 256×256. Remove Avatar reports Avatar removed; another reload has zero avatar images or remove controls. Unsupported SVG validation was already confirmed. Screenshot: `/private/tmp/nia-redesign-avatar-persisted.png`.

Actual CUA: the free reader submits a zero-guest request to the in-person event already occupied by the member's two-person group. Backend returns You’re on the Waitlist, one attendee and This is not a confirmed place. Reload retains that exact state and no-email notice. Screenshot: `/private/tmp/nia-redesign-events-waitlist.png`. Cancellation/promotion, club journeys and final build remain separate gates.

### Persisted Club, Intake and Primary Source Checks

Actual CUA: the free reader cancels only the new waitlist request through the two-step confirmation, returning Join Waitlist while capacity stays full. A free-reader plan attempt returns Secure checkout is temporarily unavailable; there is no Stripe redirect or payment session. The eligible writers-tier synthetic member joins all three TEST clubs; each displays Joined and a real count of one after reload. The member posts a clearly labeled reply to the writers-club prompt; reopening after reload displays Replies (1), exact body and correct author. Screenshot: `/private/tmp/nia-redesign-club-reply.png`.

Actual CUA: a synthetic contact submission returns Thank you. Your message is safely in the inbox. A narrowly scoped `convex data contactMessages` read on the exact nondefault dev confirms one matching saved record and source website-contact, without logging its contents. The homepage newsletter displays Your subscription has been saved; the exact dev newsletterSubscriptions read confirms one subscribed record/source homepage. Resend keys remain absent; no email-delivery acceptance is implied.

Primary verification used a temporary node_modules symlink to the existing frontend worker dependencies, with no install/download/build. After both runners exited, the exact validated symlink alone was removed; installed worker dependencies were preserved. Primary TypeScript (`--noEmit --incremental false`) passes, lint has zero errors/five existing warnings, catalog/chapter/sign-out Node checks pass 23/23, and eight in-memory Convex suites yield 43 passes/two failures. The frontend worker's seven suites yield 42 passes/the same two failures. Both failures are the already-reproduced unverified-admin bootstrap and lower-tier club-read authorization gaps awaiting human policy approval, not redesign regressions. Serial-publication acceptance passes against primary's exact author text and existing bootstrap.

Final production build and React Doctor remain deferred below the 4 GiB safety floor. Source/type/lint and connected browser evidence do not substitute for those gates. No production deployment, commit or push occurred.
