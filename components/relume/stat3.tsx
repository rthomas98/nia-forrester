/**
 * Relume Stat Card 3 (slug: stat3), vendored via the Relume Library MCP.
 * Adaptations: the dropdown menu, trend icons and button row were removed (no such
 * data or actions exist); each stat card takes a real value and an optional progress
 * percentage; the header block is optional; the value is first in DOM order; the
 * progress bar is a native `<progress>` styled with utilities (no inline styles).
 */
import type { ReactNode } from "react";

export type Stat3Card = {
  title: string;
  value: ReactNode;
  progress?: number;
};

export type Stat3Props = {
  heading?: string;
  description?: ReactNode;
  stats: Stat3Card[];
  label?: string;
};

export const Stat3 = ({ heading, description, stats, label }: Stat3Props) => {
  return (
    <section aria-label={label}>
      {heading ? (
        <div className="mb-5 w-full max-w-lg md:mb-6">
          <h2 className="font-display text-h5 font-semibold text-cream">{heading}</h2>
          {description ? <p className="mt-2 text-body">{description}</p> : null}
        </div>
      ) : null}
      <div className="grid auto-cols-fr grid-cols-1 gap-4 sm:grid-flow-col md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex flex-col justify-start rounded-card border border-scheme-border bg-scheme-foreground p-6 md:justify-normal"
          >
            {/* Value precedes the label in the DOM so it reads "12 Members"; `order-first` keeps Relume's label-on-top layout. */}
            <p className="font-display text-h4 font-semibold text-cream">{stat.value}</p>
            <p className="order-first mb-1 font-ui text-tiny font-semibold tracking-[0.16em] text-taupe uppercase">{stat.title}</p>
            {stat.progress !== undefined ? (
              <progress
                value={stat.progress}
                max={100}
                aria-label={`${stat.title} progress`}
                className="mt-3 block h-1 w-full appearance-none overflow-hidden rounded-full bg-wine-sunken md:mt-4 [&::-moz-progress-bar]:bg-champagne [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-champagne"
              />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};
