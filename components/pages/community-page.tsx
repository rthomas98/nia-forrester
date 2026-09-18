"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { authIsConfigured } from "@/lib/auth-client";

const button =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-hot-magenta)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const field =
  "mt-2 block w-full rounded-xl border border-[var(--color-soft-lavender)] bg-white p-3 text-[var(--color-deep-plum)]";
const card =
  "rounded-[28px] border border-white/50 bg-[var(--color-brand-surface)] p-6 shadow-sm sm:p-8";

function message(error: unknown) {
  return error instanceof ConvexError &&
    typeof error.data === "object" &&
    error.data &&
    "message" in error.data
    ? String(error.data.message)
    : "We couldn’t complete that request. Please try again.";
}
function Panel({ children }: { children: ReactNode }) {
  return <div className={card}>{children}</div>;
}

function Discussion({ id, close }: { id: Id<"threads">; close: () => void }) {
  const discussion = useQuery(api.readerCircle.discussion, { threadId: id });
  const reply = useMutation(api.community.reply);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await reply({ threadId: id, body });
      setBody("");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel>
      <button type="button" onClick={close} className="mb-5 min-h-11 text-sm font-semibold">
        ← All Discussions
      </button>
      {discussion === undefined ? (
        <p role="status">Loading discussion…</p>
      ) : discussion === null ? (
        <p>This discussion is no longer available.</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold">{discussion.title}</h2>
          <p className="text-sm opacity-70">{discussion.author}</p>
          <p className="whitespace-pre-wrap break-words">{discussion.body}</p>
          <h3 className="mt-8 font-bold">
            Replies ({discussion.posts.length})
          </h3>
          {discussion.posts.length === 0 && (
            <p>No replies yet. Start the conversation.</p>
          )}
          {discussion.posts.map((post) => (
            <article
              key={post._id}
              className="mt-4 border-t border-[var(--color-soft-lavender)] pt-4"
            >
              <p className="font-semibold">{post.author}</p>
              {post.spoilerChapter ? (
                <details>
                  <summary className="cursor-pointer">
                    Spoiler: Chapter {post.spoilerChapter}
                  </summary>
                  <p className="whitespace-pre-wrap break-words">{post.body}</p>
                </details>
              ) : (
                <p className="whitespace-pre-wrap break-words">{post.body}</p>
              )}
            </article>
          ))}
          {discussion.status === "open" && (
            <form onSubmit={submit} className="mt-6">
              <label className="font-semibold">
                Your Reply
                <textarea
                  className={field}
                  required
                  maxLength={10000}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={busy || !body.trim()}
                className={`${button} mt-4`}
              >
                {busy ? "Posting…" : "Post Reply"}
              </button>
            </form>
          )}
          {error && <p role="alert">{error}</p>}
        </>
      )}
    </Panel>
  );
}

