export const editorialPaths = {
  blog: "/blog",
  quick_bite: "/quick-bites",
  short_read: "/short-reads",
  outtake: "/outtakes",
} as const;

export function editorialPath(kind: keyof typeof editorialPaths, slug: string) {
  return `${editorialPaths[kind]}/${encodeURIComponent(slug)}`;
}
