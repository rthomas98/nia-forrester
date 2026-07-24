import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./security";

const source = v.union(
  v.literal("wix"),
  v.literal("substack"),
  v.literal("csv"),
  v.literal("manual"),
);

export const stageBatch = mutation({
  args: {
    migrationSecret: v.string(),
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
    if (
      !process.env.MIGRATION_SECRET ||
      args.migrationSecret !== process.env.MIGRATION_SECRET
    ) {
      throw new Error("Unauthorized import");
    }
    const now = Date.now();
    const jobId =
      args.jobId ??
      (await ctx.db.insert("importJobs", {
        source: args.source,
        status: "running",
        requestedBy: "migration-cli",
        sourceUrl: args.sourceUrl,
        totalRecords: 0,
        importedRecords: 0,
        skippedRecords: 0,
        failedRecords: 0,
        createdAt: now,
        updatedAt: now,
      }));
    const job = await ctx.db.get(jobId);
    if (!job) throw new Error("Import job not found");

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

export const reviewQueue = query({
  args: { jobId: v.id("importJobs"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["editor", "admin"]);
    return ctx.db
      .query("importRecords")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .take(Math.min(args.limit ?? 100, 100));
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
    const { user } = await requireRole(ctx, ["editor", "admin"]);
    const record = await ctx.db.get(args.recordId);
    if (!record) throw new Error("Import record not found");
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
