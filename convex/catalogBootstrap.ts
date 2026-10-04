import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { bookInput, seriesInput, upsertBookRecord, upsertSeriesRecord } from "./catalog";

// Operator-only: never exposed as a public client mutation. Imports canonical
// source records without creating accounts or granting application roles.
export const publish = internalMutation({
  args: { series: v.array(seriesInput), books: v.array(bookInput) },
  handler: async (ctx, args) => {
    const actor = "operator:catalog-bootstrap";
    for (const series of args.series) {
      await upsertSeriesRecord(ctx, actor, { ...series, status: "published" });
    }
    for (const book of args.books) {
      await upsertBookRecord(ctx, actor, { ...book, status: "published" });
    }
    return { series: args.series.length, books: args.books.length };
  },
});
