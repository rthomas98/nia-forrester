"use client";
import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { BookCover } from "@/components/ui";
import { AvatarUpload } from "@/components/avatar";

const card = "rounded-3xl bg-[var(--color-brand-surface)] p-6 shadow-sm sm:p-8";
const link = "inline-flex min-h-11 items-center font-semibold underline underline-offset-4";
const labels = { free: "Free Reader", reader: "Reader Circle", inner: "Inner Circle", writers: "Writers Circle" };
const href = (slug: string) => `/read/${encodeURIComponent(slug)}`;
const date = (value: number) => new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

function DashboardContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const data = useQuery(api.dashboard.summary, isAuthenticated ? {} : "skip");
  if (isLoading || (isAuthenticated && !data)) return <p role="status">Loading your library…</p>;
  if (!isAuthenticated || !data) return <div className={card}><h1 className="text-3xl font-bold">Sign In to Your Library</h1><Link className={link} href="/signin?next=/dashboard">Sign In</Link></div>;
  const current = data.continueReading;
  return <>
    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-hot-magenta)]">Your Shelf</p>
    <h1 className="break-words text-4xl font-bold tracking-tight sm:text-5xl">Happy reading, {data.name}</h1>
    <p className="mb-8 mt-3">Your saved reading, membership, and Circle updates in one place.</p>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-8">
        <section className="rounded-3xl bg-[var(--color-cool-teal)] p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold">Continue Reading</h2>
          {current ? <><h3 className="font-serif text-2xl">{current.title}</h3><p className="mt-2">{current.percent}% complete</p><progress aria-label="Saved reading progress" className="my-4 h-3 w-full accent-[var(--color-hot-magenta)]" value={current.percent} max={100} /><Link href={href(current.slug)} className={link}>Continue Reading ↗</Link></> : <><p>No unfinished reading yet. Choose a book and save your progress to start your shelf.</p><Link href="/read" className={link}>Browse the Library ↗</Link></>}
        </section>
        <section className={card}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Your Library</h2><Link href="/read" className={link}>Browse All</Link></div>
          {data.library.length ? <><div className="grid grid-cols-2 gap-5 sm:grid-cols-3">{data.library.map(book => <article key={book.id} className="min-w-0"><Link href={href(book.slug)} aria-label={`View ${book.title}`}><BookCover title={book.title} src={book.coverUrl} gradient="linear-gradient(145deg,#350549,#67A0AF)" size="library" sizes="120px" /><h3 className="mt-3 break-words font-semibold">{book.title}</h3></Link><p className="text-sm">{book.status}{book.status === "Reading" ? ` · ${book.percent}% complete` : ""}</p></article>)}</div>{data.libraryCount > data.library.length && <p className="mt-4 text-sm">Showing your {data.library.length} most recently updated titles.</p>}</> : <p>Your shelf is empty. Add a book to My Library or save reading progress to get started.</p>}
        </section>
        <section className={card}><h2 className="mb-4 text-2xl font-bold">From the Circle</h2>
          {data.communityAccess === "unpaid" ? <><p>An active paid membership is required to read Circle discussions.</p><Link href="/membership" className={link}>Explore Memberships</Link></> : data.communityAccess === "eligible" ? <><p>Your membership includes the Circle. Join to participate.</p><Link href="/community" className={link}>Join the Circle</Link></> : <>{data.discussions.length ? <ul className="space-y-3">{data.discussions.map(thread => <li key={thread.id}><Link href="/community" className={link}>{thread.title}</Link></li>)}</ul> : <p>No discussions to show yet.</p>}<Link href="/community" className={link}>Open the Circle ↗</Link></>}
        </section>
      </div>
      <aside className="space-y-6">
        <section className="rounded-3xl bg-[var(--color-deep-plum)] p-6 text-[var(--color-brand-surface)]">
          <AvatarUpload name={data.name} />
          <h2 className="break-words text-xl font-bold">{data.name}</h2><p className="mt-2 text-[var(--color-cool-teal)]">{labels[data.tier]}</p>
          <dl className="my-6 space-y-3"><div className="flex justify-between gap-3"><dt>Books Finished</dt><dd>{data.finished}</dd></div><div className="flex justify-between gap-3"><dt>Titles on Shelf</dt><dd>{data.libraryCount}</dd></div><div className="flex justify-between gap-3"><dt>Account Since</dt><dd>{date(data.accountCreatedAt)}</dd></div></dl>
          {data.paidThrough && <p className="mb-3 text-sm">{data.renewalCanceled ? "Access Until" : "Paid Through"} {new Date(data.paidThrough).toLocaleDateString("en-US", { timeZone: "UTC" })}</p>}
          <Link href="/membership" className={link}>{data.tier === "free" ? "Explore Memberships" : "Manage Membership"}</Link>
        </section>
        <section className={card}><h2 className="mb-4 text-xl font-bold">Next Up</h2>{data.events.length ? <ul className="space-y-4">{data.events.map(event => <li key={event.id}><h3 className="font-semibold">{event.title}</h3><p className="text-sm">{new Date(event.startsAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: event.timezone })} ({event.timezone})</p></li>)}</ul> : <p>No upcoming events available for your membership.</p>}<Link href="/events" className={link}>All Events</Link></section>
      </aside>
    </div>
  </>;
}
export default function DashboardPage() {
  return <main className="mx-auto max-w-7xl px-5 py-10 text-[var(--color-deep-plum)] sm:px-8"><QueryBoundary fallback={(_error, retry) => <section className={card} role="alert"><h1 className="text-3xl font-bold">Your Library Is Unavailable</h1><p className="my-4">We couldn’t load your account data. Your saved reading has not been changed.</p><button type="button" className={link} onClick={retry}>Try Again</button></section>}><DashboardContent /></QueryBoundary></main>;
}
