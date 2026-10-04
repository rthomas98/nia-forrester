/**
 * Relume CTA 8 (slug: cta8), vendored via the Relume Library MCP.
 * Adaptations: the form is a slot so the page keeps its real submission handler
 * (Relume's console.log placeholder handler and terms HTML were removed); optional
 * tagline; set on the raised wine surface with a hairline.
 */
import type { ReactNode } from "react";
import { tagline as taglineClass } from "@/lib/typography";

export type Cta8Props = {
  id?: string;
  tagline?: string;
  heading: string;
  description: ReactNode;
  children: ReactNode;
};

export const Cta8 = ({ id, tagline, heading, description, children }: Cta8Props) => {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined} className="scroll-mt-24 border-y border-hairline bg-wine-raised px-[5%] py-16 md:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-content grid-cols-1 items-start justify-between gap-6 md:gap-x-12 md:gap-y-8 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-x-20">
        <div className="w-full max-w-lg">
          {tagline ? <p className={taglineClass}>{tagline}</p> : null}
          <h2 id={id ? `${id}-heading` : undefined} className="mb-3 font-display text-h3 font-semibold text-balance text-cream md:mb-4">
            {heading}
          </h2>
          <div className="text-medium text-pretty text-body">{description}</div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
};
