export type CatalogRole = "reader" | "moderator" | "editor" | "admin";
export type PublishStatus = "draft" | "scheduled" | "published" | "archived";
export type CatalogVisibility = "public" | "unlisted" | "hidden";

export function normalizeIdentityPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function catalogIdentity(sourceId: string, externalId: string): string {
  const source = normalizeIdentityPart(sourceId);
  const external = normalizeIdentityPart(externalId);
  if (!source || !external) {
    throw new Error("Catalog sourceId and externalId must contain an identifier");
  }
  return `catalog:${source}:${external}`;
}

export function canWriteCatalog(role: CatalogRole | undefined): boolean {
  return role === "editor" || role === "admin";
}

export function isPublicCatalogRecord(
  status: PublishStatus,
  visibility: CatalogVisibility | undefined,
  includeUnlisted: boolean,
): boolean {
  return (
    status === "published" &&
    (visibility === "public" || (includeUnlisted && visibility === "unlisted"))
  );
}

export function isPublicSeriesReference(
  status: PublishStatus,
  visibility: CatalogVisibility | undefined,
): boolean {
  return isPublicCatalogRecord(status, visibility, true);
}

export function boundedListLimit(
  value: number | undefined,
  fallback: number,
  maximum: number,
): number | null {
  if (value !== undefined && !Number.isFinite(value)) return null;
  return Math.min(Math.max(Math.floor(value ?? fallback), 1), maximum);
}

export function compareSeriesBooks(
  left: { seriesPosition?: number; sortOrder: number; title: string },
  right: { seriesPosition?: number; sortOrder: number; title: string },
): number {
  const leftPosition = left.seriesPosition ?? Number.POSITIVE_INFINITY;
  const rightPosition = right.seriesPosition ?? Number.POSITIVE_INFINITY;
  if (leftPosition !== rightPosition) return leftPosition - rightPosition;
  if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
  return left.title.localeCompare(right.title);
}

export function catalogImportJobProgress(
  job: { totalRecords: number; skippedRecords: number; failedRecords: number },
  recordStatuses: Array<"staged" | "imported" | "skipped" | "failed">,
): { importedRecords: number; status: "review" | "completed" } {
  const importedRecords = recordStatuses.filter((status) => status === "imported").length;
  const processedRecords = importedRecords + job.skippedRecords + job.failedRecords;
  return {
    importedRecords,
    status: processedRecords >= job.totalRecords ? "completed" : "review",
  };
}

export function ownsReaderRecord(
  authenticatedUserId: string,
  recordUserId: string,
): boolean {
  return authenticatedUserId === recordUserId;
}

export function classifyCatalogImport(
  existing: {
    checksum?: string;
    payload?: string;
    status: "staged" | "imported" | "skipped" | "failed";
  } | null,
  incomingChecksum: string,
  incomingPayload: string,
): "insert" | "unchanged" | "update" | "conflict" {
  if (!existing) return "insert";
  if (existing.checksum === incomingChecksum && existing.payload === incomingPayload) {
    return "unchanged";
  }
  return existing.status === "imported" ? "conflict" : "update";
}
