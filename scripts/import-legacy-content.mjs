#!/usr/bin/env node

import { createHash } from "node:crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const authToken = process.env.CONVEX_AUTH_TOKEN;
const sitemapUrl =
  process.env.LEGACY_SITEMAP_URL ??
  "https://www.niaforrester.com/sitemap.xml";

if (!convexUrl || !authToken) {
  console.error(
    "Set NEXT_PUBLIC_CONVEX_URL and CONVEX_AUTH_TOKEN for an editor/admin before staging legacy content.",
  );
  process.exit(1);
}

const sitemapResponse = await fetch(sitemapUrl);
if (!sitemapResponse.ok) {
  throw new Error(`Could not fetch ${sitemapUrl}: ${sitemapResponse.status}`);
}
const sitemap = await sitemapResponse.text();
const urls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), (match) =>
  match[1].replaceAll("&amp;", "&"),
);

const client = new ConvexHttpClient(convexUrl);
client.setAuth(authToken);
let jobId;
let staged = 0;
let skipped = 0;

for (let start = 0; start < urls.length; start += 20) {
  const batchUrls = urls.slice(start, start + 20);
  const records = await Promise.all(
    batchUrls.map(async (url) => {
      const response = await fetch(url);
      const html = response.ok ? await response.text() : "";
      const title =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1] ??
        html.match(/<title>(.*?)<\/title>/i)?.[1] ??
        url;
      const description =
        html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)/i)?.[1] ??
        "";
      const payload = JSON.stringify({
        title,
        description,
        httpStatus: response.status,
        fetchedAt: new Date().toISOString(),
      });
      return {
        externalId: createHash("sha256").update(url).digest("hex"),
        externalUrl: url,
        entityType: url.includes("/post/") ? "essay" : "page",
        payload,
        checksum: createHash("sha256").update(payload).digest("hex"),
      };
    }),
  );

  const result = await client.mutation(api.imports.stageBatch, {
    source: "wix",
    jobId,
    sourceUrl: sitemapUrl,
    records,
  });
  jobId = result.jobId;
  staged += result.staged;
  skipped += result.skipped;
  console.log(`Staged ${Math.min(start + 20, urls.length)} of ${urls.length}`);
}

console.log(
  JSON.stringify({ jobId, discovered: urls.length, staged, skipped }, null, 2),
);
