"use client";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authIsConfigured } from "@/lib/auth-client";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { StatePanel } from "@/components/catalog/catalog-states";
import Link from "next/link";
import type { FunctionReturnType } from "convex/server";
import { ChevronRight } from "relume-icons";
import { BookCard } from "@/components/catalog/book-card";
import { useCatalogQuery } from "@/components/catalog/use-catalog-query";
import { blog60Grid } from "@/components/relume/blog60";
import { product1Grid } from "@/components/relume/product1";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CATALOG_LIST_LIMIT, catalogApi, catalogIsConfigured } from "@/lib/catalog";
import { isComingSoon, recentCatalogBooks } from "@/lib/editorial-catalog";

const label = (kind: "serial" | "essay") => (kind === "essay" ? "essays" : "serials");

function FeedSkeleton() {
  return (
    <div role="status" className={blog60Grid}>
      <span className="sr-only">Loading published writing…</span>
      {[0, 1].map((n) => (
        <div key={n} aria-hidden="true" className="h-64 animate-pulse rounded-card border border-hairline bg-wine-card motion-reduce:animate-none" />
      ))}
    </div>
  );
}

type PublishedRow = FunctionReturnType<typeof api.content.listPublished>[number];

const SHELF_LIMIT = 6;

/**
 * One published serial or essay. Serials show the backend-supplied preview of the
 * latest public chapter; paid chapters are never previewed.
 */
