# Account avatars

Dashboard Upload Avatar sends multipart `avatar` to authenticated, same-origin `POST /api/avatar`. JPEG/PNG/WebP inputs must be nonempty and at most 5 MB. The streamed request is bounded even without Content-Length. Sharp decodes with a 20-million-pixel limit, rejects animation/other formats, auto-orients, center-crops to 256×256 WebP, and strips metadata.

The server forwards the authenticated session and a server-only secret to `avatars.upload`. The action rechecks authentication and the secret; callers cannot provide a target user ID or arbitrary storage ID. An internal mutation attaches the stored image to the authenticated owner and deletes the replaced file. Failed attachment deletes its newly uploaded file. `avatars.remove` takes no user ID and removes only the current user's image. `avatars.mine` returns only the current user's URL. Missing avatars use the reader's initial.

Avatar records are independent of staff roles, membership, and Better Auth's external-provider image field. No profile bootstrap or privilege changes occur. Reactive Convex queries update the header and dashboard together. Storage image URLs are publicly accessible to anyone with the link; the upload UI discloses this. Do not upload confidential imagery.

Local checks: seven avatar/dashboard backend tests passed; typecheck and production build passed. Live endpoint checks returned 401 for anonymous, 403 for foreign origin, 400 for corrupt/SVG, 413 for oversized, and 200 for a synthetic PNG. Browser reload confirmed the stored image in both header and dashboard. File-picker upload acceptance is tracked separately from endpoint testing.

Requires INTERNAL_API_SECRET in both Next.js and Convex, plus working Better Auth/Convex configuration. Not deployed to production. The earlier unrelated RBAC audit failures remain unresolved.
