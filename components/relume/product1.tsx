/**
 * Relume Product 1 (slug: product1), vendored via the Relume Library MCP.
 * Adaptations: split into a section shell (`Product1`), grid class and product tile
 * (`Product1Item`) so catalog queries and their states render in the Relume grid; the
 * product image is the book's cover component; the price line is replaced by the
 * catalog meta line (the catalog has no on-site prices); Next.js `Link`.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tagline as taglineClass } from "@/lib/typography";

export type Product1Props = {
  tagline?: string;
  heading: string;
  headingId?: string;
  headingLevel?: "h2" | "h3";
  description?: ReactNode;
  viewAll?: ReactNode;
  children: ReactNode;
  className?: string;
  bare?: boolean;
};

export const Product1 = ({ tagline, heading, headingId, headingLevel = "h2", description, viewAll, children, className, bare }: Product1Props) => {
  const Heading = headingLevel;
  return (
    <section
      aria-labelledby={headingId}
      className={cn(bare ? "" : "px-[5%] py-16 md:py-24 lg:py-28", className)}
    >
      <div className="mx-auto w-full max-w-content">
        <div className="mb-10 grid grid-cols-1 gap-y-4 md:mb-14 md:grid-cols-[1fr_max-content] md:items-end md:gap-x-12 lg:gap-x-20">
          <div className="w-full max-w-lg">
            {tagline ? <p className={taglineClass}>{tagline}</p> : null}
            <Heading
              id={headingId}
              className={cn(
                "mb-3 font-display font-semibold text-balance text-cream md:mb-4",
                headingLevel === "h2" ? "text-h2" : "text-h4",
              )}
            >
              {heading}
            </Heading>
            {description ? <div className="text-medium text-pretty text-body">{description}</div> : null}
          </div>
          {viewAll ? <div>{viewAll}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
};

export const product1Grid =
  "m-0 grid list-none grid-cols-2 gap-x-5 gap-y-12 p-0 sm:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-4 xl:grid-cols-6";

export type Product1ItemProps = {
  url: string;
  image: ReactNode;
  name: string;
  description?: string | null;
  className?: string;
};

export const Product1Item = ({ url, image, name, description, className }: Product1ItemProps) => {
  return (
    <Link
      href={url}
      className={cn(
        "group block rounded-image transition duration-300 ease-standard hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="mb-3 md:mb-4">{image}</div>
      <div className="mb-2">
        <p className="font-display text-large leading-tight font-semibold break-words text-cream transition-colors group-hover:text-champagne">
          {name}
        </p>
        {description ? <p className="mt-1 text-small text-taupe">{description}</p> : null}
      </div>
    </Link>
  );
};
