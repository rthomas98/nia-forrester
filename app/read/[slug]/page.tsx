import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import BookDetailPage from "@/components/pages/book-detail-page";
import {
  bookDescription,
  catalogApi,
  catalogIsConfigured,
  type CatalogBook,
} from "@/lib/catalog";

type BookLookup =
  | { status: "found"; book: CatalogBook }
  | { status: "missing" }
  /** Unconfigured or unreachable: the client renders the matching state. */
  | { status: "deferred" };

const lookUpBook = cache(async (slug: string): Promise<BookLookup> => {
  if (!catalogIsConfigured) return { status: "deferred" };
  try {
    const book = await fetchQuery(catalogApi.bookBySlug, { slug });
    return book ? { status: "found", book } : { status: "missing" };
  } catch {
    // A failed lookup is not a missing book; the client retries and reports it.
    return { status: "deferred" };
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await lookUpBook(slug);

  if (lookup.status === "missing") return { title: "Book Not Found" };
  if (lookup.status === "deferred") {
    return { title: "Book", alternates: { canonical: `/read/${slug}` } };
  }

  const { book } = lookup;
  return {
    title: book.title,
    description: bookDescription(book) ?? undefined,
    alternates: { canonical: `/read/${book.slug}` },
    // Unlisted books are addressable by link but stay out of search indexes.
    robots: book.visibility === "unlisted" ? { index: false } : undefined,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lookup = await lookUpBook(slug);

  if (lookup.status === "missing") notFound();

  return (
    <BookDetailPage
      slug={slug}
      initialBook={lookup.status === "found" ? lookup.book : null}
    />
  );
}
