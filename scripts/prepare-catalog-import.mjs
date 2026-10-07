#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { z } from "zod";

function fail(message) {
  throw new Error(message);
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeIdentityPart(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function catalogIdentity(sourceId, externalId) {
  const source = normalizeIdentityPart(sourceId);
  const external = normalizeIdentityPart(externalId);
  if (!source || !external) fail("sourceId and externalId must contain an identifier");
  return `catalog:${source}:${external}`;
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!isObject(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => [key, stableValue(value[key])]),
  );
}

function requireString(record, key) {
  if (typeof record[key] !== "string" || !record[key].trim()) {
    fail(`${key} must be a nonempty string`);
  }
  return record[key];
}

const status = z.enum(["draft", "scheduled", "published", "archived"]);
const visibility = z.enum(["public", "unlisted", "hidden"]);
const commonCatalogFields = {
  catalogKey: z.string().regex(/^catalog:[a-z0-9._-]+:[a-z0-9._-]+$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  status,
  visibility,
  sortOrder: z.number().int().nonnegative(),
};
const seriesSchema = z.object(commonCatalogFields).strict();
const coverAssetSchema = z
  .object({
    path: z
      .string()
      .startsWith("/")
      .refine((path) => !path.startsWith("//") && !path.includes("..")),
    source: z.enum(["stakeholder_provided", "licensed", "retailer_source", "original"]),
    sourceReference: z.string().optional(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  })
  .strict();
const editionSchema = z
  .object({
    format: z.enum(["ebook", "paperback", "hardcover", "audiobook"]),
    asin: z.string().regex(/^[A-Z0-9]{10}$/),
    productUrl: z.url().refine((url) => new URL(url).protocol === "https:"),
  })
  .strict();
const bookSchema = z
  .object({
    ...commonCatalogFields,
    subtitle: z.string().optional(),
    seriesCatalogKey: z
      .string()
      .regex(/^catalog:[a-z0-9._-]+:[a-z0-9._-]+$/)
      .optional(),
    seriesPosition: z.number().positive().finite().optional(),
    publicationDate: z
      .string()
      .regex(/^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/)
      .optional(),
    formats: z
      .array(z.enum(["ebook", "paperback", "hardcover", "audiobook"]))
      .min(1)
      .refine((formats) => new Set(formats).size === formats.length),
    editions: z
      .array(editionSchema)
      .min(1)
      .refine(
        (editions) => new Set(editions.map((edition) => edition.asin)).size === editions.length,
        "Edition ASINs must be unique",
      )
      .optional(),
    asin: z.string().regex(/^[A-Z0-9]{10}$/).optional(),
    productUrl: z.url().refine((url) => new URL(url).protocol === "https:").optional(),
    coverAsset: coverAssetSchema.optional(),
  })
  .strict();

const amazonFormat = new Map([
  ["Kindle Edition", "ebook"],
  ["Paperback", "paperback"],
  ["Hardcover", "hardcover"],
  ["Audible Audiobook", "audiobook"],
  ["Audiobook", "audiobook"],
  ["Audio CD", "audiobook"],
]);
const formatOrder = ["ebook", "paperback", "hardcover", "audiobook"];
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function slugify(value) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) fail(`Cannot derive a slug from ${JSON.stringify(value)}`);
  return slug;
}

function canonicalAmazonUrl(asin) {
  if (!/^[A-Z0-9]{10}$/.test(asin)) fail(`Invalid Amazon ASIN ${JSON.stringify(asin)}`);
  return `https://www.amazon.com/dp/${asin}`;
}

function mapAmazonFormat(label) {
  const mapped = amazonFormat.get(label);
  if (!mapped) fail(`Unsupported Amazon format ${JSON.stringify(label)}`);
  return mapped;
}

function amazonCatalogTitle(listing) {
  const title = requireString(listing, "title");
  if (listing.series === null) return title;
  if (!isObject(listing.series)) fail("Amazon listing series must be an object or null");
  const seriesTitle = requireString(listing.series, "title");
  const position = listing.series.position;
  const exactSuffixes = [
    ` (${seriesTitle})`,
    ...(Number.isFinite(position) ? [` (${seriesTitle} Book ${position})`] : []),
  ];
  const matchingSuffix = exactSuffixes.find((suffix) => title.endsWith(suffix));
  if (!matchingSuffix) return title;
  const baseTitle = title.slice(0, -matchingSuffix.length).trim();
  return baseTitle || title;
}

async function amazonAuthorCatalog(raw) {
  if (!isObject(raw.source) || !Array.isArray(raw.listings)) {
    fail("Amazon author catalog requires source metadata and listings");
  }
  const authorId = requireString(raw.source, "authorId");
  const sourceUrl = requireString(raw.source, "url");
  if (raw.source.listingCount !== raw.listings.length) {
    fail("Amazon source listingCount does not match listings");
  }
  const seriesByTitle = new Map();
  for (const listing of raw.listings) {
    if (!isObject(listing)) fail("Every Amazon listing must be an object");
    if (listing.series === null) continue;
    if (!isObject(listing.series)) fail("Amazon listing series must be an object or null");
    const title = requireString(listing.series, "title");
    const existing = seriesByTitle.get(title);
    if (!existing || listing.sourceOrder < existing.sourceOrder) {
      seriesByTitle.set(title, { title, sourceOrder: listing.sourceOrder });
    }
  }
  const seriesRecords = [...seriesByTitle.values()]
    .sort((left, right) => left.sourceOrder - right.sourceOrder)
    .map((series) => ({
      externalId: `series-${slugify(series.title)}`,
      entityType: "series",
      slug: slugify(series.title),
      title: series.title,
      status: "draft",
      visibility: "public",
      sortOrder: series.sourceOrder,
    }));

  const listingRecords = await Promise.all(raw.listings.map(async (listing) => {
    const sourceOrder = listing.sourceOrder;
    if (!Number.isSafeInteger(sourceOrder) || sourceOrder < 1) {
      fail("Amazon sourceOrder must be a positive integer");
    }
    const title = amazonCatalogTitle(listing);
    const asin = requireString(listing, "asin");
    const primaryFormat = mapAmazonFormat(requireString(listing, "format"));
    const suppliedUrl = requireString(listing, "amazonUrl");
    const productUrl = canonicalAmazonUrl(asin);
    if (suppliedUrl !== productUrl) fail(`Amazon URL for ${asin} is not canonical`);
    if (!Array.isArray(listing.otherEditions)) fail(`Amazon listing ${asin} needs otherEditions`);
    const editions = [
      { format: primaryFormat, asin, productUrl },
      ...listing.otherEditions.map((edition) => {
        if (!isObject(edition)) fail(`Amazon listing ${asin} has an invalid edition`);
        const editionAsin = requireString(edition, "asin");
        return {
          format: mapAmazonFormat(requireString(edition, "format")),
          asin: editionAsin,
          productUrl: canonicalAmazonUrl(editionAsin),
        };
      }),
    ];
    if (new Set(editions.map((edition) => edition.asin)).size !== editions.length) {
      fail(`Amazon listing ${asin} repeats an edition ASIN`);
    }
    const formats = formatOrder.filter((format) =>
      editions.some((edition) => edition.format === format),
    );
    const fileName = `${String(sourceOrder).padStart(2, "0")}-${asin}.jpg`;
    const assetPath = `/images/books/amazon/${fileName}`;
    const asset = await readFile(path.join(repositoryRoot, "public", assetPath));
    const coverUrl = requireString(listing, "coverUrl");
    const record = {
      externalId: `book-${asin.toLowerCase()}`,
      entityType: "book",
      slug: `${slugify(title)}-${asin.toLowerCase()}`,
      title,
      status: "draft",
      visibility: "public",
      sortOrder: sourceOrder,
      formats,
      editions,
      asin,
      productUrl,
      coverAsset: {
        path: assetPath,
        source: "retailer_source",
        sourceReference: coverUrl,
        sha256: createHash("sha256").update(asset).digest("hex"),
      },
    };
    if (listing.series !== null) {
      record.seriesExternalId = `series-${slugify(requireString(listing.series, "title"))}`;
      if (!Number.isFinite(listing.series.position) || listing.series.position <= 0) {
        fail(`Amazon listing ${asin} has an invalid series position`);
      }
      record.seriesPosition = listing.series.position;
    }
    return record;
  }));
  const booksByTitle = new Map();
  for (const record of listingRecords) {
    const existing = booksByTitle.get(record.title);
    if (!existing) {
      booksByTitle.set(record.title, record);
      continue;
    }
    if (
      existing.seriesExternalId !== record.seriesExternalId ||
      existing.seriesPosition !== record.seriesPosition
    ) {
      fail(`Duplicate Amazon title ${JSON.stringify(record.title)} has conflicting series data`);
    }
    const editionsByAsin = new Map(
      [...existing.editions, ...record.editions].map((edition) => [edition.asin, edition]),
    );
    existing.editions = [...editionsByAsin.values()];
    existing.formats = formatOrder.filter((format) =>
      existing.editions.some((edition) => edition.format === format),
    );
  }
  const bookRecords = [...booksByTitle.values()];
  return {
    sourceId: `amazon-author-${authorId.toLowerCase()}`,
    sourceUrl,
    records: [...seriesRecords, ...bookRecords],
  };
}

function canonicalRecord(sourceId, record) {
  if (!isObject(record)) fail("Every record must be an object");
  const externalId = requireString(record, "externalId");
  const entityType = record.entityType;
  if (entityType !== "series" && entityType !== "book") {
    fail(`Record ${externalId} entityType must be series or book`);
  }
  const catalogKey = catalogIdentity(sourceId, externalId);
  const payload = { ...record, catalogKey };
  delete payload.externalId;
  delete payload.entityType;
  if (payload.seriesExternalId !== undefined) {
    if (typeof payload.seriesExternalId !== "string") {
      fail(`Record ${externalId} seriesExternalId must be a string`);
    }
    if (payload.seriesCatalogKey !== undefined) {
      fail(`Record ${externalId} cannot provide both seriesExternalId and seriesCatalogKey`);
    }
    payload.seriesCatalogKey = catalogIdentity(sourceId, payload.seriesExternalId);
    delete payload.seriesExternalId;
  }
  const validatedPayload = entityType === "series"
    ? seriesSchema.parse(payload)
    : bookSchema.parse(payload);
  const canonicalPayload = JSON.stringify(stableValue(validatedPayload));
  return {
    externalId,
    entityType,
    checksum: createHash("sha256").update(canonicalPayload).digest("hex"),
    payload: canonicalPayload,
  };
}

const args = process.argv.slice(2);
const stage = args.includes("--stage");
const paths = args.filter((arg) => arg !== "--stage");
if (paths.length !== 1) {
  fail("Usage: npm run catalog:prepare -- path/to/catalog.json [--stage]");
}

let raw = JSON.parse(await readFile(paths[0], "utf8"));
if (!isObject(raw)) fail("Catalog root must be an object");
if (raw.schemaVersion === 1 && isObject(raw.source) && Array.isArray(raw.listings)) {
  raw = await amazonAuthorCatalog(raw);
}
const sourceId = requireString(raw, "sourceId");
if (!Array.isArray(raw.records)) fail("Catalog records must be an array");
const records = raw.records.map((record) => canonicalRecord(sourceId, record));
const identities = records.map((record) => catalogIdentity(sourceId, record.externalId));
if (new Set(identities).size !== identities.length) {
  fail("Catalog contains duplicate deterministic identities");
}
const stagedInput = { sourceId, records };

if (!stage) {
  process.stdout.write(`${JSON.stringify(stagedInput, null, 2)}\n`);
  process.exit(0);
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const authToken = process.env.CONVEX_AUTH_TOKEN;
if (!convexUrl || !authToken) {
  fail("--stage requires NEXT_PUBLIC_CONVEX_URL and CONVEX_AUTH_TOKEN");
}
const [{ ConvexHttpClient }, { api }] = await Promise.all([
  import("convex/browser"),
  import("../convex/_generated/api.js"),
]);
const client = new ConvexHttpClient(convexUrl);
client.setAuth(authToken);
const result = await client.mutation(api.imports.stageCatalog, stagedInput);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
