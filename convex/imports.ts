import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  type BookInput,
  type SeriesInput,
  upsertBookRecord,
  upsertSeriesRecord,
  validateBookInput,
  validateSeriesInput,
} from "./catalog";
import {
  boundedListLimit,
  catalogImportJobProgress,
  catalogIdentity,
  classifyCatalogImport,
} from "./catalogPolicy";
import { requireCatalogWriter } from "./security";

const source = v.union(
  v.literal("wix"),
  v.literal("substack"),
  v.literal("csv"),
  v.literal("manual"),
);

function catalogError(code: "VALIDATION_ERROR" | "CONFLICT" | "NOT_FOUND", message: string): never {
  throw new ConvexError({ code, message });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") catalogError("VALIDATION_ERROR", `${key} must be a string`);
  return value;
}

function optionalString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") catalogError("VALIDATION_ERROR", `${key} must be a string`);
  return value;
}

function requiredNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number") catalogError("VALIDATION_ERROR", `${key} must be a number`);
  return value;
}

function optionalNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "number") catalogError("VALIDATION_ERROR", `${key} must be a number`);
  return value;
}

function parseStatus(value: unknown): SeriesInput["status"] {
  if (value === "draft" || value === "scheduled" || value === "published" || value === "archived") {
    return value;
  }
  return catalogError("VALIDATION_ERROR", "status is invalid");
}

function parseVisibility(value: unknown): SeriesInput["visibility"] {
  if (value === "public" || value === "unlisted" || value === "hidden") return value;
  return catalogError("VALIDATION_ERROR", "visibility is invalid");
}

function parseFormats(value: unknown): BookInput["formats"] {
  if (!Array.isArray(value)) catalogError("VALIDATION_ERROR", "formats must be an array");
  return value.map((entry) => {
    if (
      entry === "ebook" ||
      entry === "paperback" ||
      entry === "hardcover" ||
      entry === "audiobook"
    ) {
      return entry;
    }
    return catalogError("VALIDATION_ERROR", "formats contains an invalid value");
  });
}

function parseCoverAsset(value: unknown): BookInput["coverAsset"] {
  if (value === undefined) return undefined;
  if (!isObject(value)) catalogError("VALIDATION_ERROR", "coverAsset must be an object");
  const sourceValue = value.source;
  if (
    sourceValue !== "stakeholder_provided" &&
    sourceValue !== "licensed" &&
    sourceValue !== "retailer_source" &&
    sourceValue !== "original"
  ) {
    return catalogError("VALIDATION_ERROR", "coverAsset.source is invalid");
  }
  return {
    path: requiredString(value, "path"),
    source: sourceValue,
    sourceReference: optionalString(value, "sourceReference"),
    sha256: optionalString(value, "sha256"),
  };
}

function parseEditions(value: unknown): BookInput["editions"] {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) catalogError("VALIDATION_ERROR", "editions must be an array");
  return value.map((edition) => {
    if (!isObject(edition)) catalogError("VALIDATION_ERROR", "edition must be an object");
    const format = edition.format;
    if (
      format !== "ebook" &&
      format !== "paperback" &&
      format !== "hardcover" &&
      format !== "audiobook"
    ) {
      catalogError("VALIDATION_ERROR", "edition format is invalid");
    }
    return {
      format,
      asin: requiredString(edition, "asin"),
      productUrl: requiredString(edition, "productUrl"),
    };
  });
}

