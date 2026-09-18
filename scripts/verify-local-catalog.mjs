import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

// This command writes only to the explicitly configured anonymous local backend.
assert.match(process.env.CONVEX_DEPLOYMENT ?? "", /^anonymous:/);
for (const key of ["NEXT_PUBLIC_CONVEX_URL", "NEXT_PUBLIC_CONVEX_SITE_URL", "SITE_URL"]) {
  const url = new URL(process.env[key]);
  assert.equal(url.hostname, "127.0.0.1", `${key} must use the local backend`);
}
const origin = process.env.SITE_URL;
const authUrl = `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/api/auth`;
const stamp = Date.now();
const adminEmail = `catalog-admin-${stamp}@example.test`;
execFileSync("npx", ["convex", "env", "set", "ADMIN_EMAILS", adminEmail], { stdio: "pipe" });

async function account(email) {
  const response = await fetch(`${authUrl}/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email, password: randomBytes(24).toString("hex"), name: "Local Catalog Test" }),
  });
  assert.equal(response.status, 200, await response.clone().text());
  const { token } = await response.json();
  const jwtResponse = await fetch(`${authUrl}/convex/token`, {
    headers: { Authorization: `Bearer ${token}`, Origin: origin },
  });
  assert.equal(jwtResponse.status, 200, await jwtResponse.clone().text());
  const jwt = await jwtResponse.json();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  client.setAuth(jwt.token);
  await client.mutation(api.profiles.ensure, { displayName: "Local Catalog Test", newsletterOptIn: false });
  return client;
}

const admin = await account(adminEmail);
const prepared = JSON.parse(execFileSync(process.execPath, ["scripts/prepare-catalog-import.mjs", "data/catalog/amazon-author-page.json"], { encoding: "utf8" }));
const staged = await admin.mutation(api.imports.stageCatalog, prepared);
const queue = await admin.query(api.imports.reviewQueue, { jobId: staged.jobId, limit: 100 });
for (const record of [...queue].sort((a, b) => (a.entityType === "series" ? 0 : 1) - (b.entityType === "series" ? 0 : 1))) {
  await admin.mutation(api.imports.publishCatalogRecord, { recordId: record._id, publish: true });
}
const publicClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const books = await publicClient.query(api.catalog.listPublishedBooks, { limit: 100 });
assert.equal(books.length, prepared.records.filter((record) => record.entityType === "book").length);
assert.ok(books.every((book) => book.coverAsset?.path && book.purchaseUrl));
const ivy = await publicClient.query(api.catalog.bookBySlug, { slug: "ivy-s-league-b015n7gnx2" });
assert.ok(ivy, "Ivy's League resolves at its canonical slug");
assert.equal(await publicClient.query(api.catalog.bookBySlug, { slug: "missing-catalog-test" }), null);
await assert.rejects(publicClient.mutation(api.progress.saveBySlug, { slug: ivy.slug, percent: 30 }));
const reader = await account(`reader-${stamp}@example.test`);
await reader.mutation(api.progress.saveBySlug, { slug: ivy.slug, percent: 35 });
assert.equal((await reader.query(api.progress.currentBySlug, { slug: ivy.slug })).percent, 35);
await reader.mutation(api.progress.saveBySlug, { slug: ivy.slug, percent: 100 });
assert.equal((await reader.query(api.progress.currentBySlug, { slug: ivy.slug })).completed, true);
assert.equal(await admin.query(api.progress.currentBySlug, { slug: ivy.slug }), null);
await assert.rejects(reader.mutation(api.imports.stageCatalog, prepared));
await assert.rejects(reader.mutation(api.progress.saveBySlug, { slug: ivy.slug, percent: 101 }));
console.log(`Verified ${books.length} published books: real auth, staged import, covers, purchase links, lookup, progress persistence, user isolation, and write permissions.`);
