"use client";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authIsConfigured } from "@/lib/auth-client";
import { QueryBoundary } from "@/components/catalog/query-boundary";
function Feed({kind}:{kind:"serial"|"essay"}) {
  const rows=useQuery(api.content.listPublished,{kind});
  if (!rows) return <p role="status">Loading published {kind === "essay" ? "essays" : "serials"}…</p>;
  return <div className="grid gap-5 sm:grid-cols-2">{rows.length ? rows.map(r=><article key={r._id} className="rounded-3xl bg-[var(--color-brand-surface)] p-6"><h3 className="text-2xl font-semibold">{r.title}</h3><p className="my-4">{r.excerpt}</p><Link className="inline-flex min-h-11 items-center font-semibold underline" href={`/serial?slug=${encodeURIComponent(r.slug)}`}>Read ↗</Link></article>) : <p>No {kind === "essay" ? "essays" : "serials"} have been published here yet.</p>}</div>;
}
export function PublishedContent({kind}:{kind:"serial"|"essay"}) { return authIsConfigured ? <QueryBoundary fallback={(_e,retry)=><div role="alert">Published content is unavailable. <button onClick={retry}>Retry</button></div>}><Feed kind={kind}/></QueryBoundary> : <p>Published content is not connected yet.</p>; }
function Count({field}:{field:"books"|"series"}) { const summary=useQuery(api.site.summary,{}); return <>{summary ? summary[field] : "—"}</>; }
export function CatalogCount({field}:{field:"books"|"series"}) { return authIsConfigured ? <QueryBoundary fallback={()=> <span>—</span>}><Count field={field}/></QueryBoundary> : <span>—</span>; }
function Shelf() { const data=useQuery(api.site.summary,{}); if(!data)return <p role="status">Loading books…</p>; return <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">{data.featured.length ? data.featured.map(b=><Link key={b.id} href={`/read/${b.slug}`} className="min-w-0">{b.coverUrl && <Image src={b.coverUrl} alt={`Cover of ${b.title}`} width={200} height={300} sizes="(max-width:640px) 45vw, 180px" className="mb-3 aspect-[2/3] w-full rounded object-cover"/>}<span className="block text-lg font-semibold">{b.title}</span><span className="mt-3 inline-block text-sm underline">View Book ↗</span></Link>) : <p>No books published yet.</p>}</div>; }
export function PublishedShelf(){return authIsConfigured ? <QueryBoundary fallback={()=> <p>Books are temporarily unavailable.</p>}><Shelf/></QueryBoundary> : <p>The catalog is not connected yet.</p>;}
