import { ConvexError, type Infer, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import {
  boundedListLimit,
  compareSeriesBooks,
  isPublicCatalogRecord,
  isPublicSeriesReference,
  type CatalogVisibility,
} from "./catalogPolicy";
import { requireCatalogWriter } from "./security";

const publishStatus = v.union(
  v.literal("draft"),
  v.literal("scheduled"),
  v.literal("published"),
  v.literal("archived"),
);
const visibility = v.union(
  v.literal("public"),
  v.literal("unlisted"),
  v.literal("hidden"),
);
const format = v.union(
  v.literal("ebook"),
  v.literal("paperback"),
  v.literal("hardcover"),
  v.literal("audiobook"),
);
const coverAsset = v.object({
  path: v.string(),
  source: v.union(
    v.literal("stakeholder_provided"),
    v.literal("licensed"),
    v.literal("retailer_source"),
    v.literal("original"),
  ),
  sourceReference: v.optional(v.string()),
  sha256: v.optional(v.string()),
});

export const seriesInput = v.object({
  catalogKey: v.string(),
  slug: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  status: publishStatus,
  visibility,
  sortOrder: v.number(),
});

export const bookInput = v.object({
  catalogKey: v.string(),
  slug: v.string(),
  title: v.string(),
  subtitle: v.optional(v.string()),
  description: v.optional(v.string()),
  seriesCatalogKey: v.optional(v.string()),
  seriesPosition: v.optional(v.number()),
  publicationDate: v.optional(v.string()),
  formats: v.array(format),
  editions: v.optional(
    v.array(v.object({ format, asin: v.string(), productUrl: v.string() })),
  ),
  asin: v.optional(v.string()),
  productUrl: v.optional(v.string()),
  coverAsset: v.optional(coverAsset),
  status: publishStatus,
  visibility,
  sortOrder: v.number(),
});

export type SeriesInput = Infer<typeof seriesInput>;
export type BookInput = Infer<typeof bookInput>;

type CatalogMutationCtx = MutationCtx;
type CatalogQueryCtx = QueryCtx | MutationCtx;

function validationError(message: string): never {
  throw new ConvexError({ code: "VALIDATION_ERROR", message });
}

function conflict(message: string): never {
  throw new ConvexError({ code: "CONFLICT", message });
}

function notFound(message: string): never {
  throw new ConvexError({ code: "NOT_FOUND", message });
}

function validateCommon(input: {
  catalogKey: string;
  slug: string;
  title: string;
  description?: string;
  sortOrder: number;
}) {
  if (!/^catalog:[a-z0-9._-]+:[a-z0-9._-]+$/.test(input.catalogKey)) {
    validationError("catalogKey must be a deterministic catalog identity");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    validationError("slug must contain lowercase words separated by hyphens");
  }
  if (!input.title.trim()) {
    validationError("title is required");
  }
  if (input.description !== undefined && !input.description.trim()) {
    validationError("description must be nonempty when supplied");
  }
  if (!Number.isSafeInteger(input.sortOrder) || input.sortOrder < 0) {
    validationError("sortOrder must be a nonnegative integer");
  }
}

export function validateSeriesInput(input: SeriesInput) {
  validateCommon(input);
}

export function validateBookInput(input: BookInput) {
  validateCommon(input);
  if (input.formats.length === 0 || new Set(input.formats).size !== input.formats.length) {
    validationError("formats must contain at least one unique format");
  }
  if (
    input.seriesPosition !== undefined &&
    (!Number.isFinite(input.seriesPosition) || input.seriesPosition <= 0)
  ) {
    validationError("seriesPosition must be a positive finite number");
  }
  if (
    input.publicationDate !== undefined &&
    !/^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/.test(
      input.publicationDate,
    )
  ) {
    validationError("publicationDate must be YYYY, YYYY-MM, or YYYY-MM-DD");
  }
  if (input.asin !== undefined && !/^[A-Z0-9]{10}$/.test(input.asin)) {
    validationError("asin must be ten uppercase letters or digits");
  }
  if (input.editions) {
    if (input.editions.length === 0) validationError("editions cannot be empty");
    if (new Set(input.editions.map((edition) => edition.asin)).size !== input.editions.length) {
      validationError("edition ASINs must be unique");
    }
    for (const edition of input.editions) {
      if (!/^[A-Z0-9]{10}$/.test(edition.asin)) {
        validationError("edition asin must be ten uppercase letters or digits");
      }
      let editionUrl: URL;
      try {
        editionUrl = new URL(edition.productUrl);
      } catch {
        validationError("edition productUrl must be an absolute HTTPS URL");
      }
      if (editionUrl.protocol !== "https:") {
        validationError("edition productUrl must be an absolute HTTPS URL");
      }
    }
  }
  if (input.productUrl !== undefined) {
    let url: URL;
    try {
      url = new URL(input.productUrl);
    } catch {
      validationError("productUrl must be an absolute HTTPS URL");
    }
    if (url.protocol !== "https:") {
      validationError("productUrl must be an absolute HTTPS URL");
    }
  }
  if (input.coverAsset) {
    if (
      !input.coverAsset.path.startsWith("/") ||
      input.coverAsset.path.includes("..") ||
      input.coverAsset.path.startsWith("//")
    ) {
      validationError("coverAsset.path must be a safe root-relative local path");
    }
    if (
      input.coverAsset.sha256 !== undefined &&
      !/^[a-f0-9]{64}$/.test(input.coverAsset.sha256)
    ) {
      validationError("coverAsset.sha256 must be lowercase hexadecimal");
    }
  }
}

function purchaseLink(asin: string | undefined, productUrl: string | undefined) {
  const affiliateTag = process.env.AMAZON_ASSOCIATE_TAG?.trim();
  if (asin && affiliateTag) {
    return {
      purchaseUrl: `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(affiliateTag)}`,
      isAffiliate: true,
    };
  }
  return { purchaseUrl: productUrl, isAffiliate: false };
}

async function resolveSeries(
  ctx: CatalogQueryCtx,
  seriesCatalogKey: string | undefined,
) {
  if (!seriesCatalogKey) return null;
  const series = await ctx.db
    .query("series")
    .withIndex("by_catalog_key", (q) => q.eq("catalogKey", seriesCatalogKey))
    .unique();
  if (!series) notFound(`Series ${seriesCatalogKey} does not exist`);
  return series;
}

type CanonicalBook = Doc<"content"> & {
  catalogKey: string;
  formats: Array<"ebook" | "paperback" | "hardcover" | "audiobook">;
  visibility: CatalogVisibility;
};

type CanonicalSeries = Doc<"series"> & {
  catalogKey: string;
  visibility: CatalogVisibility;
};

function isCanonicalBook(book: Doc<"content">): book is CanonicalBook {
  return (
    book.kind === "book" &&
    book.catalogKey !== undefined &&
    book.formats !== undefined &&
    book.formats.length > 0 &&
    book.visibility !== undefined
  );
}

function isCanonicalSeries(series: Doc<"series">): series is CanonicalSeries {
  return series.catalogKey !== undefined && series.visibility !== undefined;
}

async function presentBook(ctx: CatalogQueryCtx, book: CanonicalBook) {
  const linkedSeries = book.seriesId ? await ctx.db.get(book.seriesId) : null;
  const series = linkedSeries && isCanonicalSeries(linkedSeries) &&
    isPublicSeriesReference(linkedSeries.status, linkedSeries.visibility)
    ? linkedSeries
    : null;
  const link = purchaseLink(book.asin, book.productUrl);
  return {
    _id: book._id,
    catalogKey: book.catalogKey,
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    series: series
      ? { _id: series._id, slug: series.slug, title: series.title }
      : null,
    seriesPosition: book.seriesPosition,
    publicationDate: book.publicationDate,
    formats: book.formats,
    editions: book.editions,
    asin: book.asin,
    productUrl: book.productUrl,
    ...link,
    coverAsset: book.coverAsset,
    status: book.status,
    visibility: book.visibility,
    sortOrder: book.sortOrder,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}

export const listPublishedBooks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = boundedListLimit(args.limit, 50, 100);
    if (limit === null) validationError("limit must be a finite number");
    const books = await ctx.db
      .query("content")
      .withIndex("by_kind_status", (q) =>
        q.eq("kind", "book").eq("status", "published"),
      )
      .collect();
    const visible = books
      .filter(isCanonicalBook)
      .filter((book) => isPublicCatalogRecord(book.status, book.visibility, false))
      .sort((left, right) =>
        left.sortOrder === right.sortOrder
          ? left.title.localeCompare(right.title)
          : left.sortOrder - right.sortOrder,
      )
      .slice(0, limit);
    return Promise.all(visible.map((book) => presentBook(ctx, book)));
  },
});

