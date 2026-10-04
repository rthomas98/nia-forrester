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
import { Header1 } from "@/components/relume/header1";
import { Stat3 } from "@/components/relume/stat3";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cardVariants } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { alertText, fieldLabel, heading2, heading3, heading4, muted, statusText, tagline } from "@/lib/typography";

const button = buttonVariants();
const card = `${cardVariants()} p-6 text-body sm:p-8`;
const listDivider = "border-t border-hairline";

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
      <button type="button" onClick={close} className={`mb-5 ${buttonVariants({ variant: "link", size: "link" })}`}>
        ← All Discussions
      </button>
      {discussion === undefined ? (
        <p role="status" className={statusText}>Loading discussion…</p>
      ) : discussion === null ? (
        <p className={statusText}>This discussion is no longer available.</p>
      ) : (
        <>
          <h2 className={heading3}>{discussion.title}</h2>
          <p className={`mt-1 mb-4 ${muted}`}>{discussion.author}</p>
          <p className="whitespace-pre-wrap break-words">{discussion.body}</p>
          <h3 className="mt-10 mb-2 font-ui text-tiny font-semibold tracking-[0.2em] text-champagne uppercase">
            Replies ({discussion.posts.length})
          </h3>
          {discussion.posts.length === 0 && (
            <p className={statusText}>No replies yet. Start the conversation.</p>
          )}
          {discussion.posts.map((post) => (
            <article
              key={post._id}
              className={`mt-4 pt-4 ${listDivider}`}
            >
              <p className="font-ui text-small font-semibold text-cream">{post.author}</p>
              {post.spoilerChapter ? (
                <details className="mt-1">
                  <summary className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-ui text-small font-semibold text-champagne">
                    <Badge variant="alert">Spoiler</Badge> Chapter {post.spoilerChapter}
                  </summary>
                  <p className="whitespace-pre-wrap break-words">{post.body}</p>
                </details>
              ) : (
                <p className="whitespace-pre-wrap break-words">{post.body}</p>
              )}
            </article>
          ))}
          {discussion.status === "open" && (
            <form onSubmit={submit} className="mt-8 grid gap-4">
              <label className={fieldLabel}>
                Your Reply
                <Textarea
                  rows={4}
                  required
                  maxLength={10000}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={busy || !body.trim()}
                className={`${button} justify-self-start`}
              >
                {busy ? "Posting…" : "Post Reply"}
              </button>
            </form>
          )}
          {error && <p role="alert" className={`mt-3 ${alertText}`}>{error}</p>}
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
              <h2 className={`mb-4 ${heading3}`}>Active Discussions</h2>
              {discussions === undefined ? (
                <p role="status" className={statusText}>Loading discussions…</p>
              ) : discussions.length === 0 ? (
                <p className={statusText}>
                  No discussions yet. Share the first reading thought with the
                  Circle.
                </p>
              ) : (
                discussions.map((d) => (
                  <button
                    type="button"
                    key={d._id}
                    onClick={() => setSelected(d._id)}
                    className={`group block w-full cursor-pointer py-5 text-left break-words focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne ${listDivider}`}
                  >
                    <span className="block font-display text-h6 font-semibold text-cream transition-colors group-hover:text-champagne">
                      {d.title}
                    </span>
                    <span className={muted}>
                      {d.author} · {d.replies} replies
                    </span>
                  </button>
                ))
              )}
            </Panel>
            <Panel>
              <h2 className={`mb-5 ${heading4}`}>Start a Discussion</h2>
              <form onSubmit={submit} className="grid gap-5">
                <label className={fieldLabel}>
                  Title
                  <Input
                    required
                    maxLength={160}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label className={fieldLabel}>
                  Your Message
                  <Textarea
                    rows={5}
                    required
                    maxLength={10000}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  className={`${button} justify-self-start`}
                  disabled={busy || !title.trim() || !body.trim()}
                >
                  {busy ? "Posting…" : "Post Discussion"}
                </button>
              </form>
            </Panel>
          </>
        )}
        {error && (
          <p role="alert" className={`${card} ${alertText}`}>
            {error}
          </p>
        )}
      </div>
      <div className="min-w-0 space-y-6">
        <Panel>
          <h2 className={`mb-4 ${heading3}`}>Book Clubs</h2>
          {clubs === undefined ? (
            <p role="status" className={statusText}>Loading clubs…</p>
          ) : clubs.length === 0 ? (
            <p className={statusText}>
              No book clubs have opened yet. New clubs will appear here when
              they’re ready.
            </p>
          ) : (
            clubs.map((club) => (
              <article
                key={club._id}
                className={`py-5 ${listDivider}`}
              >
                <h3 className="font-display text-h6 font-semibold text-cream">{club.name}</h3>
                <p className="mt-1">{club.description}</p>
                <p className={`mt-1 mb-4 ${muted}`}>{club.members} members</p>
                <button
                  type="button"
                  className={buttonVariants({ variant: club.joined ? "secondary" : "default", size: "sm" })}
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
          <h2 className={`mb-4 ${heading3}`}>Upcoming Circle Sessions</h2>
          {sessions === undefined ? (
            <p role="status" className={statusText}>Loading sessions…</p>
          ) : sessions.length === 0 ? (
            <p className={statusText}>No sessions are scheduled yet.</p>
          ) : (
            sessions.map((session) => (
              <p key={session._id} className={`py-3 ${listDivider}`}>
                <Link className="font-display text-h6 font-semibold text-cream underline-offset-4 hover:text-champagne hover:underline" href="/events">
                  {session.title}
                </Link>
                <span className={`block ${muted}`}>
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
      <Stat3
        label="Community statistics"
        stats={[
          { title: "Members", value: overview?.members },
          { title: "Discussions", value: overview?.threads },
          { title: "Book Clubs", value: overview?.clubs },
        ].map((stat) => ({
          title: stat.title,
          value: stat.value === undefined ? "—" : stat.value.toLocaleString(),
        }))}
      />
      <div className="mt-8">
        {!overview ? (
          <Panel>
            <p role="status" className={statusText}>Loading the Reader Circle…</p>
          </Panel>
        ) : overview.access === "member" ? (
          <MemberRoom />
        ) : (
          <Panel>
            <p className={tagline}>Membership</p>
            <h2 className={`mb-4 ${heading3}`}>
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
            <div className="mt-6 flex flex-wrap items-center gap-4">
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
                      className={buttonVariants({ variant: "secondary" })}
                      href="/signin"
                    >
                      Already a Member? Sign In
                    </Link>
                  )}
                </>
              )}
            </div>
            {error && <p role="alert" className={`mt-3 ${alertText}`}>{error}</p>}
          </Panel>
        )}
      </div>
    </>
  );
}

export default function CommunityPage() {
  return (
    <main>
      <Header1
        tagline="Paid Members · Connect"
        heading="The Reader Circle"
        description={
          <p className="max-w-xl">
            A private home for Black women&apos;s fiction. Book clubs,
            character debates, and conversations that stay with you long after
            the last page.
          </p>
        }
        actions={
          <a href="#circle" className={button}>
            Find Your Place ↗
          </a>
        }
        media={
          <div className="relative aspect-[4/3] overflow-hidden rounded-image ring-1 ring-hairline">
            <Image
              src="/images/reader-circle.png"
              alt="An imagined book-club gathering of four women sharing a novel and conversation"
              fill
              priority
              sizes="(max-width: 1023px) 90vw, 560px"
              className="object-cover"
            />
          </div>
        }
      />
      <section
        id="circle"
        aria-label="The Circle"
        className="scroll-mt-24 border-t border-hairline px-[5%] py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-content">
          {!authIsConfigured ? (
            <Panel>
              <h2 className={`mb-3 ${heading3}`}>
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
                  <h2 className={`mb-3 ${heading3}`}>
                    We Couldn’t Load the Circle
                  </h2>
                  <p>
                    Check your connection and membership status, then try again.
                  </p>
                  <button type="button" className={`mt-6 ${button}`} onClick={retry}>
                    Try Again
                  </button>
                </Panel>
              )}
            >
              <ConnectedCommunity />
            </QueryBoundary>
          )}
          <div className="mt-20 border-t border-hairline pt-14">
            <p className={tagline}>House Rules</p>
            <h2 className={heading2}>How We Read Together</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-12">
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
                <div key={rule.title} className="border-t border-champagne/40 pt-5">
                  <h3 className="mb-2 font-display text-h5 font-semibold text-cream">{rule.title}</h3>
                  <p className="text-body">{rule.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
