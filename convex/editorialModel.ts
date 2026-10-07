import { v, ConvexError } from "convex/values";

export const editorialKind = v.union(v.literal("blog"), v.literal("quick_bite"), v.literal("short_read"), v.literal("outtake"));
export const editorialStatus = v.union(v.literal("draft"), v.literal("published"), v.literal("archived"));
export const editorialBlock = v.union(
  v.object({ type: v.literal("paragraph"), text: v.string() }),
  v.object({ type: v.literal("heading"), text: v.string(), level: v.union(v.literal(2), v.literal(3)) }),
  v.object({ type: v.literal("quote"), text: v.string() }),
  v.object({ type: v.literal("image"), url: v.string(), alt: v.string(), caption: v.optional(v.string()) }),
  v.object({ type: v.literal("video"), url: v.string(), title: v.string() }),
  v.object({ type: v.literal("link"), url: v.string(), text: v.string() }),
);
export const editorialFields = {
  kind: editorialKind, title: v.string(), slug: v.string(), excerpt: v.string(),
  author: v.string(), category: v.string(), tags: v.array(v.string()),
  coverUrl: v.optional(v.string()), coverAlt: v.optional(v.string()),
  blocks: v.array(editorialBlock), status: editorialStatus, publishedAt: v.optional(v.number()),
};

export function safeEditorialUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
  } catch { return value.startsWith("/images/") && !value.includes("..") && !value.includes("\\"); }
}

export function safeEditorialMediaUrl(value: string): boolean {
  if (!safeEditorialUrl(value)) return false;
  if (value.startsWith("/images/")) return true;
  const url = new URL(value);
  const localBackend = process.env.CONVEX_CLOUD_URL?.startsWith("http://127.0.0.1:") === true;
  return url.protocol === "https:" || (localBackend && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname));
}

export function validateEditorial(value: {
  title: string; slug: string; excerpt: string; author: string; category: string;
  tags: string[]; coverUrl?: string; coverAlt?: string;
  blocks: Array<{ type: string; text?: string; url?: string; alt?: string; title?: string; caption?: string }>;
  status: string; publishedAt?: number;
}) {
  const fail = (message: string): never => { throw new ConvexError({ code: "VALIDATION_ERROR", message }); };
  if (!value.title.trim() || value.title.length > 200) fail("Title must be between 1 and 200 characters.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) || value.slug.length > 180) fail("Use a lowercase, hyphen-separated slug.");
  if (!value.author.trim() || value.author.length > 120) fail("Author is required, up to 120 characters.");
  if (value.excerpt.length > 1000 || value.category.length > 100) fail("Excerpt or category is too long.");
  if (value.tags.length > 30 || value.tags.some(t => !t.trim() || t.length > 80)) fail("Use up to 30 tags, each up to 80 characters.");
  if (value.blocks.length > 1000 || JSON.stringify(value.blocks).length > 500000) fail("Content exceeds the supported size.");
  for (const block of value.blocks) {
    if (block.url !== undefined && !safeEditorialUrl(block.url)) fail("Media and links must use safe HTTP(S) URLs.");
    if ((block.type === "image" || block.type === "video") && block.url && !safeEditorialMediaUrl(block.url)) fail("Images and videos require HTTPS URLs.");
    if (block.type === "image" && !block.alt?.trim()) fail("Images need descriptive alternative text.");
    if (block.type === "video" && !block.title?.trim()) fail("Videos need a title.");
  }
  if (value.coverUrl && (!safeEditorialMediaUrl(value.coverUrl) || !value.coverAlt?.trim())) fail("A cover needs an HTTPS URL and alternative text.");
  if (value.publishedAt !== undefined && (!Number.isFinite(value.publishedAt) || value.publishedAt < 0)) fail("Publication date is invalid.");
  if (value.status === "published" && !value.blocks.some(b => b.text?.trim() || b.url)) fail("Published content cannot be empty.");
}
