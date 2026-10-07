/**
 * Sign out, then leave with one full-document navigation to the home page.
 *
 * A client-side `router.push("/")` followed by `router.refresh()` races two RSC
 * transitions against the Better Auth/Convex auth teardown. In the browser this left
 * the previous page mounted and threw "Cannot read properties of null (reading
 * 'removeChild')" on the next navigation. A full load discards all client auth and
 * query state, and the server renders the root layout without a session token.
 *
 * Dependency-free (navigation is injectable) so it can be unit tested with `node --test`.
 */
/**
 * Revoke the session only after authenticated subscribers are gone.
 *
 * Deleting the session on the server re-runs every live authenticated Convex query,
 * which then rejects with UNAUTHENTICATED (seen as avatars:mine / events:mine console
 * errors during sign-out). `unsubscribeAll` must synchronously commit a render that
 * unmounts those subscribers (their unsubscribes go out on the socket first); then the
 * session is revoked. Backend authorization is unchanged.
 */
export async function revokeAfterUnsubscribe(
  unsubscribeAll: () => void,
  revoke: () => Promise<unknown>,
): Promise<void> {
  unsubscribeAll();
  await revoke();
}

export async function signOutToHome(
  signOut: () => Promise<void>,
  navigate: (url: string) => void = (url) => window.location.assign(url),
): Promise<void> {
  try {
    await signOut();
  } finally {
    // Navigate even if sign-out failed: the reload shows the server's true session state.
    navigate("/");
  }
}
