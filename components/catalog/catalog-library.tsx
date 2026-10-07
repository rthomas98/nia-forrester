"use client";

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
  type CatalogBook,
} from "@/lib/catalog";
import { groupEditorialBooks } from "@/lib/editorial-catalog";

export type LibraryView = "books" | "audio";

const GRID_SIZES =
  "(min-width: 1024px) 170px, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 45vw";

type Shelf = ReturnType<typeof groupEditorialBooks>[number];

const isAudiobook = (book: CatalogBook) => book.formats.includes("audiobook");

function EditorialShelf({ shelf, view }: { shelf: Shelf; view: LibraryView }) {
  const headingId = `${view}-shelf-${shelf.key}`;
  return (
    <section aria-labelledby={shelf.title ? headingId : undefined}>
      {shelf.title ? (
        <h3
          id={headingId}
          className="mt-0 mb-6 border-b border-hairline pb-3 font-display text-h5 font-semibold text-cream"
        >
          {shelf.title}
        </h3>
      ) : null}
      <ul className={product1Grid}>
        {shelf.books.map((book) => (
          <li key={book._id}>
            <BookCard book={book} sizes={GRID_SIZES} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The editorial shelves from `groupEditorialBooks`, which places every book
 * exactly once. The audio view keeps the same grouping, limited to titles with
 * an audiobook edition.
 */
function Shelves({ view }: { view: LibraryView }) {
  const books = useCatalogQuery(catalogApi.listPublishedBooks, {
    limit: CATALOG_LIST_LIMIT,
  });

  if (books.status === "loading") return <ShelfSkeleton />;
  if (books.status === "offline") return <CatalogOffline />;
  if (books.data.length === 0) return <CatalogEmpty />;

  const shelves = groupEditorialBooks(books.data)
    .map((shelf) =>
      view === "audio" ? { ...shelf, books: shelf.books.filter(isAudiobook) } : shelf,
    )
    .filter((shelf) => shelf.books.length > 0);

  if (shelves.length === 0) {
    return (
      <StatePanel role="status" eyebrow="Audio" title="No audiobooks are listed yet">
        None of the published titles has an audiobook edition in the catalog
        right now. Every other format is on the backlist.
      </StatePanel>
    );
  }

  return (
    <div className="flex flex-col gap-14">
      {shelves.map((shelf) => (
        <EditorialShelf key={shelf.key} shelf={shelf} view={view} />
      ))}
    </div>
  );
}

/** Catalog-driven shelves for /read, with every contract state handled. */
export function CatalogLibrary({ view }: { view: LibraryView }) {
  if (!catalogIsConfigured) return <CatalogUnconfigured />;

  return (
    <QueryBoundary
      fallback={(error, retry) => (
        <CatalogQueryError error={error} onRetry={retry} />
      )}
    >
      <Shelves view={view} />
    </QueryBoundary>
  );
}
