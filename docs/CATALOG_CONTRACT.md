# Catalog and reading-progress contract

Status: production-slice contract, September 18, 2026

This contract is the source of truth for frontend work on the reader catalog.
The implementation reuses the existing `series`, `content`, `readingProgress`,
`bookmarks`, `importJobs`, and `importRecords` tables. It does not enable the
Community or paid Membership releases described in `PRODUCTION_READINESS.md`.

## Authentication and roles

Better Auth is the identity provider. Convex derives the caller from the
Better Auth session; callers never supply a user ID or role.

| Capability | Anonymous | Reader or moderator | Editor | Admin |
| --- | --- | --- | --- | --- |
| List/view published public catalog | Yes | Yes | Yes | Yes |
| View an unlisted published item by slug | Yes | Yes | Yes | Yes |
| Read/write own progress and bookmarks | No | Yes | Yes | Yes |
| Stage and review catalog imports | No | No | Yes | Yes |
| Upsert draft catalog records | No | No | Yes | Yes |
| Publish or archive catalog records | No | No | Yes | Yes |

Missing or invalid auth is `UNAUTHENTICATED`. A signed-in caller without an
allowed profile role is `FORBIDDEN`. Both fail closed. The site must show its
existing configuration-unavailable state when the Convex/Better Auth public
URLs are absent; it must not substitute sample catalog rows or a mock user.

## Canonical catalog model

`CatalogSeries` contains `_id`, `catalogKey`, `slug`, `title`, optional `description`,
`status`, `visibility`, `sortOrder`, `createdAt`, and `updatedAt`.

`CatalogBook` is a `content` record whose `kind` is `book`. It contains `_id`,
`catalogKey`, `slug`, `title`, optional `subtitle` and `description`, optional
`seriesId`, optional `seriesPosition`, optional ISO `publicationDate`
(`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`), `formats`, optional `asin`, optional
`productUrl`, optional `editions`, optional `purchaseUrl`, `isAffiliate`, optional `coverAsset`, `status`,
`visibility`, `sortOrder`, `createdAt`, and `updatedAt`.
Public book DTOs replace stored `seriesId` with
`series: { _id, slug, title } | null` and add derived `purchaseUrl?` and
`isAffiliate`. A linked series is included only when it is published and is
public or unlisted; draft, scheduled, archived, hidden, legacy, or missing
series records are represented as `null` and never leak through a public book.

The allowed formats are `ebook`, `paperback`, `hardcover`, and `audiobook`.
When supplied, `editions` preserves source edition metadata as
`{ format, asin, productUrl }[]`; each ASIN is unique within a book and each URL
is the canonical HTTPS product URL for that edition. Missing descriptions stay
absent; importers must not synthesize marketing copy from a title or retailer
metadata.
`coverAsset` is `{ path, source, sourceReference?, sha256? }`; `path` must be a
root-relative local asset path. `source` is `stakeholder_provided`, `licensed`,
`retailer_source`, or `original`. `retailer_source` records retain the exact
source URL for provenance. Catalog preparation never downloads assets; every
referenced file must already exist locally and pass its SHA-256 check.

`status` is `draft`, `scheduled`, `published`, or `archived`. `visibility` is
`public`, `unlisted`, or `hidden`. Public lists include only
`published/public`; lookup by slug also permits `published/unlisted`, while
`hidden` is never returned by public queries.

`catalogKey` is immutable deterministic import identity:
`catalog:<normalized-source-id>:<normalized-external-id>`. Normalization trims,
lowercases, and replaces runs outside `a-z`, `0-9`, `.`, `_`, and `-` with `-`.
The coordinator-provided source and external IDs are required; titles, slugs,
ASINs, or URLs are not used as identity and missing metadata is never invented.

## Affiliate links

