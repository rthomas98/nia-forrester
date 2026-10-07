/**
 * Client- and server-safe editorial helpers. These checks only improve form
 * feedback; convex/cms.ts re-validates every save and enforces staff access.
 */
import type { Doc } from "@/convex/_generated/dataModel";
import { editorialPath, editorialPaths } from "@/lib/editorial-routes";

export type EditorialKind = Doc<"editorialPosts">["kind"];
export type EditorialStatus = Doc<"editorialPosts">["status"];
export type EditorialBlock = Doc<"editorialPosts">["blocks"][number];
export type EditorialBlockType = EditorialBlock["type"];

export const editorialKinds = ["blog", "quick_bite", "short_read", "outtake"] as const satisfies readonly EditorialKind[];

export const kindCopy: Record<EditorialKind, { plural: string; singular: string; tagline: string; description: string }> = {
  blog: {
    plural: "Blog",
    singular: "Blog Post",
    tagline: "From the Desk",
    description: "Essays, updates, and notes on writing, reading, and the stories behind the books.",
  },
  quick_bite: {
    plural: "Quick Bites",
    singular: "Quick Bite",
    tagline: "What I’m Up To",
    description: "Quick notes on what Nia is watching, eating and reading right now.",
  },
  short_read: {
    plural: "Short Reads",
    singular: "Short Read",
    tagline: "Settle In",
    description: "Longer short fiction for an evening with a glass of something good.",
  },
  outtake: {
    plural: "Outtakes",
    singular: "Outtake",
    tagline: "Cutting Room Floor",
    description: "Deleted scenes, alternate takes, and moments from the margins of the novels.",
  },
};

export { editorialPath, editorialPaths };

export function isEditorialKind(value: unknown): value is EditorialKind {
  return typeof value === "string" && (editorialKinds as readonly string[]).includes(value);
}

/** Mirrors safeEditorialUrl in convex/editorialModel.ts. */
export function safeEditorialUrl(value: string | undefined | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch {
    return value.startsWith("/images/") && !value.includes("..") && !value.includes("\\");
  }
}

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string): string {
  return value.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[’']/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 180).replace(/-+$/, "");
}

export function emptyBlock(type: EditorialBlockType): EditorialBlock {
  switch (type) {
    case "paragraph": return { type, text: "" };
    case "heading": return { type, text: "", level: 2 };
    case "quote": return { type, text: "" };
    case "image": return { type, url: "", alt: "" };
    case "video": return { type, url: "", title: "" };
    case "link": return { type, url: "", text: "" };
  }
}

/** True when a block carries publishable content, matching the backend rule. */
export function blockHasContent(block: EditorialBlock): boolean {
  return ("text" in block && block.text.trim() !== "") || ("url" in block && block.url !== "");
}

export type EditorialInput = {
  kind: EditorialKind;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  coverUrl?: string;
  coverAlt?: string;
  blocks: EditorialBlock[];
  status: EditorialStatus;
  publishedAt?: number;
};

/** Field key -> message. Block issues use `block-<index>`. */
export type EditorialIssues = Partial<Record<string, string>>;

/** Mirrors validateEditorial in convex/editorialModel.ts, reporting every issue at once. */
export function validateEditorialInput(value: EditorialInput): EditorialIssues {
  const issues: EditorialIssues = {};
  if (!value.title.trim() || value.title.length > 200) issues.title = "Title must be between 1 and 200 characters.";
  if (!slugPattern.test(value.slug) || value.slug.length > 180) issues.slug = "Use a lowercase, hyphen-separated slug (letters, numbers and hyphens).";
  if (!value.author.trim() || value.author.length > 120) issues.author = "Author is required, up to 120 characters.";
  if (value.excerpt.length > 1000) issues.excerpt = "Keep the excerpt under 1,000 characters.";
  if (value.category.length > 100) issues.category = "Keep the category under 100 characters.";
  if (value.tags.length > 30 || value.tags.some(tag => !tag.trim() || tag.length > 80)) issues.tags = "Use up to 30 tags, each up to 80 characters.";
  if (value.coverUrl && !safeEditorialMediaUrl(value.coverUrl)) issues.coverUrl = "Use an https:// image URL or upload an image.";
  if (value.coverUrl && !value.coverAlt?.trim()) issues.coverAlt = "Describe the cover image for screen-reader users.";
  if (value.publishedAt !== undefined && (!Number.isFinite(value.publishedAt) || value.publishedAt < 0)) issues.publishedAt = "Publication date is invalid.";
  if (value.blocks.length > 1000 || JSON.stringify(value.blocks).length > 500000) issues.blocks = "Content exceeds the supported size.";
  value.blocks.forEach((block, index) => {
    const key = `block-${index}`;
    if ("url" in block && block.url !== "" && !safeEditorialUrl(block.url)) issues[key] = "Use a full http:// or https:// URL.";
    else if ((block.type === "image" || block.type === "video") && block.url !== "" && !safeEditorialMediaUrl(block.url)) issues[key] = "Images and videos need an https:// URL.";
    else if ((block.type === "image" || block.type === "video" || block.type === "link") && block.url === "") issues[key] = "Add a URL or remove this block.";
    else if (block.type === "image" && !block.alt.trim()) issues[key] = "Images need descriptive alternative text.";
    else if (block.type === "video" && !block.title.trim()) issues[key] = "Videos need a title.";
  });
  if (value.status === "published" && !value.blocks.some(blockHasContent)) issues.blocks = "Add some content before publishing.";
  return issues;
}

const loopbackHosts = ["127.0.0.1", "localhost", "[::1]"];

/**
 * Mirrors safeEditorialMediaUrl in convex/editorialModel.ts, for covers, images and
 * videos: HTTPS or a relative /images/ path; plain HTTP only from a loopback host
 * (local uploads). Link blocks keep the broader safeEditorialUrl rule.
 */
export function safeEditorialMediaUrl(value: string | undefined | null): value is string {
  if (!safeEditorialUrl(value)) return false;
  if (value.startsWith("/images/")) return true;
  const url = new URL(value);
  return url.protocol === "https:" || loopbackHosts.includes(url.hostname);
}

/**
 * Only YouTube and Vimeo are embedded, from an extracted ID onto a fixed host.
 * Any other video URL renders as a plain outbound link.
 */
export function videoEmbedUrl(value: string): string | null {
  if (!safeEditorialMediaUrl(value)) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  const youtubeId = host === "youtu.be" ? url.pathname.slice(1)
    : host === "youtube.com" || host === "youtube-nocookie.com"
      ? url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null
      : null;
  if (youtubeId && /^[A-Za-z0-9_-]{6,20}$/.test(youtubeId)) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  }
  const vimeoId = host === "vimeo.com" ? url.pathname.match(/^\/(\d{4,12})(?:\/|$)/)?.[1]
    : host === "player.vimeo.com" ? url.pathname.match(/^\/video\/(\d{4,12})(?:\/|$)/)?.[1] : undefined;
  return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : null;
}

export function formatEditorialDate(value: number | undefined): string | null {
  return value === undefined ? null
    : new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Read a user-facing message from a ConvexError thrown by convex/cms.ts. */
export function editorialErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
      return data.message;
    }
  }
  return fallback;
}

export function editorialErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("data" in error)) return null;
  const data = (error as { data: unknown }).data;
  return typeof data === "object" && data !== null && "code" in data && typeof data.code === "string" ? data.code : null;
}
