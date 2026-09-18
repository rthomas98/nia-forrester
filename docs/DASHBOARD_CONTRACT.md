# Reader dashboard

`dashboard.summary({})` requires a Better Auth session and derives the owner from that session, never from a client-supplied user ID.

- Identity: profile display name with authenticated user name fallback; account creation date comes from the auth record.
- Membership: active, unexpired subscription only; stale profile tiers are not trusted.
- Shelf: explicit `savedBooks` records merged with legacy saved progress, joined to published, non-hidden catalog records. Returns at most 24 recent titles, exact visible shelf/completion counts, and the most recent in-progress title. This is a reading shelf, not proof of retailer purchases.
- Community: no previews without an active subscription and Circle join. Club previews additionally require current tier eligibility and club membership. Hidden discussions are excluded. No bodies are returned.
- Events: upcoming published events within the reader's tier. Only title, date, timezone, and ID are returned; never meeting URLs.
- Empty data produces empty arrays/zero counts; UI has loading, session-ended, and query-error/retry states. No sample data fallback.

## Verification — September 18, 2026

- Four isolated backend tests passed: anonymous denial/empty states; owner isolation/hidden content/completion persistence; membership/club/expiry filtering; event visibility and sensitive-field exclusion.
- TypeScript, targeted ESLint, and production build passed. Build retains the pre-existing sitemap dynamic-render warning.
- In-app Browser: test reader showed its real name, Free Reader membership, empty shelf, and zero completed books. Saved Ivy's League at 35% through the actual book UI; dashboard showed 35%, cover, and one shelf title. Resume link opened the correct book. Marked finished; a fresh dashboard load showed one finished book and no unfinished reading. Desktop and 390px mobile layouts inspected.
- The synthetic local test reader retains that one completed-book record for reproducible verification. No real member data was changed.

The six broader failures documented in RBAC_AUDIT.md remain outside this dashboard change. Dashboard filtering does not repair those other endpoints or certify production authorization.

## Saved library extension

`library.current({slug})` and `library.setSaved({slug,saved})` require authentication; ownership is always derived from the session. Repeated saves update one indexed user/book record. Removed entries are inactive rather than deleted, hiding legacy progress from the dashboard without losing it. Saving progress reactivates the shelf entry in the same mutation transaction. Missing/hidden/unpublished titles cannot be saved.

States are derived from actual reading progress: Want to Read at zero/no progress, Reading above zero, Finished when completion is recorded. Adding a book never creates progress or purchase entitlements. Existing readers keep their legacy shelves without a destructive migration.
