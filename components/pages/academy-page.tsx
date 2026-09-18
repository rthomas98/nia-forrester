import { AcademyStudio } from "@/components/academy-studio";
import Image from "next/image";
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

      <AcademyStudio />
      <div className="[margin-top:56px]"></div>
    </main>);
}
