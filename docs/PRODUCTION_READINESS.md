# Production Readiness

Updated: July 23, 2026

## Implemented

- Stakeholder copy and visual corrections across Home, Read, Events, Academy,
  Membership, and shared navigation
- Responsive desktop/phone layouts and optimized local imagery
- Better Auth client/server integration for password, magic-link, reset,
  sign-out, protected-library, and session flows
- Convex component registration, auth provider, schema, authorization helpers,
  profiles, content, chapters, reading progress, community discussions,
  moderation, clubs, events, bookings, memberships, newsletter, contact,
  imports, webhook idempotency, and audit records
- Stripe Checkout, Customer Portal, signed webhook verification, price
  allowlisting, and Convex entitlement synchronization
- Resend-backed account messages and durable contact intake
- Controlled Wix staging import with checksums and an editorial review queue
- Route metadata, canonical URLs, robots, sitemap, analytics, optimized images,
  security headers, privacy, terms, accessibility, and contact pages
- Typecheck, lint, production build, React Doctor, and Playwright smoke suite

## External configuration still required

These are account or stakeholder inputs and cannot be safely invented:

1. Re-enable the signed-in Convex team or select another active team, then create
   the `nia-forrester` cloud project.
2. Populate Convex and Vercel with the values listed in `.env.example`.
3. Verify the sending domain in Resend and provide the destination inbox.
4. Create Stripe products/prices and register the production webhook.
5. Identify the initial admin email in `ADMIN_EMAILS`.
6. Provide the replacement hero/About photographs requested during review.
7. Supply canonical book-cover files, affiliate destinations, audio files or
   platform links, full serial/essay text, accurate event dates and ticket
   links, and Writing Studio booking availability.
8. Export Substack subscriber/content data and confirm which Wix records may be
   migrated. Newsletter subscribers must retain consent and unsubscribe state.

## Community and membership release control

The data model and account/billing foundations are implemented, but Community
and paid Membership should remain prelaunch until:

- community rules, moderator ownership, escalation, and launch content are
  approved;
- Stripe prices, cancellation language, refund policy, and webhook delivery are
  tested in Stripe test mode;
- email verification, password reset, sign-in link, and contact delivery are
  tested on the verified domain;
- at least one admin and one moderator account are provisioned;
- public, paid-reader, inner-circle, writer, moderator, editor, and admin access
  matrices pass end-to-end tests.

## Import release order

1. Run the Wix sitemap staging import.
2. Review staged URLs and categorize books, essays, pages, events, and skips.
3. Import a Substack export into a separate job.
4. Deduplicate by canonical URL, external ID, and checksum.
5. Preview transformed content and image ownership/quality.
6. Publish approved records in batches with redirects from legacy URLs.
7. Compare counts and spot-check every content type.
8. Keep the legacy site read-only until redirect, analytics, search, email, and
   purchase paths are verified in production.

## Current validation evidence

- `npm run typecheck`: pass
- `npm run lint`: pass with zero warnings
- `npm run build`: pass
- `npm run test:e2e`: 16/16 pass across public routes and 390px layouts
- React Doctor: 93/100; remaining findings are component-size maintainability
  recommendations in the inherited prototype pages, not runtime, security, or
  accessibility failures

## Known dependency advisory

The current Next.js release still resolves bundled PostCSS and Sharp versions
that npm’s July 2026 advisory feed flags. Forcing incompatible transitive
versions creates an invalid dependency tree, so the repository stays on the
latest compatible Next.js patch and records the advisory rather than masking
it. Re-run `npm audit` and upgrade as soon as Next.js publishes compatible
fixed transitive versions.
