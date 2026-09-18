"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { authIsConfigured } from "@/lib/auth-client";
import { PublishedContent } from "@/components/published-content";
import { QueryBoundary } from "@/components/catalog/query-boundary";
function Chapters({id}:{id:Id<"content">}) { const rows=useQuery(api.content.chaptersForContent,{contentId:id}); const [selected,setSelected]=useState(0); if(!rows)return <p role="status">Loading chapters…</p>;if(!rows.length)return <p>No chapters have been published yet.</p>;const current=rows[Math.min(selected,rows.length-1)];return <><nav aria-label="Chapters" className="my-6 flex flex-wrap gap-3">{rows.map((r,i)=><button className="min-h-11 rounded-xl bg-white px-4" aria-pressed={i===selected} key={r._id} onClick={()=>setSelected(i)}>{r.title}</button>)}</nav><h2 className="mb-6 text-3xl font-serif">{current.title}</h2>{current.hasAccess ? <div className="whitespace-pre-wrap text-lg leading-relaxed">{current.body || "Chapter text is not available yet."}</div> : <Link href="/membership" className="underline">Membership Required to Read This Chapter</Link>}</>; }
function Reader({slug}:{slug:string}) { const item=useQuery(api.content.bySlug,{slug});if(item===undefined)return <p role="status">Loading…</p>;if(!item)return <p>This publication is not available.</p>;return <><h1 className="my-6 text-4xl font-serif">{item.title}</h1><p className="mb-6">{item.excerpt}</p>{item.kind === "serial" ? <Chapters id={item._id}/> : item.hasAccess ? <div className="whitespace-pre-wrap text-lg leading-relaxed">{item.body || "Full text is not available yet."}</div> : <Link href="/membership">Membership Required</Link>}</>; }
export default function SerialPage({slug}:{slug?:string}) { return <main className="mx-auto max-w-4xl px-5 py-12 text-[var(--color-deep-plum)]"><Link href="/read" className="underline">← Back to Read</Link>{!authIsConfigured ? <p>Reading is not connected yet.</p> : <QueryBoundary fallback={(_e,retry)=><p role="alert">Reading is temporarily unavailable. <button onClick={retry}>Retry</button></p>}>{slug ? <Reader slug={slug}/> : <><h1 className="my-6 text-4xl font-bold">Serials</h1><PublishedContent kind="serial"/></>}</QueryBoundary>}</main>; }