function ContentCard({ row, wide = false }: { row: PublishedRow; wide?: boolean }) {
  const url = `/serial?slug=${encodeURIComponent(row.slug)}`;
  const cover = row.coverUrl?.startsWith("/images/") ? row.coverUrl : null;
  const preview = row.kind === "serial" ? row.latestChapterPreview : null;
  const kindLabel = row.kind === "essay" ? "Essay" : "Serial";
  return (
    <Card className={`flex size-full flex-col items-stretch ${wide ? "md:flex-row" : "sm:flex-row"}`}>
      {cover ? (
        <Link
          href={url}
          tabIndex={-1}
          aria-hidden="true"
          className={`relative aspect-[2/3] w-full flex-none overflow-hidden bg-wine-sunken ${wide ? "md:w-56" : "sm:w-44"}`}
        >
          <Image src={cover} alt="" fill sizes={wide ? "(min-width: 768px) 224px, 100vw" : "(min-width: 640px) 176px, 100vw"} className="object-cover" />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col px-5 py-6 md:p-8">
        <div className="mb-3 md:mb-4">
          <Badge>{kindLabel}</Badge>
        </div>
        <h3 className="mb-2 font-display text-h5 font-semibold text-cream">
          <Link href={url} className="transition-colors hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne">
            {row.title}
          </Link>
        </h3>
        {row.excerpt ? <p className="max-w-[65ch] text-pretty text-body">{row.excerpt}</p> : null}
        {preview ? (
          <figure className="mt-6 max-w-[65ch] border-l-2 border-champagne pl-5">
            <figcaption className="font-ui text-tiny font-semibold tracking-[0.16em] text-champagne uppercase">
              From the Latest Chapter
            </figcaption>
            <p className="mt-2 line-clamp-5 text-small text-pretty whitespace-pre-line text-body">{preview}{preview.length >= 400 ? "…" : ""}</p>
          </figure>
        ) : null}
        <Link
          href={url}
          className="mt-auto inline-flex min-h-11 items-center gap-x-2 self-start pt-5 font-ui text-tiny font-semibold tracking-[0.12em] text-champagne uppercase transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne md:pt-6"
        >
          Read
          <ChevronRight aria-hidden="true" className="size-4" />
          <span className="sr-only">: {row.title}</span>
        </Link>
      </div>
    </Card>
  );
}

function Feed({ kind }: { kind: "serial" | "essay" }) {
  const rows = useQuery(api.content.listPublished, { kind });
  if (!rows) return <FeedSkeleton />;
  if (!rows.length) {
    return (
      <StatePanel role="status" eyebrow="Nothing published yet" title={`No ${label(kind)} yet`}>
        No {label(kind)} have been published here yet.
      </StatePanel>
    );
  }
  // Serials run full width so each card has room for its latest-chapter preview.
  return (
    <div className={kind === "serial" ? "grid grid-cols-1 gap-y-8" : blog60Grid}>
      {rows.map((r) => (
        <ContentCard key={r._id} row={r} wide={kind === "serial"} />
      ))}
    </div>
  );
}

export function PublishedContent({ kind }: { kind: "serial" | "essay" }) {
  return authIsConfigured ? (
    <QueryBoundary
      fallback={(_e, retry) => (
        <StatePanel
          role="alert"
          eyebrow="Something went wrong"
          title="Published content is unavailable"
          actions={<Button type="button" onClick={retry}>Try Again</Button>}
        >
          We couldn’t load the published {label(kind)}. This is usually temporary.
        </StatePanel>
      )}
    >
      <Feed kind={kind} />
    </QueryBoundary>
  ) : (
    <StatePanel role="status" eyebrow="Not connected" title="Published content is not connected yet">
      Reading will appear here once the site is connected to its content service.
    </StatePanel>
  );
}

function Latest() {
  const serials = useQuery(api.content.listPublished, { kind: "serial", limit: 1 });
  const essays = useQuery(api.content.listPublished, { kind: "essay", limit: 1 });
  if (!serials || !essays) return <FeedSkeleton />;
  const latest = [serials[0], essays[0]].filter((row): row is PublishedRow => Boolean(row));
  if (!latest.length) {
    return (
      <StatePanel role="status" eyebrow="Nothing published yet" title="Nothing new yet">
        New serials and essays will appear here once they are published.
      </StatePanel>
    );
  }
  return (
    <div className={blog60Grid}>
      {latest.map((r) => (
        <ContentCard key={r._id} row={r} />
      ))}
      {latest.length === 1 ? <ExploreCard /> : null}
    </div>
  );
}

/** Balances the row while only one kind is published; it points to the library and claims nothing new. */
function ExploreCard() {
  return (
    <Card className="flex size-full flex-col px-5 py-6 md:p-8">
      <div className="mb-3 md:mb-4">
        <Badge>The Library</Badge>
      </div>
      <h3 className="mb-2 font-display text-h5 font-semibold text-cream">
        <Link href="/read" className="transition-colors hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne">
          More to Explore
        </Link>
      </h3>
      <p className="max-w-[65ch] text-pretty text-body">
        Explore published writing in the library, from the serials to the full backlist.
      </p>
      <Link
        href="/read"
        className="mt-auto inline-flex min-h-11 items-center gap-x-2 self-start pt-5 font-ui text-tiny font-semibold tracking-[0.12em] text-champagne uppercase transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne md:pt-6"
      >
        Go to the Library
        <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
    </Card>
  );
}

/** The latest published serial beside the latest published essay. */
export function WhatsNew() {
  return authIsConfigured ? (
    <QueryBoundary
      fallback={(_e, retry) => (
        <StatePanel
          role="alert"
          eyebrow="Something went wrong"
          title="The latest writing is unavailable"
          actions={<Button type="button" onClick={retry}>Try Again</Button>}
        >
          We couldn’t load the latest serial and essay. This is usually temporary.
        </StatePanel>
      )}
    >
      <Latest />
    </QueryBoundary>
  ) : (
    <StatePanel role="status" eyebrow="Not connected" title="Published content is not connected yet">
      Reading will appear here once the site is connected to its content service.
    </StatePanel>
  );
}

function Counts() {
  const data = useQuery(api.site.summary, {});
  if (!data || (!data.books && !data.series)) return null;
  return (
    <p className="font-ui text-tiny font-semibold tracking-[0.18em] text-taupe uppercase">
      {data.books} {data.books === 1 ? "book" : "books"} · {data.series} series · Explore the library
    </p>
  );
}

/** Live catalog totals; renders nothing until real numbers arrive (never a placeholder). */
export function CatalogCounts() {
  return authIsConfigured ? (
    <QueryBoundary fallback={() => null}>
      <Counts />
    </QueryBoundary>
  ) : null;
}

const SHELF_SIZES = "(min-width: 1024px) 170px, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 45vw";

/** Forthcoming titles first, then the newest publications, from the live catalog. */
function Shelf() {
  const books = useCatalogQuery(catalogApi.listPublishedBooks, { limit: CATALOG_LIST_LIMIT });
  if (books.status !== "ready") {
    return (
      <div role="status" className={product1Grid}>
        <span className="sr-only">{books.status === "offline" ? "Reconnecting to the library…" : "Loading books…"}</span>
        {Array.from({ length: SHELF_LIMIT }, (_, n) => (
          <div key={n} aria-hidden="true" className="aspect-[2/3] animate-pulse rounded-image bg-wine-card motion-reduce:animate-none" />
        ))}
      </div>
    );
  }
  if (!books.data.length) {
    return (
      <StatePanel role="status" eyebrow="Nothing published yet" title="The shelves are being stocked">
        No books have been published to the library yet.
      </StatePanel>
    );
  }
  // Only titles with real release information belong under a "recent" heading; undated books stay in the library.
  const dated = books.data.filter((book) => isComingSoon(book) || Boolean(book.publicationDate?.trim()));
  const shelf = recentCatalogBooks(dated).slice(0, SHELF_LIMIT);
  if (!shelf.length) {
    return (
      <StatePanel
        role="status"
        eyebrow="Release information"
        title="Release Dates Aren’t Listed Yet"
        actions={<Link href="/read" className={buttonVariants({ variant: "secondary" })}>Browse the Library</Link>}
      >
        The catalog doesn’t include publication dates or upcoming titles yet, so there’s no release
        list to show here. Every published book is in the library.
      </StatePanel>
    );
  }
  return (
    <ul className={product1Grid}>
      {shelf.map((book) => (
        <li key={book._id} className="min-w-0">
          <BookCard book={book} sizes={SHELF_SIZES} />
        </li>
      ))}
    </ul>
  );
}

export function PublishedShelf() {
  return catalogIsConfigured ? (
    <QueryBoundary
      fallback={() => (
        <StatePanel role="alert" eyebrow="Something went wrong" title="Books are temporarily unavailable">
          The recent releases couldn’t load. The full library is still available.
        </StatePanel>
      )}
    >
      <Shelf />
    </QueryBoundary>
  ) : (
    <StatePanel role="status" eyebrow="Library unavailable" title="The catalog is not connected yet">
      Books will appear here once the site is connected to its catalog service.
    </StatePanel>
  );
}
