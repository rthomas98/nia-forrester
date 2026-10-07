import Link from "next/link";
import { Header46 } from "@/components/relume/header46";
import { buttonVariants } from "@/components/ui/button";

export default function PrelaunchPage({ eyebrow, title, body, }: {
    eyebrow: string;
    title: string;
    body: string;
}) {
    return (<main className="pb-16 md:pb-24">
      <Header46 tagline={eyebrow} heading={title} description={<p>{body}</p>}>
        <Link href="/#newsletter" className={buttonVariants()}>
          Get Launch Notes
        </Link>
      </Header46>
    </main>);
}
