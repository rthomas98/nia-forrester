/** Shared Tailwind class strings for the catalog UI (server- and client-safe). */

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-hot-magenta)]";

export const primaryAction = `inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-deep-plum)] px-6 py-3 font-sans text-sm font-semibold text-[var(--color-brand-surface)] transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`;

export const secondaryAction = `inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(53,5,73,0.2)] px-6 py-3 font-sans text-sm font-semibold text-[var(--color-deep-plum)] transition-colors hover:bg-[rgba(53,5,73,0.06)] ${focusRing}`;
