"use client";
import { useState } from "react";
import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { authIsConfigured } from "@/lib/auth-client";
import { EventRegistration } from "@/components/event-registration";
const button = "inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-deep-plum)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50";
const filters = ["All", "In Person", "Online", "Workshops"] as const;
function safeUrl(url: string | undefined) { if (!url) return null; try { return new URL(url).protocol === "https:" ? url : null; } catch { return null; } }
function EventCard({ event }: { event: FunctionReturnType<typeof api.events.upcoming>[number] }) {
  const { isAuthenticated } = useConvexAuth();
  const ticket = safeUrl(event.ticketUrl); const meeting = safeUrl(event.meetingUrl);
  return <article className="rounded-3xl bg-[var(--color-brand-surface)] p-6 shadow-sm sm:p-8">
    {event.isTest && <p className="mb-3 font-bold text-[var(--color-hot-magenta)]">Test Event · Not a Real Booking</p>}
    <p className="text-sm font-semibold uppercase tracking-wider">{event.category} · {event.format.replaceAll("_", " ")}</p>
    <h2 className="my-3 break-words text-2xl font-bold">{event.title}</h2>
    <p className="mb-3 whitespace-pre-wrap break-words">{event.description}</p>
    <p className="font-semibold"><time dateTime={new Date(event.startsAt).toISOString()}>{new Date(event.startsAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: event.timezone })}</time> ({event.timezone})</p>
    <p className="mb-4 text-sm">{event.venue ?? (event.format === "virtual" ? "Online" : "Venue to Be Announced")}{event.city ? ` · ${event.city}` : ""}</p>
    {meeting && <a className={button} href={meeting} target="_blank" rel="noopener noreferrer">Join Online Event ↗</a>}
    {!isAuthenticated ? <Link href="/signin?next=/events" className={button}>Sign In to Register</Link> : !event.eligible ? <><Link href="/membership" className={button}>{event.accessTier} Membership Required</Link>{(event.registration === "registered" || event.registration === "waitlisted") && <EventRegistration event={event} />}</> : ticket ? <a className={button} href={ticket} target="_blank" rel="noopener noreferrer">Tickets ↗</a> : <EventRegistration event={event} />}
  </article>;
}
function LiveEvents() {
  const events = useQuery(api.events.upcoming, {});
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  if (!events) return <p role="status">Loading events…</p>;
  const visible = events.filter(e => filter === "All" || filter === "In Person" && e.format !== "virtual" || filter === "Online" && e.format !== "in_person" || filter === "Workshops" && e.category === "workshop");
  return <>
    {events.some(e => e.isTest) && <p className="mb-6 rounded-2xl border border-[var(--color-hot-magenta)] p-4">Local Test Preview: these labeled fixtures are not real events. No actual appearances are currently announced.</p>}
    <div className="mb-6 flex flex-wrap gap-3" aria-label="Filter events">{filters.map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={`${button} ${filter !== value ? "opacity-60" : ""}`}>{value}</button>)}</div>
    {!events.length ? <section className="rounded-3xl bg-[var(--color-brand-surface)] p-8"><h2 className="text-2xl font-bold">No Upcoming Events Yet</h2><p className="mt-3">There are no announced events at the moment. Check back for future readings, appearances, and workshops.</p></section> : !visible.length ? <p role="status">No events match this filter.</p> : <div className="grid gap-6">{visible.map(event => <EventCard key={event._id} event={event} />)}</div>}
  </>;
}
export default function EventsPage() {
  return <main className="mx-auto max-w-6xl px-5 py-12 text-[var(--color-deep-plum)] sm:px-8"><p className="text-xs font-bold uppercase tracking-widest text-[var(--color-hot-magenta)]">Gather</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">Events &amp; Readings</h1><p className="mb-10 mt-4 text-lg">Festival appearances, live readings, workshops and retreats.</p>{authIsConfigured ? <QueryBoundary fallback={(_error, retry) => <div role="alert"><h2 className="text-2xl font-bold">Events Are Temporarily Unavailable</h2><p className="my-3">We couldn’t load the event calendar.</p><button className={button} onClick={retry}>Try Again</button></div>}><LiveEvents /></QueryBoundary> : <p>Events are not connected yet.</p>}<section className="mt-12 rounded-3xl bg-[var(--color-cool-teal)] p-8"><h2 className="text-2xl font-bold">Invite Nia</h2><p className="my-4">Bring Nia to your festival or book club. Tell us about your event and the date you have in mind.</p><Link href="/contact" className={button}>Send an Invitation ↗</Link></section></main>;
}
