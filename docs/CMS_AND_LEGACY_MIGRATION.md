# Editorial CMS and legacy review

## Local implementation

The editor is at `/admin/content` (`/admin` redirects there). Better Auth identifies the user; Convex permits only `editor` and `admin` profiles to read staff content, upload media, save posts or review imports. Reader and moderator roles cannot edit. No client-side role check grants backend authority.

Content types have public list/detail routes:

| Type | Route |
| --- | --- |
| Blog | `/blog` |
| Quick Bites — Watching, Eating & Reading | `/quick-bites` |
| Short Reads | `/short-reads` |
| Outtakes | `/outtakes` |

Authors can edit titles, slugs, excerpts, categories, tags, publication dates, cover images and structured paragraph/heading/quote/image/video/link blocks. JPEG, PNG and WebP uploads are limited to 5 MB. Video embeds are restricted to supported YouTube/Vimeo URLs; other safe video URLs become outbound links. Raw HTML is never executed. Media requires HTTPS outside the local loopback backend.

Save Draft keeps content private. Preview is staff-only. Publish exposes the article and makes it eligible for public search, category lists and the sitemap. Archive removes it from those public surfaces; saving it again can restore a draft. Every edit uses an expected version, stores the preceding revision and writes an audit event. There is no scheduled-publishing feature in this implementation.

Read and footer links discover all four sections. Empty sections render honest empty states rather than sample posts.

## Legacy content status — October 7, 2026

A read-only scan discovered 110 public URLs across nested legacy sitemaps. It extracted 109; `/the-secret-series` timed out. Of the extracted pages, 41 are recognized editorial sources: 24 blog posts, 13 short reads, 3 outtakes and 1 Quick Bites page. The remaining 68 pages require manual mapping (books, store/service pages, navigation and other material). These are not automatically converted into articles.

All 109 extracted records were staged in the **local** review queue. Local QA records and accounts were not copied to production. Following the user's publication approval, 41 freshly extracted and reviewed editorial records were published to production: 24 blogs, 13 short reads, 3 outtakes and one combined Quick Bites collection. Original blog dates were retained; 17 undated sources remain undated. Four original YouTube videos were restored. One metadata excerpt's numeric entities were corrected with a revision and audit entry; story blocks were unchanged.

Production provider identity was verified for Vercel project `nia-forrester` in `rob-thomas-projects` and Convex `empuls3-agancy:nia-forrester:production` (`valiant-egret-997`). The reviewed working-tree build `dpl_9pWMzqvdT1bAYqDVVBvGoECqjnkn` was promoted to https://nia-forrester.vercel.app/. This release was not committed or pushed by this task.

Operator publication is internal-only, checksum-tracked and idempotent; it refuses to overwrite authored content or sources skipped by editors. The manifest and publication receipt are `/private/tmp/nia-editorial-production-20261007.json` and `/private/tmp/nia-editorial-publication-receipt-20261007.json`. No production profile was assigned editor/admin access; the owner must identify the account to authorize.

Review imports individually. Approve as Draft creates an unpublished post; publishing is a separate editorial decision. Checksums make restaging unchanged sources idempotent, and changed previously imported sources cannot silently overwrite authored content.

### Review still required

- Extraction preserves paragraph breaks, source attribution, historical dates and original media, but not inline rich-text emphasis. Generic image alternatives can still be improved editorially.
- The legacy Quick Bites source is a combined page and may need to be split into separate entries.
- The Duets story on `/short-reads` needs manual handling, including collaborator attribution and external installments.
- Published records use original Wix asset URLs rather than blurred thumbnails. Older local staged records still need re-extraction before any future publication.
- Reconcile the 68 unmapped pages into the appropriate existing catalog, service, policy or navigation features. Skip irrelevant empty/platform pages rather than publishing them as content.
- Retry the one timed-out source. Public crawling does not provide private Wix drafts, members, orders, bookings or protected files; those need an authorized export.
- Old-domain redirects and durable media migration remain future work. External media URLs currently depend on the legacy host remaining available.

## Verification evidence

Local browser checks confirmed anonymous sign-in gating, reader access denial, editor access, return-to-CMS sign-in, draft 404, publish rendering, archive removal, image upload/save/preview and import approval as draft. Mobile 390 px and tablet 768 px checks found and corrected import-list overflow. CMS checks also cover admin/editor versus moderator/reader enforcement, optimistic conflicts, revisions, duplicate slugs, unsafe URLs, publication dates, search isolation and import idempotency.

Production browser checks confirmed all four collection counts (including Blog Load More to 24), a full Quick Bites article with no invented publication date, a restored YouTube embed, loaded Blog cover images, and anonymous CMS sign-in gating. A 390 px Blog check had no horizontal overflow. TypeScript and 87 automated checks passed; React Doctor reported no errors and 37 existing warnings. Production signed-in CMS editing was not tested because no owner-selected editor account has been authorized.
