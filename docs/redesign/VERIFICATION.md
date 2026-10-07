# Redesign verification — 2026-10-03

Worker: Claude Opus 5.5 (`claude-opus-5-5`, medium), as reported by the running
session. No provider rejection or model fallback was observed.

## Diff scope

- Baseline (not redesign work): 21 files copied verbatim from the primary checkout — see
  `BASELINE.md` (includes `app/layout.tsx`, the four page components,
  `published-content.tsx`, `convex/*`, `next.config.ts`, data, scripts, docs, images).
  `app/layout.tsx`, `published-content.tsx` and the four page components were then
  redesigned on top of that baseline.
- Redesign (frontend-owned): `app/globals.css`, `app/layout.tsx`, route copy title-casing
  in `app/{privacy,terms,accessibility,community,membership}/page.tsx`,
  `app/read/{error.tsx,[slug]/not-found.tsx}`, every `components/pages/*`,
  `components/catalog/*` (presentation only), `components/{academy-studio,avatar,
  event-registration,membership-action,published-content,site-header,site-footer,
  brand-mark}.tsx`, new `components/relume/*`, `components/ui/*`, `lib/utils.ts`,
  `lib/typography.ts`, `lib/catalog-styles.ts`; removed `components/ui.tsx` (its only
  consumer now uses `CoverFrame`); `package.json` / `package-lock.json`; `docs/redesign/*`.
- Untouched: Convex functions/schema, auth, API routes, Stripe/Resend integration, env.
  Every query, mutation, route, release flag, gating branch and handler was kept.

## Checks run

| Check | Result |
| --- | --- |
| `npm ci --ignore-scripts` + one `npm install --ignore-scripts` of Relume deps | OK, ≥7.5 GiB free afterwards |
| `npx tsc --noEmit` | pass |
| `npx eslint` | 0 errors; 5 pre-existing warnings in untouched generated/test files |
| `npm run build` (Next 16.2.11) | pass, 27 routes |
| `npm run test:catalog` | 11/11 pass |
| `npx vitest run scripts` | 43/45 pass. Failures: `rbac-audit` "unverified email must not bootstrap an admin" and "reader tier must not read an inner-tier club discussion" (Convex backend logic, not touched here — backend-owned security finding); `catalog-contract.test.mjs` is a `node --test` file, not a vitest suite |
| Playwright `tests/site-smoke.spec.ts` against `127.0.0.1:3417` | 77/77 pass: all 19 routes render with an h1 and zero console/page errors; no horizontal overflow at 320/390/768px; mobile nav opens, navigates, closes |
| Visual review (desktop 1440, phone 390) | home, read, book detail, serial, events, academy, community, membership, auth, contact, privacy, dashboard, open mobile menu |
| Dark default | server-rendered `scheme-dark` on `<html>`, computed body `rgb(42,15,24)`, `color-scheme: dark`; no client theme switch exists, so no flash |

## Not verified (gates)

- Live data rendering and persisted journeys (catalog covers/counts, save/progress,
  events registration, academy requests/staff inbox, community member room, plans,
  checkout/portal, avatar upload, auth flows): the worktree `.env.local` is the blank
  template with no Convex/Better Auth/Stripe/Resend values, so only the
  "not connected", gated and prelaunch branches rendered. Needs a dedicated
  nonproduction Convex deployment.
- `NEXT_PUBLIC_COMMUNITY_ENABLED` / `NEXT_PUBLIC_MEMBERSHIP_ENABLED` were false locally,
  so the Community and Membership nav items and member/pricing UIs were not seen live.
- `tests/catalog-live.spec.ts` and `tests/community-live.spec.ts` need live providers.
- `next/font/google` downloads fonts at build time (network required).
