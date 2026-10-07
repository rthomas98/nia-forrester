import Link from "next/link";
import { Header46 } from "@/components/relume/header46";
import { Content12 } from "@/components/relume/content12";

export function PolicyPage({ eyebrow, title, intro, sections, }: {
    eyebrow: string;
    title: string;
    intro: string;
    sections: Array<{
        title: string;
        body: React.ReactNode;
    }>;
}) {
    return (<main>
      <Header46 tagline={eyebrow} heading={title} description={<>
          <p>{intro}</p>
          <p className="mt-4 font-ui text-tiny font-semibold tracking-[0.16em] text-taupe uppercase">
            Effective July 23, 2026
          </p>
        </>}/>
      <Content12 className="border-t border-hairline pb-16 md:pb-24">
        {sections.map((section) => (<section key={section.title}>
            <h2>{section.title}</h2>
            {section.body}
          </section>))}
        <div className="mt-10 border-t border-hairline pt-8">
          <p>
            Questions? <Link href="/contact">Contact us</Link>.
          </p>
        </div>
      </Content12>
    </main>);
}
