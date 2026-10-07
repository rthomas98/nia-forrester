/**
 * Relume Layout 659 (slug: layout659), vendored via the Relume Library MCP.
 * Adaptations: fixed Relume's prop spread order (the source spread defaults after
 * props, so props were ignored); media/description/actions are slots for
 * `next/image` and live links; optional media-right ordering.
 */
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tagline as taglineClass } from "@/lib/typography";

export type Layout659Props = {
  tagline: string;
  heading: string;
  description: ReactNode;
  actions?: ReactNode;
  media: ReactNode;
  mediaRight?: boolean;
  headingLevel?: "h1" | "h2";
  className?: string;
};

export const Layout659 = ({ tagline, heading, description, actions, media, mediaRight, headingLevel = "h2", className }: Layout659Props) => {
  const Heading = headingLevel;
  return (
    <section className={cn("px-[5%] py-16 md:py-24 lg:py-28", className)}>
      <div className="mx-auto w-full max-w-content">
        <Card className="grid auto-cols-fr grid-cols-1 md:grid-cols-2">
          <div className={cn("relative flex min-h-80 items-center justify-center", mediaRight && "md:order-last")}>
            {media}
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
            <p className={cn(taglineClass, "mb-2 md:mb-3")}>{tagline}</p>
            <Heading className="mb-5 font-display text-h2 font-semibold text-balance text-cream md:mb-6">{heading}</Heading>
            <div className="text-medium text-pretty text-body">{description}</div>
            {actions ? <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">{actions}</div> : null}
          </div>
        </Card>
      </div>
    </section>
  );
};
