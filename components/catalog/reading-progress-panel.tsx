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
import { Card } from "@/components/ui/card";

const PROGRESS_STEP = 5;

const bodyCopy = "m-0 max-w-[52ch] text-pretty text-body";

function PanelShell({ children }: { children: ReactNode }) {
  return (
    <Card>
      <section aria-labelledby="reading-progress-heading" className="p-6 sm:p-8">
        <div className="font-ui text-tiny font-semibold tracking-[0.22em] text-champagne uppercase">
          Your Reading
        </div>
        <h2
          id="reading-progress-heading"
          className="mt-2 mb-4 font-display text-h4 font-semibold text-cream"
        >
          Track Your Progress
        </h2>
        {children}
      </section>
    </Card>
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
        <p className="m-0 font-ui text-small font-semibold text-cream">
          {saved === null
            ? "Not started yet"
            : saved.completed
              ? "Finished"
              : `${savedPercent}% read`}
        </p>
        {saved ? (
          <p className="m-0 text-tiny text-taupe">
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
        className="mt-3 block h-1.5 w-full appearance-none overflow-hidden rounded-full bg-wine-sunken [&::-moz-progress-bar]:bg-champagne [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-champagne"
      />

      <form onSubmit={handleSubmit} className="mt-6">
        <label
          htmlFor="reading-progress-input"
          className="flex items-baseline justify-between gap-3 font-ui text-small font-semibold text-cream"
        >
          How far along are you?
          <output
            htmlFor="reading-progress-input"
            className="font-ui text-small font-bold text-champagne tabular-nums"
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
          className={`mt-1 h-11 w-full cursor-pointer rounded-full accent-champagne disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
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
          className={`mt-3 mb-0 min-h-5 text-small font-semibold ${
            save.status === "error" ? "text-rose" : "text-body"
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
