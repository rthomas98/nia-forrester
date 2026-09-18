# Writing Studio: Research and Implementation

## Research findings (September 18, 2026)

- [Reedsy: briefing an editor](https://reedsy.com/blog/guide/editing/find-a-book-editor/): gather genre, manuscript length, desired editing work, timeline, and a bounded sample before agreeing scope. Adopted a structured private brief, not a pretend calendar reservation.
- [Gotham: course FAQ](https://www.writingclasses.com/classes/faq): distinguish experience level, class format, time commitment, and critique expectations. The course catalog stores level, format, workload, and outcomes explicitly.
- [Jane Friedman: online classes](https://janefriedman.com/online-classes/): clearly explain live attendance, recordings, and materials. Do not imply recordings or materials exist without published course content.
- [Thinkific: pre-selling courses](https://support.thinkific.com/hc/en-us/articles/360030723013-How-to-Pre-Sell-Your-Online-Course-Guide): coming-soon/pre-order state is distinct from available learning. Our interest list explicitly does not enroll or charge the writer. No preorders without approved delivery terms.

## Backend contract

`academy.catalog` is public and returns published services and non-draft courses only. No requests, samples, or email addresses are included. The page no longer imports static service prices or advertises unimplemented member discounts.

`academy.request` requires authentication, serviceId, name (2–100 chars), projectTitle (2–200), genre (2–100), integer wordCount (1–1,000,000), timeline (2–300), notes (20–5,000), sample (0–30,000 chars; at most 3,000 words), and consent=true. The free first-ten-pages service requires a sample of at least 20 chars; users must limit it to ten pages. The server cannot infer manuscript page count from pasted text. Account email and identity are assigned server-side. One active request per user/service, transactionally deduplicated; new requests are rate-limited to one per minute per account. External booking-provider services reject local intake. Public/draft status is checked on every submission.

`academy.mine` returns only the caller's bookings and course interests, with service titles and staff reply. `cancelRequest` only permits the owner to withdraw a pending request. Scheduled work requires studio contact, avoiding unilateral schedule cancellation.

`academy.interest` stores general or course-specific interest against the account email, with explicit consent timestamp, idempotent join/leave, and no newsletter enrollment. Draft/closed courses reject new interest. Public counts are not fabricated.

`academy.inbox` and `academy.reply` require editor/admin role AND verified auth email. Inbox includes private manuscript text and is not accessible to ordinary members. Replies and request status persist to the member's account. Scheduling requires a future UTC timestamp. This does not create a video meeting or send email. Existing unrelated role-bootstrap concerns in RBAC_AUDIT.md remain a production gate.

`academy.interestInbox` applies the same staff gate and returns the latest 100 active interests, account email, selected course, and consent timestamp. Removing interest removes it from this view.

## Operations and limits

Local initialization adds only missing service descriptions (including free review); it preserves all existing records and is restricted to the exact local site URL. No unapproved fixed prices, appointments, instructor biographies, course content, or enrollments are invented. No production seed/deployment.

Services and course catalog records are currently managed through Convex data administration, not a new content-authoring UI. Published courses can direct to an HTTPS enrollment provider; a built-in paid LMS, video hosting, certificates, calendar sync, and paid service checkout are not implemented. Manuscript submission is text-based, not a PDF/DOCX upload. Interest data is stored but automated email delivery awaits configuration and testing. Do not describe the whole education business as production-ready until these external/content gates are resolved.

## Verification

Four isolated Academy tests pass: catalog publication/local initialization, validation/deduplication/private ownership, verified staff replies and interest access, and course interest persistence/publication gating. Three Events regression tests also pass. TypeScript and targeted ESLint pass. Production build succeeds with the existing sitemap dynamic-render warning. React Doctor reports the pre-existing 78/100 baseline; its changed-file scan does not replace targeted lint/tests for new untracked components.

In-app Browser: five persisted service records, real empty-course state, free-review intake and account details rendered; synthetic brief filled; 390px mobile document width is 390px with no overflow. Final request submission awaits explicit browser confirmation at this point.
