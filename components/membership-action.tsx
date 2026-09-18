"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";

export function MembershipAction({ name, tier, annual, className, children }: { name: string; tier: "reader" | "inner" | "writers" | null; annual: boolean; className: string; children: React.ReactNode }) {
  const { authed, ready } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier, cadence: annual ? "annual" : "monthly" }) });
      const result = await response.json();
      if (!response.ok || !result.url) { setError(result.error ?? "Checkout is unavailable. Please try again."); return; }
      window.location.assign(result.url);
    } catch { setError("We couldn’t reach checkout. Please try again."); } finally { setPending(false); }
  }
  if (!authed || !tier) return <Link href={authed ? "/dashboard" : `/signup?tier=${encodeURIComponent(name)}&cadence=${annual ? "annual" : "monthly"}`} className={className}>{children}</Link>;
  return <><button type="button" className={className} disabled={!ready || pending} onClick={() => void checkout()}>{pending ? "Opening Checkout…" : children}</button>{error && <p role="alert" className="mb-4 text-sm">{error}</p>}</>;
}

export function ManageMembership() {
  const { authed } = useAuth();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  if (!authed) return null;
  async function manage() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) { setError(data.error ?? "Billing is temporarily unavailable."); return; }
      window.location.assign(data.url);
    } catch { setError("We couldn’t open billing. Please try again."); } finally { setPending(false); }
  }
  return <div className="my-6 text-center"><button type="button" disabled={pending} onClick={() => void manage()} className="min-h-11 font-semibold underline">{pending ? "Opening Billing…" : "Manage Existing Membership"}</button>{error && <p role="alert">{error}</p>}</div>;
}
