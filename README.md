# Nia Forrester Reader Hub

A production-oriented reader platform for Nia Forrester’s books, serialized
fiction, essays, audio work, reader community, events, memberships, and Writing
Studio.

## Platform

- Next.js 16 App Router and React 19
- Better Auth for email/password, magic-link, reset, and session management
- Convex for application data, real-time community state, content, reading
  progress, event registrations, bookings, entitlements, imports, and audit logs
- Stripe Checkout, Customer Portal, and signed webhooks for paid memberships
- Resend for account and contact email
- Vercel Analytics and Vercel hosting
- Playwright for desktop/mobile route smoke coverage

## Brand color system

The interface uses Tailwind CSS 4 theme tokens defined in `app/globals.css`.
The current screenshot-derived palette is:

- Deep plum: `#350549`
- Cool teal: `#67A0AF`
- Hot magenta: `#BE2B71`
- Soft lavender: `#C4B9CB`
- Clean surface: `#FCFBFC`

Components use these tokens for canvas, surface accents, actions, typography,
book-cover gradients, hover states, shadows, and selection colors.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill the values.

3. Create or select the Convex project:

   ```bash
   npx convex dev
   ```

   The currently signed-in Convex team must be active. The CLI will populate
   `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, and
   `NEXT_PUBLIC_CONVEX_SITE_URL`.

4. Set the server-side Convex environment values:

   ```bash
   npx convex env set SITE_URL http://localhost:3000
   npx convex env set BETTER_AUTH_SECRET YOUR_GENERATED_SECRET
   npx convex env set ADMIN_EMAILS YOUR_ADMIN_EMAIL
   npx convex env set INTERNAL_API_SECRET YOUR_INTERNAL_SECRET
   npx convex env set MIGRATION_SECRET YOUR_MIGRATION_SECRET
   npx convex env set RESEND_API_KEY YOUR_RESEND_KEY
   npx convex env set EMAIL_FROM "Nia Forrester <readers@niaforrester.com>"
   ```

5. Start both Convex and Next.js in separate terminals:

   ```bash
   npx convex dev
   npm run dev
   ```

The site deliberately returns clear setup errors instead of silently falling
back to mock authentication when Convex is not configured.

## Stripe setup

Create monthly and annual recurring prices for Reader Circle, Inner Circle, and
Writers Circle. Add their IDs to the matching variables in `.env.local` and
Vercel.

Register this webhook endpoint:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe it to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Set the signing secret as `STRIPE_WEBHOOK_SECRET`. Webhook processing is
idempotent and updates both the subscription record and the reader’s effective
access tier in Convex.

## Resend setup

Verify the sending domain, then configure:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `CONTACT_TO_EMAIL`

Better Auth sends password-reset and magic-link messages through Resend. Contact
messages are stored in Convex before the notification email is attempted, so a
mail-provider interruption does not lose the message.

## Legacy Wix import

The migration is intentionally staged for editorial review. It does not publish
scraped content automatically.

```bash
npm run import:legacy
```

The importer discovers URLs from the Wix sitemap, captures source metadata and
checksums, and writes a review queue to `importJobs` and `importRecords`.
Editors then approve, map, or skip records before publication. A Substack export
can use the same job/record model.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npx -y react-doctor@latest . --verbose --scope changed
```

The Playwright suite covers every public route plus phone-width overflow checks
for the highest-traffic screens.

## Production handoff

See [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) for what is
implemented, what requires external credentials or stakeholder content, and the
launch order.
