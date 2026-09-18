"use client";

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
import { focusRing, secondaryAction } from "@/lib/catalog-styles";

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
    <dl className="mb-0 mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {facts.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-[rgba(53,5,73,0.08)] bg-[var(--color-soft-lavender)]/55 p-4"
        >
          <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-plum-muted)]">
            {label}
          </dt>
          <dd className="m-0 mt-1.5 font-sans text-sm font-semibold text-[var(--color-deep-plum)]">
            {value}
          </dd>
        </div>
      ))}
      {book.formats.length > 0 ? (
        <div className="rounded-2xl border border-[rgba(53,5,73,0.08)] bg-[var(--color-soft-lavender)]/55 p-4 sm:col-span-2">
          <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-plum-muted)]">
            Available formats
          </dt>
          <dd className="m-0 mt-2.5">
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {book.formats.map((format) => (
                <li
                  key={format}
                  className="rounded-full bg-[var(--color-deep-plum)] px-3 py-1.5 font-sans text-xs font-semibold text-[var(--color-brand-surface)]"
                >
                  {formatLabel(format)}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

function BookHero({ book }: { book: CatalogBook }) {
  const description = bookDescription(book);

  return (
    <section className="grid grid-cols-1 overflow-hidden rounded-[28px] bg-[var(--color-brand-surface)] shadow-[0_12px_28px_rgba(53,5,73,0.08),0_2px_6px_rgba(53,5,73,0.04)] md:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.3fr)] lg:rounded-[36px]">
      <div className="flex items-center justify-center px-10 pb-2 pt-10 sm:px-14 md:p-10 lg:p-14">
        <div className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[268px]">
          <CatalogCover
            book={book}
            variant="detail"
            eager
            sizes="(min-width: 768px) 268px, (min-width: 640px) 240px, 200px"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center px-6 py-9 sm:px-10 md:py-12 lg:px-14 lg:py-16">
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-hot-magenta)]">
          {book.series ? book.series.title : "Standalone"}
        </div>
        <h1 className="mb-0 mt-3 text-balance break-words font-sans text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--color-deep-plum)]">
          {book.title}
        </h1>
        {book.subtitle ? (
          <p className="mb-0 mt-3 text-pretty font-serif text-xl italic leading-[1.35] text-[var(--color-plum-copy)]">
            {book.subtitle}
          </p>
        ) : null}
        {description ? (
          <p className="mb-0 mt-5 max-w-[58ch] whitespace-pre-line text-pretty text-[17px] leading-[1.7] text-[var(--color-plum-copy)]">
            {description}
          </p>
        ) : null}

        <BookFacts book={book} />

        <div className="mt-8 flex flex-wrap items-start gap-3">
          <PurchaseLink book={book} />
          <Link href="/read#backlist" className={secondaryAction}>
            Browse the backlist
          </Link>
        </div>
      </div>
    </section>
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
    <section aria-labelledby="related-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-hot-magenta)]">
            Keep exploring
          </div>
          <h2
            id="related-heading"
            className="mb-0 mt-2 text-balance font-sans text-[26px] font-bold tracking-[-0.025em] text-[var(--color-deep-plum)] sm:text-3xl"
          >
            {inSeries.length > 0 && book.series
              ? `More in ${book.series.title}`
              : "More from the library"}
          </h2>
        </div>
        <Link
          href="/read"
          className={`inline-flex min-h-11 items-center rounded-full font-sans text-sm font-semibold text-[var(--color-plum-copy)] hover:text-[var(--color-hot-magenta)] ${focusRing}`}
        >
          View all
        </Link>
      </div>
      <ul className="-mx-2 my-0 flex list-none snap-x snap-proximity gap-5 overflow-x-auto overscroll-x-contain px-2 pb-4 pt-2">
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
    </section>
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
    if (live.status === "loading") return <BookDetailSkeleton />;
    if (live.status === "offline") return <CatalogOffline />;
    return <BookNotFound />;
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <BookHero book={book} />
      <SaveBook slug={book.slug} />
      <ReadingProgressPanel slug={book.slug} />
      <QueryBoundary
        fallback={(error, retry) => (
          <CatalogQueryError error={error} onRetry={retry} />
        )}
      >
        <RelatedBooks book={book} />
      </QueryBoundary>
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
    <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-7 sm:px-8 md:pb-24 md:pt-10 lg:px-10">
      <Link
        href="/read"
        className={`mb-6 inline-flex min-h-11 items-center gap-2 rounded-full font-sans text-sm font-semibold text-[var(--color-plum-copy)] transition-colors hover:text-[var(--color-hot-magenta)] ${focusRing}`}
      >
        <span aria-hidden="true">←</span> Back to Read
      </Link>

      {catalogIsConfigured ? (
        <QueryBoundary
          fallback={(error, retry) => (
            <CatalogQueryError error={error} onRetry={retry} />
          )}
        >
          <BookDetail slug={slug} initialBook={initialBook} />
        </QueryBoundary>
      ) : (
        <CatalogUnconfigured />
      )}
    </main>
  );
}
