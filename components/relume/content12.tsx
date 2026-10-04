/**
 * Relume Content 12 (slug: content12), vendored via the Relume Library MCP.
 * Adaptations: Relume's `prose-*` classes depend on @tailwindcss/typography, which this
 * project does not use, so rich-text spacing is expressed with Tailwind child
 * selectors; the measure widens from `max-w-lg` to a 42rem reading column; metatags
 * are optional and typed.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetaTagProps = {
  title: string;
  description: ReactNode;
};

export type Content12Props = {
  children: ReactNode;
  metatags?: MetaTagProps[];
  className?: string;
};

export const content12Prose =
  "max-w-full text-[1.0625rem] leading-[1.8] text-body [&_a]:text-champagne [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-h4 [&_h2]:font-semibold [&_h2]:text-cream [&_p]:m-0 [&_p]:mb-5";

export const Content12 = ({ children, metatags = [], className }: Content12Props) => {
  return (
    <section className={cn("px-[5%] py-12 md:py-16 lg:py-20", className)}>
      <div className="mx-auto w-full max-w-[42rem]">
        {metatags.length ? (
          <dl className="mb-8 grid grid-cols-2 gap-6 border-y border-scheme-border py-6 md:mb-10 md:grid-cols-4 md:gap-8 lg:mb-12">
            {metatags.map((item) => (
              <div key={item.title}>
                <dt className="mb-2 font-ui text-tiny font-semibold tracking-[0.16em] text-champagne uppercase">{item.title}</dt>
                <dd className="text-body">{item.description}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className={content12Prose}>{children}</div>
      </div>
    </section>
  );
};
