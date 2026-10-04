"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { authIsConfigured } from "@/lib/auth-client";
import { PublishedContent } from "@/components/published-content";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { StatePanel, type HeadingLevel } from "@/components/catalog/catalog-states";
import { Header46 } from "@/components/relume/header46";
import { Blog60 } from "@/components/relume/blog60";
import { Content12 } from "@/components/relume/content12";
import { Event1Filters } from "@/components/relume/event1";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { statusText, textLink } from "@/lib/typography";
import { chapterIndexForValue, chapterOptions, clampChapterIndex } from "@/lib/chapter-selection";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-[5%] py-12 md:py-16">
      <div className="mx-auto w-full max-w-content">{children}</div>
    </div>
  );
}

function MembershipGate({ label, headingLevel }: { label: string; headingLevel?: HeadingLevel }) {
  return (
    <StatePanel
      headingLevel={headingLevel}
      eyebrow="Members only"
      title={label}
      actions={<Link href="/membership" className={buttonVariants()}>Explore Memberships</Link>}
    >
      This part of the story is available to Circle members.
    </StatePanel>
  );
}

function Chapters({ id }: { id: Id<"content"> }) {
  const rows = useQuery(api.content.chaptersForContent, { contentId: id });
  const [selected, setSelected] = useState(0);
  if (!rows) return <Shell><p role="status" className={statusText}>Loading chapters…</p></Shell>;
  if (!rows.length) {
    return (
      <Shell>
        <StatePanel role="status" eyebrow="Coming soon" title="No Chapters Yet">
          No chapters have been published yet.
        </StatePanel>
      </Shell>
    );
  }
  // Selection is by chapter `_id`/index; titles are labels only and may repeat.
  const currentIndex = clampChapterIndex(rows, selected);
  const current = rows[currentIndex];
  return (
    <>
      <div className="px-[5%]">
        <div className="mx-auto w-full max-w-[42rem]">
          <nav aria-label="Chapters">
            <Event1Filters<string>
              label="Chapters"
              options={chapterOptions(rows)}
              value={current._id}
              onChange={(chapterId) => setSelected(chapterIndexForValue(rows, chapterId))}
            />
          </nav>
        </div>
      </div>
      <Content12
        className="pt-0 md:pt-0 lg:pt-0"
        metatags={[
          { title: "Chapter", description: `${currentIndex + 1} of ${rows.length}` },
          { title: "Access", description: current.hasAccess ? "Open to read" : "Members only" },
        ]}
      >
        <h2>{current.title}</h2>
        {current.hasAccess ? (
          <div className="whitespace-pre-wrap">{current.body || "Chapter text is not available yet."}</div>
        ) : (
          <>
            <p>This chapter is available to Circle members.</p>
            <p>
              <Link href="/membership">Membership Required to Read This Chapter</Link>
            </p>
          </>
        )}
      </Content12>
    </>
  );
}

function Reader({ slug }: { slug: string }) {
  const item = useQuery(api.content.bySlug, { slug });
  if (item === undefined) {
    return (
      <Shell>
        <h1 className="sr-only">Loading Publication</h1>
        <p role="status" className={statusText}>Loading…</p>
      </Shell>
    );
  }
  if (!item) {
    return (
      <Shell>
        <StatePanel
          headingLevel="h1"
          eyebrow="Not available"
          title="This Publication Is Not Available"
          actions={<Link href="/read" className={buttonVariants()}>Browse the Library</Link>}
        >
          It may have been unpublished or moved. Everything available is in the library.
        </StatePanel>
      </Shell>
    );
  }
  return (
    <>
      <header className="px-[5%] pt-10 pb-10 md:pt-14 md:pb-14">
        <div className="mx-auto grid w-full max-w-content grid-cols-1 items-center gap-10 md:grid-cols-[auto_1fr] md:gap-14">
          {item.coverUrl?.startsWith("/images/") ? (
            <div className="relative mx-auto aspect-[5/8] w-44 overflow-hidden rounded-image shadow-[0_28px_48px_-24px_rgb(0_0_0/0.8)] ring-1 ring-hairline sm:w-52 md:mx-0">
              <Image src={item.coverUrl} alt={`Cover of ${item.title}`} fill sizes="208px" loading="eager" className="object-cover" />
            </div>
          ) : null}
          <div className="min-w-0">
            <Badge className="mb-4">{item.kind === "serial" ? "Serial" : "Essay"}</Badge>
            <h1 className="mb-5 font-display text-h1 font-semibold text-balance text-cream">{item.title}</h1>
            <p className="max-w-[56ch] text-medium text-pretty text-body">{item.excerpt}</p>
          </div>
        </div>
      </header>
      {item.kind === "serial" ? (
        <Chapters id={item._id} />
      ) : item.hasAccess ? (
        <Content12>
          <div className="whitespace-pre-wrap">{item.body || "Full text is not available yet."}</div>
        </Content12>
      ) : (
        <Shell>
          <MembershipGate label="Membership Required" />
        </Shell>
      )}
    </>
  );
}

export default function SerialPage({ slug }: { slug?: string }) {
  return (
    <main>
      <div className="px-[5%] pt-6">
        <div className="mx-auto w-full max-w-content">
          <Link href="/read" className={textLink}>
            <span aria-hidden="true">←</span> Back to Read
          </Link>
        </div>
      </div>
      {!authIsConfigured ? (
        <Shell>
          <StatePanel headingLevel="h1" role="status" eyebrow="Not connected" title="Reading Is Not Connected Yet">
            Serials and essays will appear here once the site is connected to its content service.
          </StatePanel>
        </Shell>
      ) : (
        <QueryBoundary
          fallback={(_e, retry) => (
            <Shell>
              <StatePanel
                headingLevel="h1"
                role="alert"
                eyebrow="Something went wrong"
                title="Reading Is Temporarily Unavailable"
                actions={<Button type="button" onClick={retry}>Try Again</Button>}
              >
                We couldn’t load this page. This is usually temporary.
              </StatePanel>
            </Shell>
          )}
        >
          {slug ? (
            <Reader slug={slug} />
          ) : (
            <>
              <Header46
                className="pt-10 md:pt-14 lg:pt-16"
                tagline="#TheSerial"
                heading="Serials"
                description="Fiction published chapter by chapter. Start from the beginning — the opening chapters are free."
              />
              <div className="px-[5%] pb-16 md:pb-24">
                <Blog60 bare heading="Now Publishing" headingId="serial-list-heading">
                  <PublishedContent kind="serial" />
                </Blog60>
              </div>
            </>
          )}
        </QueryBoundary>
      )}
    </main>
  );
}
