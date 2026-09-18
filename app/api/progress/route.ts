import { NextResponse } from "next/server";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { api } from "@/convex/_generated/api";

function utilities() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!convexUrl || !convexSiteUrl) return null;
  return convexBetterAuthNextJs({ convexUrl, convexSiteUrl });
}

export async function GET(request: Request) {
  const auth = utilities();
  if (!auth) {
    return NextResponse.json({ error: "Progress is not configured" }, { status: 503 });
  }
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Content slug is required" }, { status: 400 });
  }
  try {
    const progress = await auth.fetchAuthQuery(api.progress.currentBySlug, {
      slug,
    });
    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  const auth = utilities();
  if (!auth) {
    return NextResponse.json({ error: "Progress is not configured" }, { status: 503 });
  }
  const input = (await request.json()) as {
    slug?: string;
    chapterNumber?: number;
    percent?: number;
  };
  if (
    !input.slug ||
    !Number.isInteger(input.chapterNumber) ||
    typeof input.percent !== "number"
  ) {
    return NextResponse.json({ error: "Invalid progress update" }, { status: 400 });
  }
  try {
    await auth.fetchAuthMutation(api.progress.saveBySlug, {
      slug: input.slug,
      chapterNumber: input.chapterNumber!,
      percent: input.percent,
    });
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Could not save progress" }, { status: 400 });
  }
}
