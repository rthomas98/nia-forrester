import sharp from "sharp";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { api } from "@/convex/_generated/api";
export const runtime = "nodejs";
const maxBytes = 5 * 1024 * 1024;
export async function POST(request: Request) {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!site || !convexUrl || !convexSiteUrl || !secret) return Response.json({ error: "Avatar uploads are not configured." }, { status: 503 });
  if (request.headers.get("origin") !== new URL(site).origin) return Response.json({ error: "Invalid origin." }, { status: 403 });
  const auth = convexBetterAuthNextJs({ convexUrl, convexSiteUrl });
  try {
    if (!await auth.fetchAuthQuery(api.auth.getCurrentUser)) return Response.json({ error: "Sign in to upload an avatar." }, { status: 401 });
  } catch { return Response.json({ error: "Sign in to upload an avatar." }, { status: 401 }); }
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return Response.json({ error: "Choose an image file." }, { status: 400 });
  // Bound the streamed body, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: "Choose an image file." }, { status: 400 });
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const part = await reader.read(); if (part.done) break;
    size += part.value.byteLength;
    if (size > maxBytes + 65536) { await reader.cancel(); return Response.json({ error: "Image must be 5 MB or smaller." }, { status: 413 }); }
    chunks.push(part.value);
  }
  let bytes: ArrayBuffer;
  try {
    const form = await new Response(Buffer.concat(chunks), { headers: { "content-type": request.headers.get("content-type")! } }).formData();
    const file = form.get("avatar");
    if (!(file instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(file.type) || !file.size || file.size > maxBytes) throw new Error("Invalid file");
    const input = Buffer.from(await file.arrayBuffer());
    const processor = sharp(input, { limitInputPixels: 20000000, failOn: "warning" });
    const metadata = await processor.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format ?? "") || (metadata.pages ?? 1) > 1) throw new Error("Unsupported image");
    const output = await processor.rotate().resize(256, 256, { fit: "cover" }).webp({ quality: 85 }).toBuffer();
    bytes = Uint8Array.from(output).buffer;
  } catch { return Response.json({ error: "Choose a valid, non-animated JPEG, PNG, or WebP up to 5 MB." }, { status: 400 }); }
  try { await auth.fetchAuthAction(api.avatars.upload, { secret, bytes }); return Response.json({ success: true }); }
  catch { return Response.json({ error: "Upload failed. Please try again." }, { status: 503 }); }
}
