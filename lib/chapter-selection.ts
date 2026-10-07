/**
 * Chapter selection by stable record identity. Titles are display labels only: two
 * published chapters may share a title, and each must stay independently selectable.
 * Dependency-free so it can be unit tested with `node --test`.
 */
export type ChapterIdentity = { _id: string; title: string };

export type ChapterOption = { value: string; label: string };

/** One option per chapter row, valued by the row's unique `_id`. */
export function chapterOptions(rows: readonly ChapterIdentity[]): ChapterOption[] {
  return rows.map((row) => ({ value: row._id, label: row.title }));
}

/** Index of the chapter whose `_id` matches; falls back to the first chapter. */
export function chapterIndexForValue(rows: readonly ChapterIdentity[], value: string): number {
  const index = rows.findIndex((row) => row._id === value);
  return index < 0 ? 0 : index;
}

/** Keeps a stored index valid when the published chapter list changes. */
export function clampChapterIndex(rows: readonly unknown[], index: number): number {
  if (rows.length === 0) return 0;
  return Math.min(Math.max(index, 0), rows.length - 1);
}
