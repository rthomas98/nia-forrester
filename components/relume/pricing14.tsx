/**
 * Relume Pricing 14 (slug: pricing14), vendored via the Relume Library MCP.
 * Adaptations: the Radix Tabs control is replaced by the page's existing
 * monthly/annual state rendered with Relume's tab-list styling (`aria-pressed`
 * buttons); plans come from the live `billing.plans` query with the plan action as a
 * slot; Relume's invalid `<h4>` inside `<h1>` price markup is corrected to spans; the
 * heading is the page h1.
 */
import type { ReactNode } from "react";
import { Check } from "relume-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tagline as taglineClass } from "@/lib/typography";

export type Pricing14Props = {
  tagline: string;
  heading: string;
  description: ReactNode;
  children: ReactNode;
};

export const Pricing14 = ({ tagline, heading, description, children }: Pricing14Props) => {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-16">
          <p className={taglineClass}>{tagline}</p>
          <h1 className="mb-5 font-display text-h2 font-semibold text-balance text-cream md:mb-6">{heading}</h1>
          <div className="text-medium text-pretty text-body">{description}</div>
        </div>
        {children}
      </div>
    </section>
  );
};

export type Pricing14ToggleProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
};

export function Pricing14Toggle<T extends string>({ options, value, onChange, label }: Pricing14ToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mx-auto mb-12 flex w-fit items-center justify-center rounded-button border border-scheme-border bg-scheme-foreground p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "min-h-11 cursor-pointer rounded-button px-5 font-ui text-tiny font-semibold tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
            value === option.value ? "bg-scheme-background text-champagne" : "bg-transparent text-body hover:text-cream",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export type Pricing14PlanProps = {
  planName: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  action: ReactNode;
};

export const Pricing14Plan = ({ planName, price, cadence, description, features, action }: Pricing14PlanProps) => (
  <Card className="flex h-full flex-col justify-between px-6 py-8 md:p-8">
    <div>
      <div className="mb-6 text-center md:mb-8">
        <h2 className="font-ui text-small font-semibold tracking-[0.18em] text-champagne uppercase">{planName}</h2>
        <p className="my-2 font-display text-h2 font-semibold text-cream">
          {price}
          {cadence ? <span className="ml-1 font-sans text-medium font-normal text-taupe">/ {cadence}</span> : null}
        </p>
        <p className="mt-2 text-pretty text-body">{description}</p>
      </div>
      <ul className="mb-8 grid grid-cols-1 gap-4 py-2">
        {features.map((feature) => (
          <li key={feature} className="flex self-start">
            <div className="mr-4 flex-none self-start">
              <Check aria-hidden="true" className="size-6 text-champagne" />
            </div>
            <p className="text-body">{feature}</p>
          </li>
        ))}
      </ul>
    </div>
    <div>{action}</div>
  </Card>
);
