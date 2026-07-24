"use client";
import Link from "next/link";
import { BookCover } from "@/components/ui";
import { popular, threads, COCOA } from "@/lib/data";
export default function DashboardPage() {
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:1240px] [margin:0_auto] [padding:44px_40px_64px]">
      <div className="grid [grid-template-columns:minmax(0,1fr)_minmax(270px,320px)] [gap:40px] [align-items:start] max-[900px]:grid-cols-1">
        <div className="[min-width:0px]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            Your shelf · Tuesday
          </div>
          <h1 className="font-sans [font-weight:700] [font-size:clamp(38px,4vw,52px)] [line-height:1.02] [letter-spacing:-0.03em] [color:var(--color-deep-plum)] [margin:0_0_10px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            Happy reading, Maya
          </h1>
          <p className="[font-size:15px] [color:var(--color-plum-copy)] [margin:0_0_32px] text-pretty">
            You&apos;re a chapter behind on{" "}
            <em className="font-serif [font-style:normal]">
              Forty-Nothing
            </em>{" "}
            — and Chapter 11 just dropped.
          </p>

          <div className="[background:var(--color-cool-teal)] [border-radius:26px] [padding:28px] flex [gap:24px] items-center [margin-bottom:44px]">
            <Link href="/serial" className="flex-none">
              <BookCover title="Forty-Nothing" gradient={COCOA} size="progress" className="cursor-pointer"/>
            </Link>
            <div className="[flex:1] [min-width:0px]">
              <div className="font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-deep-plum)] [font-weight:700] [margin-bottom:8px]">
                Continue reading
              </div>
              <h3 className="font-serif [font-weight:500] [font-size:24px] [color:var(--color-deep-plum)] [margin:0_0_12px]">
                Chapter 11 — &ldquo;Undone&rdquo;
              </h3>
              <div className="flex items-center [gap:12px] [margin-bottom:16px] [max-width:340px]">
                <div className="[flex:1] [height:6px] [border-radius:999px] [background:rgba(53,5,73,0.14)] overflow-hidden">
                  <div className="[width:38%] h-full [border-radius:999px] [background:var(--color-hot-magenta)]"/>
                </div>
                <span className="whitespace-nowrap font-sans [font-weight:600] [font-size:12px] [color:rgba(53,5,73,0.65)]">
                  38% · 12 min left
                </span>
              </div>
              <Link href="/serial" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 inline-block [background:var(--color-deep-plum)] [color:var(--color-brand-surface)] [padding:12px_22px] [border-radius:999px] font-sans [font-weight:600] [font-size:13px]">
                Pick up where you left off ↗
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between [margin-bottom:18px]">
            <h2 className="font-sans [font-weight:700] [font-size:24px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:0px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Your library
            </h2>
            <Link href="/read" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:13px] [color:var(--color-plum-copy)]">
              Browse all
            </Link>
          </div>
          <div className="snap-x snap-proximity overscroll-x-contain touch-pan-x [&>*]:snap-start flex [gap:18px] overflow-x-auto [padding-bottom:12px] [margin-bottom:44px]">
            {popular.map((b) => (<div key={b.title} className="flex-none [width:120px]">
                <BookCover title={b.title} gradient={b.gradient} size="library"/>
                <div className="[margin-top:8px] [font-size:12px] [font-weight:600] [color:var(--color-deep-plum)] [line-height:1.25]">
                  {b.title}
                </div>
                <div className="[font-size:11px] [color:var(--color-plum-muted)]">{b.meta}</div>
              </div>))}
          </div>

          <h2 className="font-sans [font-weight:700] [font-size:24px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:0_0_18px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            From the Circle
          </h2>
          <div className="[background:var(--color-brand-surface)] [border-radius:18px] [box-shadow:0_1px_2px_rgba(53,5,73,0.04)] overflow-hidden">
            {threads.map((t) => (<Link key={t.title} href="/community" className="transition-colors duration-150 hover:bg-[var(--color-soft-lavender)]/50 cursor-pointer [padding:16px_20px] flex items-center [gap:14px] [border-top:1px_solid_rgba(53,5,73,0.08)]">
                <div className={`flex size-9 flex-none items-center justify-center rounded-full font-sans text-xs font-bold text-[var(--color-soft-lavender)] ${t.avatarColor}`}>
                  {t.initials}
                </div>
                <div className="[flex:1] [min-width:0px]">
                  <span className="font-sans [font-size:10px] [letter-spacing:0.1em] uppercase [color:var(--color-hot-magenta)] [font-weight:700]">
                    {t.tag}
                  </span>
                  <h3 className="font-sans [font-weight:600] [font-size:15px] [line-height:1.3] [color:var(--color-deep-plum)] [margin:4px_0_0]">
                    {t.title}
                  </h3>
                </div>
                <span className="flex-none flex items-center [gap:6px] [color:var(--color-plum-muted)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                  </svg>
                  <span className="font-sans [font-weight:600] [font-size:13px]">
                    {t.count}
                  </span>
                </span>
              </Link>))}
          </div>
        </div>

        <aside className="sticky [top:90px] flex flex-col [gap:20px] max-[900px]:static">
          <div className="[background:var(--color-deep-plum)] [border-radius:24px] [padding:24px]">
            <div className="flex items-center [gap:12px] [margin-bottom:18px]">
              <div className="flex-none [width:44px] [height:44px] [border-radius:999px] [background:var(--color-cool-teal)] [color:var(--color-deep-plum)] flex items-center justify-center font-sans [font-weight:700] [font-size:16px]">
                M
              </div>
              <div className="[min-width:0px]">
                <div className="font-sans [font-weight:600] [font-size:15px] [color:var(--color-soft-lavender)]">
                  Maya Okafor
                </div>
                <div className="font-sans [font-size:10px] [letter-spacing:0.1em] uppercase [color:var(--color-hot-magenta)] [font-weight:700] [margin-top:2px]">
                  Inner Circle member
                </div>
              </div>
            </div>
            <div className="flex flex-col [gap:10px] [border-top:1px_solid_rgba(196,185,203,0.14)] [padding-top:16px] [margin-bottom:18px]">
              {[
            { label: "Books finished", value: "14" },
            { label: "Reading streak", value: "9 weeks" },
            { label: "Member since", value: "2024" },
        ].map((row) => (<div key={row.label} className="flex justify-between font-sans [font-size:13px]">
                  <span className="[color:rgba(196,185,203,0.6)]">{row.label}</span>
                  <span className="[color:var(--color-soft-lavender)] [font-weight:600]">
                    {row.value}
                  </span>
                </div>))}
            </div>
            <Link href="/membership" className="transition-colors duration-150 hover:bg-[var(--color-cool-teal)]/25 block w-full text-center [background:rgba(103,160,175,0.14)] [color:var(--color-soft-lavender)] [padding:11px] [border-radius:999px] font-sans [font-weight:600] [font-size:13px] [transition:background_140ms_ease]">
              Manage membership
            </Link>
          </div>

          <div className="[background:var(--color-brand-surface)] [border-radius:24px] [padding:24px]">
            <h3 className="font-sans [font-weight:700] [font-size:16px] [color:var(--color-deep-plum)] [margin:0_0_16px]">
              Next up
            </h3>
            <div className="flex [gap:14px] items-center">
              <div className="flex-none [width:54px] text-center [background:var(--color-cool-teal)] [border-radius:12px] [padding:10px_0]">
                <div className="font-sans [font-weight:700] [font-size:10px] [letter-spacing:0.1em] uppercase [color:var(--color-hot-magenta)]">
                  MAR
                </div>
                <div className="font-sans [font-weight:700] [font-size:22px] [color:var(--color-deep-plum)] [line-height:1] [margin-top:2px]">
                  02
                </div>
              </div>
              <div>
                <div className="[font-size:14px] [font-weight:600] [color:var(--color-deep-plum)] [line-height:1.3]">
                  Forty-Nothing, read live
                </div>
                <div className="[font-size:12px] [color:var(--color-plum-muted)] [margin-top:3px]">
                  Online · Reader Circle
                </div>
              </div>
            </div>
            <Link href="/events" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] inline-block [margin-top:16px] font-sans [font-weight:600] [font-size:13px] [color:var(--color-plum-copy)]">
              All events
            </Link>
          </div>
        </aside>
      </div>
    </main>);
}
