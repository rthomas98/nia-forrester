# Reciprocal sign-out review

Reviewed 2026-10-03 for frontend task `task8da24e222d84`. **ACCEPT the bounded final delta: no blocking new regression or auth weakening found.** Two nonblocking follow-ups below limit error-path and lifecycle claims. This worker changed only this report and performed no UI automation, provider mutations, environment edits, API/schema edits, installs, builds, downloads, commits or publication.

## Snapshot and comparison authority

Frontend: `/Users/robthomas/orca/workspaces/nia-forrester/nia-relume-frontend`. Compared both changed files directly with the integrated pre-fix source at `/Users/robthomas/Development/nia-forrester`, rather than treating the redesign's Git HEAD as the complete baseline. Primary pre-fix hashes:

- `components/auth-context.tsx`: `1aeeadb5f18f04a5d4c1e617773bfbb80216d133056b0e8da3927a142b39b32d`.
- `components/site-header.tsx`: `d83f64c0a18007d5161223c4a3ed5bc4b8bef331673180091fdbaf5c68e07102`.

Independently reconstructed the 227-entry pre-fix manifest from `REDESIGN_FRONTEND_REVIEW.md` and `REDESIGN_FRONTEND_FIX_REVIEW.md`: `4c40a608879e7793896dcaab03278894624a9f677dbc90cc61b834d9b114069f`. Every entry comparison yields **225 unchanged, two changed, two added, zero removed**. In particular, backend, API, assets, serial text, package.json and lockfile are unchanged by this sign-out delta.

The full final product inventory before and after review is **229 files**, SHA-256 `c39571c5ec9e9cbb12f4658317d2708ed5ea36cddc997fa9482e1cd7c4c4829a`. Construction: sorted relative paths, UTF-8 LF `<sha256>  <path>\n`; exclude path segments `docs`, `.git`, `node_modules`, `.next`, `.agents`, `.claude`, `.codex`, `.aws`, `test-results`, `playwright-report`, `.env*` filenames and `*.tsbuildinfo`. Documentation is outside this inventory.

| Path | Exact final SHA-256, before and after |
| --- | --- |
| `components/auth-context.tsx` | `e249d907921e162d0d0b90e3c5ea8f49f1e76604b50cd95179a7f951dac62bfd` |
| `components/site-header.tsx` | `511b2081661166074ff0c97f293894647a0cceab5da8e3e91b6ed1cdf324f68d` |
| `lib/sign-out.ts` (new) | `a558b10782e37db1a9ac2f77dd6c48adbce40c991d2d41a8e7c1fd9beeb9c4c6` |
| `scripts/signout-navigation.test.mjs` (new) | `3dcd121e3859b04de537a8ada9b75fd2f250d90123ce184202b929c3d9f8148d` |

Read frontend `docs/redesign/SIGNOUT_FIX.md`, the project workflow and the installed Next.js navigation guide. Existing unrelated contracts/fixture work was preserved.

## Source verdict

| Requirement | Finding |
| --- | --- |
| Unmount before revocation | `auth-context.tsx:55-61` calls `flushSync(setSigningOut(true))` through `revokeAfterUnsubscribe` before invoking `authClient.signOut`. The replacement removes header, routed page, footer and analytics because all sit under AuthProvider in `app/layout.tsx:73-80`. The parent Convex provider remains alive; no shared-client close or ad hoc credential deletion occurs. |
| Subscriber lifecycle | Installed Convex `use_queries.ts:110` destroys its observer on unmount; `queries_observer.ts` removes watches through unsubscribe; `browser/sync/client.ts:727-731` sends the removal over the socket. Installed React's synchronous commit flushes pending effects for synchronous lanes. This supports local cleanup ordering, but does not establish server receipt of the WebSocket removal before the separate HTTP revocation. The frontend report already identifies this residual ordering risk. |
| Full navigation | `site-header.tsx:33` uses `signOutToHome`; `lib/sign-out.ts:29-38` awaits settlement and calls `window.location.assign('/')` once through the default navigation dependency. The old push/refresh pair and useRouter import are removed. Reload reconstructs server/client auth state and avoids retaining the old page tree. |
| Failure fallback and retry | `finally` navigates for resolved and rejected revocation, including a synchronous throw. A failed revocation can leave the real session intact; reload then renders the authenticated header and lets the reader retry. It does not pretend that the server session was revoked. No automatic retry, timeout or success guarantee is implemented. |
| Hooks | Hook calls remain unconditional inside ConfiguredAuthProvider; the unconfigured branch lives in the separate outer component. The memo depends on pending state and user; setSigningOut is stable and the callback does not read signingOut. The initiating header unmount does not cancel its async continuation. Only SiteHeader currently consumes signOut. |
| Auth and secrets | Better Auth still owns revocation. Session-derived user, readiness and configured checks are preserved. No backend authorization or token gate changes; no secret imports in the new helper. Hardened client/transitive-import source checks and synthetic secret-leak negatives pass. Actual credential files were not read or copied. |

