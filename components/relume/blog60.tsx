/**
 * Relume Blog 60 (slug: blog60), vendored via the Relume Library MCP.
 * Adaptations: split into a section shell (`Blog60`) and a post card (`Blog60Card`) so
 * Convex-fed lists, loading and empty states render inside the Relume grid; Next.js
 * links and `next/image` portrait covers; the read-time field was removed because the
 * content API does not provide it.
 */
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "relume-icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tagline as taglineClass } from "@/lib/typography";

export type Blog60Props = {
  tagline?: string;
  heading: string;
  headingId?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bare?: boolean;
};

export const Blog60 = ({ tagline, heading, headingId, description, action, children, className, bare }: Blog60Props) => {
  return (
    <section
      aria-labelledby={headingId}
      className={cn(bare ? "" : "px-[5%] py-16 md:py-24 lg:py-28", className)}
    >
      <div className="mx-auto w-full max-w-content">
        <div className="mb-10 grid grid-cols-1 items-start justify-start gap-y-6 md:mb-14 md:grid-cols-[1fr_max-content] md:items-end md:justify-between md:gap-x-12 md:gap-y-4 lg:gap-x-20">
          <div className="w-full max-w-lg">
            {tagline ? <p className={taglineClass}>{tagline}</p> : null}
            <h2 id={headingId} className="mb-3 font-display text-h2 font-semibold text-balance text-cream md:mb-4">
              {heading}
            </h2>
            {description ? <div className="text-medium text-pretty text-body">{description}</div> : null}
          </div>
          {action ? <div className="flex flex-wrap items-center md:justify-end">{action}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
};

export const blog60Grid = "grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8 lg:gap-x-12";

export type Blog60CardProps = {
  url: string;
  image?: { src: string; alt: string } | null;
  category: string;
  title: string;
  description: string;
  linkLabel: string;
};

export const Blog60Card = ({ url, image, category, title, description, linkLabel }: Blog60CardProps) => {
  return (
    <Card className="flex size-full flex-col items-stretch justify-start sm:flex-row">
      {image ? (
        <Link
          href={url}
          tabIndex={-1}
          aria-hidden="true"
          className="relative aspect-[2/3] w-full flex-none overflow-hidden bg-wine-sunken sm:w-44"
        >
          <Image src={image.src} alt="" fill sizes="(min-width: 640px) 176px, 100vw" className="object-cover" />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col px-5 py-6 md:p-6">
        <div className="mb-3 flex w-full items-center justify-start md:mb-4">
          <Badge>{category}</Badge>
        </div>
        <div className="flex w-full flex-1 flex-col items-start justify-start">
          <h3 className="mb-2 font-display text-h5 font-semibold text-cream">
            <Link
              href={url}
              className="transition-colors hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              {title}
            </Link>
          </h3>
          <p className="text-pretty text-body">{description}</p>
          <Link
            href={url}
            className="mt-auto inline-flex min-h-11 items-center gap-x-2 pt-5 font-ui text-tiny font-semibold tracking-[0.12em] text-champagne uppercase transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne md:pt-6"
          >
            {linkLabel}
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="sr-only">: {title}</span>
          </Link>
        </div>
      </div>
    </Card>
  );
};
