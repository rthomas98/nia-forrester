"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useConvexAuth, useMutation } from "convex/react";
import { useAuth } from "@/components/auth-context";
import { PanelSkeleton } from "@/components/catalog/catalog-states";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { useCatalogQuery } from "@/components/catalog/use-catalog-query";
import { catalogApi, catalogErrorCode } from "@/lib/catalog";
import { focusRing, primaryAction, secondaryAction } from "@/lib/catalog-styles";

const PROGRESS_STEP = 5;

const bodyCopy =
  "m-0 max-w-[52ch] text-pretty text-[15px] leading-[1.65] text-[var(--color-plum-copy)]";

function PanelShell({ children }: { children: ReactNode }) {
  return (
    <section
      aria-labelledby="reading-progress-heading"
      className="rounded-[28px] bg-[var(--color-brand-surface)] p-6 shadow-[0_4px_12px_rgba(53,5,73,0.06)] sm:p-8"
    >
      <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-hot-magenta)]">
        Your reading
      </div>
      <h2
        id="reading-progress-heading"
        className="mb-4 mt-2 font-sans text-2xl font-bold tracking-[-0.02em] text-[var(--color-deep-plum)]"
      >
        Track your progress
      </h2>
      {children}
    </section>
  );
}

function SignInPrompt({ message }: { message: string }) {
  return (
    <>
      <p className={bodyCopy}>{message}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/signin" className={primaryAction}>
          Sign in
        </Link>
        <Link href="/signup" className={secondaryAction}>
          Create an account
        </Link>
      </div>
    </>
  );
}

function saveErrorMessage(error: unknown): string {
  switch (catalogErrorCode(error)) {
    case "UNAUTHENTICATED":
      return "Your session has ended. Sign in again to save your progress.";
    case "FORBIDDEN":
      return "Your account isn’t allowed to save reading progress.";
    case "NOT_FOUND":
      return "This book is no longer available, so progress can’t be saved.";
    case "VALIDATION_ERROR":
      return "That progress value wasn’t accepted. Choose a value from 0 to 100.";
    default:
      return "We couldn’t save your progress. Check your connection and try again.";
  }
}

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved" }
  | { status: "error"; message: string };

