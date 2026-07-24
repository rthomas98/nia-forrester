import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/data";
export default function AcademyPage() {
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:1240px] [margin:0_auto] [padding:56px_40px_64px]">
      <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-cool-teal)] [margin-bottom:14px]">
        For writers · Learn
      </div>
      <h1 className="font-sans [font-weight:700] [font-size:56px] [letter-spacing:-0.03em] [color:var(--color-deep-plum)] [margin:0_0_12px] [max-width:18ch] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
        The Writing Studio
      </h1>
      <p className="[font-size:18px] [color:var(--color-plum-copy)] [max-width:620px] [margin:0_0_40px] text-pretty">
        A public-policy attorney by day, a novelist by night, and an editor for writers who are
        serious about the craft. Work directly with Nia — book here.
      </p>

      {/* Stock photo: Unsplash (free license) — a writing desk with notebook and coffee */}
      <Image src="/images/academy-banner.jpg" alt="A writing desk with an open notebook, fountain pen, and coffee" width={1600} height={1067} loading="eager" sizes="(max-width: 1240px) 100vw, 1160px" className="block w-full [height:240px] [object-fit:cover] [object-position:50%_60%] [border-radius:24px] [box-shadow:0_4px_12px_rgba(53,5,73,0.06)] [margin:0_0_40px] [background:var(--color-brand-surface)]"/>

      <div className="grid [grid-template-columns:repeat(2,1fr)] [gap:18px] [margin-bottom:48px] max-[900px]:grid-cols-1">
        {services.map((s) => (<article key={s.name} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl [background:var(--color-brand-surface)] [border-radius:24px] [padding:30px] [box-shadow:0_4px_12px_rgba(53,5,73,0.06)] flex flex-col">
            <div className="flex items-baseline justify-between [gap:16px] [margin-bottom:12px]">
              <h3 className="font-sans [font-weight:700] [font-size:24px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:0px]">
                {s.name}
              </h3>
              <span className="font-sans [font-weight:700] [font-size:16px] [color:var(--color-hot-magenta)] whitespace-nowrap">
                {s.price}
              </span>
            </div>
            <p className="[font-size:14px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_22px] [flex:1] text-pretty">
              {s.desc}
            </p>
            <button type="button" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-deep-plum)] [color:var(--color-brand-surface)] [padding:12px_22px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px] [align-self:flex-start]">
              Book a slot ↗
            </button>
          </article>))}
      </div>

      <div className="[background:var(--color-cool-teal)] [border-radius:32px] [padding:44px_48px] grid [grid-template-columns:1fr_auto] [gap:32px] items-center max-[900px]:grid-cols-1">
        <div>
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.14em] uppercase [color:var(--color-deep-plum)] [margin-bottom:10px]">
            Coming soon
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:32px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_10px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            Courses, Workshops &amp; Masterclasses
          </h2>
          <p className="[font-size:15px] [line-height:1.6] [color:rgba(53,5,73,0.78)] [margin:0px] [max-width:520px] text-pretty">
            Self-paced craft courses and live cohorts on writing woman-centered romance. Writers
            Circle members get them first, and at a discount.
          </p>
        </div>
        <Link href="/membership" className="flex-none [background:var(--color-deep-plum)] [color:var(--color-brand-surface)] [padding:14px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
          Join the waitlist
        </Link>
      </div>
      <div className="[margin-top:56px]"></div>
    </main>);
}
