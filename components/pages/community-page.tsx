import Link from "next/link";
import { Avatar, ImageSlot } from "@/components/ui";
import { communityStats, threads, clubs, circleSessions, reactions, principles, } from "@/lib/data";
export default function CommunityPage() {
    return (<main>
      <section className="[background:var(--color-deep-plum)]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-[1.05fr_0.95fr] items-center gap-14 px-10 py-16 max-[900px]:grid-cols-1 max-[640px]:px-5 max-[640px]:py-12">
          <div>
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:16px]">
              Members only · Connect
            </div>
            <h1 className="font-sans [font-weight:700] [font-size:56px] [letter-spacing:-0.03em] [color:var(--color-soft-lavender)] [margin:0_0_14px] [max-width:16ch] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
              The Reader Circle
            </h1>
            <p className="[font-size:18px] [line-height:1.6] [color:rgba(196,185,203,0.8)] [max-width:560px] [margin:0_0_28px] text-pretty">
              A private home for Black women&apos;s fiction. Discussions, book
              clubs, character debates — the conversations that used to scatter
              across the comments, finally in one room.
            </p>
            <Link href="/membership" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 inline-block [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              Become a member ↗
            </Link>
            <div className="flex items-center [gap:14px] [margin-top:32px]">
              <div className="flex">
                <Avatar initials="TR" color="bg-[var(--color-deep-plum)]" size="sm" className="border-2 border-[var(--color-deep-plum)]"/>
                <Avatar initials="IK" color="bg-[var(--color-hot-magenta)]" size="sm" className="-ml-[9px] border-2 border-[var(--color-deep-plum)]"/>
                <Avatar initials="DW" color="bg-[var(--color-cool-teal)]" size="sm" className="-ml-[9px] border-2 border-[var(--color-deep-plum)] text-[var(--color-deep-plum)]"/>
                <Avatar initials="RB" color="bg-[var(--color-cool-teal)]" size="sm" className="-ml-[9px] border-2 border-[var(--color-deep-plum)] text-[var(--color-deep-plum)]"/>
              </div>
              <span className="font-sans [font-size:13px] [font-weight:500] [color:rgba(196,185,203,0.72)]">
                1,240 readers already in the room
              </span>
            </div>
          </div>
          <div className="relative [padding:16px_16px_0_0]">
            <span className="absolute [top:0px] [right:0px] [left:16px] [bottom:16px] [border-radius:28px] [border:1px_solid_rgba(196,185,203,0.22)]"></span>
            <ImageSlot label="Drop a reader-community photo" className="relative [z-index:1] block w-full [height:380px] [border-radius:28px] [box-shadow:0_28px_56px_-16px_rgba(53,5,73,0.18),0_8px_16px_rgba(53,5,73,0.06)] [background:rgba(103,160,175,0.10)]"/>
            <div className="absolute [left:-24px] [bottom:36px] [z-index:3] [background:var(--color-brand-surface)] [border-radius:16px] [padding:14px_16px] [box-shadow:0_28px_56px_-16px_rgba(53,5,73,0.18),0_8px_16px_rgba(53,5,73,0.06)] [max-width:270px] flex [gap:11px] items-start">
              <Avatar initials="TR" color="bg-[var(--color-deep-plum)]" size="sm" className="size-8"/>
              <div>
                <div className="font-sans [font-weight:600] [font-size:12px] [color:var(--color-deep-plum)]">
                  Tasha R.{" "}
                  <span className="[color:var(--color-plum-faint)] [font-weight:500]">
                    · in Ch. 11
                  </span>
                </div>
                <div className="font-serif [font-style:italic] [font-size:13.5px] [line-height:1.45] [color:var(--color-plum-copy)] [margin-top:3px]">
                  &ldquo;The drawer line. I gasped.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:36px_40px_0]">
        <div className="[border-top:1px_solid_rgba(53,5,73,0.85)] [border-bottom:1px_solid_rgba(53,5,73,0.08)] [padding:26px_6px] grid [grid-template-columns:repeat(4,1fr)] max-[900px]:grid-cols-1">
          {communityStats.map((st) => (<div key={st.label} className="flex items-baseline [gap:12px] [border-left:1px_solid_rgba(53,5,73,0.08)] [padding-left:24px]">
              <span className="font-serif [font-style:italic] [font-weight:500] [font-size:36px] [color:var(--color-deep-plum)] [line-height:1]">
                {st.num}
              </span>
              <span className="font-sans [font-size:11px] [letter-spacing:0.14em] uppercase [color:var(--color-plum-muted)] [font-weight:600]">
                {st.label}
              </span>
            </div>))}
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:56px_40px] grid [grid-template-columns:1.5fr_1fr] [gap:48px] [align-items:start] max-[900px]:grid-cols-1">
        <div>
          <div className="flex items-center justify-between [margin:0_0_18px]">
            <h2 className="font-sans [font-weight:700] [font-size:30px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:0px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Active discussions
            </h2>
            <span className="inline-flex items-center [gap:7px] font-sans [font-weight:600] [font-size:12px] [color:var(--color-plum-muted)]">
              <span className="[width:7px] [height:7px] [border-radius:999px] [background:var(--color-cool-teal)] [animation:nfPulse_2.4s_ease-in-out_infinite]"></span>
              212 online now
            </span>
          </div>
          <div className="[background:var(--color-brand-surface)] [border-radius:22px] [box-shadow:0_1px_2px_rgba(53,5,73,0.04)] overflow-hidden">
            {threads.map((t) => (<article key={t.title} className="flex cursor-pointer items-center gap-[18px] border-t border-[rgba(53,5,73,0.08)] px-6 py-5 transition-colors duration-150 hover:bg-[var(--color-soft-lavender)]/50 max-[640px]:items-start max-[640px]:gap-3 max-[640px]:p-[18px]">
                <Avatar initials={t.initials} color={t.avatarColor}/>
                <div className="[flex:1] [min-width:0px]">
                  <h3 className="font-sans [font-weight:600] [font-size:17px] [line-height:1.3] [color:var(--color-deep-plum)] [margin:0_0_5px]">
                    {t.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--color-plum-muted)] max-[640px]:gap-y-1">
                    <span className="font-sans [font-size:11px] [letter-spacing:0.08em] uppercase [color:var(--color-hot-magenta)] [font-weight:700]">
                      {t.tag}
                    </span>
                    <span className="[width:3px] [height:3px] [border-radius:999px] [background:var(--color-plum-faint)]"></span>
                    <span>{t.author}</span>
                    <span className="[width:3px] [height:3px] [border-radius:999px] [background:var(--color-plum-faint)]"></span>
                    <span>{t.when}</span>
                    {t.pinned && (<span className="inline-flex items-center [gap:4px] font-sans [font-size:10px] [letter-spacing:0.08em] uppercase [color:var(--color-cool-teal)] [font-weight:700]">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 17v5"></path>
                          <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
                        </svg>
                        Pinned
                      </span>)}
                  </div>
                </div>
                <div className="flex-none flex items-center [gap:6px] [color:var(--color-plum-muted)]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                  </svg>
                  <span className="font-sans [font-weight:600] [font-size:14px]">
                    {t.count}
                  </span>
                </div>
              </article>))}
          </div>
        </div>
        <div>
          <h2 className="font-sans [font-weight:700] [font-size:30px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:0_0_18px] [padding-top:5px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            Book clubs
          </h2>
          <div className="flex flex-col [gap:14px]">
            {clubs.map((c) => (<article key={c.name} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl cursor-pointer [border-radius:20px] [box-shadow:0_1px_2px_rgba(53,5,73,0.04)] [background:var(--color-brand-surface)] [padding:20px_22px] flex [gap:16px] items-start">
                <span className={`mt-[5px] size-3 flex-none rounded-full ${c.gradient}`}></span>
                <div className="[flex:1]">
                  <div className="flex items-baseline justify-between [gap:12px]">
                    <h3 className="font-sans [font-weight:700] [font-size:17px] [letter-spacing:-0.01em] [color:var(--color-deep-plum)] [margin:0_0_5px]">
                      {c.name}
                    </h3>
                    <span className="whitespace-nowrap font-sans [font-size:11px] [letter-spacing:0.06em] uppercase [color:var(--color-plum-muted)] [font-weight:600]">
                      {c.members}
                    </span>
                  </div>
                  <p className="[font-size:13.5px] [line-height:1.5] [color:var(--color-plum-copy)] [margin:0px] text-pretty">
                    {c.desc}
                  </p>
                </div>
              </article>))}
            <Link href="/membership" className="transition duration-150 hover:border-[var(--color-plum-copy)] hover:bg-black/5 inline-block text-center [background:transparent] [color:var(--color-deep-plum)] [border:1px_solid_rgba(53,5,73,0.16)] [padding:13px_22px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
              Start a club with membership
            </Link>
          </div>
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:24px_40px_8px]">
        <div className="flex items-end justify-between [margin-bottom:24px]">
          <div>
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
              Live together
            </div>
            <h2 className="font-sans [font-weight:700] [font-size:30px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:8px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              This week in the Circle
            </h2>
          </div>
          <Link href="/events" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-plum-copy)]">
            All events
          </Link>
        </div>
        <div className="grid [grid-template-columns:repeat(3,1fr)] [gap:18px] max-[900px]:grid-cols-1">
          {circleSessions.map((s) => (<Link key={s.title} href="/events" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl cursor-pointer [background:var(--color-brand-surface)] [border-radius:22px] [padding:24px] [box-shadow:0_4px_12px_rgba(53,5,73,0.06)] flex [gap:18px] items-start">
              <div className="flex-none [width:58px] text-center [background:var(--color-cool-teal)] [border-radius:14px] [padding:10px_0]">
                <div className={`font-sans text-[11px] font-bold uppercase tracking-[0.1em] ${s.accent}`}>
                  {s.mon}
                </div>
                <div className="font-sans [font-weight:700] [font-size:24px] [color:var(--color-deep-plum)] [line-height:1] [margin-top:2px]">
                  {s.day}
                </div>
              </div>
              <div className="[flex:1]">
                <div className={`mb-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.1em] ${s.accent}`}>
                  {s.type}
                </div>
                <h3 className="font-sans [font-weight:600] [font-size:17px] [line-height:1.25] [color:var(--color-deep-plum)] [margin:0_0_8px]">
                  {s.title}
                </h3>
                <div className="font-sans [font-size:12px] [letter-spacing:0.04em] [color:var(--color-plum-muted)]">
                  {s.where} · {s.host}
                </div>
              </div>
            </Link>))}
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:56px_40px_24px]">
        <div className="text-center [max-width:600px] [margin:0_auto_36px]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            From the margins
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(30px,3.4vw,40px)] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0px] [line-height:1.06] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            What the Circle is saying right now
          </h2>
        </div>
        <div className="grid [grid-template-columns:repeat(3,1fr)] [gap:20px] max-[900px]:grid-cols-1">
          {reactions.map((r) => (<article key={r.name} className="[border-top:2px_solid_rgba(53,5,73,0.85)] [padding:26px_6px_0] flex flex-col [gap:20px]">
              <p className="font-serif [font-style:italic] [font-weight:500] [font-size:19px] [line-height:1.55] [color:var(--color-deep-plum)] [margin:0px] [flex:1] text-pretty">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center [gap:12px]">
                <Avatar initials={r.initials} color={r.color} className="text-sm"/>
                <div className="font-sans [font-weight:600] [font-size:15px] [color:var(--color-deep-plum)]">
                  {r.name}
                </div>
              </div>
            </article>))}
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:40px_40px_64px]">
        <div className="[background:var(--color-cool-teal)] [border-radius:36px] [padding:clamp(36px,4vw,52px)]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-deep-plum)] [margin-bottom:8px]">
            House rules
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(28px,3.2vw,36px)] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_32px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            How we read together
          </h2>
          <div className="grid [grid-template-columns:repeat(3,1fr)] [gap:32px] max-[900px]:grid-cols-1">
            {principles.map((p) => (<div key={p.num}>
                <div className="font-serif [font-style:italic] [font-weight:500] [font-size:34px] [color:var(--color-hot-magenta)] [line-height:1] [margin-bottom:14px]">
                  {p.num}
                </div>
                <h3 className="font-sans [font-weight:700] [font-size:19px] [letter-spacing:-0.01em] [color:var(--color-deep-plum)] [margin:0_0_8px]">
                  {p.title}
                </h3>
                <p className="[font-size:14px] [line-height:1.6] [color:rgba(53,5,73,0.72)] [margin:0px] text-pretty">
                  {p.desc}
                </p>
              </div>))}
          </div>
        </div>
      </section>
    </main>);
}
