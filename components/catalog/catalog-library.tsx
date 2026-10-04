"use client";

import type { ReactNode } from "react";
import { BookCard } from "@/components/catalog/book-card";
import {
  CatalogEmpty,
  CatalogOffline,
  CatalogQueryError,
  CatalogUnconfigured,
  ShelfSkeleton,
  StatePanel,
} from "@/components/catalog/catalog-states";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { useCatalogQuery } from "@/components/catalog/use-catalog-query";
import { product1Grid } from "@/components/relume/product1";
import {
  CATALOG_LIST_LIMIT,
  catalogApi,
  catalogIsConfigured,
  inReadingOrder,
  standaloneBooks,
  type CatalogBook,
} from "@/lib/catalog";

export type LibraryView = "books" | "audio";

const SHELF_SIZES = "(min-width: 640px) 150px, 132px";
const GRID_SIZES =
  "(min-width: 1024px) 170px, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 45vw";

const bookGrid = product1Grid;

function SeriesShelves() {
  const series = useCatalogQuery(catalogApi.listPublishedSeries, {});

  if (series.status === "loading") return <ShelfSkeleton />;
  if (series.status === "offline") return <CatalogOffline />;

  // Series order is the backend's; a public series with no public books has
  // nothing to shelve yet.
  const shelves = series.data.filter((entry) => entry.books.length > 0);
  if (shelves.length === 0) return null;

  return (
    <div className="flex flex-col gap-14">
      {shelves.map((entry) => {
        const shelfBooks = inReadingOrder(entry.books);
        return (
          <section key={entry._id} aria-labelledby={`series-${entry._id}`}>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-hairline pb-3">
              <h3
                id={`series-${entry._id}`}
                className="m-0 font-display text-h5 font-semibold text-cream"
              >
                {entry.title}
              </h3>
              <span className="font-ui text-tiny font-semibold tracking-[0.14em] text-taupe uppercase">
                {shelfBooks.length === 1
                  ? "1 book"
                  : `${shelfBooks.length} books · in reading order`}
              </span>
            </div>
            <ul className="-mx-2 my-0 flex list-none snap-x snap-proximity gap-6 overflow-x-auto overscroll-x-contain px-2 pt-2 pb-4">
              {shelfBooks.map((book) => (
                <li
                  key={book._id}
                  className="w-[132px] flex-none snap-start sm:w-[150px]"
                >
                  <BookCard book={book} sizes={SHELF_SIZES} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Standalones() {
  const books = useCatalogQuery(catalogApi.listPublishedBooks, {
    limit: CATALOG_LIST_LIMIT,
  });

  if (books.status === "loading") return <ShelfSkeleton rows={1} />;
  if (books.status === "offline") {
    // The series shelf above already raises the connection alert.
    return (
      <p className="m-0 text-small text-body">
        Standalone titles will appear once the library reconnects.
      </p>
    );
  }
  // The book list is the authority on an empty catalog: no published books
  // means no series shelves either.
  if (books.data.length === 0) return <CatalogEmpty />;

  const standalones = standaloneBooks(books.data);
  if (standalones.length === 0) return null;

  return (
    <section aria-labelledby="standalones-heading">
      <h3
        id="standalones-heading"
        className="mt-0 mb-6 border-b border-hairline pb-3 font-display text-h5 font-semibold text-cream"
      >
        Standalones
      </h3>
      <ul className={bookGrid}>
        {standalones.map((book) => (
          <li key={book._id}>
            <BookCard book={book} sizes={GRID_SIZES} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function AudioGrid({ books }: { books: CatalogBook[] }) {
  const audiobooks = books.filter((book) => book.formats.includes("audiobook"));

  if (audiobooks.length === 0) {
    return (
      <StatePanel
        role="status"
        eyebrow="Audio"
        title="No audiobooks are listed yet"
      >
        None of the published titles has an audiobook edition in the catalog
        right now. Every other format is on the backlist.
      </StatePanel>
    );
  }

  return (
    <ul className={bookGrid}>
      {audiobooks.map((book) => (
        <li key={book._id}>
          <BookCard book={book} sizes={GRID_SIZES} />
        </li>
      ))}
    </ul>
  );
}

function AudioResults() {
  const books = useCatalogQuery(catalogApi.listPublishedBooks, {
    limit: CATALOG_LIST_LIMIT,
  });

  if (books.status === "loading") return <ShelfSkeleton rows={1} />;
  if (books.status === "offline") return <CatalogOffline />;
  if (books.data.length === 0) return <CatalogEmpty />;
  return <AudioGrid books={books.data} />;
}

function Bounded({ children }: { children: ReactNode }) {
  return (
    <QueryBoundary
      fallback={(error, retry) => (
        <CatalogQueryError error={error} onRetry={retry} />
      )}
    >
      {children}
    </QueryBoundary>
  );
}

/** Catalog-driven shelves for /read, with every contract state handled. */
export function CatalogLibrary({ view }: { view: LibraryView }) {
  if (!catalogIsConfigured) return <CatalogUnconfigured />;

  if (view === "audio") {
    return (
      <Bounded>
        <AudioResults />
      </Bounded>
    );
  }

  // Each query fails on its own, so a series error still leaves standalones.
  return (
    <div className="flex flex-col gap-14">
      <Bounded>
        <SeriesShelves />
      </Bounded>
      <Bounded>
        <Standalones />
      </Bounded>
    </div>
  );
}