function ProgressTracker({ slug }: { slug: string }) {
  const progress = useCatalogQuery(catalogApi.progressBySlug, { slug });
  const saveProgress = useMutation(catalogApi.saveProgressBySlug);
  const [draft, setDraft] = useState<number | null>(null);
  const [save, setSave] = useState<SaveState>({ status: "idle" });

  if (progress.status === "loading") {
    return <PanelSkeleton label="Loading your reading progress…" />;
  }
  if (progress.status === "offline") {
    return (
      <p role="alert" className={bodyCopy}>
        We can’t reach your reading history right now. We’re still trying to
        reconnect — your saved progress hasn’t been lost.
      </p>
    );
  }

  const saved = progress.data;
  const savedPercent = saved ? Math.round(saved.percent) : 0;
  const percent = draft ?? savedPercent;
  const saving = save.status === "saving";

  async function submit(nextPercent: number) {
    setSave({ status: "saving" });
    try {
      await saveProgress({
        slug,
        percent: nextPercent,
        completed: nextPercent === 100,
      });
      setDraft(null);
      setSave({ status: "saved" });
    } catch (error) {
      setSave({ status: "error", message: saveErrorMessage(error) });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(percent);
  }

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="m-0 font-sans text-[15px] font-semibold text-[var(--color-deep-plum)]">
          {saved === null
            ? "Not started yet"
            : saved.completed
              ? "Finished"
              : `${savedPercent}% read`}
        </p>
        {saved ? (
          <p className="m-0 font-sans text-xs text-[var(--color-plum-muted)]">
            Updated{" "}
            {new Date(saved.updatedAt).toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
          </p>
        ) : null}
      </div>
      <progress
        value={savedPercent}
        max={100}
        aria-label="Saved reading progress"
        className="mt-3 block h-2.5 w-full appearance-none overflow-hidden rounded-full bg-[rgba(53,5,73,0.1)] [&::-moz-progress-bar]:bg-[var(--color-hot-magenta)] [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[var(--color-hot-magenta)]"
      />

      <form onSubmit={handleSubmit} className="mt-6">
        <label
          htmlFor="reading-progress-input"
          className="flex items-baseline justify-between gap-3 font-sans text-sm font-semibold text-[var(--color-deep-plum)]"
        >
          How far along are you?
          <output
            htmlFor="reading-progress-input"
            className="font-sans text-sm font-bold tabular-nums text-[var(--color-hot-magenta)]"
          >
            {percent}%
          </output>
        </label>
        <input
          id="reading-progress-input"
          type="range"
          min={0}
          max={100}
          step={PROGRESS_STEP}
          value={percent}
          disabled={saving}
          onChange={(event) => {
            setDraft(Number(event.target.value));
            setSave({ status: "idle" });
          }}
          className={`mt-1 h-11 w-full cursor-pointer rounded-full accent-[var(--color-hot-magenta)] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving || percent === savedPercent}
            className={`${primaryAction} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
          >
            {saving ? "Saving…" : "Save progress"}
          </button>
          {saved?.completed ? null : (
            <button
              type="button"
              disabled={saving}
              onClick={() => void submit(100)}
              className={`${secondaryAction} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Mark as finished
            </button>
          )}
        </div>
        <p
          role={save.status === "error" ? "alert" : "status"}
          className={`mb-0 mt-3 min-h-5 font-sans text-[13px] font-semibold ${
            save.status === "error"
              ? "text-[var(--color-hot-magenta)]"
              : "text-[var(--color-plum-copy)]"
          }`}
        >
          {save.status === "saved" ? "Progress saved." : null}
          {save.status === "error" ? save.message : null}
        </p>
      </form>
    </>
  );
}

function ProgressQueryError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const code = catalogErrorCode(error);

  if (code === "UNAUTHENTICATED") {
    return (
      <SignInPrompt message="Your session has ended. Sign in again to see and save your progress." />
    );
  }
  if (code === "FORBIDDEN") {
    return (
      <p role="alert" className={bodyCopy}>
        Your account isn’t allowed to keep reading progress.
      </p>
    );
  }
  return (
    <div role="alert">
      <p className={bodyCopy}>
        We couldn’t load your reading progress. This is usually temporary.
      </p>
      <button type="button" onClick={onRetry} className={`${primaryAction} mt-5`}>
        Try again
      </button>
    </div>
  );
}

function SignedInProgress({ slug }: { slug: string }) {
  const convexAuth = useConvexAuth();

  if (convexAuth.isLoading) {
    return <PanelSkeleton label="Checking your account…" />;
  }
  if (!convexAuth.isAuthenticated) {
    return (
      <SignInPrompt message="We couldn’t verify your session. Sign in again to see and save your progress." />
    );
  }
  return (
    <QueryBoundary
      fallback={(error, retry) => (
        <ProgressQueryError error={error} onRetry={retry} />
      )}
    >
      <ProgressTracker slug={slug} />
    </QueryBoundary>
  );
}

/**
 * Reader progress for one book. Identity comes only from the existing Better
 * Auth session; the client sends a slug and a percent, never a user.
 */
export function ReadingProgressPanel({ slug }: { slug: string }) {
  const { authed, ready, configured } = useAuth();

  return (
    <PanelShell>
      {!configured ? (
        <p role="status" className={bodyCopy}>
          Reader accounts aren’t connected on this site yet, so progress can’t
          be saved right now.
        </p>
      ) : !ready ? (
        <PanelSkeleton label="Checking your account…" />
      ) : !authed ? (
        <SignInPrompt message="Sign in to keep your place in this book and save how far you’ve read." />
      ) : (
        <SignedInProgress slug={slug} />
      )}
    </PanelShell>
  );
}
