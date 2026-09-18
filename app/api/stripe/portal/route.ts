import { NextResponse } from "next/server";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { api } from "@/convex/_generated/api";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!convexUrl || !convexSiteUrl || !siteUrl) {
    return NextResponse.json(
      { error: "Account services are not configured" },
      { status: 503 },
    );
  }
  const { fetchAuthQuery } = convexBetterAuthNextJs({
    convexUrl,
    convexSiteUrl,
  });
  const subscription = await fetchAuthQuery(api.billing.mySubscription);
  if (!subscription) {
    return NextResponse.json(
      { error: "No paid membership found" },
      { status: 404 },
    );
  }
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID,
      return_url: `${siteUrl}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe billing portal failed", error);
    return NextResponse.json(
      { error: "Billing management is temporarily unavailable" },
      { status: 503 },
    );
  }
}