The source-cause description is consistent with the observed failure and chosen mitigation; this review does not independently prove the exact React-internal cause of removeChild. The helper comment saying the server renders without a token applies to successful revocation; after failure the server may correctly retain the session.

## Nonblocking actionable findings

1. **Inherited rejected-promise handling gap** — `site-header.tsx:61` discards `handleSignOut()` with `void`; `signOutToHome` preserves a rejection after its `finally` navigation. A thrown revocation error can therefore emit an unhandled rejection before the document unloads, even though homepage fallback works. The primary click handler already discarded the rejecting async operation, so this is not a new blocker. Follow-up: consume the rejection at the click boundary with a deliberate error policy; test rejection handling without adding sensitive error payloads to logs. The successful coordinator CUA paths do not cover this failure case.
2. **Test names exceed mounted lifecycle coverage** — four sign-out tests execute the actual dependency-free helper seam, while two inspect source wiring. The test named “authenticated subscribers are unmounted” only records an injected callback; it does not mount AuthProvider, run React passive cleanup, use real Convex subscriptions, or establish transport ordering. Follow-up: add a mounted cleanup/revocation-order test using existing supported test infrastructure when authorized; keep server receipt ordering described as residual unless observed. This gap is mitigated for the reviewed successful journeys by coordinator browser evidence, not by a stronger unit-test claim.

No rejection of the final fix is warranted by these inherited/coverage limitations. If error-free failed-sign-out behavior or a proven cross-transport unsubscribe barrier is made an acceptance requirement, those remain additional work.

## Verification and limits

| Check run in this dispatch | Result |
| --- | --- |
| Frontend `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test scripts/signout-navigation.test.mjs scripts/chapter-selection.test.mjs` | **12/12**, sign-out 6 and chapter 6; exit 0 |
| Contracts `REDESIGN_SOURCE_ROOT=<frontend absolute path> node --test scripts/redesign-source.test.mjs scripts/redesign-source-negative.test.mjs` | **16/16**, seven positive and nine mutation negatives; exit 0 |
| Additional ephemeral assertions importing actual `lib/sign-out.ts` | **4 pass**: default assign, synchronous revocation failure still navigates, resolved error-shaped result still navigates, failed cleanup does not invoke revocation |
| Exact four-file hashes and complete inventory, before/after | **Match supplied hashes and final 229-entry manifest** |

Source negatives reject removed chapter controls/serial links, six synthetic server-secret references under client app modules, and a secret in a local lib dependency of a client entry. These are source-isolation tests, not runtime bundle/provider audits; their temporary copies were cleaned by the runner. No real secrets or environment files entered those fixtures.

The coordinator supplied fresh **actual CUA PASS** for paid-member Dashboard and Events and free Academy: logout reaches homepage, Sign In reaches `/signin` with the correct h1, and no new console errors occur. Frontend `SIGNOUT_FIX.md` records the same acceptance. This worker did not independently operate a browser or inspect those console sessions; browser acceptance is coordinator-owned evidence. Network/revocation failure and production-build behavior were not browser-tested here.

Disk at start: 2,149,348 KiB available (about 2.05 GiB), below the 4 GiB floor. Only installed focused runners were used. No fresh typecheck/lint or build was required for this bounded dispatch; frontend's reported typecheck/lint results are not claimed as independently rerun.
