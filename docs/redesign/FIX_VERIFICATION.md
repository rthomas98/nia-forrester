# Fix verification — independent frontend review findings

Worker: Claude Opus 5.5 (`claude-opus-5-5`, medium), frontend owner, 2026-10-03.
Input: `nia-relume-contracts/docs/REDESIGN_FRONTEND_REVIEW.md`
(SHA-256 `9d92b17e98fdca1e901591bedd27a6fbe03d41439c03f198f80bfd5cea11d78c`), read in
full before editing. This is the frontend owner's evidence; it is not a reciprocal
review. The backend reviewer reviews the exact delta below.

## Disposition of every item

| Item | Disposition | Change |
| --- | --- | --- |
| F1 — duplicate chapter titles make later chapters unreachable (P2) | **Fixed** | New `lib/chapter-selection.ts`: options are `{ value: chapter._id, label: title }`, and selection resolves the clicked `_id` to its index. `components/pages/serial-page.tsx` uses it, compares `current._id` for the pressed state, and computes the chapter number from the resolved index. `components/relume/event1.tsx` `Event1Filters` now takes `{ value, label }` options and uses `value` for key, pressed state and `onChange`; labels may repeat. Parent/chapter access gating (`current.hasAccess`, membership link) is unchanged. |
| F2 — strict Tailwind-only: Stat 3 inline width style (P2) | **Fixed** | `components/relume/stat3.tsx` renders a native `<progress value max>` styled with utilities (same treatment as the reading-progress bars). No `style=` remains in `components/` or `app/`. |
| F2 — strict Tailwind-only: Navbar 1 Motion runtime styles (P2) | **Fixed** | `components/relume/navbar1.tsx` no longer imports `motion`. The hamburger morph is translate/rotate/width/opacity utilities and the menu reveal is `transition-[height,visibility]` between `max-lg:h-0` and `max-lg:h-[calc(100dvh-4rem)]`, with `motion-reduce:transition-none`. Kept: desktop always-visible menu, collapsed menu `max-lg:invisible` (out of the tab order), Escape and link-click close, `aria-expanded` / `aria-controls`, and the `Open/Close navigation menu` labels. |
| F2 follow-on — `motion` dependency now unused | **Deferred (scope)** | Still listed in `package.json` / `package-lock.json`, because this task forbids lockfile changes. Removing it needs an approved dependency change. Documented in `RELUME_PROVENANCE.md`. |
| Read and events filters (callers of `Event1Filters`) | **Adapted** | `read-page.tsx` passes `{ value: chip.key, label }` (the old label-to-key round-trip is removed); `events-page.tsx` passes `{ value, label: value }`. Filter predicates are unchanged. |
| Source-preservation table, Relume/brand/content section | No action | Review reports these as passing. Photos, covers, serial text and auth/paid gates were not touched. |
| Test-event badges unreachable (noted in the review's Events row) | No action | Retained for parity; the backend query excludes test events. |
| RBAC failures (admin bootstrap, club discussion) | Not frontend | Existing backend defects owned by the backend follow-up; reproduced unchanged. |
| Browser/CUA, live-provider and persistence gates | Open | Owned by the coordinator; no shell browser was run for this task. |

## Regression evidence (bounded, existing tooling, no installs or downloads)

| Check | Result |
| --- | --- |
| `node --experimental-strip-types --test scripts/chapter-selection.test.mjs` (new) | **6/6 pass**. Two rows titled "Interlude" with bodies `FIRST INTERLUDE` / `SECOND INTERLUDE`: options have distinct values/keys; selecting the second resolves index 2, body `SECOND INTERLUDE`, chapter "3 of 3", and exactly one option is pressed. Includes source assertions that the serial picker and `Event1Filters` select by identity and contain no `indexOf(title)`, and that `components/` and `app/` contain no `style={{` or `motion/react`. |
| `./node_modules/.bin/tsc --noEmit --incremental false` | pass |
| `./node_modules/.bin/eslint` | 0 errors; same 5 pre-existing warnings in untouched generated/test files |
| `REDESIGN_SOURCE_ROOT=<frontend> node --test nia-relume-contracts/scripts/redesign-source.test.mjs` | 7/7 pass |
| `npm run test:catalog` | 11/11 pass |
| HTTP sanity on owned preview `127.0.0.1:3417` (PID 36076, still running) | `/`, `/serial`, `/read`, `/events`, `/signin` 200; `/dashboard` 307 (existing unauthenticated redirect); no errors in the dev log |

Not run: build (avoided because of disk pressure, under 4 GiB at task start), Playwright
and any browser automation (coordinator-owned CUA), live providers. The new test checks
the selection logic and the component wiring at source level. Rendered duplicate-title
behaviour still needs coordinator browser acceptance on a dataset with duplicate titles.

## Final snapshot

Same scope and format as the review manifest (all regular workspace files; excluded path
segments `docs`, `.git`, `node_modules`, `.next`, `.agents`, `.claude`, `.codex`, `.aws`,
`test-results`, `playwright-report`; excluded `.env*` and `*.tsbuildinfo`; also the
worktree's `.git` pointer file; sorted, `<sha256>  <path>` LF lines).

- Final manifest: **227 files**, SHA-256
  **`4c40a608879e7793896dcaab03278894624a9f677dbc90cc61b834d9b114069f`**
- Review manifest: 225 files, `8741eb2832b619a4f97e1e0f6e0986b85fcc825d240be0d16338581a28aebd2d`
  (reproduced from the review's listing).
- 219 entries are byte-identical to the review manifest, including `package.json`,
  `package-lock.json`, all `convex/**`, `app/api/**`, public assets and the serial text.

Changed (6):

```text
5ea0d20225e99b1f370027c5151a03fbdc0568d5353f9a471ed49f8f4da8881c  components/pages/events-page.tsx
734e322c60bdfadcc1a46c7eeb9fb8762fc73baedd114295deef828baf08938e  components/pages/read-page.tsx
0d104b7cb9827142aa8eaf4e13d94800e5a3d4ef02ef32cd7bebc8a7858e9244  components/pages/serial-page.tsx
67684f5ef9028d6797ae3cff03ecc8eee7d9e412ac5d610ae10f3df711229566  components/relume/event1.tsx
28b59f8ad9a655dbb602e156391cee3cc69598e394256af36a6ab11f3cd198e2  components/relume/navbar1.tsx
0b71eb15be1cbe86d3b8151320111bf80a12e7d2e045591406f5fead1db82615  components/relume/stat3.tsx
```

Added (2):

```text
3b531ba770d4887fd0c3d0c5b2f9fd4a00edbcd4c6012c6a94ddc67171743f66  lib/chapter-selection.ts
8bf8412e20b9128821c98d159255e88405547d1273e5cfdc7565f1da68c7aea0  scripts/chapter-selection.test.mjs
```

Documentation updated outside the manifest scope: `docs/redesign/RELUME_PROVENANCE.md`
(Navbar 1 / Stat 3 adaptations, unused `motion` note), `docs/redesign/PLAN.md` (motion
line), and this file.

## Process note

During this task I mistakenly sent one heartbeat labelled with the settled prior task
ID (`task_de3e778f8269`) together with the current dispatch ID. It carried no status
or completion content. All other lifecycle messages used `task_a07cd2107595` /
`ctx_bf48f3bed7b9`.
