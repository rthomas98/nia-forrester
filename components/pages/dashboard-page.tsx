"use client";
import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { CoverFrame } from "@/components/catalog/catalog-cover";
import { StatePanel } from "@/components/catalog/catalog-states";
import { AvatarUpload } from "@/components/avatar";
import { Header46 } from "@/components/relume/header46";
import { Stat3 } from "@/components/relume/stat3";
import { Product1Item } from "@/components/relume/product1";
import { Button, buttonVariants } from "@/components/ui/button";
import { cardVariants } from "@/components/ui/card";
import { heading3, heading4, muted, statusText, tagline, textLink } from "@/lib/typography";

const card = `${cardVariants()} p-6 text-body sm:p-8`;
const link = textLink;
const labels = { free: "Free Reader", reader: "Reader Circle", inner: "Inner Circle", writers: "Writers Circle" };
const href = (slug: string) => `/read/${encodeURIComponent(slug)}`;
const date = (value: number) => new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-[5%] py-16 md:py-24">
      <div className="mx-auto w-full max-w-content">{children}</div>
    </div>
  );
}

function DashboardContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const data = useQuery(api.dashboard.summary, isAuthenticated ? {} : "skip");
  if (isLoading || (isAuthenticated && !data)) {
    return <Shell><h1 className="sr-only">My Library</h1><p role="status" className={statusText}>Loading your library…</p></Shell>;
  }
  if (!isAuthenticated || !data) {
    return (
      <Shell>
        <StatePanel headingLevel="h1" eyebrow="Your shelf" title="Sign In to Your Library" actions={<Link className={buttonVariants()} href="/signin?next=/dashboard">Sign In</Link>}>
          Sign in to see your saved reading, membership, and Circle updates.
        </StatePanel>
      </Shell>
    );
  }
  const current = data.continueReading;
  return <>
    <Header46 tagline="Your Shelf" heading={<span className="break-words">Happy Reading, {data.name}</span>} description="Your saved reading, membership, and Circle updates in one place." className="pb-8 md:pb-10" />
    <div className="px-[5%] pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-content">
        <Stat3
          label="Reading summary"
          stats={[
            { title: "Books Finished", value: data.finished },
            { title: "Titles on Shelf", value: data.libraryCount },
            ...(current ? [{ title: "Continue Reading", value: `${current.percent}%`, progress: current.percent }] : []),
          ]}
        />
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-8">
            <section className={`${cardVariants({ variant: "raised" })} p-6 text-body sm:p-8`}>
              <p className={tagline}>Pick Up Where You Left Off</p>
              <h2 className={`mb-4 ${heading3}`}>Continue Reading</h2>
              {current ? <>
                <h3 className="font-display text-h5 font-semibold text-cream">{current.title}</h3>
                <p className={`mt-2 ${muted}`}>{current.percent}% complete</p>
                <progress aria-label="Saved reading progress" className="my-4 block h-1.5 w-full appearance-none overflow-hidden rounded-full bg-wine-sunken [&::-moz-progress-bar]:bg-champagne [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-champagne" value={current.percent} max={100} />
                <Link href={href(current.slug)} className={buttonVariants()}>Continue Reading ↗</Link>
              </> : <>
                <p>No unfinished reading yet. Choose a book and save your progress to start your shelf.</p>
                <Link href="/read" className={link}>Browse the Library ↗</Link>
              </>}
            </section>
            <section className={card}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className={heading3}>Your Library</h2><Link href="/read" className={link}>Browse All</Link></div>
              {data.library.length ? <>
                <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
                  {data.library.map(book => (
                    <li key={book.id} className="min-w-0">
                      <Product1Item
                        url={href(book.slug)}
                        name={book.title}
                        description={`${book.status}${book.status === "Reading" ? ` · ${book.percent}% complete` : ""}`}
                        image={<CoverFrame title={book.title} src={book.coverUrl ?? null} sizes="(min-width: 640px) 200px, 45vw" />}
                      />
                    </li>
                  ))}
                </ul>
                {data.libraryCount > data.library.length && <p className={`mt-6 ${muted}`}>Showing your {data.library.length} most recently updated titles.</p>}
              </> : <p>Your shelf is empty. Add a book to My Library or save reading progress to get started.</p>}
            </section>
            <section className={card}><h2 className={`mb-4 ${heading3}`}>From the Circle</h2>
              {data.communityAccess === "unpaid" ? <><p>An active paid membership is required to read Circle discussions.</p><Link href="/membership" className={link}>Explore Memberships</Link></> : data.communityAccess === "eligible" ? <><p>Your membership includes the Circle. Join to participate.</p><Link href="/community" className={link}>Join the Circle</Link></> : <>{data.discussions.length ? <ul className="mb-2">{data.discussions.map(thread => <li key={thread.id} className="border-t border-hairline first:border-t-0"><Link href="/community" className={link}>{thread.title}</Link></li>)}</ul> : <p>No discussions to show yet.</p>}<Link href="/community" className={link}>Open the Circle ↗</Link></>}
            </section>
          </div>
          <aside className="space-y-6">
            <section className={card}>
              <AvatarUpload name={data.name} />
              <h2 className={`break-words ${heading4}`}>{data.name}</h2><p className="mt-1 font-ui text-tiny font-semibold tracking-[0.18em] text-champagne uppercase">{labels[data.tier]}</p>
              <dl className="my-6 space-y-3 border-y border-hairline py-5 text-small">
                <div className="flex justify-between gap-3"><dt className="text-taupe">Books Finished</dt><dd className="text-cream">{data.finished}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-taupe">Titles on Shelf</dt><dd className="text-cream">{data.libraryCount}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-taupe">Account Since</dt><dd className="text-cream">{date(data.accountCreatedAt)}</dd></div>
              </dl>
              {data.paidThrough && <p className={`mb-3 ${muted}`}>{data.renewalCanceled ? "Access Until" : "Paid Through"} {new Date(data.paidThrough).toLocaleDateString("en-US", { timeZone: "UTC" })}</p>}
              <Link href="/membership" className={buttonVariants({ variant: "secondary" })}>{data.tier === "free" ? "Explore Memberships" : "Manage Membership"}</Link>
            </section>
            <section className={card}><h2 className={`mb-4 ${heading4}`}>Next Up</h2>{data.events.length ? <ul className="mb-2 space-y-4">{data.events.map(event => <li key={event.id}><h3 className="font-display text-h6 font-semibold text-cream">{event.title}</h3><p className={muted}>{new Date(event.startsAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: event.timezone })} ({event.timezone})</p></li>)}</ul> : <p>No upcoming events available for your membership.</p>}<Link href="/events" className={link}>All Events</Link></section>
          </aside>
        </div>
      </div>
    </div>
  </>;
}

export default function DashboardPage() {
  return <main><QueryBoundary fallback={(_error, retry) => <Shell><StatePanel headingLevel="h1" role="alert" eyebrow="Something went wrong" title="Your Library Is Unavailable" actions={<Button type="button" onClick={retry}>Try Again</Button>}>We couldn’t load your account data. Your saved reading has not been changed.</StatePanel></Shell>}><DashboardContent /></QueryBoundary></main>;
}
