/**
 * Relume Header 46 (slug: header46), vendored via the Relume Library MCP.
 * Adaptations: optional tagline, ReactNode description, optional trailing slot
 * (filters, back links) and the 1200px content container.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tagline as taglineClass } from "@/lib/typography";

export type Header46Props = {
  tagline?: string;
  heading: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export const Header46 = ({ tagline, heading, description, children, className }: Header46Props) => {
  return (
    <section className={cn("px-[5%] pt-16 pb-10 md:pt-24 md:pb-12 lg:pt-28", className)}>
      <div className="mx-auto w-full max-w-content">
        <div className="w-full max-w-2xl">
          {tagline ? <p className={taglineClass}>{tagline}</p> : null}
          <h1 className="mb-5 font-display text-h1 font-semibold text-balance text-cream md:mb-6">{heading}</h1>
          {description ? <div className="text-medium text-pretty text-body">{description}</div> : null}
        </div>
        {children ? <div className="mt-8 md:mt-10">{children}</div> : null}
      </div>
    </section>
  );
};