function MemberRoom() {
  const discussions = useQuery(api.readerCircle.discussions);
  const clubs = useQuery(api.readerCircle.clubs);
  const sessions = useQuery(api.readerCircle.sessions);
  const create = useMutation(api.community.createThread);
  const joinClub = useMutation(api.readerCircle.joinClub);
  const [selected, setSelected] = useState<Id<"threads"> | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const id = await create({ title, body, tags: [] });
      setTitle("");
      setBody("");
      setSelected(id);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function join(id: Id<"clubs">) {
    setBusy(true);
    setError("");
    try {
      await joinClub({ clubId: id });
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0 space-y-6">
        {selected ? (
          <Discussion id={selected} close={() => setSelected(null)} />
        ) : (
          <>
            <Panel>
              <h2 className="text-2xl font-bold">Active Discussions</h2>
              {discussions === undefined ? (
                <p role="status">Loading discussions…</p>
              ) : discussions.length === 0 ? (
                <p>
                  No discussions yet. Share the first reading thought with the
                  Circle.
                </p>
              ) : (
                discussions.map((d) => (
                  <button
                    type="button"
                    key={d._id}
                    onClick={() => setSelected(d._id)}
                    className="block w-full break-words border-t border-[var(--color-soft-lavender)] py-5 text-left"
                  >
                    <span className="block text-lg font-semibold">
                      {d.title}
                    </span>
                    <span className="text-sm opacity-70">
                      {d.author} · {d.replies} replies
                    </span>
                  </button>
                ))
              )}
            </Panel>
            <Panel>
              <h2 className="text-xl font-bold">Start a Discussion</h2>
              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  Title
                  <input
                    className={field}
                    required
                    maxLength={160}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label className="block">
                  Your Message
                  <textarea
                    className={field}
                    required
                    maxLength={10000}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  className={button}
                  disabled={busy || !title.trim() || !body.trim()}
                >
                  {busy ? "Posting…" : "Post Discussion"}
                </button>
              </form>
            </Panel>
          </>
        )}
        {error && (
          <p role="alert" className={card}>
            {error}
          </p>
        )}
      </div>
      <div className="min-w-0 space-y-6">
        <Panel>
          <h2 className="text-2xl font-bold">Book Clubs</h2>
          {clubs === undefined ? (
            <p role="status">Loading clubs…</p>
          ) : clubs.length === 0 ? (
            <p>
              No book clubs have opened yet. New clubs will appear here when
              they’re ready.
            </p>
          ) : (
            clubs.map((club) => (
              <article
                key={club._id}
                className="border-t border-[var(--color-soft-lavender)] py-4"
              >
                <h3 className="font-bold">{club.name}</h3>
                <p>{club.description}</p>
                <p className="text-sm">{club.members} members</p>
                <button
                  type="button"
                  className={button}
                  disabled={busy || club.joined || !club.eligible}
                  onClick={() => void join(club._id)}
                >
                  {club.joined
                    ? "Joined"
                    : club.eligible
                      ? "Join Club"
                      : "Higher Membership Required"}
                </button>
              </article>
            ))
          )}
        </Panel>
        <Panel>
          <h2 className="text-2xl font-bold">Upcoming Circle Sessions</h2>
          {sessions === undefined ? (
            <p role="status">Loading sessions…</p>
          ) : sessions.length === 0 ? (
            <p>No sessions are scheduled yet.</p>
          ) : (
            sessions.map((session) => (
              <p key={session._id}>
                <Link className="underline" href="/events">
                  {session.title}
                </Link>
                <span className="block text-sm">
                  {new Date(session.startsAt).toLocaleDateString()}
                </span>
              </p>
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}

function ConnectedCommunity() {
  const { isLoading } = useConvexAuth();
  const overview = useQuery(api.readerCircle.overview, isLoading ? "skip" : {});
  const join = useMutation(api.readerCircle.join);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function enter() {
    setBusy(true);
    setError("");
    try {
      await join({});
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div
        className="grid grid-cols-3 gap-3 border-y border-[var(--color-deep-plum)]/15 py-7 text-center"
        aria-label="Community statistics"
      >
        {[
          { label: "Members", value: overview?.members },
          { label: "Discussions", value: overview?.threads },
          { label: "Book Clubs", value: overview?.clubs },
        ].map((stat) => (
          <div key={stat.label}>
            <span className="block font-serif text-4xl">
              {stat.value === undefined ? "—" : stat.value.toLocaleString()}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8">
        {!overview ? (
          <Panel>
            <p role="status">Loading the Reader Circle…</p>
          </Panel>
        ) : overview.access === "member" ? (
          <MemberRoom />
        ) : (
          <Panel>
            <h2 className="text-2xl font-bold">
              {overview.access === "eligible"
                ? "Your Place in the Circle Is Ready"
                : "A Space for Paid Members"}
            </h2>
            <p>
              {overview.members === 0
                ? "The Circle is just beginning. There are no members yet. "
                : ""}
              {overview.access === "eligible"
                ? "Join to take part in private discussions and book clubs."
                : "An active paid membership is required to join, read discussions, and participate in book clubs. A free account does not include community access."}
            </p>
            <div className="flex flex-wrap gap-3">
              {overview.access === "eligible" ? (
                <button
                  type="button"
                  className={button}
                  disabled={busy}
                  onClick={() => void enter()}
                >
                  {busy ? "Joining…" : "Join the Circle"}
                </button>
              ) : (
                <>
                  <Link className={button} href="/membership">
                    Explore Paid Memberships
                  </Link>
                  {overview.access === "anonymous" && (
                    <Link
                      className="inline-flex min-h-11 items-center px-4 font-semibold underline"
                      href="/signin"
                    >
                      Already a Member? Sign In
                    </Link>
                  )}
                </>
              )}
            </div>
            {error && <p role="alert">{error}</p>}
          </Panel>
        )}
      </div>
    </>
  );
}

export default function CommunityPage() {
  return (
    <main className="text-[var(--color-deep-plum)]">
      <section className="bg-[var(--color-deep-plum)] text-[var(--color-soft-lavender)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-hot-magenta)]">
              Paid Members · Connect
            </p>
            <h1 className="my-5 text-4xl font-bold tracking-tight sm:text-5xl">
              The Reader Circle
            </h1>
            <p className="max-w-xl text-lg leading-relaxed">
              A private home for Black women&apos;s fiction. Book clubs,
              character debates, and conversations that stay with you long after
              the last page.
            </p>
            <a href="#circle" className={`${button} mt-5`}>
              Find Your Place ↗
            </a>
          </div>
          <div className="relative pt-4 pr-4">
            <span
              aria-hidden="true"
              className="absolute inset-0 bottom-4 left-4 rounded-[28px] border border-[var(--color-soft-lavender)]/25"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
              <Image
                src="/images/reader-circle.png"
                alt="An imagined book-club gathering of four women sharing a novel and conversation"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 540px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        id="circle"
        className="mx-auto max-w-[1240px] scroll-mt-8 px-5 py-10 sm:px-10"
      >
        {!authIsConfigured ? (
          <Panel>
            <h2 className="text-xl font-bold">
              The Circle Is Temporarily Unavailable
            </h2>
            <p>
              Membership information couldn’t be loaded. Please check back
              shortly.
            </p>
          </Panel>
        ) : (
          <QueryBoundary
            fallback={(_error, retry) => (
              <Panel>
                <h2 className="text-xl font-bold">
                  We Couldn’t Load the Circle
                </h2>
                <p>
                  Check your connection and membership status, then try again.
                </p>
                <button type="button" className={button} onClick={retry}>
                  Try Again
                </button>
              </Panel>
            )}
          >
            <ConnectedCommunity />
          </QueryBoundary>
        )}
        <div className="mt-12">
          <h2 className="text-2xl font-bold">How We Read Together</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Keep Spoilers Behind the Cut",
                body: "Name the chapter before sharing a spoiler. Everyone reads at her own pace.",
              },
              {
                title: "Discuss the Book with Care",
                body: "Strong opinions are welcome. Treat every reader with respect.",
              },
              {
                title: "Make Room for Each Other",
                body: "Listen closely, share thoughtfully, and welcome new voices.",
              },
            ].map((rule) => (
              <div key={rule.title}>
                <h3 className="font-bold">{rule.title}</h3>
                <p>{rule.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
