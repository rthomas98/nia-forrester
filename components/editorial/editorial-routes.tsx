/**
 * Shared server helpers for the /blog, /quick-bites, /short-reads and /outtakes
 * route files, which stay one-line wrappers around these.
 */
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { catalogIsConfigured } from "@/lib/catalog";
import { EditorialArticle } from "./editorial-article";
import { EditorialDetailClient } from "./editorial-detail-client";
import { EditorialDiscovery } from "./editorial-discovery";
import EditorialListPage from "./editorial-list-page";
import { editorialPath, editorialPaths, kindCopy, safeEditorialMediaUrl, type EditorialKind } from "./editorial-model";

type PublicPost = NonNullable<FunctionReturnType<typeof api.cms.bySlug>>;
type Lookup = { status: "found"; post: PublicPost } | { status: "missing" } | { status: "deferred" };
type SlugParams = { params: Promise<{ slug: string }> };

const lookUp = cache(async (kind: EditorialKind, slug: string): Promise<Lookup> => {
  if (!catalogIsConfigured) return { status: "deferred" };
  try {
    const post = await fetchQuery(api.cms.bySlug, { kind, slug });
    return post ? { status: "found", post } : { status: "missing" };
  } catch {
    // An unreachable backend is not a missing post; the client retries.
    return { status: "deferred" };
  }
});

export function editorialListMetadata(kind: EditorialKind): Metadata {
  const copy = kindCopy[kind];
  return { title: copy.plural, description: copy.description, alternates: { canonical: editorialPaths[kind] } };
}

export function EditorialListRoute({ kind }: { kind: EditorialKind }) {
  return <EditorialListPage kind={kind} />;
}

export async function editorialDetailMetadata(kind: EditorialKind, { params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await lookUp(kind, slug);
  if (lookup.status === "missing") return { title: "Not Found", robots: { index: false } };
  if (lookup.status === "deferred") return { title: kindCopy[kind].singular, alternates: { canonical: editorialPath(kind, slug) } };
  const { post } = lookup;
  const image = safeEditorialMediaUrl(post.coverUrl) ? [{ url: post.coverUrl, alt: post.coverAlt ?? "" }] : undefined;
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: editorialPath(kind, post.slug) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      url: editorialPath(kind, post.slug),
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: [post.author],
      images: image,
    },
  };
}

export async function EditorialDetailRoute({ kind, params }: { kind: EditorialKind } & SlugParams) {
  const { slug } = await params;
  const lookup = await lookUp(kind, slug);
  if (lookup.status === "missing") notFound();
  return (
    <main>
      {lookup.status === "found" ? <EditorialArticle post={lookup.post} /> : <EditorialDetailClient kind={kind} slug={slug} />}
      <EditorialDiscovery current={kind} />
    </main>
  );
}
