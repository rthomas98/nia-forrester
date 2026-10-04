# Relume × Wine With Writers redesign — inventory and plan

Owner: frontend (Claude Opus 5.5, `claude-opus-5-5`, medium). Backend contracts, Convex
functions, auth and API routes are out of scope and unchanged.

## Design direction

- Dark only, by default: `<html>` is server-rendered with the dark Wine palette and
  `color-scheme: dark` (`scheme-dark`). There is no light theme or toggle, so there is
  no client-side theme switch and therefore no flash.
- Palette (Wine With Writers dark theme): page `#2a0f18`, raised `#4b1d2f`, card
  `#351526`, sunken `#1f0a11`; text `#f7efe6` / `#e9dad0` / `#b8a89a`; cabernet
  `#7a263a`, champagne `#d8b86f`, rose `#b86a6a`.
- Type: Cormorant Garamond (display headings, never italic for book titles), Inter
  (body), Manrope (UI labels, buttons, the spaced uppercase NIA FORRESTER mark).
  Headings use title case.
- Layout: 1200px (`max-w-content`) content width, Relume `px-[5%]` section gutters and
  `py-16 md:py-24 lg:py-28` rhythm, hairline `border-scheme-border` dividers.
- Motion: Tailwind utility transitions only (navbar height/hamburger morph, colour and
  translate hovers), each with `motion-reduce` fallbacks; no runtime inline styles.
- Styling: Tailwind 4 utilities only. `app/globals.css` contains `@import "tailwindcss"`
  and a single `@theme` token block — no custom selectors or rules.

## Relume foundation

Relume React source is fetched through the official Relume Library MCP and vendored
shadcn-style (see `RELUME_PROVENANCE.md`). Relume's published Tailwind preset is v3, so
its tokens (`text-h1…h6`, `text-medium`, `scheme-*`, `rounded-button|card|image|form|badge`)
are declared in the v4 `@theme` block and mapped to the Wine palette.

Shared UI: `components/ui/{button,card,badge,input,label,textarea,breadcrumb}.tsx`,
`lib/utils.ts` (`cn`), `hooks/use-media-query.ts`. Relume sections live in
`components/relume/` as typed, slot-based adaptations (no lorem/placeholder defaults).

## Route and component inventory → Relume mapping

| Route | Page component | Live data / features preserved | Relume source |
| --- | --- | --- | --- |
| all | `site-header.tsx` | nav flags `NEXT_PUBLIC_COMMUNITY_ENABLED` / `NEXT_PUBLIC_MEMBERSHIP_ENABLED`, active state, auth sign in/out, avatar, "Open navigation menu" a11y, Escape close | Navbar 1 |
| all | `site-footer.tsx` | static links, legal links | Footer 15 |
| `/` | `home-page.tsx` | newsletter POST `/api/newsletter`, `content.listPublished` serials, `site.summary` featured shelf; About quote kept; no pricing, no counts | Header 1, Layout 399, Blog 60, Product 1, Layout 659, CTA 8 |
| `/read` | `read-page.tsx` | filter chips, serials/essays feeds, series shelves, standalones, audio, every catalog state | Header 46, Blog 60, Product 1 |
| `/read/[slug]` | `book-detail-page.tsx` | SSR book + live query, purchase/affiliate link, save to library, reading progress mutation, related books, not-found/error/offline | Product Header 1 (layout + breadcrumb only), Product 1 |
| `/serial` (+`?slug=`) | `serial-page.tsx` | free serial chapters, chapter picker, paid gating → membership | Header 46, Content 12, Blog 60 |
| `/events` | `events-page.tsx`, `event-registration.tsx` | filters, test-event labels, register/waitlist/cancel, tier gating, ticket/meeting links, invite CTA | Header 46, Event 1, Layout 659 |
| `/academy` | `academy-page.tsx`, `academy-studio.tsx` | services, request brief form, booking URLs, course interest, my requests, withdraw, staff inbox/reply | Header 1, Card, Contact 3 form fields |
| `/community` | `community-page.tsx`, prelaunch | overview stats, paid gating, join, discussions, replies, spoilers, clubs, sessions | Header 1, Stat 3, Card |
| `/membership` | `membership-page.tsx`, `membership-action.tsx`, prelaunch | live plans, monthly/annual, Stripe checkout & portal | Pricing 14 |
| `/dashboard` | `dashboard-page.tsx`, `avatar.tsx` | dashboard summary, continue reading, library, Circle access, events, avatar upload/remove | Header 46, Stat 3, Product 1, Card |
| `/signin` `/signup` `/reset` | auth pages | Better Auth email/password, magic link, 3-step signup + profile action + checkout, reset request/resend/save | Log In 7, Sign Up 7 |
| `/contact` | `contact-page.tsx` | POST `/api/contact` with honeypot | Contact 3 |
| `/privacy` `/terms` `/accessibility` | `policy-page.tsx` | static policy content | Header 46, Content 12 |
| states | `catalog-states.tsx`, `query-boundary`, skeletons, `/read` error & not-found | every loading/empty/offline/error/gated state | Card + Relume typography |

## Order of work

1. Tokens, fonts, primitives, Relume section adaptations, shared class helpers.
2. Shell (header, footer, layout).
3. Home → Read/catalog/details → serial → events → academy → community/membership →
   dashboard → auth → contact/policies → states.
4. Typecheck, lint, tests, build, browser checks — gated on dependency install approval.
