import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { Resend } from "resend";
import { z } from "zod";
import { api } from "@/convex/_generated/api";

export const runtime = "nodejs";

const contactInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(320),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json(
      { error: "The contact desk is being connected. Please try again soon." },
      { status: 503 },
    );
  }
  const parsed = contactInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form fields" },
      { status: 400 },
    );
  }
  const { name, email, message, website } = parsed.data;
  if (website) return NextResponse.json({ sent: true });

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
  const ipHash = createHash("sha256")
    .update(`${forwardedFor}:${process.env.INTERNAL_API_SECRET ?? "contact"}`)
    .digest("hex");

  try {
    await new ConvexHttpClient(convexUrl).mutation(api.contact.submit, {
      name,
      email,
      message,
      source: "website-contact",
      ipHash,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Could not save message";
    return NextResponse.json({ error: detail }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO_EMAIL;
  if (apiKey && contactTo) {
    try {
      await new Resend(apiKey).emails.send({
        from:
          process.env.EMAIL_FROM ??
          "Nia Forrester <readers@niaforrester.com>",
        to: contactTo,
        replyTo: email,
        subject: `Reader Hub message from ${name}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } catch (error) {
      console.error("Contact notification email failed", error);
    }
  }

  return NextResponse.json({ sent: true });
}