export const bookBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const book = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (
      !book ||
      !isCanonicalBook(book) ||
      !isPublicCatalogRecord(book.status, book.visibility, true)
    ) {
      return null;
    }
    return presentBook(ctx, book);
  },
});

export const listPublishedSeries = query({
  args: {},
  handler: async (ctx) => {
    const allSeries = await ctx.db
      .query("series")
      .withIndex("by_status_sort", (q) => q.eq("status", "published"))
      .collect();
    const visibleSeries = allSeries
      .filter(isCanonicalSeries)
      .filter((series) =>
        isPublicCatalogRecord(series.status, series.visibility, false),
      )
      .sort((left, right) => left.sortOrder - right.sortOrder);
    return Promise.all(
      visibleSeries.map(async (series) => {
        const books = await ctx.db
          .query("content")
          .withIndex("by_series_sort", (q) => q.eq("seriesId", series._id))
          .collect();
        const visibleBooks = books
          .filter(isCanonicalBook)
          .filter((book) =>
            isPublicCatalogRecord(book.status, book.visibility, false),
          )
          .sort(compareSeriesBooks);
        return {
          _id: series._id,
          catalogKey: series.catalogKey,
          slug: series.slug,
          title: series.title,
          description: series.description,
          status: series.status,
          visibility: series.visibility,
          sortOrder: series.sortOrder,
          createdAt: series.createdAt,
          updatedAt: series.updatedAt,
          books: await Promise.all(visibleBooks.map((book) => presentBook(ctx, book))),
        };
      }),
    );
  },
});

