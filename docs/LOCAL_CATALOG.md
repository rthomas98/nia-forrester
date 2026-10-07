# Connected local catalog

The local preview uses an anonymous Convex deployment at `127.0.0.1:3210`
(HTTP/auth actions on `3211`) and Next.js at `127.0.0.1:4321`.
The ignored `.env.local` contains the deployment selection and these URLs.
Keep the backend running in one terminal:

```sh
npx convex dev
```

Run the frontend in another terminal:

```sh
npm run dev -- --hostname 127.0.0.1 --port 4321
```

For a production-build preview, run `npm run build` and then
`npm run start -- --hostname 127.0.0.1 --port 4321` instead.
Public environment values are embedded at build time, so rebuild after changing them.

The local database contains 48 distinct books normalized from 49 Amazon listings,
including seven series, local cover assets, formats, and retailer destinations.
The duplicate Wanderer editions are consolidated. The import does not invent
missing descriptions or full book text.

## Verification

```sh
node --env-file=.env.local scripts/verify-local-catalog.mjs
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4321 npx playwright test tests/catalog-live.spec.ts --workers=1
```

The integration command requires an anonymous loopback deployment. It creates
local test accounts, sets a test admin email, stages/publishes the Amazon catalog
through authenticated mutations, and checks progress persistence and permissions.
It replaces the local `ADMIN_EMAILS` setting with its test administrator.
The browser tests check mobile/desktop covers, book details, the legacy Ivy's
League redirect, missing-book responses, and saved progress after reload.

These checks use a real local Convex database and Better Auth. Hosted Convex,
production configuration, email delivery, and payments require separate setup.