The canonical `productUrl` is an absolute `https` retailer URL. An ASIN, when
present, is ten uppercase letters/digits. The public `purchaseUrl` is derived
at read time: if an ASIN and server-side `AMAZON_ASSOCIATE_TAG` exist it is
`https://www.amazon.com/dp/<ASIN>?tag=<encoded-tag>`; otherwise it is the
canonical `productUrl`; otherwise it is absent. Clients must use
`purchaseUrl`, must not append or replace tags, and must label outbound links
as affiliate links when `isAffiliate` is true. Import data
cannot provide an affiliate tag or affiliate-ready URL.

## Public queries

### `catalog:listPublishedBooks`

Arguments: `{ limit?: number }`, where the default is 50 and the maximum is
100. The limit must be finite; non-finite values are `VALIDATION_ERROR`.
Returns `CatalogBook[]`, ordered by `sortOrder`, then title. Series data is
included as `{ _id, slug, title } | null`. Only `published/public` books are
returned. An empty catalog returns `[]`; loading is represented by Convex as
`undefined`; transport/configuration failures are errors, never empty data.

### `catalog:bookBySlug`

Arguments: `{ slug: string }`. Returns `CatalogBook | null`. It returns `null`
for an unknown slug, a non-book record, any non-published status, or hidden
visibility. Published unlisted books are addressable by exact slug.

### `catalog:listPublishedSeries`

Arguments: `{}`. Returns `CatalogSeries[]` with a `books: CatalogBook[]` field.
Only `published/public` series and their `published/public` books are included.
Series with no public books remain in the result with `books: []`. Loading and
error semantics match `catalog:listPublishedBooks`. Books within each series
are ordered by `seriesPosition`, then `sortOrder`, then title; books without a
series position follow positioned books.

## Authenticated reading queries and mutations

### `progress:mine`

Arguments: `{}`. Returns at most 50 progress records for the current user,
newest first. Each record is `{ _id, _creationTime, contentId, chapterId?,
percent, position?, completed, updatedAt }`. It never accepts or returns another
user's identity. No saved progress returns `[]`.

### `progress:currentBySlug`

Arguments: `{ slug: string }`. Returns the same progress shape plus optional
`chapterNumber`, or `null` when the visible published content or progress does
not exist.

### `progress:save`

Arguments: `{ contentId, chapterId?, percent, position?, completed }`. Returns
the progress ID. The content must be published and visible; a chapter must
belong to that content and be published. `percent` must be finite and within
0–100, and `position` must be a nonnegative finite number. The mutation upserts
only the authenticated user's `(user, content)` row.

### `progress:saveBySlug`

Arguments: `{ slug, chapterNumber?, percent, position?, completed? }`. Returns
the progress ID. The slug must resolve to visible published content. If a
chapter number is supplied it must resolve to a published chapter of that
content. Omitted `completed` is derived from `percent === 100`.

### `progress:listBookmarks` / `progress:addBookmark` / `progress:removeBookmark`

`listBookmarks` takes `{ contentId }` and returns only the current user's
`{ _id, _creationTime, contentId, chapterId?, position?, note?, createdAt }[]`
for visible published content; no bookmarks or non-visible content returns
`[]`. `addBookmark` takes
`{ contentId, chapterId?, position?, note? }`, validates ownership/content
relationships, and returns a bookmark ID. `removeBookmark` takes
`{ bookmarkId }` and deletes only a bookmark owned by the current user. A
missing bookmark is `NOT_FOUND`; cross-user deletion is also `NOT_FOUND` so it
does not disclose existence.

## Editor/admin catalog mutations

### `catalog:upsertSeries` / `catalog:upsertBook`

Both require editor or admin. Their arguments are `{ input }`, where `input`
contains the canonical fields above and a required `catalogKey`; timestamps and
IDs are server-owned. A book input uses optional `seriesCatalogKey` rather than
a database ID so imports remain deterministic. An
existing record is found by `catalogKey`. Creating a duplicate slug or changing
an existing record to another record's slug is `CONFLICT`. These mutations are
idempotent for the same canonical input and write an audit event. Draft,
scheduled, published, and archived states are explicit; no import auto-
publishes. Each mutation returns the resulting Convex series/content ID.

### `imports:stageCatalog`

