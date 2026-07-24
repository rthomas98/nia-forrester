"use client";
import { useState } from "react";
import Link from "next/link";
import { tiers, tierPrice, compareGroups, compareTiers, memberVoices, faqs, } from "@/lib/data";
const billingButton = "min-h-[46px] rounded-full px-[22px] py-[9px] font-sans text-sm font-semibold transition duration-200";
const tierVisuals = [
    {
        card: "border border-[rgba(53,5,73,0.08)] bg-[var(--color-brand-surface)] shadow-sm",
        label: "text-[var(--color-deep-plum)]",
        price: "text-[var(--color-deep-plum)]",
        per: "text-[var(--color-plum-muted)]",
        desc: "text-[var(--color-plum-copy)]",
        cta: "border border-[rgba(53,5,73,0.16)] bg-transparent text-[var(--color-deep-plum)]",
        feature: "text-[var(--color-plum-copy)]",
        check: "text-[var(--color-cool-teal)]",
    },
    {
        card: "border border-transparent bg-[var(--color-cool-teal)] shadow-md",
        label: "text-[var(--color-deep-plum)]",
        price: "text-[var(--color-deep-plum)]",
        per: "text-[rgba(53,5,73,0.6)]",
        desc: "text-[rgba(53,5,73,0.78)]",
        cta: "border border-[var(--color-deep-plum)] bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)]",
        feature: "text-[rgba(53,5,73,0.82)]",
        check: "text-[var(--color-hot-magenta)]",
    },
    {
        card: "border border-transparent bg-[var(--color-deep-plum)] shadow-xl",
        label: "text-[var(--color-cool-teal)]",
        price: "text-[var(--color-brand-surface)]",
        per: "text-[rgba(196,185,203,0.6)]",
        desc: "text-[rgba(196,185,203,0.78)]",
        cta: "border border-[var(--color-hot-magenta)] bg-[var(--color-hot-magenta)] text-[var(--color-brand-surface)]",
        feature: "text-[rgba(196,185,203,0.86)]",
        check: "text-[var(--color-hot-magenta)]",
    },
    {
        card: "border border-[rgba(53,5,73,0.08)] bg-[var(--color-brand-surface)] shadow-sm",
        label: "text-[var(--color-deep-plum)]",
        price: "text-[var(--color-deep-plum)]",
        per: "text-[var(--color-plum-muted)]",
        desc: "text-[var(--color-plum-copy)]",
        cta: "border border-[var(--color-deep-plum)] bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)]",
        feature: "text-[var(--color-plum-copy)]",
        check: "text-[var(--color-cool-teal)]",
    },
] as const;
export default function MembershipPage() {
    const [annual, setAnnual] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:1240px] [margin:0_auto] [padding:56px_40px_64px]">
      <div className="text-center [max-width:680px] [margin:0_auto_44px]">
        <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:16px]">
          One login · one subscription
        </div>
        <h1 className="font-sans [font-weight:700] [font-size:clamp(40px,5vw,60px)] [letter-spacing:-0.03em] [color:var(--color-deep-plum)] [margin:0_0_16px] [line-height:1.02] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
          Find your seat in the Circle
        </h1>
        <p className="[font-size:18px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0px] text-pretty">
          From free reader to working writer. Every tier includes everything below it — upgrade or
          cancel any time.
        </p>
        <div className="mt-7 inline-flex max-w-full items-center gap-1 rounded-full bg-[var(--color-brand-surface)] p-[5px] shadow-sm">
          <button type="button" onClick={() => setAnnual(false)} className={`${billingButton} ${!annual ? "bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)] shadow-md" : "bg-transparent text-[var(--color-plum-copy)]"}`}>
            Monthly
          </button>
          <button type="button" onClick={() => setAnnual(true)} className={`${billingButton} flex items-center gap-2 ${annual ? "bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)] shadow-md" : "bg-transparent text-[var(--color-plum-copy)]"}`}>
            Annual{" "}
            <span className="[font-size:10px] [letter-spacing:0.08em] uppercase [font-weight:700] [color:var(--color-deep-plum)] [background:var(--color-cool-teal)] [padding:2px_7px] [border-radius:999px]">
              2 months free
            </span>
          </button>
        </div>
      </div>

      <div className="grid [grid-template-columns:repeat(4,1fr)] [gap:18px] [align-items:start] max-[900px]:grid-cols-1">
        {tiers.map((t, tierIndex) => {
            const { price, per, note } = tierPrice(t.monthly, annual);
            const visuals = tierVisuals[tierIndex];
            return (<div key={t.name} className={`flex min-h-[520px] flex-col rounded-[26px] px-[26px] py-[30px] ${visuals.card}`}>
              <div className="flex items-center [gap:8px] [margin-bottom:6px]">
                <div className={`font-sans text-sm font-bold uppercase tracking-[0.04em] ${visuals.label}`}>
                  {t.name}
                </div>
                {t.featured && (<span className="font-sans [font-weight:700] [font-size:10px] [letter-spacing:0.1em] uppercase [color:var(--color-brand-surface)] [background:var(--color-hot-magenta)] [padding:3px_8px] [border-radius:999px]">
                    Popular
                  </span>)}
              </div>
              <div className="flex items-baseline [gap:5px] [margin:14px_0_4px]">
                <span className={`font-sans text-[44px] font-bold tracking-[-0.03em] ${visuals.price}`}>
                  {price}
                </span>
                <span className={`text-sm ${visuals.per}`}>{per}</span>
              </div>
              {note && (<div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.08em] uppercase [color:var(--color-hot-magenta)] [min-height:14px]">
                  {note}
                </div>)}
              <p className={`mb-[22px] mt-2 min-h-11 text-sm leading-normal ${visuals.desc}`}>
                {t.desc}
              </p>
              <Link href={`/signup?tier=${encodeURIComponent(t.name)}`} className={`mb-6 w-full rounded-full p-[13px] text-center font-sans text-sm font-semibold transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${visuals.cta}`}>
                {t.cta}
              </Link>
              <div className="flex flex-col [gap:12px]">
                {t.features.map((f) => (<div key={f} className="flex [gap:10px] items-start">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`mt-[3px] flex-none ${visuals.check}`}>
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span className={`text-[13px] leading-normal ${visuals.feature}`}>{f}</span>
                  </div>))}
              </div>
            </div>);
        })}
      </div>

      <p className="text-center font-sans [font-size:13px] [color:var(--color-plum-muted)] [margin:32px_0_0] text-pretty">
        Free forever on the base tier · cancel in one click · readers keep access to everything
        they&apos;ve unlocked
      </p>

      {/* COMPARISON TABLE */}
      <section className="[margin-top:96px]">
        <div className="text-center [max-width:600px] [margin:0_auto_40px]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            Compare every tier
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(30px,3.4vw,40px)] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0px] [line-height:1.06] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            Everything, side by side
          </h2>
        </div>
        <div className="[background:var(--color-brand-surface)] [border-radius:28px] [box-shadow:0_4px_12px_rgba(53,5,73,0.06)] overflow-hidden">
          <div className="grid [grid-template-columns:minmax(0,1.7fr)_repeat(4,1fr)] [align-items:end] [padding:26px_30px_20px] max-[900px]:grid-cols-1">
            <div></div>
            {compareTiers.map((ct) => (<div key={ct.name} className="text-center">
                {ct.highlight ? (<span className="inline-block font-sans [font-weight:700] [font-size:14px] [letter-spacing:0.02em] [color:var(--color-brand-surface)] [background:var(--color-hot-magenta)] [padding:5px_14px] [border-radius:999px]">
                    {ct.name}
                  </span>) : (<span className="font-sans [font-weight:700] [font-size:14px] [letter-spacing:0.02em] [color:var(--color-deep-plum)]">
                    {ct.name}
                  </span>)}
              </div>))}
          </div>
          {compareGroups.map((g) => (<div key={g.group}>
              <div className="[padding:18px_30px_8px] font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-plum-muted)] [background:rgba(53,5,73,0.025)]">
                {g.group}
              </div>
              {g.rows.map((r) => (<div key={r.feat} className="grid [grid-template-columns:minmax(0,1.7fr)_repeat(4,1fr)] items-center [padding:13px_30px] [border-top:1px_solid_rgba(53,5,73,0.08)] max-[900px]:grid-cols-1">
                  <div className="[font-size:14px] [color:var(--color-deep-plum)] [font-weight:500]">
                    {r.feat}
                  </div>
                  {r.cells.map((c, i) => (<div key={`${r.feat}-${compareTiers[i].name}`} className="text-center">
                      {"yes" in c && (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="[color:var(--color-hot-magenta)] [vertical-align:middle]">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>)}
                      {"no" in c && (<span className="[color:var(--color-plum-faint)] [font-size:16px]">—</span>)}
                      {"text" in c && (<span className="font-sans [font-weight:700] [font-size:12px] [letter-spacing:0.02em] [color:var(--color-cool-teal)]">
                          {c.label}
                        </span>)}
                    </div>))}
                </div>))}
            </div>))}
        </div>
      </section>

      {/* MEMBER VOICES */}
      <section className="[margin-top:96px]">
        <div className="text-center [max-width:600px] [margin:0_auto_40px]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            From the Circle
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(30px,3.4vw,40px)] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0px] [line-height:1.06] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            What members say
          </h2>
        </div>
        <div className="grid [grid-template-columns:repeat(3,1fr)] [gap:20px] max-[900px]:grid-cols-1">
          {memberVoices.map((m, voiceIndex) => (<article key={m.name} className="[border-top:2px_solid_rgba(53,5,73,0.85)] [padding:26px_6px_0] flex flex-col [gap:20px]">
              <div className="font-serif [font-style:italic] [font-size:52px] [color:var(--color-hot-magenta)] [line-height:0.5] [height:22px]">
                &ldquo;
              </div>
              <p className="font-serif [font-style:italic] [font-weight:500] [font-size:19px] [line-height:1.55] [color:var(--color-deep-plum)] [margin:0px] [flex:1] text-pretty">
                {m.quote}
              </p>
              <div className="flex items-center [gap:12px]">
                <div className={`flex size-11 flex-none items-center justify-center rounded-full font-sans text-[17px] font-bold ${voiceIndex === 1 ? "bg-[var(--color-cool-teal)] text-[var(--color-deep-plum)]" : voiceIndex === 0 ? "bg-[var(--color-hot-magenta)] text-[var(--color-brand-surface)]" : "bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)]"}`}>
                  {m.initial}
                </div>
                <div>
                  <div className="font-sans [font-weight:600] [font-size:15px] [color:var(--color-deep-plum)]">
                    {m.name}
                  </div>
                  <div className="font-sans [font-size:11px] [letter-spacing:0.06em] uppercase [color:var(--color-plum-muted)] [font-weight:600]">
                    {m.role}
                  </div>
                </div>
              </div>
            </article>))}
        </div>
      </section>

      {/* GIFT A MEMBERSHIP */}
      <section className="[margin-top:96px] [background:var(--color-deep-plum)] [border-radius:36px] [padding:clamp(40px,5vw,64px)] grid [grid-template-columns:1.05fr_0.95fr] [gap:48px] items-center max-[900px]:grid-cols-1">
        <div>
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:16px]">
            Gift a membership
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(30px,3.6vw,44px)] [letter-spacing:-0.03em] [color:var(--color-soft-lavender)] [margin:0_0_14px] [line-height:1.04] [max-width:14ch] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            Give someone a year in the Circle
          </h2>
          <p className="[font-size:17px] [line-height:1.6] [color:rgba(196,185,203,0.8)] [margin:0_0_28px] [max-width:46ch] text-pretty">
            For the reader who has every book on her shelf and still wants more — twelve months of
            serials, bonus chapters, and the book club, wrapped and ready to send.
          </p>
          <button type="button" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_28px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
            Gift a membership ↗
          </button>
        </div>
        <div className="flex justify-center">
          <div className="[width:300px] [background:linear-gradient(155deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_100%)] [border-radius:20px] [padding:30px] [box-shadow:0_28px_56px_-16px_rgba(53,5,73,0.18),0_8px_16px_rgba(53,5,73,0.06)] [transform:rotate(-2deg)]">
            <div className="flex items-center justify-between [margin-bottom:36px]">
              <span className="font-sans [font-weight:700] [font-size:13px] [letter-spacing:0.1em] uppercase [color:var(--color-cool-teal)]">
                Stiletto Press
              </span>
              <span className="font-serif [font-style:italic] [font-size:20px] [color:var(--color-soft-lavender)]">
                SP
              </span>
            </div>
            <div className="font-serif [font-style:italic] [font-weight:500] [font-size:26px] [color:var(--color-soft-lavender)] [line-height:1.1] [margin-bottom:6px]">
              The Reader Circle
            </div>
            <div className="font-sans [font-size:12px] [letter-spacing:0.1em] uppercase [color:rgba(196,185,203,0.7)] [font-weight:600] [margin-bottom:28px]">
              12-month gift membership
            </div>
            <div className="flex items-baseline [gap:6px]">
              <span className="font-sans [font-weight:700] [font-size:32px] [color:var(--color-hot-magenta)] [letter-spacing:-0.02em]">
                $70
              </span>
              <span className="[font-size:13px] [color:rgba(196,185,203,0.65)]">
                / year · sent by email
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="[margin-top:96px] [max-width:760px] [margin-left:auto] [margin-right:auto]">
        <div className="text-center [margin-bottom:36px]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            Good to know
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(30px,3.4vw,40px)] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0px] [line-height:1.06] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            Questions, answered
          </h2>
        </div>
        <div className="flex flex-col [gap:12px]">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (<div key={f.q} className="[background:var(--color-brand-surface)] [border-radius:18px] [box-shadow:0_1px_2px_rgba(53,5,73,0.04)] overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : i)} className="w-full flex items-center justify-between [gap:16px] [padding:20px_26px] text-left">
                  <span className="font-sans [font-weight:600] [font-size:16px] [color:var(--color-deep-plum)]">
                    {f.q}
                  </span>
                  <span className="flex-none font-sans [font-weight:500] [font-size:24px] [color:var(--color-hot-magenta)] [line-height:1] [width:22px] text-center">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen && (<div className="[padding:0_26px_22px] [font-size:15px] [line-height:1.65] [color:var(--color-plum-copy)] [max-width:64ch]">
                    {f.a}
                  </div>)}
              </div>);
        })}
        </div>
        <div className="text-center [margin-top:32px] [font-size:14px] [color:var(--color-plum-muted)]">
          Still wondering?{" "}
          <span className="[color:var(--color-hot-magenta)] [font-weight:600] font-sans">
            Email the Circle ↗
          </span>
        </div>
      </section>

      <div className="[margin-top:56px]"></div>
    </main>);
}
