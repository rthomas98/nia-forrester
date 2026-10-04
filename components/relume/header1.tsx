/**
 * Relume Header 1 (slug: header1), vendored via the Relume Library MCP.
 * Adaptations: heading/description/actions/media are slots so pages can pass the
 * NIA FORRESTER mark, live links and `next/image` photography; optional tagline;
 * container mapped to the 1200px content width.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tagline as taglineClass } from "@/lib/typography";

export type Header1Props = {
  tagline?: string;
  heading: ReactNode;
  headingClassName?: string;
  description: ReactNode;
  actions?: ReactNode;
  media: ReactNode;
  className?: string;
};

export const Header1 = ({ tagline, heading, headingClassName, description, actions, media, className }: Header1Props) => {
  return (
    <section className={cn("px-[5%] py-16 md:py-24 lg:py-28", className)}>
      <div className="mx-auto w-full max-w-content">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <div>
            {tagline ? <p className={taglineClass}>{tagline}</p> : null}
            <h1 className={cn("mb-5 font-display text-h1 font-semibold text-balance text-cream md:mb-6", headingClassName)}>
              {heading}
            </h1>
            <div className="text-medium text-pretty text-body">{description}</div>
            {actions ? <div className="mt-6 flex flex-wrap gap-4 md:mt-8">{actions}</div> : null}
          </div>
          <div>{media}</div>
        </div>
      </div>
    </section>
  );
};
