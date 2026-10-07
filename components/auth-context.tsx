"use client";
import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { authClient, authIsConfigured } from "@/lib/auth-client";
import { revokeAfterUnsubscribe } from "@/lib/sign-out";
interface AuthState {
    authed: boolean;
    ready: boolean;
    configured: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
    } | null;
    signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthState>({
    authed: false,
    ready: false,
    configured: false,
    user: null,
    signOut: async () => { },
});
const unconfiguredAuth: AuthState = {
    authed: false,
    ready: true,
    configured: false,
    user: null,
    signOut: async () => { },
};
// React uses the server snapshot for SSR and the first hydration render, even
// when Better Auth already has a cached session in the browser. Later client
// renders use the client snapshot without resetting on route navigation.
const subscribeToHydration = () => () => {};
const clientHydrationSnapshot = () => true;
const serverHydrationSnapshot = () => false;
export function AuthProvider({ children }: {
    children: ReactNode;
}) {
    if (!authIsConfigured) {
        return (<AuthContext.Provider value={unconfiguredAuth}>
        {children}
      </AuthContext.Provider>);
    }
    return <ConfiguredAuthProvider>{children}</ConfiguredAuthProvider>;
}
function ConfiguredAuthProvider({ children }: {
    children: ReactNode;
}) {
    const session = authClient.useSession();
    const hydrated = useSyncExternalStore(
        subscribeToHydration, clientHydrationSnapshot, serverHydrationSnapshot,
    );
    const user = hydrated ? session.data?.user ?? null : null;
    // While signing out, the page tree (and every authenticated Convex subscriber in it)
    // is unmounted before the session is revoked; see lib/sign-out.ts.
    const [signingOut, setSigningOut] = useState(false);
    const value = useMemo<AuthState>(() => ({
        authed: Boolean(user),
        ready: hydrated && !session.isPending,
        configured: authIsConfigured,
        user,
        signOut: () => revokeAfterUnsubscribe(
            () => flushSync(() => setSigningOut(true)),
            () => authClient.signOut(),
        ),
    }), [hydrated, session.isPending, user]);
    return (<AuthContext.Provider value={value}>
      {signingOut ? <SigningOut /> : children}
    </AuthContext.Provider>);
}
function SigningOut() {
    return (<main className="flex min-h-screen items-center justify-center px-[5%]">
      <p role="status" className="font-ui text-small font-semibold tracking-[0.18em] text-taupe uppercase">
        Signing out…
      </p>
    </main>);
}
export function useAuth() {
    return useContext(AuthContext);
}
