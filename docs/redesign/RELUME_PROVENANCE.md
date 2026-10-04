# Relume provenance

All Relume source below was retrieved on 2026-10-03 from the official Relume Library MCP
server (`https://relume-library-mcp.relume.io/mcp`, tools `get_setup_instructions`,
`list_categories`, `list_components`, `search_components`, `get_components`,
`get_primitives`) by Claude Opus 5.5 (`claude-opus-5-5`). Relume delivers components
shadcn-style as owned source; nothing is imported from `@relume_io/relume-ui`.

Every vendored file starts with a header comment naming its slug and listing its
adaptations. Relume placeholder defaults (lorem ipsum, placeholder images, sample prices,
ratings, addresses) were removed in every case; components take typed props/slots that
are fed only by existing site copy, site photography in `public/images`, and live Convex
queries.

## Sections (`components/relume/`)

| File | Relume component (slug) | Used on | Key adaptations |
| --- | --- | --- | --- |
| `navbar1.tsx` | Navbar 1 (`navbar1`) | every page | Next `Link`, active state, Escape/link close, aria menu button, collapsed menu hidden from tab order, sticky hairline surface; Relume's Motion variants (hamburger morph, menu height) re-expressed as Tailwind utility transitions with `motion-reduce` fallbacks (strict Tailwind-only, review F2); sub-menus removed (unused) |
| `footer15.tsx` | Footer 15 (`footer15`) | every page | Link columns with headings; address/phone/social/company-logo rows removed (no real data) |
| `header1.tsx` | Header 1 (`header1`) | home, academy, community | slots for heading/description/actions/media, optional tagline |
| `header46.tsx` | Header 46 (`header46`) | read, serial list, events, dashboard, policies, prelaunch | optional tagline and trailing slot |
| `layout399.tsx` | Layout 399 (`layout399`) | home "Four Ways In" | stretched-link cards, `next/image`, top-aligned card text |
| `layout659.tsx` | Layout 659 (`layout659`) | home author block, events invite | **fixed upstream bug**: source spread defaults after props so props were ignored |
| `blog60.tsx` | Blog 60 (`blog60`) | home/read/serial feeds | split shell + card; portrait covers; read-time removed (not in API) |
| `product1.tsx` | Product 1 (`product1`) | home shelf, backlist, audio, related, dashboard library | split shell + grid + item; price replaced by catalog meta line |
| `cta8.tsx` | CTA 8 (`cta8`) | home newsletter | form slot keeps `/api/newsletter`; console.log handler and terms HTML removed |
| `event1.tsx` | Event 1 (`event1`) | events, read filter, serial chapters | Radix Tabs replaced by existing `aria-pressed` filter state in Relume trigger styling; rows take live events and an action slot |
| `content12.tsx` | Content 12 (`content12`) | serial/essay reader, policies | `prose-*` (needs @tailwindcss/typography) replaced by child-selector utilities; 42rem measure |
| `login7.tsx` | Log In 7 (`login7`); layout of Sign Up 7 (`signup7`) | sign-in, sign-up, reset | Relume's logo bar/footer replaced by site shell; Google button removed (no Google auth); form slot keeps Better Auth handlers |
| `contact3.tsx` | Contact 3 (`contact3`) | contact | form slot keeps `/api/contact` + honeypot; terms checkbox removed |
| `pricing14.tsx` | Pricing 14 (`pricing14`) | membership | Radix Tabs replaced by existing monthly/annual state; invalid `<h4>` in `<h1>` fixed |
| `stat3.tsx` | Stat Card 3 (`stat3`) | community statistics, dashboard summary | dropdown/trend icons removed; value first in DOM, label shown first visually; progress bar is a native `<progress>` with utility styling instead of an inline width style (review F2) |
| `product-header1.tsx` | Product Header 1 (`product-header1`) | book detail | breadcrumb + two-column grid kept; carousel, star rating, variants, quantity and shipping accordion removed (fabricated for books) |

## Primitives (`components/ui/`, `lib/utils.ts`)

`button`, `card`, `badge`, `input`, `label`, `textarea`, `breadcrumb`, `utils` (`cn`) —
Relume source, restyled to the Wine palette with visible champagne focus rings (Relume's
originals use `focus-visible:outline-none`). `cn` registers Relume's `text-h1…tiny`
tokens with tailwind-merge so they are not mistaken for colours.

## Fetched but not used

Fetched source not vendored: the `use-media-query` hook (only needed by Navbar 1
sub-menus) and the carousel/select/accordion/checkbox/tabs/dropdown primitives that
Product Header 1, Event 1, Pricing 14, Contact 3 and Stat 3 import.

## Dependencies

Relume's install lines required: `@radix-ui/react-slot`, `@radix-ui/react-label`,
`class-variance-authority`, `clsx`, `motion`, `relume-icons`, `tailwind-merge`.
`tailwind-merge` is `^3.7.0` instead of Relume's `^2.2.2` because the v3 line supports
Tailwind 4 (v2 targets Tailwind 3). Radix Tabs/Select/Accordion/Checkbox/Dropdown and
Embla were not added because the corresponding Relume features were replaced by existing
state or removed as above. Relume's published Tailwind preset is v3-only, so its tokens
are declared in `app/globals.css` `@theme` instead.

After review F2, no source imports `motion` any more. The package remains in
`package.json` and `package-lock.json` only because lockfile changes were out of scope
for the fix task; removing it is a follow-up for an approved dependency change.
