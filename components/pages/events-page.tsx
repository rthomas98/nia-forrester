"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useConvexAuth, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { StatePanel } from "@/components/catalog/catalog-states";
import { authIsConfigured } from "@/lib/auth-client";
import { EventRegistration } from "@/components/event-registration";
import { InvitationForm } from "@/components/inquiry-form";
import { Header46 } from "@/components/relume/header46";
import { Event1Filters, Event1Row } from "@/components/relume/event1";
import { Layout659 } from "@/components/relume/layout659";
import { Button, buttonVariants } from "@/components/ui/button";
import { statusText } from "@/lib/typography";

const filters = ["All", "In Person", "Online", "Workshops"] as const;
type UpcomingEvent = FunctionReturnType<typeof api.events.upcoming>[number];

function safeUrl(url: string | undefined) { if (!url) return null; try { return new URL(url).protocol === "https:" ? url : null; } catch { return null; } }

function dateParts(event: UpcomingEvent) {
  const date = new Date(event.startsAt);
  const part = (options: Intl.DateTimeFormatOptions) => date.toLocaleString("en-US", { ...options, timeZone: event.timezone });
  return {
    weekday: part({ weekday: "short" }),
    day: part({ day: "2-digit" }),
    month: part({ month: "short" }),
    year: part({ year: "numeric" }),
    iso: date.toISOString(),
  };
}

function EventCard({ event }: { event: UpcomingEvent }) {
  const { isAuthenticated } = useConvexAuth();
  const ticket = safeUrl(event.ticketUrl); const meeting = safeUrl(event.meetingUrl);
  const statuses: Array<{ label: string; variant?: "default" | "alternate" | "outline" | "alert" }> = [];
  if (event.isTest) statuses.push({ label: "Test Event · Not a Real Booking", variant: "alert" });
  if (event.full) statuses.push({ label: event.waitlistEnabled ? "Waitlist" : "Full", variant: "outline" });
  return (
    <Event1Row
      date={dateParts(event)}
      eyebrow={`${event.category} · ${event.format.replaceAll("_", " ")}`}
      title={event.title}
      statuses={statuses}
      time={<><time dateTime={new Date(event.startsAt).toISOString()}>{new Date(event.startsAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: event.timezone })}</time> ({event.timezone})</>}
      location={`${event.venue ?? (event.format === "virtual" ? "Online" : "Venue to Be Announced")}${event.city ? ` · ${event.city}` : ""}`}
      description={event.description}
    >
      <div className="flex flex-wrap items-center gap-3">
        {meeting && <a className={buttonVariants({ variant: "secondary", size: "sm" })} href={meeting} target="_blank" rel="noopener noreferrer">Join Online Event ↗</a>}
        {!isAuthenticated ? (
          <Link href="/signin?next=/events" className={buttonVariants({ size: "sm" })}>Sign In to Register</Link>
        ) : !event.eligible ? (
          <Link href="/membership" className={buttonVariants({ size: "sm" })}>{event.accessTier} Membership Required</Link>
        ) : ticket ? (
          <a className={buttonVariants({ size: "sm" })} href={ticket} target="_blank" rel="noopener noreferrer">Tickets ↗</a>
        ) : null}
      </div>
      {isAuthenticated && (event.eligible ? !ticket : (event.registration === "registered" || event.registration === "waitlisted")) && <EventRegistration event={event} />}
    </Event1Row>
  );
}

function LiveEvents() {
  const events = useQuery(api.events.upcoming, {});
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  if (!events) return <p role="status" className={statusText}>Loading events…</p>;
  const visible = events.filter(e => filter === "All" || filter === "In Person" && e.format !== "virtual" || filter === "Online" && e.format !== "in_person" || filter === "Workshops" && e.category === "workshop");
  return <>
    {events.some(e => e.isTest) && <p className="mb-8 rounded-card border border-rose/60 bg-rose/10 p-4 text-small text-cream">Local Test Preview: these labeled fixtures are not real events. No actual appearances are currently announced.</p>}
    <Event1Filters label="Filter events" options={filters.map(value => ({ value, label: value }))} value={filter} onChange={setFilter} />
    {!events.length ? (
      <StatePanel eyebrow="Calendar" title="No Upcoming Events Yet">
        There are no announced events at the moment. Check back for future readings, appearances, and workshops.
      </StatePanel>
    ) : !visible.length ? (
      <p role="status" className={statusText}>No events match this filter.</p>
    ) : (
      <div>{visible.map(event => <EventCard key={event._id} event={event} />)}</div>
    )}
  </>;
}

export default function EventsPage() {
  return (
    <main>
      <Header46 tagline="Gather" heading="Events & Readings" description="Festival appearances, live readings, workshops and retreats." />
      <section aria-label="Upcoming events" className="px-[5%] pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-content">
          {authIsConfigured ? (
            <QueryBoundary
              fallback={(_error, retry) => (
                <StatePanel
                  role="alert"
                  eyebrow="Something went wrong"
                  title="Events Are Temporarily Unavailable"
                  actions={<Button type="button" onClick={retry}>Try Again</Button>}
                >
                  We couldn’t load the event calendar.
                </StatePanel>
              )}
            >
              <LiveEvents />
            </QueryBoundary>
          ) : (
            <StatePanel role="status" eyebrow="Not connected" title="Events Are Not Connected Yet">
              The event calendar will appear here once the site is connected to its event service.
            </StatePanel>
          )}
        </div>
      </section>
      <Layout659
        className="border-t border-hairline"
        tagline="Bring Nia to You"
        heading="Invite Nia"
        media={<Image src="/images/nia-pink-smile.jpeg" alt="Nia Forrester smiling in front of a pink mural" fill sizes="(max-width: 767px) 100vw, 560px" className="object-cover object-[50%_25%]" />}
        description={<p>Invite Nia to your festival, book club, or literary gathering. Share the details of your event and the date you have in mind, and we’ll follow up to explore the possibilities.</p>}
        actions={<a href="#invite-nia-form" className={buttonVariants()}>Send an Invitation</a>}
      />
      <section id="invite-nia-form" aria-label="Invitation request" className="scroll-mt-24 px-[5%] pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-3xl">
          <InvitationForm />
        </div>
      </section>
    </main>
  );
}
