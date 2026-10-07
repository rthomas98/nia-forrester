import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { editorialPath } from "@/lib/editorial-routes";
import {
  CATALOG_LIST_LIMIT,
  catalogApi,
  catalogIsConfigured,
} from "@/lib/catalog";

const baseUrl = "https://www.niaforrester.com";

// Convex reads are uncached; generate from current published content per request.
export const dynamic = "force-dynamic";

/**
 * Detail URLs for published public books. The sitemap must always render, so
 * a missing deployment or a failed lookup yields the static entries only.
 */
async function bookEntries(): Promise<MetadataRoute.Sitemap> {
  if (!catalogIsConfigured) return [];
  try {
    const books = await fetchQuery(catalogApi.listPublishedBooks, {
      limit: CATALOG_LIST_LIMIT,
    });
    return books.map((book) => ({
      url: `${baseUrl}/read/${encodeURIComponent(book.slug)}`,
      lastModified: new Date(book.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("sitemap: published book lookup failed", error);
    return [];
  }
}

async function editorialEntries(): Promise<MetadataRoute.Sitemap> {
  if (!catalogIsConfigured) return [];
  try {
    const posts = await fetchQuery(api.cms.sitemap, {});
    return posts.map((post) => ({
      url: `${baseUrl}${editorialPath(post.kind, post.slug)}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("sitemap: published editorial lookup failed", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: Array<{
    path: string;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/read", changeFrequency: "weekly", priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/quick-bites", changeFrequency: "weekly", priority: 0.7 },
    { path: "/short-reads", changeFrequency: "monthly", priority: 0.6 },
    { path: "/outtakes", changeFrequency: "monthly", priority: 0.6 },
    { path: "/serial", changeFrequency: "weekly", priority: 0.9 },
    { path: "/events", changeFrequency: "weekly", priority: 0.8 },
    { path: "/academy", changeFrequency: "monthly", priority: 0.7 },
    { path: "/work-with-nia", changeFrequency: "monthly", priority: 0.6 },
    { path: "/community", changeFrequency: "weekly", priority: 0.6 },
    { path: "/membership", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.2 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.2 },
    { path: "/accessibility", changeFrequency: "monthly", priority: 0.2 },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes
    .filter((route) => {
      if (
        route.path === "/community" &&
        process.env.NEXT_PUBLIC_COMMUNITY_ENABLED === "false"
      ) {
        return false;
      }
      if (
        route.path === "/membership" &&
        process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "false"
      ) {
        return false;
      }
      return true;
    })
    .map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date("2026-07-23"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    }));

  const [books, editorial] = await Promise.all([bookEntries(), editorialEntries()]);
  return [...staticEntries, ...books, ...editorial];
}
