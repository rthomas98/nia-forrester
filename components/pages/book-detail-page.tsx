"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BookCard } from "@/components/catalog/book-card";
import { CatalogCover } from "@/components/catalog/catalog-cover";
import {
  BookDetailSkeleton,
  BookNotFound,
  CatalogOffline,
  CatalogQueryError,
  CatalogUnconfigured,
  ShelfSkeleton,
} from "@/components/catalog/catalog-states";
import { PurchaseLink } from "@/components/catalog/purchase-link";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { ReadingProgressPanel } from "@/components/catalog/reading-progress-panel";
import { SaveBook } from "@/components/catalog/save-book";
import { useCatalogQuery } from "@/components/catalog/use-catalog-query";
import {
  CATALOG_LIST_LIMIT,
  bookDescription,
  catalogApi,
  catalogIsConfigured,
  formatLabel,
  formatPublicationDate,
  inReadingOrder,
  type CatalogBook,
} from "@/lib/catalog";
import { secondaryAction } from "@/lib/catalog-styles";
import { getSignedCopyOffer } from "@/lib/legacy-offers";
import { ProductHeader1 } from "@/components/relume/product-header1";
import { Product1 } from "@/components/relume/product1";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RELATED_LIMIT = 6;

function BookFacts({ book }: { book: CatalogBook }) {
  const published = formatPublicationDate(book.publicationDate);
  const facts: Array<[label: string, value: string]> = [];
  if (book.series) {
    facts.push([
      "Series",
      book.seriesPosition === undefined
        ? book.series.title
        : `${book.series.title} · Book ${book.seriesPosition}`,
    ]);
  }
  if (published) facts.push(["Published", published]);

  if (facts.length === 0 && book.formats.length === 0) return null;

  return (
    <dl className="mt-8 mb-0 grid grid-cols-1 gap-x-8 gap-y-5 border-y border-scheme-border py-6 sm:grid-cols-2">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt className="font-ui text-tiny font-semibold tracking-[0.16em] text-champagne uppercase">
            {label}
          </dt>
          <dd className="m-0 mt-1.5 text-cream">
            {value}
          </dd>
        </div>
      ))}
      {book.formats.length > 0 ? (
        <div className="sm:col-span-2">
          <dt className="font-ui text-tiny font-semibold tracking-[0.16em] text-champagne uppercase">
            Available Formats
          </dt>
          <dd className="m-0 mt-2.5">
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {book.formats.map((format) => (
                <li key={format}>
                  <Badge variant="outline">{formatLabel(format)}</Badge>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** A signed copy, only when the original shop lists this title; the request starts on this site. */
function SignedCopy({ book }: { book: CatalogBook }) {
  const offer = getSignedCopyOffer(book.title);
  if (!offer) return null;
  const price = usd.format(offer.priceInCents / 100);
  return (
    <Link href={`/signed-copy/${book.slug}`} className={`${secondaryAction} self-start`}>
      Signed &amp; Personalized Copy · {price}
    </Link>
  );
}

function BookHero({ book }: { book: CatalogBook }) {
  const description = bookDescription(book);

  return (
    <ProductHeader1
      breadcrumbs={[
        { url: "/read", title: "Read" },
        { url: "/read#backlist", title: book.series ? book.series.title : "Standalones" },
        { title: book.title },
      ]}
      media={
        <CatalogCover
          book={book}
          variant="detail"
          eager
          sizes="(min-width: 1024px) 400px, 288px"
        />
      }
    >
      <p className="mb-3 font-ui text-tiny font-semibold tracking-[0.22em] text-champagne uppercase md:mb-4">
        {book.series ? book.series.title : "Standalone"}
      </p>
      <h1 className="mb-0 font-display text-h2 font-semibold text-balance break-words text-cream">
        {book.title}
      </h1>
      {book.subtitle ? (
        <p className="mt-3 mb-0 font-display text-h6 leading-snug text-pretty text-body">
          {book.subtitle}
        </p>
      ) : null}
      {description ? (
        <p className="mt-6 mb-0 max-w-[60ch] text-medium text-pretty whitespace-pre-line text-body">
          {description}
        </p>
      ) : null}

      <BookFacts book={book} />

      <div className="mt-8 flex flex-wrap items-start gap-4">
        <PurchaseLink book={book} />
        <SignedCopy book={book} />
        <Link href="/read#backlist" className={secondaryAction}>
          Browse the Backlist
        </Link>
      </div>
    </ProductHeader1>
  );
}

function RelatedBooks({ book }: { book: CatalogBook }) {
  const books = useCatalogQuery(catalogApi.listPublishedBooks, {
    limit: CATALOG_LIST_LIMIT,
  });

  if (books.status === "loading") return <ShelfSkeleton rows={1} />;
  if (books.status === "offline") return <CatalogOffline />;

  const others = books.data.filter((candidate) => candidate._id !== book._id);
  const seriesId = book.series?._id;
  const inSeries = seriesId
    ? inReadingOrder(
        others.filter((candidate) => candidate.series?._id === seriesId),
      )
    : [];
  const related = inSeries.length > 0 ? inSeries : others.slice(0, RELATED_LIMIT);

  if (related.length === 0) return null;

  return (
    <Product1
      bare
      tagline="Keep Exploring"
      heading={
        inSeries.length > 0 && book.series
          ? `More in ${book.series.title}`
          : "More From the Library"
      }
      headingId="related-heading"
      headingLevel="h2"
      viewAll={
        <Link href="/read" className={buttonVariants({ variant: "secondary" })}>
          View All
        </Link>
      }
    >
      <ul className="-mx-2 my-0 flex list-none snap-x snap-proximity gap-6 overflow-x-auto overscroll-x-contain px-2 pt-2 pb-4">
        {related.map((candidate) => (
          <li
            key={candidate._id}
            className="w-[132px] flex-none snap-start sm:w-[150px]"
          >
            <BookCard
              book={candidate}
              sizes="(min-width: 640px) 150px, 132px"
            />
          </li>
        ))}
      </ul>
    </Product1>
  );
}

function BookDetail({
  slug,
  initialBook,
}: {
  slug: string;
  initialBook: CatalogBook | null;
}) {
  const live = useCatalogQuery(catalogApi.bookBySlug, { slug });

  // The server-rendered book is shown until the reactive query resolves; a
  // resolved `null` always wins so an unpublished book disappears.
  const book = live.status === "ready" ? live.data : initialBook;

  if (book === null) {
    if (live.status === "loading") return <Padded><h1 className="sr-only">Loading Book</h1><BookDetailSkeleton /></Padded>;
    if (live.status === "offline") return <Padded><CatalogOffline headingLevel="h1" /></Padded>;
    return <Padded><BookNotFound headingLevel="h1" /></Padded>;
  }

  return (
    <>
      <BookHero book={book} />
      <section aria-label="Your copy" className="border-t border-hairline px-[5%] py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-content grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <SaveBook slug={book.slug} />
          <ReadingProgressPanel slug={book.slug} />
        </div>
      </section>
      <div className="border-t border-hairline px-[5%] py-16 md:py-24">
        <div className="mx-auto w-full max-w-content">
          <QueryBoundary
            fallback={(error, retry) => (
              <CatalogQueryError error={error} onRetry={retry} />
            )}
          >
            <RelatedBooks book={book} />
          </QueryBoundary>
        </div>
      </div>
    </>
  );
}

function Padded({ children }: { children: ReactNode }) {
  return (
    <div className="px-[5%] pt-8 pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-content">{children}</div>
    </div>
  );
}

export default function BookDetailPage({
  slug,
  initialBook,
}: {
  slug: string;
  initialBook: CatalogBook | null;
}) {
  return (
    <main>
      {catalogIsConfigured ? (
        <QueryBoundary
          fallback={(error, retry) => (
            <Padded>
              <CatalogQueryError error={error} onRetry={retry} headingLevel="h1" />
            </Padded>
          )}
        >
          <BookDetail slug={slug} initialBook={initialBook} />
        </QueryBoundary>
      ) : (
        <Padded>
          <CatalogUnconfigured headingLevel="h1" />
        </Padded>
      )}
    </main>
  );
}
