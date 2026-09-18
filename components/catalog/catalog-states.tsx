"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { catalogErrorCode } from "@/lib/catalog";
import { primaryAction } from "@/lib/catalog-styles";

export function StatePanel({
  eyebrow,
  title,
  children,
  actions,
  role,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <div
      role={role}
      className="rounded-[28px] border border-[rgba(53,5,73,0.1)] bg-[var(--color-brand-surface)] px-6 py-9 sm:px-10 sm:py-11"
    >
      <div className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-hot-magenta)]">
        {eyebrow}
      </div>
      <h2 className="mb-0 mt-2.5 text-balance font-sans text-2xl font-bold tracking-[-0.02em] text-[var(--color-deep-plum)] sm:text-[28px]">
        {title}
      </h2>
      <p className="mb-0 mt-3 max-w-[60ch] text-pretty text-[15px] leading-[1.65] text-[var(--color-plum-copy)]">
        {children}
      </p>
      {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

function RetryButton({ onRetry }: { onRetry: () => void }) {
  return (
    <button type="button" onClick={onRetry} className={primaryAction}>
      Try again
    </button>
  );
}

export function CatalogUnconfigured() {
  return (
    <StatePanel
      role="status"
      eyebrow="Library unavailable"
      title="The library isn’t connected yet"
    >
      This site hasn’t been connected to its catalog service, so there are no
      books to show right now. Nothing is wrong on your end — please check
      back soon.
    </StatePanel>
  );
}

export function CatalogOffline() {
  return (
    <StatePanel
      role="alert"
      eyebrow="Connection problem"
      title="We can’t reach the library right now"
      actions={<RetryButton onRetry={() => window.location.reload()} />}
    >
      The catalog didn’t respond. We’re still trying to reconnect in the
      background — check your connection, or try again.
    </StatePanel>
  );
}

/** Fallback for errors thrown by a catalog query. */
export function CatalogQueryError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const code = catalogErrorCode(error);

  if (code === "UNAUTHENTICATED") {
    return (
      <StatePanel
        role="alert"
        eyebrow="Sign in required"
        title="Sign in to continue"
        actions={
          <Link href="/signin" className={primaryAction}>
            Sign in
          </Link>
        }
      >
        Your session has ended. Sign in again to pick up where you left off.
      </StatePanel>
    );
  }

  if (code === "FORBIDDEN") {
    return (
      <StatePanel
        role="alert"
        eyebrow="Access denied"
        title="Your account can’t view this"
      >
        This part of the library isn’t available to your account.
      </StatePanel>
    );
  }

  return (
    <StatePanel
      role="alert"
      eyebrow="Something went wrong"
      title="The library couldn’t load"
      actions={<RetryButton onRetry={onRetry} />}
    >
      The catalog returned an error instead of books. This is usually
      temporary — try again in a moment.
    </StatePanel>
  );
}

export function CatalogEmpty() {
  return (
    <StatePanel
      role="status"
      eyebrow="Nothing published yet"
      title="The shelves are being stocked"
    >
      No books have been published to the library yet. The serial and essays
      are open in the meantime.
    </StatePanel>
  );
}

export function BookNotFound() {
  return (
    <StatePanel
      eyebrow="Book not found"
      title="We couldn’t find that book"
      actions={
        <Link href="/read" className={primaryAction}>
          Browse the library
        </Link>
      }
    >
      It may have been renamed or isn’t published right now. Every available
      title is in the library.
    </StatePanel>
  );
}

const skeletonBlock =
  "animate-pulse rounded-md bg-[rgba(53,5,73,0.1)] motion-reduce:animate-none";

export function ShelfSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div role="status" className="flex flex-col gap-9">
      <span className="sr-only">Loading the library…</span>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} aria-hidden="true">
          <div className={`mb-4 h-5 w-44 ${skeletonBlock}`} />
          <div className="flex gap-5 overflow-hidden pb-3">
            {Array.from({ length: 6 }, (_, cover) => (
              <div key={cover} className="w-[132px] flex-none sm:w-[150px]">
                <div className={`aspect-[2/3] w-full ${skeletonBlock}`} />
                <div className={`mt-3 h-3.5 w-4/5 ${skeletonBlock}`} />
                <div className={`mt-2 h-3 w-1/2 ${skeletonBlock}`} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div
      role="status"
      className="grid grid-cols-1 gap-8 rounded-[28px] bg-[var(--color-brand-surface)] p-6 sm:p-10 md:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] md:gap-12 lg:rounded-[36px] lg:p-14"
    >
      <span className="sr-only">Loading book details…</span>
      <div
        aria-hidden="true"
        className={`mx-auto aspect-[2/3] w-full max-w-[268px] ${skeletonBlock}`}
      />
      <div aria-hidden="true" className="flex flex-col justify-center">
        <div className={`h-3 w-32 ${skeletonBlock}`} />
        <div className={`mt-5 h-11 w-4/5 ${skeletonBlock}`} />
        <div className={`mt-7 h-4 w-full ${skeletonBlock}`} />
        <div className={`mt-3 h-4 w-11/12 ${skeletonBlock}`} />
        <div className={`mt-3 h-4 w-3/5 ${skeletonBlock}`} />
        <div className={`mt-9 h-12 w-44 rounded-full ${skeletonBlock}`} />
      </div>
    </div>
  );
}

export function PanelSkeleton({ label }: { label: string }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <div className={`h-4 w-40 ${skeletonBlock}`} />
        <div className={`mt-4 h-3 w-full rounded-full ${skeletonBlock}`} />
        <div className={`mt-5 h-11 w-36 rounded-full ${skeletonBlock}`} />
      </div>
    </div>
  );
}
