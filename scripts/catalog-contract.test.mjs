import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  boundedListLimit,
  canWriteCatalog,
  catalogImportJobProgress,
  catalogIdentity,
  classifyCatalogImport,
  compareSeriesBooks,
  isPublicCatalogRecord,
  isPublicSeriesReference,
  ownsReaderRecord,
} from "../convex/catalogPolicy.ts";
import { AMAZON_CATALOG_LISTING_COUNT } from "../lib/catalog-summary.ts";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const amazonSource = JSON.parse(
  readFileSync(path.join(repositoryRoot, "data/catalog/amazon-author-page.json"), "utf8"),
);
const preparedAmazon = JSON.parse(
  execFileSync(
    process.execPath,
    ["scripts/prepare-catalog-import.mjs", "data/catalog/amazon-author-page.json"],
    { cwd: repositoryRoot, encoding: "utf8" },
  ),
);
const preparedAmazonAgain = JSON.parse(
  execFileSync(
    process.execPath,
    ["scripts/prepare-catalog-import.mjs", "data/catalog/amazon-author-page.json"],
    { cwd: repositoryRoot, encoding: "utf8" },
  ),
);
const preparedPayloads = preparedAmazon.records.map((record) => ({
  ...record,
  payload: JSON.parse(record.payload),
}));
const preparedBooks = preparedPayloads.filter((record) => record.entityType === "book");
const preparedSeries = preparedPayloads.filter((record) => record.entityType === "series");

test("deterministic identity makes duplicate imports unchanged", () => {
  assert.equal(catalogIdentity(" Nia Canonical ", "Book / 001"), "catalog:nia-canonical:book-001");
  assert.equal(
    classifyCatalogImport(
      { checksum: "same", payload: "same-payload", status: "staged" },
      "same",
      "same-payload",
    ),
    "unchanged",
  );
  assert.equal(
    classifyCatalogImport(
      { checksum: "old", payload: "old-payload", status: "staged" },
      "new",
      "new-payload",
    ),
    "update",
  );
  assert.equal(
    classifyCatalogImport(
      { checksum: "old", payload: "old-payload", status: "imported" },
      "new",
      "new-payload",
    ),
    "conflict",
  );
  assert.equal(
    classifyCatalogImport(
      { checksum: "same", payload: "old-payload", status: "staged" },
      "same",
      "changed-payload",
    ),
    "update",
  );
});

test("anonymous catalog reads expose only published public records", () => {
  assert.equal(isPublicCatalogRecord("published", "public", false), true);
  assert.equal(isPublicCatalogRecord("draft", "public", false), false);
  assert.equal(isPublicCatalogRecord("published", "unlisted", false), false);
  assert.equal(isPublicCatalogRecord("published", "hidden", true), false);
  assert.equal(isPublicCatalogRecord("published", "unlisted", true), true);
  assert.equal(isPublicSeriesReference("draft", "public"), false);
  assert.equal(isPublicSeriesReference("published", "hidden"), false);
  assert.equal(isPublicSeriesReference("published", "unlisted"), true);
});

test("catalog list limits reject non-finite values and preserve bounds", () => {
  assert.equal(boundedListLimit(undefined, 50, 100), 50);
  assert.equal(boundedListLimit(0, 50, 100), 1);
  assert.equal(boundedListLimit(101, 50, 100), 100);
  assert.equal(boundedListLimit(Number.NaN, 50, 100), null);
  assert.equal(boundedListLimit(Number.POSITIVE_INFINITY, 50, 100), null);
});

test("series books sort by series position, then sort order", () => {
  const books = [
    { title: "Unnumbered", sortOrder: 1 },
    { title: "Second later", seriesPosition: 2, sortOrder: 4 },
    { title: "First", seriesPosition: 1, sortOrder: 10 },
    { title: "Second earlier", seriesPosition: 2, sortOrder: 3 },
  ];
  assert.deepEqual(books.sort(compareSeriesBooks).map((book) => book.title), [
    "First",
    "Second earlier",
    "Second later",
    "Unnumbered",
  ]);
});

test("catalog publishing derives accurate import job counts and completion", () => {
  assert.deepEqual(
    catalogImportJobProgress(
      { totalRecords: 3, skippedRecords: 1, failedRecords: 0 },
      ["imported", "staged"],
    ),
    { importedRecords: 1, status: "review" },
  );
  assert.deepEqual(
    catalogImportJobProgress(
      { totalRecords: 3, skippedRecords: 1, failedRecords: 0 },
      ["imported", "imported"],
    ),
    { importedRecords: 2, status: "completed" },
  );
});

test("catalog writes are limited to editor and admin roles", () => {
  assert.equal(canWriteCatalog(undefined), false);
  assert.equal(canWriteCatalog("reader"), false);
  assert.equal(canWriteCatalog("moderator"), false);
  assert.equal(canWriteCatalog("editor"), true);
  assert.equal(canWriteCatalog("admin"), true);
});

test("progress and bookmarks remain isolated to their authenticated owner", () => {
  assert.equal(ownsReaderRecord("user-a", "user-a"), true);
  assert.equal(ownsReaderRecord("user-a", "user-b"), false);
});

