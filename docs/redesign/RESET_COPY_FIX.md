# Reset page copy fix

Owner: frontend (Claude Opus 5.5, `claude-opus-5-5`, medium), 2026-10-03. I read
`AGENTS.md`, the pair skill and the installed Next 16.2.11 Server/Client Components guide
before editing (the file stays a `"use client"` page). Independent Codex review and
coordinator integration/browser checks follow.

## Inventory of copy changes (`components/pages/reset-page.tsx`)

| Location | Before | After | Reason |
| --- | --- | --- | --- |
| Step 2 ("Check Your Email") description | "We sent a reset link to **{email}**." | "If an account exists for this email address, a reset link will be sent." plus a muted line "Address entered: **{email}**" | The old copy asserted delivery and implied the account exists. The new copy is conditional and reveals nothing about account existence |
| Step 2 body | "The link expires in 30 minutes. Check spam if it's shy." | "Reset links expire in one hour. Check spam if it's shy." | Backend `convex/auth.ts:31` `resetPasswordTokenExpiresIn: 60 * 60`, and the reset email (`:36`) says "It expires in one hour." |
| Step 4 ("Password Updated") description | "Sign in with your new password and get back to Chapter 11." | "Sign in with your new password and pick up your reading where you left off." | Hardcoded chapter removed |

Unchanged:

- state, steps, handlers, validation and error messages;
- `authClient.requestPasswordReset` / `resetPassword` calls and `redirectTo`;
- resend behaviour, including the earlier stale-error fix;
- the step titles, the "Nothing arrived? Resend the link" control, and the Relume
  Log In 7 / Wine styling.

Account enumeration stays prevented: the step-2 screen shows the same text whether or not
an account exists, and backend responses are unchanged. `convex/auth.ts` is byte-identical
in the frontend, contracts and primary checkouts (`7738948761a4a78a…`); it was read only.

## Checks

| Check | Result |
| --- | --- |
| `node --test scripts/reset-page-state.test.mjs` | **6/6** (3 existing state tests plus 3 new copy tests). The copy tests check: the UI says one hour and contains no 30-minute claim, and the backend source still has `60 * 60` and "It expires in one hour."; the conditional sentence is present with no delivery claim and no account-existence disclosure; there is no "Chapter 11" and the general reading copy is present |
| `contact-submit` / `signout-navigation` / `chapter-selection` tests | 6/6 each |
| `tsc --noEmit --incremental false` | pass |
| `eslint` | 0 errors, 5 pre-existing warnings |
| Contracts `redesign-source.test.mjs` against this frontend | 7/7 |
| Preview `/reset` | 200 (served by the current listener PID 63243, cwd this worktree, started 19:36 by another actor; I did not restart anything) |

No backend, provider, environment, dependency, real mail, credential, commit, push,
deploy or browser action was taken.

## Exact delta

From manifest `b38d30d1c37ca82888fde143201c6b2b5103abb98188111504b894bf5f2e01cf` (232
files) to **`8188794263c22be0edd20d6ad7bbc326bfd7e44e55367117c94a647ec7f1c364`** (232
files):

```text
CHANGED 499d2e830d5f4895967f3c5e226cebabd3a253b882e203b8378eeb687fb22948  components/pages/reset-page.tsx       (was c968f9af…11ca)
CHANGED 72b5037e53a028969eaed05db80a28ea6bb800e100336bcf72075ca62b124887  scripts/reset-page-state.test.mjs     (was cc7134c1…531a)
```

## Known limitations

- The copy tests are source assertions, since no DOM test libraries are installed. The
  rendered wording, mobile wrapping and contrast of the new muted "Address entered" line
  need the coordinator's browser check.
- The expiry text is static copy that mirrors the backend constant. The test fails if
  `convex/auth.ts` changes the lifetime or its email wording, which prompts a matching UI
  update.
