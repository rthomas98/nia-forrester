"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode } from "react";

// localStorage is the source of truth for the mock auth state; a custom event
// notifies subscribers so useSyncExternalStore re-reads after each write.
const AUTH_KEY = "nf_authed";
const AUTH_EVENT = "nf-auth-change";

function subscribeAuth(onChange: () => void) {
  window.addEventListener(AUTH_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readAuthed(): boolean {
  try {
    return window.localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

function writeAuthed(value: boolean) {
  try {
    window.localStorage.setItem(AUTH_KEY, value ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(AUTH_EVENT));
}

interface AuthState {
  authed: boolean;
  /** true once client-side state is live (always false during SSR) */
  ready: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthState>({
  authed: false,
  ready: false,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const authed = useSyncExternalStore(subscribeAuth, readAuthed, () => false);
  const ready = useSyncExternalStore(
    subscribeAuth,
    () => true,
    () => false
  );

  return (
    <AuthContext.Provider
      value={{
        authed,
        ready,
        signIn: () => writeAuthed(true),
        signOut: () => writeAuthed(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
