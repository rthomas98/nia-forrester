/**
 * Renders editorial content from structured blocks only. Text is always emitted as
 * React text (never HTML). Media URLs (cover, image, video) must pass
 * safeEditorialMediaUrl and link hrefs safeEditorialUrl before reaching the DOM.
 */
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "relume-icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { container, label, muted, tagline } from "@/lib/typography";
import {
  editorialPaths, formatEditorialDate, kindCopy, safeEditorialMediaUrl, safeEditorialUrl, videoEmbedUrl,
  type EditorialBlock, type EditorialKind,
} from "./editorial-model";

export type EditorialArticleContent = {
  kind: EditorialKind;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  coverUrl?: string;
  coverAlt?: string;
  publishedAt?: number;
  blocks: EditorialBlock[];
};

const outbound = (url: string) => /^https?:/i.test(url);

// Show the whole source image (book covers and portraits included) at its natural
// ratio; very tall images are capped and letterboxed instead of cropped.
const mediaFrame = "flex w-full justify-center overflow-hidden rounded-image bg-wine-sunken";
const mediaImage = "h-auto max-h-[80vh] w-auto max-w-full object-contain";

function Block({ block }: { block: EditorialBlock }) {
  switch (block.type) {
    case "paragraph":
      return block.text.trim() ? <p className="whitespace-pre-line">{block.text}</p> : null;
    case "heading": {
      const Heading = block.level === 3 ? "h3" : "h2";
      return block.text.trim() ? (
        <Heading className={cn("font-display font-semibold text-balance text-cream", block.level === 3 ? "pt-2 text-h5" : "pt-4 text-h4")}>
          {block.text}
        </Heading>
      ) : null;
    }
    case "quote":
      return block.text.trim() ? (
        <blockquote className="border-l-2 border-champagne pl-5 font-display text-h6 text-pretty whitespace-pre-line text-cream italic">
          {block.text}
        </blockquote>
      ) : null;
    case "image":
      return safeEditorialMediaUrl(block.url) ? (
        <figure className="space-y-3">
          <div className={mediaFrame}>
            <Image src={block.url} alt={block.alt} width={1440} height={960} unoptimized sizes="(min-width: 768px) 720px, 100vw" className={mediaImage} />
          </div>
          {block.caption?.trim() ? <figcaption className={muted}>{block.caption}</figcaption> : null}
        </figure>
      ) : null;
    case "video": {
      if (!safeEditorialMediaUrl(block.url)) return null;
      const embed = videoEmbedUrl(block.url);
      return embed ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-image bg-wine-sunken">
          <iframe
            src={embed}
            title={block.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            className="absolute inset-0 size-full border-0"
          />
        </div>
      ) : (
        <p>
          <a href={block.url} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-champagne underline underline-offset-4 hover:text-cream">
            Watch: {block.title}<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      );
    }
    case "link":
      return safeEditorialUrl(block.url) ? (
        <p>
          <a
            href={block.url}
            {...(outbound(block.url) ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
            className="font-semibold text-champagne underline underline-offset-4 hover:text-cream"
          >
            {block.text.trim() || block.url}
            {outbound(block.url) ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        </p>
      ) : null;
  }
}

export function EditorialBlocks({ blocks }: { blocks: EditorialBlock[] }) {
  return (
    <div className="space-y-6 text-medium text-pretty text-body">
      {blocks.map((block, index) => <Block key={index} block={block} />)}
    </div>
  );
}

export function EditorialArticle({
  post,
  banner,
  showBackLink = true,
  headingLevel = "h1",
}: {
  post: EditorialArticleContent;
  /** Shown above the article, e.g. a staff preview notice. */
  banner?: ReactNode;
  showBackLink?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const copy = kindCopy[post.kind];
  const Heading = headingLevel;
  const published = formatEditorialDate(post.publishedAt);
  const cover = safeEditorialMediaUrl(post.coverUrl) ? post.coverUrl : null;
  return (
    <article className="px-[5%] py-16 md:py-24">
      <div className={container}>
        <div className="mx-auto max-w-[720px]">
          {banner}
          {showBackLink ? (
            <Link href={editorialPaths[post.kind]} className="mb-8 inline-flex min-h-11 items-center gap-2 font-ui text-tiny font-semibold tracking-[0.12em] text-champagne uppercase hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne">
              <ChevronLeft aria-hidden="true" className="size-4" />
              All {copy.plural}
            </Link>
          ) : null}
          <header className="mb-10">
            <p className={tagline}>{copy.singular}{post.category ? ` · ${post.category}` : ""}</p>
            <Heading className="mb-5 font-display text-h2 font-semibold text-balance break-words text-cream">{post.title || "Untitled"}</Heading>
            {post.excerpt ? <p className="text-large text-pretty text-body">{post.excerpt}</p> : null}
            <p className={cn("mt-6", label)}>
              By {post.author || "Nia Forrester"}
              {published ? <> · <time dateTime={new Date(post.publishedAt!).toISOString()}>{published}</time></> : null}
            </p>
          </header>
          {cover ? (
            <div className={cn("mb-10", mediaFrame)}>
              <Image src={cover} alt={post.coverAlt ?? ""} width={1440} height={960} unoptimized priority={headingLevel === "h1"} sizes="(min-width: 768px) 720px, 100vw" className={mediaImage} />
            </div>
          ) : null}
          <EditorialBlocks blocks={post.blocks} />
          {post.tags.length ? (
            <ul aria-label="Tags" className="mt-12 flex flex-wrap gap-2 border-t border-hairline pt-6">
              {post.tags.map(tag => <li key={tag}><Badge variant="outline">{tag}</Badge></li>)}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
