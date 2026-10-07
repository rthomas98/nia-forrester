"use client";
import { useState } from "react";
import Link from "next/link";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "./query-boundary";
import { authIsConfigured } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { alertText, muted, statusText } from "@/lib/typography";

const heading = "mb-3 font-ui text-tiny font-semibold tracking-[0.22em] text-champagne uppercase";

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
  if (isLoading) return <p role="status" className={statusText}>Loading your shelf…</p>;
  if (!isAuthenticated) return <Link className={buttonVariants({ variant: "secondary" })} href={`/signin?next=${encodeURIComponent(`/read/${slug}`)}`}>Sign In to Save This Book</Link>;
  if (record === undefined) return <p role="status" className={statusText}>Loading your shelf…</p>;
  if (!record) return null;
  return (
    <div className="space-y-4">
      <p role="status" className="font-display text-h6 font-semibold text-cream">
        {record.saved ? `In Your Library · ${record.status}` : "Save this book to your Want to Read shelf."}
      </p>
      <Button variant={record.saved ? "secondary" : "default"} disabled={pending} onClick={() => void toggle()}>
        {pending ? "Saving…" : record.saved ? "Remove from My Library" : "Add to My Library"}
      </Button>
      {record.saved && <p className={muted}>Removing a book keeps your saved progress. Saving progress adds it back.</p>}
      <p className={muted}>Saving a book does not purchase it or unlock paid content.</p>
      {error && <p role="alert" className={alertText}>{error}</p>}
    </div>
  );
}

export function SaveBook({ slug }: { slug: string }) {
  if (!authIsConfigured) {
    return (
      <Card className="p-6 sm:p-8">
        <p className={heading}>My Library</p>
        <p className={statusText}>Reader accounts are not connected yet.</p>
      </Card>
    );
  }
  return (
    <Card className="p-6 sm:p-8">
      <p className={heading}>My Library</p>
      <QueryBoundary
        fallback={(_error, retry) => (
          <div role="alert" className="space-y-4">
            <p className={statusText}>Your shelf is unavailable.</p>
            <Button variant="secondary" onClick={retry}>Try Again</Button>
          </div>
        )}
      >
        <SaveControl slug={slug} />
      </QueryBoundary>
    </Card>
  );
}
