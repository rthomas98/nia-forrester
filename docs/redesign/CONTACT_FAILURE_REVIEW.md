# Reciprocal contact failure and reset review

Reviewed 2026-10-03 for owner task `task_b7c28f62e282`, dispatch `ctx_ef9fd7a1d852`, by review task `task_900bfb08b871`. **ACCEPT the bounded delta for the current endpoint: no blocking new regression found.** One nonblocking contract discrepancy and inherited limitations are recorded below. Browser acceptance remains coordinator-owned.

## Authority and exact snapshot

Orca reports the owner worker `succeeded`, dispatch `completed`, detail `settled`, before validation began. Source reviewed at `/Users/robthomas/orca/workspaces/nia-forrester/nia-relume-frontend`; both worktrees have HEAD `fefc16b83a5a8e0124d8cb8bce9a228dd9064ae7`, but the uncommitted manifest identifies the actual source. Read owner `docs/redesign/CONTACT_FAILURE_FIX.md`, exact five final files, unchanged `app/api/contact/route.ts`, project ownership/workflow docs, and preceding reciprocal reports.

Independently reconstructed the baseline from the complete `REDESIGN_FRONTEND_REVIEW.md` inventory plus `REDESIGN_FRONTEND_FIX_REVIEW.md` and `REDESIGN_SIGNOUT_REVIEW.md` replacements/additions. Reconstructed hashes match each prior aggregate: 225 files `8741eb2832b619a4f97e1e0f6e0986b85fcc825d240be0d16338581a28aebd2d`, 227 files `4c40a608879e7793896dcaab03278894624a9f677dbc90cc61b834d9b114069f`, and 229 files `c39571c5ec9e9cbb12f4658317d2708ed5ea36cddc997fa9482e1cd7c4c4829a`.

Final inventory: **232 files**, SHA-256 **`b38d30d1c37ca82888fde143201c6b2b5103abb98188111504b894bf5f2e01cf`**. Every entry compared: **227 unchanged, two changed, three added, zero removed**. Backend, APIs, auth/sign-out, assets, serial text, package/lock and other config retain their previous bytes. No unreviewed product drift was found.

Construction: sorted relative paths, UTF-8 LF `<sha256>  <path>\n`; exclude segments `docs`, `.git`, `node_modules`, `.next`, `.agents`, `.claude`, `.codex`, `.aws`, `test-results`, `playwright-report`, `.env*` filenames and `*.tsbuildinfo`. Documentation/instruction exclusions are intentional; this inventory does not certify their absence of changes. Environment files were not read.

| Path | Final SHA-256 |
| --- | --- |
| `components/pages/contact-page.tsx` | `87d040f7ff9549fbf50e4e6e312dc977fa4eb8d1a9fe0d1a98e0a9db2628af61` |
| `components/pages/reset-page.tsx` | `c968f9af337a2a428bc1b7ed4c41cfe2520b773a81a142559e0d5876067a11ca` |
| `lib/contact-submit.ts` | `d2ca164cc726ca0a79f797a727e2bad24fe12a1d8e01025586017d5801e36219` |
| `scripts/contact-submit.test.mjs` | `97cbf885dceed845cbc2d12fc93c17f758b025d94475b3c0d72a3b21d46f9983` |
| `scripts/reset-page-state.test.mjs` | `cc7134c1c498c2df178eb5bdcf901d101e39a63dfe3b42e489c6d644b956531a` |

## Behavior and data preservation

`submitContact` resolves fetch rejection and JSON parse failure to actionable errors. HTTP failures cannot become success even with `{ sent: true }`; successful responses require the literal boolean `sent: true`. Empty, non-JSON, null, array, scalar and wrong-type bodies are rejected. Server nonblank error strings are retained. Contrary to the handoff wording, those server strings do not necessarily include the phrase that the message remains in the form; form preservation still holds.

The page clears the previous error before each attempt, resets pending in `finally`, sets `sent` only for `result.ok`, and retains the same uncontrolled form branch on failure. No reset, field clearing, key change or navigation was added. Name/email/message/honeypot fields, POST JSON shape, `/api/contact` destination and presentation remain intact. Unit retry reuses identical payload bytes. These facts establish source-level preservation of typed values and no success display for current endpoint failures; they do not constitute mounted DOM acceptance.