Arguments are `{ sourceId, records }`, where each record is
`{ externalId, entityType: "series" | "book", checksum, payload }` and
`payload` is canonical JSON. Only editor/admin callers may stage. The server
recomputes the deterministic identity and rejects an identity mismatch in the
payload. A first identity is inserted as `staged`; the same identity and
checksum and canonical payload are `unchanged`; the same identity with changed
canonical payload replaces the staged payload and is `updated`. Identities
already marked `imported` cannot be
silently replaced. The return is `{ jobId, staged, updated, unchanged }`.

### `imports:reviewQueue` / `imports:publishCatalogRecord`

Both require editor/admin. `reviewQueue({ jobId, limit? })` returns at most 100
stored import records for that job, including identity, entity type, status,
checksum, canonical payload, target ID/error when present, and timestamps; an
empty queue returns `[]`. The optional limit must be finite or the query throws
`VALIDATION_ERROR`.
`publishCatalogRecord({ recordId, publish })` validates the stored canonical
payload, calls the corresponding catalog upsert, and marks the import record
`imported`, returning the resulting series/content ID. `publish: false` forces
`draft`; `publish: true` forces `published` but preserves the payload
visibility. The operation is idempotent and audited. It also recomputes the
parent job's `importedRecords` count and marks the job `completed` when imported,
skipped, and failed records account for `totalRecords`; otherwise the job
remains in `review`.

The local `npm run catalog:prepare -- path/to/catalog.json` command validates
and canonicalizes coordinator-supplied JSON, computes stable SHA-256 checksums,
and writes no files or remote data. Passing `--stage` additionally requires
`NEXT_PUBLIC_CONVEX_URL` and `CONVEX_AUTH_TOKEN` and invokes
`imports:stageCatalog` as the authenticated user. Missing configuration stops
before any mutation. The tool never scrapes, downloads assets, fills absent
fields, or publishes.

The input root is `{ "sourceId": string, "records": record[] }`. Every record
has `externalId`, `entityType`, and all required canonical fields for that
entity except `catalogKey`, which the tool derives. A book may use
`seriesExternalId` as shorthand for a series from the same source; the tool
derives `seriesCatalogKey`. Unknown fields, client-provided affiliate fields,
duplicate identities, and incomplete records are rejected before any remote
call.

### Amazon author-page normalization

`data/catalog/amazon-author-page.json` is accepted directly as a local source
shape. The 49 source rows remain unchanged. The transformer emits one canonical
book per exact title and one series for each of the seven distinct non-null
`series` objects. A trailing parenthetical is removed only when its contents
exactly equal the supplied structured series title, optionally followed by the
supplied `Book <position>`; other parentheticals remain part of the title. It
never infers series membership from title text: notably, the Commitment 10th
Anniversary Edition remains a separate standalone draft because its supplied
`series` is null. The two Wanderer listings consolidate into one canonical book
keyed by the first listing's primary ASIN (`B0DNRMVSJH`), with Kindle, paperback,
and audiobook ASINs and canonical product URLs retained in `editions`.

Amazon format labels normalize only to the four allowed contract values. Each
primary and alternate edition receives `https://www.amazon.com/dp/<ASIN>` with
no affiliate query. Affiliate behavior remains server-derived as described
above. Covers resolve to `/images/books/amazon/<order>-<ASIN>.jpg`, retain the
supplied Amazon image URL as `sourceReference`, and include the local file's
SHA-256. No description, publication date, or absent series association is
created.

## Error codes

Convex errors use these stable `data.code` values: `UNAUTHENTICATED`,
`FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, and `VALIDATION_ERROR`. UI code should
show an empty state only for successful `[]`/`null` responses, a sign-in prompt
for `UNAUTHENTICATED`, an access-denied state for `FORBIDDEN`, and a retryable
error state for transport/configuration failures.
For every reactive query, the Convex client represents loading as `undefined`;
only a resolved `[]` or `null` is an empty/not-found result. Mutations have no
empty success state: they return an ID/result object or throw a coded error.