function parsePayload(payload: string, entityType: "series" | "book") {
  let value: unknown;
  try {
    value = JSON.parse(payload);
  } catch {
    return catalogError("VALIDATION_ERROR", "payload must be valid JSON");
  }
  if (!isObject(value)) catalogError("VALIDATION_ERROR", "payload must be an object");
  for (const forbidden of ["affiliateTag", "amazonAffiliateUrl", "purchaseUrl", "isAffiliate"]) {
    if (forbidden in value) {
      catalogError("VALIDATION_ERROR", `${forbidden} is server-owned and cannot be imported`);
    }
  }
  const common = {
    catalogKey: requiredString(value, "catalogKey"),
    slug: requiredString(value, "slug"),
    title: requiredString(value, "title"),
    description: optionalString(value, "description"),
    status: parseStatus(value.status),
    visibility: parseVisibility(value.visibility),
    sortOrder: requiredNumber(value, "sortOrder"),
  };
  if (entityType === "series") {
    validateSeriesInput(common);
    return { entityType, input: common } satisfies {
      entityType: "series";
      input: SeriesInput;
    };
  }
  const input = {
    ...common,
    subtitle: optionalString(value, "subtitle"),
    seriesCatalogKey: optionalString(value, "seriesCatalogKey"),
    seriesPosition: optionalNumber(value, "seriesPosition"),
    publicationDate: optionalString(value, "publicationDate"),
    formats: parseFormats(value.formats),
    editions: parseEditions(value.editions),
    asin: optionalString(value, "asin"),
    productUrl: optionalString(value, "productUrl"),
    coverAsset: parseCoverAsset(value.coverAsset),
  } satisfies BookInput;
  validateBookInput(input);
  return {
    entityType,
    input,
  } satisfies { entityType: "book"; input: BookInput };
}

