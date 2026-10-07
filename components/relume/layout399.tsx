/**
 * Relume Layout 399 (slug: layout399), vendored via the Relume Library MCP.
 * Adaptations: cards are Next.js links with `next/image` photography from the site's
 * own assets, the card button is rendered as a link label, and the header block takes
 * an optional h2 id for `aria-labelledby`.
 */
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "relume-icons";
import { Card } from "@/components/ui/card";
import { tagline as taglineClass } from "@/lib/typography";

type BaseCard = {
  tagline: string;
  image: { src: string; alt: string; position?: string };
  heading: string;
  description: string;
  url: string;
  linkLabel: string;
};

export type Layout399Props = {
  tagline: string;
  heading: string;
  description: string;
  cards: BaseCard[];
};

export const Layout399 = ({ tagline, heading, description, cards }: Layout399Props) => {
  return (
    <section aria-labelledby="layout399-heading" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-content">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className={taglineClass}>{tagline}</p>
            <h2 id="layout399-heading" className="mb-5 font-display text-h2 font-semibold text-balance text-cream md:mb-6">
              {heading}
            </h2>
            <p className="text-medium text-pretty text-body">{description}</p>
          </div>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {cards.map((card) => (
            <LayoutCard key={card.url} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

const LayoutCard = (card: BaseCard) => {
  return (
    <Card className="group relative flex flex-col transition-colors duration-300 hover:border-champagne/50 focus-within:border-champagne/60">
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="mb-2 font-ui text-tiny font-semibold tracking-[0.2em] text-champagne uppercase">{card.tagline}</p>
          <h3 className="mb-2 font-display text-h5 font-semibold text-cream">
            <Link
              href={card.url}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {card.heading}
            </Link>
          </h3>
          <p className="text-small text-pretty text-body">{card.description}</p>
        </div>
        <div className="mt-5 md:mt-6">
          <span className="inline-flex items-center gap-2 font-ui text-tiny font-semibold tracking-[0.12em] text-champagne uppercase transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
            {card.linkLabel}
            <ChevronRight aria-hidden="true" className="size-4" />
          </span>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={card.image.src}
          alt={card.image.alt}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
          className={`object-cover transition duration-700 ease-standard group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${card.image.position ?? "object-center"}`}
        />
      </div>
    </Card>
  );
};
