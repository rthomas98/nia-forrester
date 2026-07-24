"use client";
import { useState } from "react";
import { featuredEvent, events, recordings } from "@/lib/data";
type EventFilter = "all" | "inperson" | "online" | "workshop";
const chips: {
    key: EventFilter;
    label: string;
}[] = [
    { key: "all", label: "All" },
    { key: "inperson", label: "In person" },
    { key: "online", label: "Online" },
    { key: "workshop", label: "Workshops" },
];
export default function EventsPage() {
    const [eventFilter, setEventFilter] = useState<EventFilter>("all");
    const eventsFiltered = eventFilter === "all"
        ? events
        : events.filter((e) => e.cat === eventFilter);
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:1240px] [margin:0_auto] [padding:56px_40px_64px]">
      <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
        Gather
      </div>
      <h1 className="font-sans [font-weight:700] [font-size:56px] [letter-spacing:-0.03em] [color:var(--color-deep-plum)] [margin:0_0_12px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
        Events &amp; Readings
      </h1>
      <p className="[font-size:18px] [color:var(--color-plum-copy)] [max-width:600px] [margin:0_0_40px] text-pretty">
        Festival appearances, live readings, workshops and retreats.
      </p>

      <article className="[background:var(--color-brand-surface)] [border-radius:32px] overflow-hidden grid [grid-template-columns:0.9fr_1.1fr] items-stretch [box-shadow:0_12px_28px_rgba(53,5,73,0.08),0_2px_6px_rgba(53,5,73,0.04)] [margin:0_0_36px] max-[900px]:grid-cols-1">
        <div className={`relative flex min-h-[300px] flex-col justify-between p-8 ${featuredEvent.gradient}`}>
          <span className="[align-self:flex-start] font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-brand-surface)] [background:rgba(53,5,73,0.28)] [padding:6px_14px] [border-radius:999px]">
            {featuredEvent.type}
          </span>
          <div className="flex items-baseline [gap:12px]">
            <div className="font-sans [font-weight:700] [font-size:13px] [letter-spacing:0.14em] uppercase [color:rgba(255,255,255,0.85)]">
              {featuredEvent.mon}
            </div>
            <div className="font-sans [font-weight:700] [font-size:72px] [letter-spacing:-0.04em] [color:var(--color-brand-surface)] [line-height:0.85]">
              {featuredEvent.day}
            </div>
          </div>
        </div>
        <div className="[padding:40px_44px] flex flex-col justify-center">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:12px]">
            Next up · don&apos;t miss it
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(28px,3vw,38px)] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_14px] [line-height:1.04] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            {featuredEvent.title}
          </h2>
          <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_22px] [max-width:52ch] text-pretty">
            {featuredEvent.blurb}
          </p>
          <div className="flex [gap:12px] items-center flex-wrap">
            <button type="button" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:14px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              Get tickets ↗
            </button>
            <span className="font-sans [font-size:13px] [color:var(--color-plum-muted)]">
              {featuredEvent.where} · {featuredEvent.when}
            </span>
          </div>
        </div>
      </article>

      <div className="flex items-center justify-between [gap:20px] flex-wrap [margin-bottom:22px]">
        <h2 className="font-sans [font-weight:700] [font-size:28px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:0px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
          Upcoming
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {chips.map((chip) => {
            const active = eventFilter === chip.key;
            return (<button type="button" key={chip.key} onClick={() => setEventFilter(chip.key)} className={`min-h-[46px] rounded-full px-[18px] py-[9px] font-sans text-[13px] font-semibold transition-colors duration-200 ${active ? "bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)]" : "bg-[var(--color-brand-surface)] text-[var(--color-deep-plum)]"}`}>
                {chip.label}
              </button>);
        })}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {eventsFiltered.map((e) => (<article key={e.title} className="flex items-center gap-7 rounded-[22px] bg-[var(--color-brand-surface)] px-7 py-6 shadow-[0_4px_12px_rgba(53,5,73,0.06)] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl max-[640px]:grid max-[640px]:grid-cols-[64px_minmax(0,1fr)] max-[640px]:items-start max-[640px]:gap-4 max-[640px]:p-[18px]">
            <div className="w-20 flex-none rounded-2xl bg-[var(--color-cool-teal)] py-3.5 text-center max-[640px]:w-16 max-[640px]:rounded-[14px]">
              <div className="font-sans [font-weight:700] [font-size:12px] [letter-spacing:0.1em] uppercase [color:var(--color-hot-magenta)]">
                {e.mon}
              </div>
              <div className="font-sans [font-weight:700] [font-size:30px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [line-height:1] [margin-top:2px]">
                {e.day}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-hot-magenta)] [font-weight:700] [margin-bottom:6px]">
                {e.type}
              </div>
              <h3 className="break-words font-sans [font-weight:700] [font-size:22px] [letter-spacing:-0.015em] [color:var(--color-deep-plum)] [margin:0_0_6px]">
                {e.title}
              </h3>
              <div className="[font-size:14px] [color:var(--color-plum-copy)]">
                {e.where}
              </div>
            </div>
            <button type="button" className="flex-none rounded-full bg-[var(--color-hot-magenta)] px-6 py-[13px] font-sans text-sm font-semibold text-[var(--color-brand-surface)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 max-[640px]:col-span-full max-[640px]:min-h-[46px] max-[640px]:w-full">
              {e.cta}
            </button>
          </article>))}
      </div>

      <section className="[padding:64px_0_8px]">
        <div className="flex items-end justify-between [margin-bottom:24px]">
          <div>
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
              Missed one?
            </div>
            <h2 className="font-sans [font-weight:700] [font-size:32px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:8px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Catch Up on the Recordings
            </h2>
          </div>
          <span className="font-sans [font-size:13px] [color:var(--color-plum-muted)]">
            Members watch back any time
          </span>
        </div>
        <div className="grid [grid-template-columns:repeat(3,1fr)] [gap:18px] max-[900px]:grid-cols-1">
          {recordings.map((r) => (<article key={r.title} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl cursor-pointer [background:var(--color-brand-surface)] [border-radius:22px] overflow-hidden [box-shadow:0_4px_12px_rgba(53,5,73,0.06)]">
              <div className={`relative flex h-[130px] items-center justify-center ${r.gradient}`}>
                <span className="[width:52px] [height:52px] [border-radius:999px] [background:rgba(196,185,203,0.92)] flex items-center justify-center [color:var(--color-deep-plum)]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="[margin-left:3px]">
                    <path d="M8 5.14v13.72L19 12z"></path>
                  </svg>
                </span>
                <span className="absolute [bottom:12px] [right:12px] font-sans [font-weight:600] [font-size:11px] [letter-spacing:0.04em] [color:var(--color-soft-lavender)] [background:rgba(53,5,73,0.5)] [padding:4px_10px] [border-radius:999px]">
                  {r.duration}
                </span>
              </div>
              <div className="[padding:20px_22px]">
                <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.1em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:8px]">
                  {r.type}
                </div>
                <h3 className="font-sans [font-weight:600] [font-size:17px] [line-height:1.25] [color:var(--color-deep-plum)] [margin:0_0_8px]">
                  {r.title}
                </h3>
                <div className="font-sans [font-size:12px] [letter-spacing:0.04em] [color:var(--color-plum-muted)]">
                  {r.date}
                </div>
              </div>
            </article>))}
        </div>
      </section>

      <section className="[padding:40px_0_0]">
        <div className="[background:var(--color-deep-plum)] [border-radius:36px] [padding:clamp(40px,5vw,56px)] grid [grid-template-columns:1.1fr_0.9fr] [gap:40px] items-center max-[900px]:grid-cols-1">
          <div>
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:16px]">
              Invite Nia
            </div>
            <h2 className="font-sans [font-weight:700] [font-size:clamp(28px,3.4vw,40px)] [letter-spacing:-0.03em] [color:var(--color-soft-lavender)] [margin:0_0_14px] [line-height:1.04] [max-width:18ch] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Bring Nia to Your Festival or Book Club
            </h2>
            <p className="[font-size:16px] [line-height:1.6] [color:rgba(196,185,203,0.8)] [margin:0px] [max-width:48ch] text-pretty">
              Readings, panels, craft talks, and book-club drop-ins — in person
              or virtual. Tell us about your event and a date you have in mind.
            </p>
          </div>
          <div className="flex flex-col [gap:12px] items-start">
            <button type="button" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_28px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              Send an invitation ↗
            </button>
            <span className="font-sans [font-size:13px] [color:rgba(196,185,203,0.6)]">
              or email events@stilettopress.com
            </span>
          </div>
        </div>
      </section>

      <div className="[margin-top:56px]"></div>
    </main>);
}
