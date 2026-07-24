"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookCover } from "@/components/ui";
import { readingPaths, mostRead, essays, audiobooks, shortReads, series, } from "@/lib/data";
const chips = [
    { key: "all", label: "All" },
    { key: "serials", label: "Serials" },
    { key: "essays", label: "Essays" },
    { key: "books", label: "Books" },
    { key: "shorts", label: "Short Reads" },
    { key: "audio", label: "Audio" },
] as const;
export default function ReadPage() {
    const router = useRouter();
    const [readFilter, setReadFilter] = useState<string>("all");
    const showSerial = readFilter === "all" || readFilter === "serials";
    const showStart = readFilter === "all" || readFilter === "books";
    const showMost = readFilter === "all" || readFilter === "books";
    const showBacklist = readFilter === "all" || readFilter === "books";
    const showEssays = readFilter === "all" || readFilter === "essays";
    const showAudio = readFilter === "all" || readFilter === "audio";
    const showShorts = readFilter === "all" || readFilter === "shorts";
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:1240px] [margin:0_auto] [padding:56px_40px]">
      <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
        The Library
      </div>
      <h1 className="font-sans [font-weight:700] [font-size:56px] [letter-spacing:-0.03em] [color:var(--color-deep-plum)] [margin:0_0_12px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
        Read
      </h1>
      <p className="[font-size:18px] [color:var(--color-plum-copy)] [max-width:600px] [margin:0_0_28px] text-pretty">
        The serials, the essays, and the whole backlist. Everything that used
        to live only on Substack now starts here.
      </p>
      <div className="mb-10 flex flex-wrap gap-2.5">
        {chips.map((chip) => {
            const active = readFilter === chip.key;
            return (<button type="button" key={chip.key} onClick={() => setReadFilter(chip.key)} className={`min-h-[46px] rounded-full px-4 py-[9px] font-sans text-[13px] font-semibold transition-colors duration-200 ${active ? "bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)]" : "bg-[var(--color-brand-surface)] text-[var(--color-deep-plum)]"}`}>
              {chip.label}
            </button>);
        })}
      </div>

      {showSerial && (<div className="[background:var(--color-cool-teal)] [border-radius:32px] [padding:40px] grid [grid-template-columns:200px_1fr] [gap:36px] items-center [margin-bottom:56px] max-[900px]:grid-cols-1">
          <button type="button" aria-label="Read Forty-Nothing" onClick={() => router.push("/serial")} className="transition duration-200 ease-out hover:-translate-y-1 hover:-rotate-1 cursor-pointer [width:200px] [height:292px] [border-radius:2px] [box-shadow:0_32px_44px_-22px_rgba(53,5,73,0.38),0_14px_22px_-10px_rgba(53,5,73,0.20)] [background:linear-gradient(160deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_100%)] [padding:20px_16px] flex flex-col justify-between">
            <div className="font-sans [font-size:10px] [letter-spacing:0.14em] uppercase [color:rgba(196,185,203,0.78)] [font-weight:700]">
              Nia Forrester
            </div>
            <div className="font-serif [font-weight:500] [font-size:30px] [color:var(--color-soft-lavender)] [line-height:1.04]">
              Forty-Nothing
            </div>
          </button>
          <div>
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.14em] uppercase [color:var(--color-deep-plum)]">
              Current serial · Second-chance romance
            </div>
            <h2 className="font-serif [font-weight:500] [font-size:36px] [color:var(--color-deep-plum)] [margin:10px_0_12px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Forty-Nothing
            </h2>
            <p className="[font-size:15px] [line-height:1.6] [color:rgba(53,5,73,0.78)] [margin:0_0_20px] [max-width:520px] text-pretty">
              A new chapter every week. Norah built a careful life after Luke
              walked out — until the doorbell rings six years later. Read it as
              it unfolds, and argue about it in the margins.
            </p>
            <div className="flex [gap:12px] items-center flex-wrap">
              <button type="button" onClick={() => router.push("/serial")} className="[background:var(--color-deep-plum)] [color:var(--color-brand-surface)] [padding:13px_22px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
                Open the reader ↗
              </button>
              <span className="font-sans [font-size:13px] [color:rgba(53,5,73,0.7)]">
                11 chapters live
              </span>
            </div>
          </div>
        </div>)}

      {showStart && (<>
          <div className="[margin-bottom:22px]">
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
              Not sure where to begin?
            </div>
            <h2 className="font-sans [font-weight:700] [font-size:34px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:8px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Start Here
            </h2>
          </div>
          <div className="mb-14 grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-1">
            {readingPaths.map((p) => (<button type="button" key={p.title} onClick={() => router.push("/serial")} className="flex cursor-pointer items-center gap-[18px] rounded-3xl bg-[var(--color-brand-surface)] p-6 text-left shadow-[0_4px_12px_rgba(53,5,73,0.06)] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl max-[640px]:items-start max-[640px]:gap-4 max-[640px]:p-[18px]">
                <BookCover title={p.title} gradient={p.gradient} size="path"/>
                <div className="min-w-0 flex-1">
                  <div className="font-sans [font-weight:700] [font-size:10px] [letter-spacing:0.1em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:6px]">
                    {p.eyebrow}
                  </div>
                  <h3 className="break-words font-sans [font-weight:700] [font-size:18px] [line-height:1.2] [letter-spacing:-0.01em] [color:var(--color-deep-plum)] [margin:0_0_6px]">
                    {p.title}
                  </h3>
                  <p className="[font-size:13px] [line-height:1.5] [color:var(--color-plum-copy)] [margin:0_0_8px] text-pretty">
                    {p.desc}
                  </p>
                  <div className="font-sans [font-size:11px] [letter-spacing:0.06em] uppercase [color:var(--color-plum-muted)] [font-weight:600]">
                    {p.meta}
                  </div>
                </div>
              </button>))}
          </div>
        </>)}

      {showMost && (<div className="mb-14 rounded-[32px] bg-[var(--color-brand-surface)] px-10 py-9 max-[640px]:px-6 max-[640px]:py-[30px]">
          <div className="flex items-end justify-between [margin-bottom:24px]">
            <div>
              <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
                Trending in the Circle
              </div>
              <h2 className="font-sans [font-weight:700] [font-size:30px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:8px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
                Most Read This Month
              </h2>
            </div>
          </div>
          <div className="flex flex-col">
            {mostRead.map((m) => (<Link href={m.href} aria-label={`View ${m.title}`} className="group flex items-center gap-5 border-t border-[rgba(53,5,73,0.08)] py-3.5 transition-colors duration-150 hover:bg-white/30 focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-hot-magenta)] max-[640px]:grid max-[640px]:grid-cols-[32px_40px_minmax(0,1fr)] max-[640px]:gap-3" key={m.rank}>
                <span className="w-10 flex-none font-sans text-2xl font-bold tracking-[-0.02em] text-[var(--color-plum-faint)] max-[640px]:w-8 max-[640px]:text-xl">
                  {m.rank}
                </span>
                <div className={`h-[58px] w-10 flex-none rounded-[2px] shadow-sm ${m.gradient}`}></div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans [font-weight:700] [font-size:17px] [letter-spacing:-0.01em] [color:var(--color-deep-plum)]">
                    {m.title}
                  </div>
                  <div className="font-sans [font-size:12px] [letter-spacing:0.04em] [color:var(--color-plum-muted)] [margin-top:2px]">
                    {m.meta}
                  </div>
                </div>
                <span className="flex flex-none items-center gap-2 font-sans text-[13px] font-semibold text-[var(--color-plum-copy)] transition-colors group-hover:text-[var(--color-hot-magenta)] max-[640px]:col-start-3 max-[640px]:text-xs">
                  View details
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>))}
          </div>
        </div>)}

      {showEssays && (<>
          <div className="flex items-end justify-between [margin-bottom:22px]">
            <div>
              <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
                She Who Writes Herself
              </div>
              <h2 className="font-sans [font-weight:700] [font-size:34px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:8px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
                Essays &amp; Commentary
              </h2>
            </div>
          </div>
          <div className="grid [grid-template-columns:repeat(2,1fr)] [gap:18px] [margin-bottom:56px] max-[900px]:grid-cols-1">
            {essays.map((e) => (<article key={e.title} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl cursor-pointer [background:var(--color-brand-surface)] [border-radius:22px] [padding:26px] [box-shadow:0_4px_12px_rgba(53,5,73,0.06)]">
                <div className="flex justify-between items-center [margin-bottom:12px]">
                  <span className="font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-hot-magenta)] [font-weight:700]">
                    {e.tag}
                  </span>
                  <span className="font-sans [font-size:11px] [letter-spacing:0.06em] uppercase [color:var(--color-plum-muted)]">
                    {e.date}
                  </span>
                </div>
                <h3 className="font-sans [font-weight:700] [font-size:22px] [line-height:1.18] [letter-spacing:-0.015em] [color:var(--color-deep-plum)] [margin:0_0_10px]">
                  {e.title}
                </h3>
                <p className="[font-size:14px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0px] text-pretty">
                  {e.excerpt}
                </p>
              </article>))}
          </div>
        </>)}

      {showAudio && (<>
          <div className="flex items-end justify-between [margin-bottom:22px]">
            <div>
              <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-cool-teal)]">
                Listen
              </div>
              <h2 className="font-sans [font-weight:700] [font-size:34px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:8px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
                Audiobooks &amp; Audio Exclusives
              </h2>
            </div>
            <span className="font-sans [font-size:13px] [color:var(--color-plum-muted)]">
              Full-length titles on Amazon and other platforms · select short
              audio exclusives here and on Allan&apos;s site
            </span>
          </div>
          <div className="snap-x snap-proximity overscroll-x-contain touch-pan-x [&>*]:snap-start flex [gap:20px] overflow-x-auto [padding-bottom:12px] [margin-bottom:56px]">
            {audiobooks.map((a) => (<div key={a.title} className="flex-none [width:150px]">
                <div className={`relative flex size-[150px] flex-col justify-between overflow-hidden rounded-[14px] p-3.5 shadow-[0_32px_44px_-22px_rgba(53,5,73,0.38),0_14px_22px_-10px_rgba(53,5,73,0.20)] transition duration-200 ease-out hover:-translate-y-1 hover:-rotate-1 ${a.gradient}`}>
                  <div className="font-sans [font-size:8px] [letter-spacing:0.12em] uppercase [color:rgba(196,185,203,0.8)] [font-weight:600]">
                    Nia Forrester
                  </div>
                  <div className="font-serif [font-weight:500] [font-size:18px] [line-height:1.05] [color:var(--color-soft-lavender)]">
                    {a.title}
                  </div>
                  <div className="absolute [top:12px] [right:12px] [width:30px] [height:30px] [border-radius:999px] [background:rgba(196,185,203,0.92)] flex items-center justify-center [color:var(--color-deep-plum)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="[margin-left:2px]">
                      <path d="M8 5.14v13.72L19 12z"></path>
                    </svg>
                  </div>
                </div>
                <div className="[margin-top:10px] [font-size:13px] [font-weight:600] [color:var(--color-deep-plum)] [line-height:1.25]">
                  {a.title}
                </div>
                <div className="[font-size:12px] [color:var(--color-plum-muted)] [margin-top:2px]">
                  {a.narrator}
                </div>
                <div className="font-sans [font-size:11px] [letter-spacing:0.04em] [color:var(--color-plum-faint)] [margin-top:2px]">
                  {a.duration}
                </div>
              </div>))}
          </div>
        </>)}

      {showShorts && (<>
          <div className="flex items-end justify-between [margin-bottom:22px]">
            <div>
              <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
                An hour or less
              </div>
              <h2 className="font-sans [font-weight:700] [font-size:34px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:8px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
                Short Reads
              </h2>
            </div>
            <span className="font-sans [font-size:13px] [color:var(--color-plum-muted)]">
              Novellas &amp; one-sitting stories
            </span>
          </div>
          <div className="snap-x snap-proximity overscroll-x-contain touch-pan-x [&>*]:snap-start flex [gap:20px] overflow-x-auto [padding-bottom:12px] [margin-bottom:56px]">
            {shortReads.map((b) => (<div key={b.title} className="flex-none [width:132px]">
                <BookCover title={b.title} gradient={b.gradient}/>
                <div className="[margin-top:10px] [font-size:13px] [font-weight:600] [color:var(--color-deep-plum)] [line-height:1.25]">
                  {b.title}
                </div>
                <div className="[font-size:12px] [color:var(--color-plum-muted)] [margin-top:2px]">
                  {b.meta}
                </div>
              </div>))}
          </div>
        </>)}

      {showBacklist && (<>
          <div id="backlist" className="scroll-mt-24 flex items-end justify-between [margin-bottom:22px]">
            <h2 className="font-sans [font-weight:700] [font-size:34px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              The Backlist
            </h2>
            <span className="font-sans [font-size:13px] [color:var(--color-plum-muted)]">
              By series · read order kept intact
            </span>
          </div>
          <div className="flex flex-col [gap:36px]">
            {series.map((s) => (<div key={s.name}>
                <div className="flex items-baseline [gap:12px] [margin-bottom:16px]">
                  <h3 className="font-sans [font-weight:700] [font-size:20px] [letter-spacing:-0.01em] [color:var(--color-deep-plum)] [margin:0px]">
                    {s.name}
                  </h3>
                  <span className="font-sans [font-size:12px] [letter-spacing:0.06em] uppercase [color:var(--color-plum-muted)]">
                    {s.tag}
                  </span>
                </div>
                <div className="snap-x snap-proximity overscroll-x-contain touch-pan-x [&>*]:snap-start flex [gap:20px] overflow-x-auto [padding-bottom:12px]">
                  {s.books.map((b) => (<div key={b.title} className="flex-none [width:132px]">
                      <BookCover title={b.title} gradient={b.gradient}/>
                      <div className="[margin-top:10px] [font-size:13px] [font-weight:600] [color:var(--color-deep-plum)] [line-height:1.25]">
                        {b.title}
                      </div>
                      <div className="[font-size:12px] [color:var(--color-plum-muted)] [margin-top:2px]">
                        {b.meta}
                      </div>
                    </div>))}
                </div>
              </div>))}
          </div>
        </>)}
      <div className="[margin-top:64px]"></div>
    </main>);
}
