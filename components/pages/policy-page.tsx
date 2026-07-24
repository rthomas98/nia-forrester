import Link from "next/link";
export function PolicyPage({ eyebrow, title, intro, sections, }: {
    eyebrow: string;
    title: string;
    intro: string;
    sections: Array<{
        title: string;
        body: React.ReactNode;
    }>;
}) {
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:760px] [margin:0_auto] [padding:64px_40px_96px]">
      <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
        {eyebrow}
      </div>
      <h1 className="font-sans [font-size:48px] [line-height:1.08] [color:var(--color-deep-plum)] [margin:0_0_18px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
        {title}
      </h1>
      <p className="[font-size:18px] [line-height:1.7] [color:var(--color-plum-copy)] text-pretty">
        {intro}
      </p>
      <p className="[font-size:13px] [color:var(--color-plum-muted)] [margin:0_0_40px] text-pretty">
        Effective July 23, 2026
      </p>
      <div className="flex flex-col [gap:30px]">
        {sections.map((section) => (<section key={section.title}>
            <h2 className="font-sans [font-size:24px] [color:var(--color-deep-plum)] [margin:0_0_10px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              {section.title}
            </h2>
            <div className="[color:var(--color-plum-copy)] [line-height:1.75]">
              {section.body}
            </div>
          </section>))}
      </div>
      <p className="[margin-top:40px] [color:var(--color-plum-copy)] text-pretty">
        Questions?{" "}
        <Link href="/contact" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] [color:var(--color-hot-magenta)] [font-weight:700]">
          Contact us
        </Link>
        .
      </p>
    </main>);
}