test("Amazon author source preserves 49 raw listings in canonical title records", () => {
  assert.equal(amazonSource.source.listingCount, 49);
  assert.equal(AMAZON_CATALOG_LISTING_COUNT, amazonSource.source.listingCount);
  assert.equal(amazonSource.listings.length, 49);
  assert.equal(preparedBooks.length, 48);
  assert.equal(preparedSeries.length, 7);
  assert.equal(preparedAmazon.records.length, 55);
  assert.equal(new Set(preparedAmazon.records.map((record) => record.externalId)).size, 55);
  assert.equal(new Set(preparedPayloads.map((record) => record.payload.catalogKey)).size, 55);
  assert.equal(new Set(preparedPayloads.map((record) => record.payload.slug)).size, 55);
  assert.deepEqual(preparedAmazonAgain, preparedAmazon);
  for (const record of preparedAmazon.records) {
    assert.equal(createHash("sha256").update(record.payload).digest("hex"), record.checksum);
  }
  assert.deepEqual(
    new Set(preparedBooks.flatMap((record) => record.payload.editions.map((edition) => edition.asin))),
    new Set(amazonSource.listings.flatMap((listing) => [
      listing.asin,
      ...listing.otherEditions.map((edition) => edition.asin),
    ])),
  );
});

test("Amazon normalization uses only exact structured series suffixes and consolidates editions", () => {
  const wanderers = preparedBooks.filter(
    (record) => record.payload.title === "The Wanderer: A Novel",
  );
  assert.equal(wanderers.length, 1);
  assert.equal(wanderers[0].payload.asin, "B0DNRMVSJH");
  assert.deepEqual(wanderers[0].payload.editions.map((edition) => edition.asin), [
    "B0DNRMVSJH",
    "B0G34C53NP",
    "B0DSCJPY8G",
  ]);
  assert.equal(wanderers[0].payload.seriesCatalogKey, undefined);

  const originalCommitment = preparedBooks.find(
    (record) => record.payload.asin === "B008IVMKAG",
  );
  const anniversaryCommitment = preparedBooks.find(
    (record) => record.payload.asin === "B09RV9Y1PW",
  );
  assert.equal(originalCommitment.payload.title, "Commitment");
  assert.match(originalCommitment.payload.seriesCatalogKey, /series-the-commitment-series$/);
  assert.equal(anniversaryCommitment.payload.title, "Commitment (10th Anniversary Edition)");
  assert.equal(anniversaryCommitment.payload.seriesCatalogKey, undefined);
  assert.notEqual(originalCommitment.payload.slug, anniversaryCommitment.payload.slug);
  assert.equal(
    preparedBooks.find((record) => record.payload.asin === "1519101341").payload.title,
    "The Education of Miri Acosta (The Acosta Series)",
  );
  assert.equal(
    preparedBooks.find((record) => record.payload.asin === "B0758PKV91").payload.title,
    "The Takedown (The 'Afterwards' Series)",
  );
  assert.ok(preparedBooks.every((record) => record.payload.description === undefined));
  assert.ok(preparedBooks.every((record) => record.payload.publicationDate === undefined));
});

test("Amazon editions use allowed formats, canonical non-affiliate URLs, and corrected Dylan data", () => {
  const allowedFormats = new Set(["ebook", "paperback", "hardcover", "audiobook"]);
  for (const record of preparedBooks) {
    assert.match(record.payload.asin, /^[A-Z0-9]{10}$/);
    assert.equal(record.payload.productUrl, `https://www.amazon.com/dp/${record.payload.asin}`);
    assert.equal(new URL(record.payload.productUrl).search, "");
    assert.ok(record.payload.formats.every((format) => allowedFormats.has(format)));
    assert.equal(
      new Set(record.payload.editions.map((edition) => edition.asin)).size,
      record.payload.editions.length,
    );
    for (const edition of record.payload.editions) {
      assert.ok(allowedFormats.has(edition.format));
      assert.equal(edition.productUrl, `https://www.amazon.com/dp/${edition.asin}`);
      assert.equal(new URL(edition.productUrl).search, "");
    }
  }

  const dylan = preparedBooks.find((record) => record.payload.asin === "B008QNMHH2");
  assert.deepEqual(dylan.payload.formats, ["ebook", "paperback"]);
  assert.deepEqual(dylan.payload.editions, [
    {
      asin: "B008QNMHH2",
      format: "ebook",
      productUrl: "https://www.amazon.com/dp/B008QNMHH2",
    },
    {
      asin: "B088NXZD23",
      format: "paperback",
      productUrl: "https://www.amazon.com/dp/B088NXZD23",
    },
  ]);
});

test("Amazon cover paths exist locally and hashes and source references match", () => {
  for (const record of preparedBooks) {
    const listing = amazonSource.listings.find(({ asin }) => asin === record.payload.asin);
    const cover = record.payload.coverAsset;
    assert.equal(cover.source, "retailer_source");
    assert.equal(cover.sourceReference, listing.coverUrl);
    assert.equal(
      cover.path,
      `/images/books/amazon/${String(listing.sourceOrder).padStart(2, "0")}-${listing.asin}.jpg`,
    );
    const bytes = readFileSync(path.join(repositoryRoot, "public", cover.path));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), cover.sha256);
  }
});
