# Relume / Wine Redesign Acceptance

Updated October 3, 2026. This is the current conversion handoff; earlier checkpoint reports remain historical evidence, not the current list of blockers.

## Scope and disposition

The full-site presentation conversion is implemented and verified locally and against the approved isolated development deployment. This is not production publication or a claim of complete live billing/email acceptance. Those activities were explicitly excluded from the approved test workflow.

| Requested result | Evidence |
| --- | --- |
| Real Relume components, not an imitation | `docs/redesign/RELUME_PROVENANCE.md`: 16 vendored section adaptations, seven UI primitives and official Library MCP provenance; placeholder defaults removed |
| Wine With Writers dark design by default | `app/globals.css` Wine tokens; dark server-rendered layout; Cormorant/Inter/Manrope typography; Tailwind utilities, without custom selector styles or runtime Motion styling |
| Entire site, retaining features | `docs/redesign/PLAN.md` maps every public, account, policy and staff-facing presentation surface; final source checks preserve routes and every original frontend query/mutation consumer |
| Approved editorial/assets | Exact author photos, public serial cover and chapter source checks; spaced sans-serif author mark, nonitalic titles, preserved About quote and no fabricated homepage pricing/counts |
| Orca ownership and reciprocal review | Existing Claude Opus 5.5 medium frontend and GPT-6.1 Sol medium backend worktrees; exact-delta review/integration reports in `docs/redesign/` and `docs/REDESIGN_*` |
| Responsive/accessibility checks | Recorded CUA desktop, phone and tablet route sweeps, mobile navigation/focus checks, connected member journeys; latest reset confirmation measured document width = viewport width = 320px |
| Actual backend/member journeys | Dedicated nondefault `dutiful-firefly-917` development deployment; catalog, library/progress, avatar, Circle/clubs, event registration/waitlist/cancellation, studio intake/staff reply, contact and newsletter checks recorded in the plan |
| Approved RBAC repair | `docs/REDESIGN_RBAC_PROVIDER.md` and `docs/REDESIGN_RBAC_BROWSER.md`: verified-email bootstrap; paid appropriate tier plus persisted joined-club membership; denial cases and successful persisted replies |

## Latest accepted delta

Reset-page copy now matches the backend's one-hour expiry, makes the email confirmation conditional, and removes the hardcoded Chapter 11 reference. Independent Codex review accepted the exact two-file delta; the frontend owner integrated it into primary with verified original/final hashes. See `docs/REDESIGN_RESET_COPY_REVIEW.md` and `docs/redesign/RESET_COPY_FIX.md`. Final frontend 232-file product manifest: `8188794263c22be0edd20d6ad7bbc326bfd7e44e55367117c94a647ec7f1c364`.

CUA verified a reset request and resend for the existing synthetic free-reader account. A provider-rejected malformed address showed `[body.email] Invalid email address`, kept the address, and re-enabled Send. Correcting the address on that page reached the conditional confirmation with the old error absent. No new password was entered or changed; no email delivery is claimed.

## Contact fault acceptance

The loopback-only coordinator test proxy at port 3420 forwarded to the unchanged owned preview on 3417. It supplied malformed JSON only for contact POSTs, then dropped only that connection, then restored forwarding. It contained no credentials and introduced no product/provider/environment changes.

- Malformed JSON: explicit unconfirmed-message error, all three field values retained, Send enabled.
- Stable connection drop: explicit network error, identical values retained, Send enabled.
- Recovery: clicked Send on the same mounted page, without reload or refilling. The inbox-success state appeared.
- Independently filtered read of the named nonproduction database found exactly one `website-contact` record for `redesign-stable-fault@example.test`, with the exact submitted synthetic message; ID `k5754a77cm07v3d8z9cjgfr7a98fnf0a`.
- The first proxy attempt did not hydrate and is not acceptance evidence. Adding loopback hot-reload WebSocket forwarding fixed the test harness. Its failed attempts did not save records.
- Both proxy processes and their temporary browser tabs were stopped/closed. The normal preview and the user's library tab were preserved.

Evidence: `/private/tmp/nia-redesign-contact-malformed.png`, `/private/tmp/nia-redesign-contact-stable-retry.png`, `/private/tmp/nia-redesign-reset-mobile.png`.

## Final checks

- Primary product Convex suites: **79/79** across seven explicit suites.
- Primary catalog/chapter/sign-out/contact/reset Node checks: **35/35**.
- Primary source-preservation and deliberate negative controls: **16/16**.
- TypeScript: passes through the final build and the owner integration check.
- Complete Next 16.2.11 build: passes, 27 routes. The first restricted-network attempt could not fetch public Google Fonts; the authorized network-enabled retry passed. The existing caught dynamic sitemap static-collection diagnostic is not sitemap runtime acceptance.
- React Doctor: 157-file changed/untracked scan, 38 warning-level diagnostics, exit zero; telemetry and supply-chain lookup disabled. No numerical score or clean diagnostic claim. This scope is larger than the prior 120-file scan, so the counts are not a before/after regression comparison. Existing complexity/performance/date/configuration warnings, standard vendored primitive exports and the reviewed synchronous sign-out diagnostic remain unsuppressed.

## Explicit boundaries and follow-ups

This completes the requested design conversion with preserved source contracts and the documented isolated acceptance coverage, not exhaustive certification of every possible provider failure.

- Real Stripe payments/webhooks, actual mail delivery, production deployment and production records were not exercised or changed.
- Password entry/change needs human browser handoff; complete delivered-email reset and transient resend transport-failure behavior are not claimed from the request/resend and validation-retry checks. Async state/source checks cover pending cleanup and stale-error clearing separately.
- Verified-admin onboarding is a separate operational/product decision. Existing explicit roles are preserved; the approved insert-only bootstrap does not automatically promote an existing unverified reader profile after verification. No new promotion authority is inferred.
- No redesign commit, Git push, or production publication has occurred.
