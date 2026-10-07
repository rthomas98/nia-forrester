import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(request: Request) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json(
      { error: "Newsletter signup is being connected. Please try again soon." },
      { status: 503 },
    );
  }
  const input = (await request.json()) as { email?: string; source?: string };
  if (!input.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  try {
    await new ConvexHttpClient(convexUrl).mutation(api.newsletter.subscribe, {
      email: input.email,
      source: input.source ?? "website",
    });
    return NextResponse.json({ subscribed: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Newsletter signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
