import type { CatalogBook } from "./catalog";

/** Match retailer subtitles without changing the displayed title. */
export function normalizedBookTitle(title: string): string {
  return title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[’‘]/g, "'").replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function begins(title: string, name: string) {
  return title === name || title.startsWith(`${name} `);
}

const commitment = ["commitment", "unsuitable men", "maybe never", "the fall", "four stories of marriage"];
const afterwards = ["afterwards", "afterburn", "the come up", "the takedown", "young rich and black", "snowflake", "rhyme and reason", "courtship", "unplanned"];
const coffee = ["coffee date", "just lunch", "table for two", "a la carte"];

export interface EditorialBookGroup {
  key: string;
  title: string | null;
  books: CatalogBook[];
}

export function groupEditorialBooks(books: readonly CatalogBook[]): EditorialBookGroup[] {
  const groups: EditorialBookGroup[] = [
    { key: "lainey", title: "The Lainey Abbott Series", books: [] },
    { key: "commitment", title: "The Commitment Series", books: [] },
    { key: "afterwards", title: "The Afterwards Series", books: [] },
    { key: "mistress", title: "The Mistress Trilogy", books: [] },
    { key: "ivy-lover", title: null, books: [] },
    { key: "coffee", title: "The Coffee Date Series", books: [] },
    { key: "standalone", title: "Standalone Novels & Novellas", books: [] },
  ];
  for (const book of books) {
    const title = normalizedBookTitle(book.title);
    const series = normalizedBookTitle(book.series?.title ?? "");
    const key = series.includes("lainey abbott") || title.includes("lainey abbott") || begins(title, "reversible error") || begins(title, "jane doe black") ? "lainey"
      : series.includes("commitment") || commitment.some(name => begins(title, name)) ? "commitment"
      : series.includes("afterwards") || afterwards.some(name => begins(title, name)) ? "afterwards"
      : series.includes("mistress") || ["mistress", "wife", "mother"].some(name => begins(title, name)) ? "mistress"
      : ["ivy s league", "the lover"].some(name => begins(title, name)) ? "ivy-lover"
      : series.includes("coffee date") || coffee.some(name => begins(title, name)) ? "coffee"
      : "standalone";
    groups.find(group => group.key === key)?.books.push(book);
  }
  const orderFor = (key: string, book: CatalogBook) => {
    const title = normalizedBookTitle(book.title);
    const names = key === "afterwards" ? afterwards : key === "commitment" ? commitment
      : key === "mistress" ? ["mistress", "wife", "mother"] : key === "coffee" ? coffee
      : key === "ivy-lover" ? ["ivy s league", "the lover"] : [];
    const index = names.findIndex(name => begins(title, name));
    // Anniversary editions sit alongside Commitment, not in standalones.
    return index < 0 ? (book.seriesPosition ?? 100) : index;
  };
  for (const group of groups) {
    group.books.sort((a, b) => orderFor(group.key, a) - orderFor(group.key, b)
      || a.sortOrder - b.sortOrder || a.catalogKey.localeCompare(b.catalogKey));
  }
  return groups.filter(group => group.books.length > 0);
}

/** An explicit editorial flag; never infer an announcement from a draft. */
export function isComingSoon(book: Pick<CatalogBook, "comingSoon">): boolean {
  return book.comingSoon === true;
}

export function recentCatalogBooks(books: readonly CatalogBook[]): CatalogBook[] {
  return [...books].sort((a, b) => Number(isComingSoon(b)) - Number(isComingSoon(a))
    || (b.publicationDate ?? "").localeCompare(a.publicationDate ?? "")
    || a.sortOrder - b.sortOrder || a.catalogKey.localeCompare(b.catalogKey));
}
