# Sign-out navigation regression — diagnosis and fix

Owner: frontend (Claude Opus 5.5, `claude-opus-5-5`, medium), 2026-10-03. Requires
reciprocal Codex review and coordinator CUA retest before it counts as accepted.

## Symptom (coordinator CUA, observed twice)

Signed in, then Sign Out, then the home page renders. Clicking the top Sign In changes
the URL to `/signin`, but the home h1 (NIA FORRESTER) stays on screen, with
`TypeError: Cannot read properties of null (reading 'removeChild')` at
`commitDeletionEffectsOnFiber`. A page reload recovers.

## Evidence

- The owned preview log (`next dev` forwards browser errors) shows the same sequence
  both times: `POST /api/auth/sign-out` → `GET /` (`router.push`) → `GET /`
  (`router.refresh`) → `GET /api/auth/convex/token 401` → `GET /signin` →
  `[browser] Uncaught TypeError … removeChild`.
- `components/site-header.tsx` signed out with `await signOut(); router.push("/");
  router.refresh();`, which starts two RSC transitions in the same tick while Better
  Auth and Convex are tearing down auth state. This pattern predates the redesign.

## Hypotheses and discriminating CUA probes (run by coordinator)

| Hypothesis | Probe | Result |
| --- | --- | --- |
| H1 sign-out redirect timing (push + refresh race during auth teardown) | P1: member → `/events` only (no Academy) → Sign Out → Sign In | **Reproduced** — H1 holds without Academy |
| H2 Academy route/details cleanup | P2: member → Academy, open submitted brief → Home → Read, no sign-out | Pass; H2 rejected |
| Transient post-sign-out client state | P3: sign out → reload home → Sign In | Pass; a full load clears it |
| H3 dev-runtime artifact | Would need a production build (blocked: disk under 4 GiB) | Not tested; H1 fix removed the symptom in dev |

Source-cause confidence: **high** that the trigger is the client-side sign-out
transition (reproduced and removed by probes). **Medium** on the exact React-internal
node: the stack shows nested deletion traversal, consistent with two overlapping
commits during auth teardown, but React internals were not instrumented.

## Fix

1. **Navigation race** (`components/site-header.tsx`, new `lib/sign-out.ts`
   `signOutToHome`): await sign-out, then make one full-document navigation
   (`window.location.assign("/")`) in place of `router.push("/")` + `router.refresh()`.
   It navigates even if sign-out fails, so the reload shows the server's true session.
   **CUA retest: PASS** from free Academy, member Events and member Dashboard; the URL
   reaches `/`, Sign In reaches `/signin` ("Pick Up Where You Left Off"), and there is no
   new removeChild.
2. **Teardown query errors** found by that retest: `avatars:mine` / `events:mine`
   `UNAUTHENTICATED` and generic Convex errors. Deleting the session re-runs the still
   subscribed authenticated queries, which correctly reject.
   `components/auth-context.tsx` now signs out through `revokeAfterUnsubscribe`: it
   first commits a "Signing out…" status in place of the page tree with `flushSync`,
   which unmounts every authenticated subscriber so their unsubscribes go out on the
   socket, and only then calls `authClient.signOut()`. The shared Convex client is not
   closed (closing it would make any later render throw), and backend authorization is
   unchanged. **CUA retest of step 2: PASS** from fresh reloads for member Dashboard,
   member Events and free Academy. Each Sign Out reaches `/` and Sign In reaches
   `/signin`, and the per-test filtered console errors are empty (no removeChild, no
   Convex UNAUTHENTICATED). Residual risk:
   ordering between the socket unsubscribe and the HTTP revocation is practical, not
   guaranteed (the sign-out request took 384–525 ms in the logs).

Not changed: sign-in still uses `router.push("/dashboard"); router.refresh();`. It is the
same pattern but was not observed to fail (sign-in → dashboard → academy navigated
cleanly). It is recorded as latent for review and was left alone to keep the scope
narrow.

The Academy "View Your Request" link the coordinator saw is existing data-driven
behaviour: an active request now exists for that service from earlier CUA testing. No
academy source was edited in this task.

## Tests

| Check | Result |
| --- | --- |
| `node --experimental-strip-types --test scripts/signout-navigation.test.mjs` (new) | 6/6. Order is unmount → revoke → single navigate to `/`; no navigation before revocation settles; one navigation on failure; provider uses `flushSync` before `authClient.signOut` and swaps the tree; no Convex `close()`; header has no `router.push('/')` / `router.refresh()` |
| `scripts/chapter-selection.test.mjs` | 6/6 |
| `tsc --noEmit --incremental false` | pass |
| `eslint` | 0 errors, 5 pre-existing warnings |
| Contracts `redesign-source.test.mjs` against this frontend | 7/7 |
| Preview | PID 97863 unchanged (hot reload, no restart); `/` returns 200 |

No build, install or download was run (disk ~1 GiB), and no shell browser was used.

## Exact delta from manifest `4c40a608879e7793896dcaab03278894624a9f677dbc90cc61b834d9b114069f`

New manifest (same scope rules): **229 files,
`c39571c5ec9e9cbb12f4658317d2708ed5ea36cddc997fa9482e1cd7c4c4829a`**. All other
entries are unchanged.

```text
CHANGED e249d907921e162d0d0b90e3c5ea8f49f1e76604b50cd95179a7f951dac62bfd  components/auth-context.tsx   (was 1aeeadb5f18f04a5…)
CHANGED 511b2081661166074ff0c97f293894647a0cceab5da8e3e91b6ed1cdf324f68d  components/site-header.tsx    (was d83f64c0a18007d5…)
ADDED   a558b10782e37db1a9ac2f77dd6c48adbce40c991d2d41a8e7c1fd9beeb9c4c6  lib/sign-out.ts
ADDED   3dcd121e3859b04de537a8ada9b75fd2f250d90123ce184202b929c3d9f8148d  scripts/signout-navigation.test.mjs
```
