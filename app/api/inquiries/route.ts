import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { inquiryInput, inquiryMessage, signedCopyMessage } from "@/lib/inquiries";
import { catalogApi } from "@/lib/catalog";
import { getSignedCopyOffer } from "@/lib/legacy-offers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Please submit a valid form." }, { status: 400 }); }
  const parsed = inquiryInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the form fields." }, { status: 400 });
  const inquiry = parsed.data;
  if (inquiry.website) return NextResponse.json({ saved: true }, { status: 202 });
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return NextResponse.json({ error: "The inquiry desk is not connected yet. Please try again soon." }, { status: 503 });
  const ipHash = createHash("sha256").update(`${request.headers.get("x-forwarded-for") ?? "unknown"}:${process.env.INTERNAL_API_SECRET ?? "inquiries"}`).digest("hex");
  try {
    const client = new ConvexHttpClient(convexUrl);
    if (inquiry.kind === "signed_copy") {
      const book = await client.query(catalogApi.bookBySlug, {slug: inquiry.bookSlug});
      const offer = book ? getSignedCopyOffer(book.title) : null;
      if (!offer) return NextResponse.json({error: "A signed-copy order form is not available for this book."}, {status: 404});
      await client.mutation(api.contact.submit, {
        name: inquiry.name, email: inquiry.email, message: signedCopyMessage(inquiry, offer),
        source: "website-signed-copy", ipHash,
      });
      return NextResponse.json({saved: true, checkoutUrl: offer.url}, {status: 202});
    }
    await client.mutation(api.contact.submit, {
      name: inquiry.name, email: inquiry.email, message: inquiryMessage(inquiry),
      source: inquiry.kind === "invitation" ? "website-invite-nia" : "website-academy-booking", ipHash,
    });
  } catch {
    return NextResponse.json({ error: "We couldn’t save your request. Please wait a minute and try again." }, { status: 503 });
  }
  return NextResponse.json({ saved: true }, { status: 202 });
}
