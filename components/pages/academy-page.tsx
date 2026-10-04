import { AcademyStudio } from "@/components/academy-studio";
import Image from "next/image";
import { Header1 } from "@/components/relume/header1";

export default function AcademyPage() {
    return (<main>
      <Header1
        tagline="For Writers · Learn"
        heading="The Writing Studio"
        description={<p className="max-w-[56ch]">
            A public-policy attorney by day, a novelist by night, and an editor for
            writers who are serious about the craft. Work directly with Nia — book here.
          </p>}
        media={<div className="relative aspect-[4/5] w-full overflow-hidden rounded-image ring-1 ring-hairline">
            <Image src="/images/nia-outside.jpeg" alt="Nia Forrester seated outdoors" fill loading="eager" sizes="(max-width: 1024px) 90vw, 560px" className="object-cover object-[50%_15%]"/>
          </div>}
      />
      <section aria-label="Studio services and courses" className="border-t border-hairline px-[5%] py-16 md:py-24">
        <div className="mx-auto w-full max-w-content">
          <AcademyStudio />
        </div>
      </section>
    </main>);
}