export const stageBatch = mutation({
  args: {
    source,
    jobId: v.optional(v.id("importJobs")),
    sourceUrl: v.optional(v.string()),
    records: v.array(
      v.object({
        externalId: v.string(),
        externalUrl: v.optional(v.string()),
        entityType: v.string(),
        payload: v.string(),
        checksum: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCatalogWriter(ctx);
    const now = Date.now();
    const jobId =
      args.jobId ??
      (await ctx.db.insert("importJobs", {
        source: args.source,
        status: "running",
        requestedBy: user._id,
        sourceUrl: args.sourceUrl,
        totalRecords: 0,
        importedRecords: 0,
        skippedRecords: 0,
        failedRecords: 0,
        createdAt: now,
        updatedAt: now,
      }));
    const job = await ctx.db.get(jobId);
    if (!job) catalogError("NOT_FOUND", "Import job not found");

    let staged = 0;
    let skipped = 0;
    for (const record of args.records) {
      const existing = await ctx.db
        .query("importRecords")
        .withIndex("by_job_external", (q) =>
          q.eq("jobId", jobId).eq("externalId", record.externalId),
        )
        .unique();
      if (existing) {
        skipped += 1;
        continue;
      }
      await ctx.db.insert("importRecords", {
        jobId,
        ...record,
        status: "staged",
        createdAt: now,
        updatedAt: now,
      });
      staged += 1;
    }

    await ctx.db.patch(jobId, {
      totalRecords: job.totalRecords + staged + skipped,
      skippedRecords: job.skippedRecords + skipped,
      status: "review",
      updatedAt: now,
    });
    return { jobId, staged, skipped };
  },
});

export const stageCatalog = mutation({
  args: {
    sourceId: v.string(),
    records: v.array(
      v.object({
        externalId: v.string(),
        entityType: v.union(v.literal("series"), v.literal("book")),
        checksum: v.string(),
        payload: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCatalogWriter(ctx);
    const now = Date.now();
    const jobId = await ctx.db.insert("importJobs", {
      source: "catalog",
      status: "running",
      requestedBy: user._id,
      totalRecords: args.records.length,
      importedRecords: 0,
      skippedRecords: 0,
      failedRecords: 0,
      createdAt: now,
      updatedAt: now,
    });
    let staged = 0;
    let updated = 0;
    let unchanged = 0;

    for (const record of args.records) {
      if (!/^[a-f0-9]{64}$/.test(record.checksum)) {
        catalogError("VALIDATION_ERROR", "checksum must be lowercase SHA-256 hexadecimal");
      }
      const identity = catalogIdentity(args.sourceId, record.externalId);
      const parsed = parsePayload(record.payload, record.entityType);
      if (parsed.input.catalogKey !== identity) {
        catalogError("VALIDATION_ERROR", `Payload catalogKey must equal ${identity}`);
      }
      const existing = await ctx.db
        .query("importRecords")
        .withIndex("by_identity", (q) => q.eq("identity", identity))
        .unique();
      const disposition = classifyCatalogImport(existing, record.checksum, record.payload);
      if (disposition === "unchanged") {
        unchanged += 1;
        continue;
      }
      if (disposition === "conflict") {
        catalogError("CONFLICT", `Imported identity ${identity} has changed`);
      }
      if (existing && disposition === "update") {
        await ctx.db.patch(existing._id, {
          jobId,
          externalId: record.externalId,
          entityType: record.entityType,
          checksum: record.checksum,
          payload: record.payload,
          status: "staged",
          error: undefined,
          updatedAt: now,
        });
        updated += 1;
      } else if (disposition === "insert") {
        await ctx.db.insert("importRecords", {
          jobId,
          externalId: record.externalId,
          identity,
          entityType: record.entityType,
          status: "staged",
          checksum: record.checksum,
          payload: record.payload,
          createdAt: now,
          updatedAt: now,
        });
        staged += 1;
      }
    }

    await ctx.db.patch(jobId, {
      status: "review",
      skippedRecords: unchanged,
      updatedAt: now,
    });
    await ctx.db.insert("auditLog", {
      actorAuthUserId: user._id,
      action: "catalog.import.staged",
      entityType: "importJob",
      entityId: jobId,
      metadata: JSON.stringify({ staged, updated, unchanged }),
      createdAt: now,
    });
    return { jobId, staged, updated, unchanged };
  },
});

export const reviewQueue = query({
  args: { jobId: v.id("importJobs"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireCatalogWriter(ctx);
    const limit = boundedListLimit(args.limit, 100, 100);
    if (limit === null) catalogError("VALIDATION_ERROR", "limit must be a finite number");
    return ctx.db
      .query("importRecords")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .take(limit);
  },
});

export const publishCatalogRecord = mutation({
  args: { recordId: v.id("importRecords"), publish: v.boolean() },
  handler: async (ctx, args) => {
    const { user } = await requireCatalogWriter(ctx);
    const record = await ctx.db.get(args.recordId);
    if (!record || (record.entityType !== "series" && record.entityType !== "book")) {
      catalogError("NOT_FOUND", "Catalog import record not found");
    }
    if (!record.payload) catalogError("VALIDATION_ERROR", "Catalog payload is missing");
    const parsed = parsePayload(record.payload, record.entityType);
    const status = args.publish ? "published" as const : "draft" as const;
    const targetId = parsed.entityType === "series"
      ? await upsertSeriesRecord(ctx, user._id, { ...parsed.input, status })
      : await upsertBookRecord(ctx, user._id, { ...parsed.input, status });
    const now = Date.now();
    await ctx.db.patch(record._id, {
      status: "imported",
      targetId,
      error: undefined,
      updatedAt: now,
    });
    const job = await ctx.db.get(record.jobId);
    if (!job) catalogError("NOT_FOUND", "Import job not found");
    const jobRecords = await ctx.db
      .query("importRecords")
      .withIndex("by_job", (q) => q.eq("jobId", record.jobId))
      .collect();
    const progress = catalogImportJobProgress(
      job,
      jobRecords.map((jobRecord) => jobRecord.status),
    );
    await ctx.db.patch(job._id, {
      ...progress,
      updatedAt: now,
    });
    await ctx.db.insert("auditLog", {
      actorAuthUserId: user._id,
      action: args.publish ? "catalog.import.published" : "catalog.import.drafted",
      entityType: "importRecord",
      entityId: record._id,
      createdAt: now,
    });
    return targetId;
  },
});

export const markRecord = mutation({
  args: {
    recordId: v.id("importRecords"),
    status: v.union(
      v.literal("staged"),
      v.literal("imported"),
      v.literal("skipped"),
      v.literal("failed"),
    ),
    targetId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCatalogWriter(ctx);
    const record = await ctx.db.get(args.recordId);
    if (!record) catalogError("NOT_FOUND", "Import record not found");
    if (record.identity) {
      catalogError("CONFLICT", "Use publishCatalogRecord for canonical catalog imports");
    }
    await ctx.db.patch(record._id, {
      status: args.status,
      targetId: args.targetId,
      error: args.error,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("auditLog", {
      actorAuthUserId: user._id,
      action: `import.${args.status}`,
      entityType: "importRecord",
      entityId: record._id,
      metadata: args.error,
      createdAt: Date.now(),
    });
  },
});
