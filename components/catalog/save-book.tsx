"use client";
import { useState } from "react";
import Link from "next/link";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "./query-boundary";
import { authIsConfigured } from "@/lib/auth-client";
const button = "min-h-11 rounded-full border border-current px-5 py-2 font-semibold disabled:opacity-50";
function SaveControl({ slug }: { slug: string }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const record = useQuery(api.library.current, isAuthenticated ? { slug } : "skip");
  const save = useMutation(api.library.setSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function toggle() {
    if (!record) return;
    setPending(true); setError("");
    try { await save({ slug, saved: !record.saved }); }
    catch { setError("We couldn’t update your library. Please try again."); }
    finally { setPending(false); }
  }
  if (isLoading) return <p role="status">Loading your shelf…</p>;
  if (!isAuthenticated) return <Link className={button} href={`/signin?next=${encodeURIComponent(`/read/${slug}`)}`}>Sign In to Save This Book</Link>;
  if (record === undefined) return <p role="status">Loading your shelf…</p>;
  if (!record) return null;
  return <div className="space-y-3"><p role="status">{record.saved ? `In Your Library · ${record.status}` : "Save this book to your Want to Read shelf."}</p><button className={button} disabled={pending} onClick={() => void toggle()}>{pending ? "Saving…" : record.saved ? "Remove from My Library" : "Add to My Library"}</button>{record.saved && <p className="text-sm">Removing a book keeps your saved progress. Saving progress adds it back.</p>}<p className="text-sm">Saving a book does not purchase it or unlock paid content.</p>{error && <p role="alert">{error}</p>}</div>;
}
export function SaveBook({ slug }: { slug: string }) {
  if (!authIsConfigured) return <p>Reader accounts are not connected yet.</p>;
  return <section className="my-6 rounded-3xl bg-[var(--color-brand-surface)] p-6 text-[var(--color-deep-plum)]"><QueryBoundary fallback={(_error, retry) => <div role="alert">Your shelf is unavailable. <button className={button} onClick={retry}>Try Again</button></div>}><SaveControl slug={slug} /></QueryBoundary></section>;
}
