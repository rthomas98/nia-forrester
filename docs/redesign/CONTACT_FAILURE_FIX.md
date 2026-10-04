# Contact failure fix and reset-page async review

Owner: frontend (Claude Opus 5.5, `claude-opus-5-5`, medium), 2026-10-03. Independent
Codex reciprocal review follows before coordinator integration. The reviewed
`flushSync` sign-out was left untouched.

## Baseline defect (inherited, confirmed by source)

The baseline `components/pages/contact-page.tsx` (`35a40ece…`) awaited `fetch` and
`response.json()` with no `try`/`finally`:

- A fetch rejection (offline, DNS, aborted) or a non-JSON body (proxy HTML, empty 5xx)
  threw out of `submit` before `setPending(false)`. The button stayed on "Sending…" and
  disabled forever, with no error shown.
- Any 2xx was treated as success without checking the documented `{ sent: true }` body.

## Fix

- New `lib/contact-submit.ts` `submitContact(payload, fetchImpl = fetch)` never throws.
  Each outcome resolves to a result:
  - fetch rejection → network error message;
  - non-JSON or malformed body → treated as no body;
  - HTTP failure → the server's `error` string when non-blank, else
    "error <status>";
  - success → only `200` with `{ sent: true }`;
  - any other 2xx → "couldn't confirm" error.

  Every failure message says the message is still in the form.
- `contact-page.tsx` calls the helper and clears `pending` in `finally`. It shows the
  confirmation only on `result.ok`, and otherwise the existing `role="alert"` error.
  The form stays mounted on failure, so the uncontrolled name/email/message values are
  preserved. Resubmitting clears the previous error and retries with the same values.
  The honeypot, `/api/contact` request shape, and Relume Contact 3 / Wine styling are
  unchanged.

## Reset page: React Doctor `no-unowned-async-error-clear`

React Doctor flags `components/pages/reset-page.tsx:68`, the `finally` in `resetSend`,
because an older response could clear a newer request's error.

- **Not reachable today.** All three request handlers set `pending` before awaiting.
  All three triggers (Send, Resend, Save) are `disabled={pending}`, so requests cannot
  overlap and no stale response can clear a newer error. I made no ownership refactor;
  the warning is recorded as a non-applicable pattern match and is still reported.
- **Separate real defect found while reviewing (fixed, high confidence).** `resetResend`
  never cleared earlier state. After a failed resend, a successful one showed
  "Sent again ✓" beside the stale failure message. It now clears `resetError` and
  `resetResent` before the request, mirroring `resetSend`. This is a two-line change
  with no other behaviour change.

## Checks

| Check | Result |
| --- | --- |
| `node --experimental-strip-types --test scripts/contact-submit.test.mjs` (new) | 6/6: fetch reject; non-JSON 200 and 502, `null` and array bodies; HTTP failure with message, blank message and no message; success only for `{ sent: true }` (`"true"` and `{}` rejected); retry resends the identical payload and succeeds; page source clears pending in `finally`, has no unguarded `response.json()`, keeps the honeypot and replaces the form only on success |
| `node --test scripts/reset-page-state.test.mjs` (new) | 3/3: resend clears error and sent flag before requesting; every handler sets pending and clears it in `finally`; all 3 triggers are `disabled={pending}` |
| Existing `signout-navigation` / `chapter-selection` tests | 6/6, 6/6 |
| `tsc --noEmit --incremental false` | pass |
| `eslint` | 0 errors, 5 pre-existing warnings (generated files / academy test) |
| Contracts `redesign-source.test.mjs` against this frontend | 7/7 |
| React Doctor 0.9.14 from the local npx cache (`REACT_DOCTOR_NO_TELEMETRY=1`, `--no-supply-chain`; nothing downloaded, no build) | 73/100, 39 warnings, 0 errors on this worktree. There are no diagnostics in `contact-page.tsx` or `lib/contact-submit.ts`. Remaining in scope: reset `no-unowned-async-error-clear` (non-applicable, above), reset `no-high-complexity-react-function` (pre-existing, not refactored), and `auth-context.tsx` `no-flush-sync` (the reviewed sign-out fix, intentionally kept) |
| Preview | PID 97863 unchanged (hot reload, no restart); `/contact` returns 200 |

Baseline versus new React Doctor: the coordinator's 72/100 with 32 warnings was measured
on the integrated primary build, a different tree. I did not capture a pre-change scan of
this worktree, so per-file before/after doctor counts for `contact-page.tsx` are not
claimed. The defect itself is established from source and by the deterministic helper
tests.

## Exact delta from manifest `c39571c5ec9e9cbb12f4658317d2708ed5ea36cddc997fa9482e1cd7c4c4829a`

New manifest (same scope rules): **232 files,
`b38d30d1c37ca82888fde143201c6b2b5103abb98188111504b894bf5f2e01cf`**.

```text
CHANGED 87d040f7ff9549fbf50e4e6e312dc977fa4eb8d1a9fe0d1a98e0a9db2628af61  components/pages/contact-page.tsx  (was 35a40ece…)
CHANGED c968f9af337a2a428bc1b7ed4c41cfe2520b773a81a142559e0d5876067a11ca  components/pages/reset-page.tsx    (was 7ef2725c…)
ADDED   d2ca164cc726ca0a79f797a727e2bad24fe12a1d8e01025586017d5801e36219  lib/contact-submit.ts
ADDED   97cbf885dceed845cbc2d12fc93c17f758b025d94475b3c0d72a3b21d46f9983  scripts/contact-submit.test.mjs
ADDED   cc7134c1c498c2df178eb5bdcf901d101e39a63dfe3b42e489c6d644b956531a  scripts/reset-page-state.test.mjs
```

## Known limitations

- No browser run by me (coordinator owns CUA). Suggested CUA checks:
  - With the network offline in DevTools, submit and expect an error with the values
    kept; then go online, resubmit and expect the confirmation.
  - On a reset resend that fails then succeeds, the error disappears.
- Tests use source assertions for component wiring; there are no DOM test libraries,
  and none were installed.
- Successful contact submission writes a real contact record on the connected dev
  deployment, so I did not exercise it against the provider.
- No backend, provider, env, secret or dependency change; no commit/push/deploy.
