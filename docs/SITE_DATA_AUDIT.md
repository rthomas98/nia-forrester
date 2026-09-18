# Site data audit — September 18, 2026

## Removed or replaced

- Home: hard-coded catalog counts, fabricated serial promotion/chapter count, static favorite-book array, dated fake updates/event, and reader testimonials. Counts/shelf now query published public Convex records. The verified author photo, biography, and explicitly approved About quote remain editorial content.
- Read: static serial cover/blurb and essay previews replaced with published-content queries and empty/error states.
- Serial: fabricated chapter prose, titles, progress, reactions, and bonus promotion removed. Reader now fetches a selected published slug and actual chapters. No fabricated progress is recorded.
- Membership: static tiers, prices, comparison matrix, and unsupported FAQ claims removed. Active plan records supply names, prices, descriptions, and features. Checkout actions remain existing Stripe integration.
- Sign In/Sign Up: fake reader quote/count, Tuesday cadence, and Chapter 11 availability claims removed.
- Footer: misleading Instagram-to-community and unimplemented gift-membership links removed.
- Events and Dashboard: isTest event records excluded, including in local preview. Records were preserved, not deleted.
- Shared data module: unused demo books, essays, events, testimonials, pricing, and chapters removed; only navigation and preference labels remain.
- Missing catalog covers explicitly say Cover Unavailable instead of pretending a generated typographic cover is the actual artwork.

## Existing backend flows inspected

Catalog/book details, Community statistics/discussions/clubs, member library/progress/avatar, Academy services/intake/interests, Contact storage, newsletter storage, authentication, and billing already use backend APIs. Static headings, navigation, author-approved editorial copy, policies, illustrative community art, and the writing-desk banner are not live activity data and remain source-controlled rather than CMS-managed.

Published-content list queries now return summaries only. Bodies and audio are gated using current subscription records, not cached profile tiers. Chapters require a published visible parent and both parent/chapter access. These fixes prevent the newly connected reader from exposing paid content.

## Current local records and verification

Direct query: 48 published public books, 7 published public series; 0 published serials, 0 essays, 0 active membership plans. These are catalog records, not a claim about the current Amazon store's listing total. No real events or courses are announced. Do not manufacture records to fill these empty states.

14 targeted backend tests pass across site data, Events, Academy, and Dashboard. Typecheck, targeted ESLint, and production build pass (existing sitemap dynamic-render warning remains). Browser verified Home counts and real covers, Read catalog, Serial/Events empty states, Community zero counts, Academy service records, Dashboard owner records, and Membership empty state. No checkout or email submission was performed.

Test accounts and their real persisted QA library/registration history remain in the local database; they were not deleted. Test fixtures in automated tests are intentional and never constitute production data. There is no claim that every persisted record in a future production deployment has been editorially approved.

## Remaining launch gates

Publish approved membership plans, serials/essays, event records, and course content when ready. Verify paid plan prices against Stripe before making them active. Editorial content still requires owner review; this audit is not legal-policy certification. Email delivery, payment-provider acceptance, the remaining RBAC audit issues, and deployment remain separate gates. No commit, push, or production deployment occurred.
