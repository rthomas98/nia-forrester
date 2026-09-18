import Link from "next/link";
export default function PrelaunchPage({ eyebrow, title, body, }: {
    eyebrow: string;
    title: string;
    body: string;
}) {
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:760px] [margin:0_auto] [padding:88px_40px_120px]">
      <div className="[background:var(--color-deep-plum)] [border-radius:32px] [padding:clamp(36px,6vw,68px)] [color:var(--color-brand-surface)]">
        <div className="[font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
          {eyebrow}
        </div>
        <h1 className="font-serif [font-size:48px] [line-height:1.08] [margin:0_0_18px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
          {title}
        </h1>
        <p className="[font-size:17px] [line-height:1.7] [color:rgba(196,185,203,0.82)] [margin:0_0_28px] text-pretty">
          {body}
        </p>
        <Link href="/#newsletter" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 inline-block [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:14px_24px] [border-radius:999px] [font-weight:700]">
          Get launch notes
        </Link>
      </div>
    </main>);
}
