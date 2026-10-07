# Approved RBAC browser acceptance

Coordinator CUA acceptance on the normal local preview `http://127.0.0.1:3417`, using only the explicitly approved nondefault development deployment `dutiful-firefly-917`. Tested after the accepted backend repair was pushed; no production, payment or email operation occurred.

## Observed browser results

- Newly seeded writers-tier paid Circle member, initially joined to zero clubs: Dashboard showed only the general Circle discussion, and Community showed no private club threads. All three eligible clubs offered Join Club.
- Joined only the reader-tier test club through its visible form. Its member count changed from1 to2, its button became Joined, and its private discussion appeared. Inner/writers club discussions and the provider-created writers-club thread remained absent.
- Opened the newly accessible reader-club discussion and submitted exactly one labeled synthetic reply: `TEST REDESIGN RBAC browser joined-club reply. Synthetic acceptance only.` Reply count changed0 to1 and the submitted text rendered. A complete reload and later logout/login preserved the club join and exact reply. No repeat submission occurred.
- Dashboard after that join showed the reader-club thread and general Circle thread only; no inner/writers thread projection leaked.
- Separate reader-tier paid Circle account with zero club joins: only the general discussion rendered; reader club offered Join Club, while inner and writers clubs showed disabled Higher Membership Required buttons. No club join was attempted for that identity.
- Original unpaid admin: Dashboard displayed the active-paid-membership requirement, and Community displayed A Space for Paid Members with no discussion or club controls. This confirms that the existing staff role does not bypass paid community access.
- Original free reader: Community displayed the same paid-membership gate, with zero private discussion controls.
- Every tested logout unmounted protected content and navigated to home before the next sign-in. Final browser error log inspection returned an empty array.

## Evidence and current test state

- `/private/tmp/nia-redesign-rbac-unjoined.png`: writers-tier account before any club join.
- `/private/tmp/nia-redesign-rbac-joined-reply.png`: saved browser reply and Joined club state.
- Provider/API denial matrix and exact deployed source identities: `docs/REDESIGN_RBAC_PROVIDER.md` (unchanged owner report).
- The account labeled TEST REDESIGN RBAC writers Unjoined is now joined to the reader-tier club; its original label is historical test provenance, not its current membership state. The reader-tier account remains unjoined. Do not rerun the fixture helper after browser joins: it intentionally refuses preexisting club memberships.
- Original four account roles/subscriptions remain unchanged. Browser acceptance added one membership for the new writers-tier test account and one reply to the existing synthetic reader-club thread. The provider acceptance previously added one separate labeled writers-club thread/reply.
- The user-facing tab is retained on the joined reader-club discussion. No service was stopped or environment changed for these RBAC browser checks; the normal viewport is restored.

## Validation and boundaries

Primary seven product backend suites79/79, Node catalog/chapter/sign-out/contact/reset32/32, source preservation/negative controls16/16, typecheck and production build pass. Lint has zero errors and five inherited warnings. Contracts eight suites83/83; new fixture suite10/10 and independent probes8/8 pass. Nine real provider denial scenarios and joined-member success were verified separately from CUA.

These checks accept the two approved RBAC fixes in source and isolated development. They do not claim production publication, real billing/mail delivery, password-reset provider acceptance, malformed-contact-response browser injection or a stable-outage unchanged-payload browser retry. Production admin onboarding still needs an explicit operator or pre-profile verified-email flow decision; existing roles remain preserved and the verified bootstrap guard was not weakened. No commit, Git push or production deployment occurred.