async function assertUniqueSlug(
  ctx: CatalogMutationCtx,
  table: "series" | "content",
  slug: string,
  existingId: Id<"series"> | Id<"content"> | undefined,
) {
  const collision = await ctx.db
    .query(table)
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
  if (collision && collision._id !== existingId) {
    conflict(`Slug ${slug} is already in use`);
  }
}

export async function upsertSeriesRecord(
  ctx: CatalogMutationCtx,
  actorAuthUserId: string,
  input: SeriesInput,
) {
  validateSeriesInput(input);
  const existing = await ctx.db
    .query("series")
    .withIndex("by_catalog_key", (q) => q.eq("catalogKey", input.catalogKey))
    .unique();
  await assertUniqueSlug(ctx, "series", input.slug, existing?._id);
  const now = Date.now();
  const seriesId = existing?._id ?? (await ctx.db.insert("series", {
    ...input,
    createdAt: now,
    updatedAt: now,
  }));
  if (existing) await ctx.db.patch(existing._id, { ...input, updatedAt: now });
  await ctx.db.insert("auditLog", {
    actorAuthUserId,
    action: existing ? "catalog.series.updated" : "catalog.series.created",
    entityType: "series",
    entityId: seriesId,
    createdAt: now,
  });
  return seriesId;
}

export async function upsertBookRecord(
  ctx: CatalogMutationCtx,
  actorAuthUserId: string,
  input: BookInput,
) {
  validateBookInput(input);
  const existing = await ctx.db
    .query("content")
    .withIndex("by_catalog_key", (q) => q.eq("catalogKey", input.catalogKey))
    .unique();
  if (existing && existing.kind !== "book") {
    conflict(`Catalog identity ${input.catalogKey} belongs to non-book content`);
  }
  await assertUniqueSlug(ctx, "content", input.slug, existing?._id);
  const series = await resolveSeries(ctx, input.seriesCatalogKey);
  const now = Date.now();
  const values = {
    catalogKey: input.catalogKey,
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    description: input.description,
    seriesPosition: input.seriesPosition,
    publicationDate: input.publicationDate,
    formats: input.formats,
    editions: input.editions,
    asin: input.asin,
    productUrl: input.productUrl,
    coverAsset: input.coverAsset,
    status: input.status,
    visibility: input.visibility,
    sortOrder: input.sortOrder,
    kind: "book" as const,
    excerpt: input.description ?? "",
    seriesId: series?._id,
    accessTier: "free" as const,
    tags: [],
    updatedAt: now,
  };
  const contentId = existing?._id ?? (await ctx.db.insert("content", {
    ...values,
    createdAt: now,
  }));
  if (existing) await ctx.db.patch(existing._id, values);
  await ctx.db.insert("auditLog", {
    actorAuthUserId,
    action: existing ? "catalog.book.updated" : "catalog.book.created",
    entityType: "content",
    entityId: contentId,
    createdAt: now,
  });
  return contentId;
}

export const upsertSeries = mutation({
  args: { input: seriesInput },
  handler: async (ctx, args) => {
    const { user } = await requireCatalogWriter(ctx);
    return upsertSeriesRecord(ctx, user._id, args.input);
  },
});

export const upsertBook = mutation({
  args: { input: bookInput },
  handler: async (ctx, args) => {
    const { user } = await requireCatalogWriter(ctx);
    return upsertBookRecord(ctx, user._id, args.input);
  },
});
