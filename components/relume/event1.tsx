/**
 * Relume Event 1 (slug: event1), vendored via the Relume Library MCP.
 * Adaptations: the Radix Tabs list is replaced by the page's existing filter state
 * rendered with Relume's tab-trigger styling (`Event1Filters`, `aria-pressed`, options
 * keyed and selected by a unique value, never by their label); event
 * rows (`Event1Row`) take live Convex data, multiple status badges and an action slot
 * that holds registration, tickets or gating links.
 */
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Each option has a unique `value` (identity, React key, selection) and a display
 * `label`. Labels may repeat — e.g. two chapters titled "Interlude" — without
 * colliding, because nothing is matched by label.
 */
export type Event1FilterOption<T extends string> = { value: T; label: string };

export type Event1FiltersProps<T extends string> = {
  label: string;
  options: ReadonlyArray<Event1FilterOption<T>>;
  value: T;
  onChange: (value: T) => void;
};

export function Event1Filters<T extends string>({ label, options, value, onChange }: Event1FiltersProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mb-10 flex w-full flex-wrap items-center gap-2 md:mb-12"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-11 cursor-pointer rounded-button border px-4 py-2 font-ui text-tiny font-semibold tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
              active
                ? "border-champagne bg-champagne/10 text-champagne"
                : "border-transparent text-body hover:border-scheme-border hover:text-cream",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export type Event1RowProps = {
  date: { weekday: string; day: string; month: string; year: string; iso: string };
  title: string;
  statuses?: Array<{ label: string; variant?: "default" | "alternate" | "outline" | "alert" }>;
  eyebrow?: string;
  location: ReactNode;
  time?: ReactNode;
  description: ReactNode;
  children?: ReactNode;
};

export const Event1Row = ({ date, title, statuses = [], eyebrow, location, time, description, children }: Event1RowProps) => {
  return (
    <article className="grid grid-cols-1 items-start gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr] md:gap-8 md:py-8">
      <Card variant="raised" className="flex w-28 flex-col items-center px-1 py-3 text-center">
        <time dateTime={date.iso} className="contents">
          <span className="font-ui text-tiny font-semibold tracking-[0.16em] text-champagne uppercase">{date.weekday}</span>
          <span className="font-display text-h4 font-semibold text-cream">{date.day}</span>
          <span className="text-small text-body">
            {date.month} {date.year}
          </span>
        </time>
      </Card>
      <div className="flex w-full min-w-0 flex-col items-start justify-start">
        {eyebrow ? (
          <p className="mb-2 font-ui text-tiny font-semibold tracking-[0.16em] text-taupe uppercase">{eyebrow}</p>
        ) : null}
        <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-4">
          <h2 className="font-display text-h5 font-semibold break-words text-cream">{title}</h2>
          {statuses.map((status) => (
            <Badge key={status.label} variant={status.variant}>
              {status.label}
            </Badge>
          ))}
        </div>
        {time ? <p className="text-small font-semibold text-cream">{time}</p> : null}
        <p className="mb-3 text-small text-taupe md:mb-4">{location}</p>
        <div className="max-w-2xl text-pretty break-words whitespace-pre-wrap text-body">{description}</div>
        {children ? <div className="mt-5 w-full">{children}</div> : null}
      </div>
    </article>
  );
};
