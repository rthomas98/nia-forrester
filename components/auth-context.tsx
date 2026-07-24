"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { authClient, authIsConfigured } from "@/lib/auth-client";
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
    const user = session.data?.user ?? null;
    const value = useMemo<AuthState>(() => ({
        authed: Boolean(user),
        ready: !session.isPending,
        configured: authIsConfigured,
        user,
        signOut: async () => {
            await authClient.signOut();
        },
    }), [session.isPending, user]);
    return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}
export function useAuth() {
    return useContext(AuthContext);
}
