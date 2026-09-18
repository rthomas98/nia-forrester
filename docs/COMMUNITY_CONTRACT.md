# Reader Circle

Community access is derived from a stored Stripe subscription, never a selected
signup tier or a client claim. Qualifying subscriptions have a non-free plan,
`status: active`, and `currentPeriodEnd` in the future. Trials, overdue, paused,
canceled, missing-expiry, and expired subscriptions do not qualify. Cancellation
at period end keeps access until that period ends. There is no staff bypass for
joining or reading discussions; staff moderation remains role-controlled.

`readerCircle:overview` is public and returns only aggregate members, open
discussions, open clubs, and the caller's access state (`anonymous`, `unpaid`,
`eligible`, `member`). Members means unique joined accounts with currently
qualifying paid subscriptions. Free/test accounts do not count. Missing backend
configuration and transport errors display unavailable states, never invented zeros.

`readerCircle:join({})` checks payment and idempotently inserts a community
membership. `community:createThread`, `community:reply`, `community:listThreads`,
and every private Reader Circle query require both paid access and a joined
community membership. Payment is rechecked on every request.

`readerCircle:discussions` returns the latest 50 open discussions and actual
visible reply counts. `discussion({threadId})` returns visible content and replies;
hidden discussions and posts are excluded. Spoiler replies are collapsed in UI.
`clubs` returns open clubs and computed active paid membership counts.
`joinClub({clubId})` is idempotent and enforces the club tier. `createClub` is
restricted to moderators/admins. `sessions` returns upcoming published paid
events allowed by the caller's tier, without private meeting links.

Errors use Convex error codes `UNAUTHENTICATED`, `PAID_MEMBERSHIP_REQUIRED`,
`JOIN_REQUIRED`, `FORBIDDEN`, `NOT_FOUND`, and `VALIDATION_ERROR`.

Production enrollment still requires configured Stripe prices, keys, and verified
webhooks. No payment credentials or subscriptions are synthesized for the site.
Backend tests create temporary subscription fixtures only inside the test harness.
