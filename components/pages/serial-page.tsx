"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chapterTitles, reactions } from "@/lib/data";
import { useAuth } from "@/components/auth-context";
const progressWidths = ["w-[8.333%]", "w-[16.667%]", "w-1/4", "w-1/3", "w-[41.667%]", "w-1/2", "w-[58.333%]", "w-2/3", "w-3/4", "w-[83.333%]", "w-[91.667%]", "w-full"] as const;
export default function SerialPage({ initialChapter = 11 }: {
    initialChapter?: number;
}) {
    const router = useRouter();
    const { authed, configured } = useAuth();
    const [chapter, setChapter] = useState(initialChapter);
    const writeChapter = (next: number) => {
        setChapter(next);
        if (!authed || !configured)
            return;
        void fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                slug: "forty-nothing",
                chapterNumber: next,
                percent: Math.round((next / 12) * 100),
            }),
        }).catch(() => undefined);
    };
    const currentChapterTitle = chapterTitles[chapter - 1];
    const prevChapter = () => writeChapter(Math.max(1, chapter - 1));
    const nextChapter = () => writeChapter(Math.min(11, chapter + 1));
    const chapters = chapterTitles.map((title, i) => {
        const n = i + 1;
        const isCur = n === chapter;
        const done = n < chapter;
        return {
            label: String(n).padStart(2, "0"),
            title,
            locked: false,
            isCur,
            done,
        };
    });
    chapters.push({
        label: "✦",
        title: "Luke's POV (bonus)",
        locked: true,
        isCur: false,
        done: false,
    });
    return (<main className="mx-auto max-w-[1240px] px-10 pb-16 pt-8 max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:pb-14 max-[640px]:pt-6">
      <button type="button" onClick={() => router.push("/read")} className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:13px] [color:var(--color-plum-copy)] [margin-bottom:24px]">
        ← Back to Read
      </button>
      <div className="grid grid-cols-[240px_1fr_280px] items-start gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <aside className="sticky top-[90px] max-[900px]:static max-[900px]:rounded-3xl max-[900px]:bg-[var(--color-brand-surface)] max-[900px]:p-6 max-[640px]:p-5">
          <div className="font-serif [font-size:24px] [color:var(--color-deep-plum)] [margin-bottom:4px]">
            Forty-Nothing
          </div>
          <div className="font-sans [font-size:12px] [letter-spacing:0.06em] uppercase [color:var(--color-plum-muted)] [margin-bottom:18px]">
            Nia Forrester
          </div>
          <div className="[height:6px] [border-radius:999px] [background:var(--color-brand-surface)] overflow-hidden [margin-bottom:8px]">
            <div className={`h-full bg-[var(--color-hot-magenta)] ${progressWidths[Math.min(chapter, 12) - 1]}`}></div>
          </div>
          <div className="font-sans [font-size:12px] [color:var(--color-plum-muted)] [margin-bottom:20px]">
            {chapter} of 12 chapters read
          </div>
          <div className="flex max-h-[50vh] flex-col gap-0.5 overflow-y-auto max-[900px]:max-h-none max-[900px]:flex-row max-[900px]:overflow-x-auto max-[900px]:overflow-y-hidden max-[900px]:px-0.5 max-[900px]:pb-3 max-[640px]:[&>div]:basis-[164px]">
            {chapters.map((c) => (<div key={c.label} className={`flex items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] max-[900px]:basis-[180px] max-[900px]:flex-none ${c.isCur ? "bg-[var(--color-cool-teal)]" : "bg-transparent"}`}>
                <span className={`w-[18px] text-center font-sans text-[11px] font-semibold ${c.isCur || c.locked ? "text-[var(--color-hot-magenta)]" : "text-[var(--color-plum-muted)]"}`}>
                  {c.label}
                </span>
                <span className={`flex-1 text-[13px] leading-[1.3] ${c.isCur ? "font-bold text-[var(--color-deep-plum)]" : c.done || c.locked ? "font-medium text-[var(--color-plum-muted)]" : "font-medium text-[var(--color-deep-plum)]"}`}>
                  {c.title}
                </span>
                {c.locked && (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none [color:var(--color-plum-faint)]">
                    <rect width="18" height="11" x="3" y="11" rx="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>)}
              </div>))}
          </div>
        </aside>

        <article className="max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[68ch]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:10px]">
            Chapter {chapter}
          </div>
          <h1 className="font-serif [font-weight:500] [font-size:44px] [line-height:1.08] [color:var(--color-deep-plum)] [margin:0_0_28px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            {currentChapterTitle}
          </h1>
          <div className="max-w-[62ch] text-[19px] leading-[1.75] text-[var(--color-deep-plum)] max-[640px]:text-[17px] max-[640px]:leading-[1.72]">
            <p className="[margin:0_0_22px] text-pretty">
              <span className="[float:left] font-serif [font-style:italic] [font-weight:500] [font-size:58px] [line-height:0.82] [padding:6px_12px_0_0] [color:var(--color-deep-plum)]">
                T
              </span>
              he doorbell rang at 9:14 on a Tuesday, and Norah knew — the way you
              know weather, the way you know your own name — exactly who it was
              before she crossed the room.
            </p>
            <p className="[margin:0_0_22px] text-pretty">
              Six years. She had built a whole life in six years. A life with
              edges she had sanded smooth herself, a life that did not require
              explanation or apology, a life that fit. And now the bell, and
              behind it the shape of a man she had loved enough to ruin herself
              over, standing on her step like he had any right to the air on
              this side of the door.
            </p>
            <p className="[margin:0_0_22px] text-pretty">
              &ldquo;Don&rsquo;t,&rdquo; she said, before he could speak. Not{" "}
              <em className="font-serif [font-style:italic]">
                go away.
              </em>{" "}
              Not{" "}
              <em className="font-serif [font-style:italic]">
                how dare you.
              </em>{" "}
              Just — don&rsquo;t. Don&rsquo;t undo the thing I spent six years
              constructing with my bare hands.
            </p>
            <p className="[margin:0_0_22px] text-pretty">
              Luke had the grace, at least, to look like a man who understood he
              was asking for something he had not earned. He held nothing. No
              flowers, no speech, no ring returned in a velvet box. Only his
              hands, open at his sides, and the particular silence of someone
              who has rehearsed every word and decided, at the threshold, to
              abandon all of them.
            </p>
            <p className="[margin:0_0_22px] text-pretty">
              &ldquo;Norah,&rdquo; he said. And that was the trouble with him.
              That had always been the trouble with him. He could put her whole
              name in his mouth like it was the only word he&rsquo;d ever
              learned, and her carefully constructed composure would crack right
              down the middle.
            </p>
          </div>

          <div className="flex items-center justify-between [margin-top:44px] [padding-top:24px] [border-top:1px_solid_rgba(53,5,73,0.08)]">
            <button type="button" onClick={prevChapter} className="[background:var(--color-brand-surface)] [color:var(--color-deep-plum)] [padding:12px_20px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
              ← Previous
            </button>
            <div className="flex items-center [gap:10px] [color:var(--color-plum-muted)]">
              <span className="[font-size:13px] font-sans">
                Reading time ~6 min
              </span>
            </div>
            <button type="button" onClick={nextChapter} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:12px_20px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
              Next chapter →
            </button>
          </div>

          <div className="[margin-top:32px] [background:var(--color-deep-plum)] [border-radius:24px] [padding:28px_32px] flex items-center [gap:24px]">
            <div>
              <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-cool-teal)] [margin-bottom:8px]">
                Bonus chapter · Inner Circle
              </div>
              <h3 className="font-serif [font-weight:500] [font-size:22px] [color:var(--color-soft-lavender)] [margin:0_0_6px]">
                Luke&rsquo;s POV — the drive over
              </h3>
              <p className="[font-size:14px] [color:rgba(196,185,203,0.75)] [margin:0px] text-pretty">
                What was going through his head on the six-hour drive. Members
                read it first.
              </p>
            </div>
            <button type="button" onClick={() => router.push("/membership")} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 flex-none [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:13px_22px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
              Unlock ↗
            </button>
          </div>
        </article>

        <aside className="sticky top-[90px] flex flex-col gap-6 max-[900px]:static max-[900px]:grid max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          <div className="[background:var(--color-cool-teal)] [border-radius:20px] [padding:22px]">
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-deep-plum)] [margin-bottom:10px]">
              From Nia
            </div>
            <p className="font-serif [font-style:italic] [font-size:15px] [line-height:1.55] [color:var(--color-deep-plum)] [margin:0px] text-pretty">
              &ldquo;I rewrote this doorbell six times. The version where she
              doesn&rsquo;t open it is in a drawer. Maybe one day.&rdquo;
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between [margin-bottom:14px]">
              <h3 className="font-sans [font-weight:600] [font-size:18px] [color:var(--color-deep-plum)] [margin:0px]">
                In the margins
              </h3>
              <span className="font-sans [font-size:12px] [color:var(--color-hot-magenta)] [font-weight:600]">
                48
              </span>
            </div>
            {reactions.map((r) => (<div key={r.initials} className="flex [gap:12px] [padding:12px_0] [border-bottom:1px_solid_rgba(53,5,73,0.08)]">
                <div className={`flex size-9 flex-none items-center justify-center rounded-full border-2 border-[var(--color-cool-teal)] font-sans text-[13px] font-semibold text-[var(--color-soft-lavender)] ${r.color}`}>
                  {r.initials}
                </div>
                <div>
                  <div className="[font-size:13px] [font-weight:600] [color:var(--color-deep-plum)] [margin-bottom:2px]">
                    {r.name}
                  </div>
                  <div className="font-serif [font-style:italic] [font-size:13px] [line-height:1.5] [color:var(--color-plum-copy)]">
                    &ldquo;{r.quote}&rdquo;
                  </div>
                </div>
              </div>))}
            <button type="button" onClick={() => router.push("/community")} className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] [margin-top:14px] font-sans [font-weight:600] [font-size:13px] [color:var(--color-plum-copy)]">
              Join the discussion
            </button>
          </div>
        </aside>
      </div>
    </main>);
}
