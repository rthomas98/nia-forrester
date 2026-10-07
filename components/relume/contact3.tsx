/**
 * Relume Contact 3 (slug: contact3), vendored via the Relume Library MCP.
 * Adaptations: the form is a slot so the page keeps its `/api/contact` submission and
 * honeypot (Relume's console.log handler and terms checkbox were removed — the
 * original form has no terms acceptance); heading is the page h1.
 */
import type { ReactNode } from "react";
import { tagline as taglineClass } from "@/lib/typography";

export type Contact3Props = {
  tagline: string;
  heading: string;
  description: ReactNode;
  children: ReactNode;
};

export const Contact3 = ({ tagline, heading, description, children }: Contact3Props) => {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-content">
        <div className="mb-8 w-full max-w-lg md:mb-10 lg:mb-12">
          <p className={taglineClass}>{tagline}</p>
          <h1 className="mb-5 font-display text-h2 font-semibold text-balance text-cream md:mb-6">{heading}</h1>
          <div className="text-medium text-pretty text-body">{description}</div>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </section>
  );
};
