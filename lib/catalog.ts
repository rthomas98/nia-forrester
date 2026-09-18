import { makeFunctionReference } from "convex/server";
import type { Id } from "@/convex/_generated/dataModel";

/**
 * Frontend view of docs/CATALOG_CONTRACT.md. The references are declared here,
 * against the frozen contract, so the reader UI does not depend on which
 * backend revision generated `convex/_generated/api`.
 */

export const catalogFormats = [
  "ebook",
  "paperback",
  "hardcover",
  "audiobook",
] as const;

export type CatalogFormat = (typeof catalogFormats)[number];

export interface CoverAsset {
  path: string;
  source: "stakeholder_provided" | "licensed" | "retailer_source" | "original";
  sourceReference?: string;
  sha256?: string;
}

export interface CatalogEdition {
  format: CatalogFormat;
  asin: string;
  productUrl: string;
}

export interface CatalogSeriesRef {
  _id: Id<"series">;
  slug: string;
  title: string;
}

export interface CatalogBook {
  _id: Id<"content">;
  catalogKey: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  series: CatalogSeriesRef | null;
  seriesPosition?: number;
  publicationDate?: string;
  formats: CatalogFormat[];
  editions?: CatalogEdition[];
  asin?: string;
  productUrl?: string;
  purchaseUrl?: string;
  isAffiliate: boolean;
  coverAsset?: CoverAsset;
  status: "draft" | "scheduled" | "published" | "archived";
  visibility: "public" | "unlisted" | "hidden";
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface CatalogSeries {
  _id: Id<"series">;
  catalogKey: string;
  slug: string;
  title: string;
  description?: string;
  status: CatalogBook["status"];
  visibility: CatalogBook["visibility"];
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
  books: CatalogBook[];
}

export interface ReadingProgress {
  _id: Id<"readingProgress">;
  _creationTime: number;
  contentId: Id<"content">;
  chapterId?: Id<"chapters">;
  chapterNumber?: number;
  percent: number;
  position?: number;
  completed: boolean;
  updatedAt: number;
}

export const catalogApi = {
  listPublishedBooks: makeFunctionReference<
    "query",
    { limit?: number },
    CatalogBook[]
  >("catalog:listPublishedBooks"),
  bookBySlug: makeFunctionReference<
    "query",
    { slug: string },
    CatalogBook | null
  >("catalog:bookBySlug"),
  listPublishedSeries: makeFunctionReference<
    "query",
    Record<string, never>,
    CatalogSeries[]
  >("catalog:listPublishedSeries"),
  progressBySlug: makeFunctionReference<
    "query",
    { slug: string },
    ReadingProgress | null
  >("progress:currentBySlug"),
  saveProgressBySlug: makeFunctionReference<
    "mutation",
    { slug: string; percent: number; completed?: boolean },
    Id<"readingProgress">
  >("progress:saveBySlug"),
};

/** The contract's maximum page size; the whole backlist fits in one page. */
export const CATALOG_LIST_LIMIT = 100;

export const catalogIsConfigured = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

export type CatalogErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR";

const catalogErrorCodes: readonly string[] = [
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "VALIDATION_ERROR",
];

/** Reads the stable `data.code` of a ConvexError without trusting its shape. */
export function catalogErrorCode(error: unknown): CatalogErrorCode | null {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return null;
  }
  const data = error.data;
  if (typeof data !== "object" || data === null || !("code" in data)) {
    return null;
  }
  const code = data.code;
  return typeof code === "string" && catalogErrorCodes.includes(code)
    ? (code as CatalogErrorCode)
    : null;
}

const formatLabels: Record<CatalogFormat, string> = {
  ebook: "Ebook",
  paperback: "Paperback",
  hardcover: "Hardcover",
  audiobook: "Audiobook",
};

export function formatLabel(format: CatalogFormat): string {
  return formatLabels[format];
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Formats `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` without time-zone drift. */
export function formatPublicationDate(value: string | undefined): string | null {
  if (!value) return null;
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  const monthName = month ? months[Number(month) - 1] : undefined;
  if (!monthName) return year;
  return day ? `${monthName} ${Number(day)}, ${year}` : `${monthName} ${year}`;
}

/** Descriptions are optional; blank or absent copy is never rendered. */
export function bookDescription(
  book: Pick<CatalogBook, "description">,
): string | null {
  return book.description?.trim() || null;
}

/** Only root-relative local assets are rendered, as the contract requires. */
export function coverPath(book: Pick<CatalogBook, "coverAsset">): string | null {
  const path = book.coverAsset?.path;
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

/**
 * Exact hosts that may be labeled "Amazon". Anything else, including
 * look-alikes such as amazon.evil.com, gets the neutral label.
 */
const trustedAmazonHosts: ReadonlySet<string> = new Set([
  "amazon.com",
  "www.amazon.com",
  "amazon.co.uk",
  "www.amazon.co.uk",
  "amazon.ca",
  "www.amazon.ca",
  "amazon.com.au",
  "www.amazon.com.au",
  "amazon.de",
  "www.amazon.de",
  "amazon.fr",
  "www.amazon.fr",
]);

export interface PurchaseTarget {
  href: string;
  retailer: string | null;
}

/** Uses the backend-derived URL as-is; never appends or rewrites tags. */
export function purchaseTarget(
  book: Pick<CatalogBook, "purchaseUrl">,
): PurchaseTarget | null {
  if (!book.purchaseUrl) return null;
  let url: URL;
  try {
    url = new URL(book.purchaseUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  return {
    href: book.purchaseUrl,
    retailer: trustedAmazonHosts.has(url.hostname) ? "Amazon" : null,
  };
}

function bySeriesPosition(a: CatalogBook, b: CatalogBook): number {
  if (a.seriesPosition === b.seriesPosition) return 0;
  if (a.seriesPosition === undefined) return 1;
  if (b.seriesPosition === undefined) return -1;
  return a.seriesPosition - b.seriesPosition;
}

/** Books in reading order; ties keep the backend's order (stable sort). */
export function inReadingOrder(books: readonly CatalogBook[]): CatalogBook[] {
  return [...books].sort(bySeriesPosition);
}

/** Books that belong to no series, in the backend's list order. */
export function standaloneBooks(books: readonly CatalogBook[]): CatalogBook[] {
  return books.filter((book) => book.series === null);
}

export function bookMetaLine(book: CatalogBook): string {
  const parts: string[] = [];
  if (book.series && book.seriesPosition !== undefined) {
    parts.push(`Book ${book.seriesPosition}`);
  }
  if (book.formats.length > 0) {
    parts.push(book.formats.map(formatLabel).join(", "));
  }
  return parts.join(" · ");
}
