# Production connection

Connected September 24, 2026.

- Frontend: https://nia-forrester.vercel.app
- Convex team/project: `empuls3-agancy:nia-forrester`
- Default production deployment: `valiant-egret-997` (reference `production`)
- Public API: https://valiant-egret-997.convex.cloud
- Auth HTTP endpoint: https://valiant-egret-997.convex.site

Vercel production contains the three public connection URLs, `SITE_URL`, and
an encrypted `INTERNAL_API_SECRET` shared with Convex. Convex also has a fresh
`BETTER_AUTH_SECRET`. Local `.env.local` and its test database are unchanged.
No production deploy key has been added to the repository or Vercel.

The approved Amazon source was validated with `prepare-catalog-import.mjs`,
then published using the operator-only `catalogBootstrap:publish` internal
mutation. It reuses catalog validators, deterministic upserts, and audit logs.
Production has 48 canonical books and seven series; the 49 source listings
include consolidated Wanderer editions. No test users, subscriptions, events,
community records, or sample service/plan prices were copied.

## Remaining launch inputs

Community and membership flags remain false. Live Stripe products, prices,
webhook configuration and verified Resend sending configuration are not set.
Password-reset and magic-link email delivery are therefore not launch-ready.
`ADMIN_EMAILS` remains unset; no administrator was created or granted access.
Serials, essays, events, studio offerings, and courses require approved records
before publication. Empty states are real, not connection failures.

## Safe operations

Use explicit production selectors; do not change the local deployment selection:

```sh
CONVEX_DEPLOYMENT=prod:valiant-egret-997 npx convex deploy
npx convex run catalog:listPublishedBooks '{}' --deployment empuls3-agancy:nia-forrester:production
```

Frontend public variables are embedded at build time: rebuild Vercel after
changing them. Keep secrets scoped to production and out of logs/source files.
The avatar route explicitly includes its matching Linux Sharp/libvips binaries
because the initial deployment omitted the required native shared library.
