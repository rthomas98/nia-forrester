import Image from "next/image";
import Link from "next/link";
import { AcademyStudio } from "@/components/academy-studio";
import { Header1 } from "@/components/relume/header1";
import { buttonVariants } from "@/components/ui/button";

export default function AcademyPage() {
    return (<main>
      <Header1
        tagline="For Writers · Learn"
        heading="Academy"
        description={<p className="max-w-[56ch]">
            Nia partners with writers who are ready to do the work—through
            developmental editing, one-on-one coaching, and workshops that sharpen
            your craft and strengthen your novel. Every engagement is tailored to
            where you are and where you want to go. If you’re serious about your
            writing, you’re in the right place.
          </p>}
        actions={<Link href="/work-with-nia" className={buttonVariants()}>
            Work with Nia
          </Link>}
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
