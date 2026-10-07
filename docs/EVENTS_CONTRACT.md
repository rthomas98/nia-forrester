# Events integration

The Events page reads `events.upcoming` reactively. Static featured events and invented recordings have been removed. Empty calendars and empty filter results are distinct from loading/failure states. Invitations link to the contact page.

The backend returns only published future event summaries, sorted by start time, with event-timezone dates, format/category, caller eligibility and registration state. No attendee identities are exposed. Meeting URLs require both current tier eligibility and a registered status. Ticket/meeting links are rendered only for HTTPS destinations.

`events.register` authenticates the caller, checks publication/start time and current paid tier, rejects invalid guest counts, counts guests toward capacity, and idempotently registers or waitlists. Events with external ticket URLs use that provider instead of local registration.

## Local test data

`eventFixtures.seedLocal` is an internal, idempotent mutation restricted to SITE_URL=http://127.0.0.1:4321. It refuses to overwrite non-test events. Three persisted records are marked isTest and prominently labeled TEST: online reading; full in-person appearance with waitlist; Writers-tier workshop. The public events query excludes these fixtures outside the local environment. They are not real bookings and were not deployed to production.

## Verification

Two isolated backend tests pass covering empty calendar, fixture restrictions, idempotent seed/registration, anonymous denial, private meeting URL gating, paid-tier denial, waitlisting, and invalid guest counts. Build/typecheck and targeted lint pass. In-app Browser verified all three records, registration/waitlist/membership CTAs, workshop filtering, and a 390px mobile layout with no horizontal overflow. Browser registration was not submitted; mutation behavior was tested in the isolated backend.

No real events or recordings are currently announced. Other RBAC audit issues outside Events remain open.

## Registration form

`events.register` now requires attendeeName (trimmed, 2–100 characters), attendance (in_person or virtual), and acknowledged=true; optional note is capped at 1,000 characters. Email is taken from the authenticated account, never trusted from client input. Attendance must match the event format unless hybrid. Online registration disallows guests; in-person allows 0–5 additional guests. All seats count toward the same event capacity. Existing active registrations remain idempotent; canceled records can be reused.

`events.mine({eventId})` returns only the caller's record. `events.cancel({eventId})` cancels only that caller's active registration before the event starts. Cancellation frees capacity; waitlisted people are not automatically promoted. The public calendar exposes no attendee names, emails, or notes. Optional schema fields preserve older registrations.

The Tailwind form prefills account details, collects an optional organizer note and explicit acknowledgment, and distinguishes waitlist requests from confirmed places. It includes self-service cancellation and persistent account status. Email delivery and organizer waitlist approval UI are not implemented by this form. External ticket-provider events continue to use their provider.

Research: Eventbrite custom registration forms (https://www.eventbrite.com/features/custom-forms/) and Luma waitlist behavior (https://help.luma.com/p/waitlist). Three isolated backend tests pass, including field validation, account email ownership, privacy, cancellation, and re-registration; production build, TypeScript, and targeted ESLint pass. React Doctor reports existing unrelated warnings (78/100).

Browser acceptance: with explicit user approval, submitted the local Bookshop Conversation test form under Stripe Test Reader and observed the saved waitlist confirmation. No payment or email occurred.