The unchanged server route awaits durable Convex intake before returning its normal `200 { sent: true }`; notification delivery is best effort. No provider success was tested or inferred. A lost response after a durable write can produce a retry/duplicate message because the existing endpoint has no idempotency key; the fix does not resolve that inherited uncertainty. Pending also lasts indefinitely for a fetch/body read that never settles, since there is no timeout. Neither limitation is new.

## Nonblocking finding and reset diagnostics

1. **Contact status contract discrepancy** (`lib/contact-submit.ts:51-55`; success test): the helper uses `response.ok`, accepting `201` and `202` with `{ sent: true }`, while its comment, handoff and test title claim only HTTP 200. Independent actual-helper probes reproduce both acceptances. The unchanged endpoint returns 200, so this is not a current-path blocker, but 202 could represent acceptance without completed intake if the endpoint contract changes. Follow-up: require `response.status === 200` and add 201/202 negatives, or explicitly document/test the broader status contract before adopting it.
2. **Reset stale async warning: inherited, nonblocking in ordinary UI use.** The cached React Doctor rule describes stale completion clearing newer request state. All three async triggers use the shared `pending` flag, set it synchronously before awaiting, disable their buttons, and restore it in `finally`; only one step's trigger is mounted at a time. Normal user activation therefore serializes these requests. At the reported `resetSend` finally, the write is `setPending(false)`, not `setResetError("")`; the owner's explanation specifically saying the finally clears a newer error is imprecise. This is not a general request-identity guarantee: direct/programmatic duplicate handler calls are unguarded, and editable inputs may change while requests run. No mounted concurrency test proves every possible event path. Classify as an inherited heuristic warning with a current UI mitigation, rather than a universal impossibility proof.
3. **Reset resend defect fixed.** Both earlier error and earlier sent flag are cleared before requesting. Actual extracted final handler execution verifies failed resend, successful retry, and rejection states; a successful retry leaves only `resetResent=true`, with empty error and pending false. The extraction injects auth/state dependencies and does not mount React or contact an auth provider.
4. **Other inherited diagnostics.** Reset complexity remains a maintainability warning; the auth `no-flush-sync` warning belongs to the independently reviewed sign-out mitigation whose bytes remain unchanged. Full lint has four unused-disable warnings in generated Convex files and one unused `t` warning in `scripts/academy.test.mjs`, all outside this delta. No new in-scope lint warning or error appeared. Owner-reported Doctor 73/100, 39 warnings, zero errors was not independently rerun; scores from a different integrated tree cannot establish before/after improvement.

## Independent checks

| Command/check | Result |
| --- | --- |
| Frontend `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test scripts/contact-submit.test.mjs scripts/reset-page-state.test.mjs scripts/signout-navigation.test.mjs scripts/chapter-selection.test.mjs` | **21/21**, exit 0; contact 6, reset source 3, sign-out 6, chapters 6 |
| Frontend `./node_modules/.bin/tsc --noEmit --incremental false` | **Pass**, exit 0; no incremental artifact written |
| Frontend `./node_modules/.bin/eslint` | **Zero errors, five inherited warnings**, exit 0; no fix/cache flags |
| Contracts `REDESIGN_SOURCE_ROOT=/Users/robthomas/orca/workspaces/nia-forrester/nia-relume-frontend node --test scripts/redesign-source.test.mjs scripts/redesign-source-negative.test.mjs` | **16/16**, exit 0; seven positive and nine mutation-negative isolation checks |
| Ephemeral actual-helper probes | **10 passed**: 201/202 accepted (finding), failed statuses with sent true rejected, scalar/wrong-type sent rejected, empty 204 rejected |
| Ephemeral actual extracted `resetResend` handler | **Five state assertions passed** across failed response, successful retry, rejected request; injected dependencies only |
| Complete inventory before/after verification | **232/232 stable**, exact manifest above |

The new component tests are source assertions, not React lifecycle/DOM tests. Deterministic helper tests replace transport only; no provider request occurs. Source-negative fixtures use synthetic identifiers and temporary local copies. Existing dependencies only; no install, build, preview restart, browser command, backend/policy/env/secret edit, provider mutation, commit, push or deploy. Disk available at review was 5,911,716 KiB; no large artifacts were created.

## Remaining acceptance

No blocking source/test finding remains for the current endpoint. Coordinator should verify in CUA: rejected/offline and malformed-response submissions show an alert, re-enable Send, preserve all typed values and succeed on retry; reset resend failure then success removes the old alert. DOM, provider-backed durable intake, email delivery and production behavior are separate gates and are not claimed by this report. Only this report was changed in the contracts worktree; pre-existing dirty work was preserved.
