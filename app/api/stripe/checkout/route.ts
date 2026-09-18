import { NextResponse } from "next/server";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { api } from "@/convex/_generated/api";
import {
  getPriceId,
  getStripe,
  type BillingCadence,
  type PaidTier,
} from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "false") {
    return NextResponse.json(
      { error: "Paid memberships are not open yet" },
      { status: 409 },
    );
  }
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!convexUrl || !convexSiteUrl || !siteUrl) {
    return NextResponse.json(
      { error: "Account services are not configured" },
      { status: 503 },
    );
  }

  const input = (await request.json()) as {
    tier?: PaidTier;
    cadence?: BillingCadence;
  };
  if (
    !input.tier ||
    !["reader", "inner", "writers"].includes(input.tier) ||
    !input.cadence ||
    !["monthly", "annual"].includes(input.cadence)
  ) {
    return NextResponse.json(
      { error: "Choose a valid membership and billing cadence" },
      { status: 400 },
    );
  }

  const { fetchAuthQuery } = convexBetterAuthNextJs({
    convexUrl,
    convexSiteUrl,
  });
  const user = await fetchAuthQuery(api.auth.getCurrentUser);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const subscription = await fetchAuthQuery(api.billing.mySubscription);
    if (subscription && ["active", "trialing", "past_due", "unpaid", "paused"].includes(subscription.status)) {
      return NextResponse.json({ error: "You already have a membership. Use Manage Existing Membership to review billing." }, { status: 409 });
    }
    const stripe = getStripe();
    const priceId = getPriceId(input.tier, input.cadence);
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user._id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${siteUrl}/community?membership=success`,
      cancel_url: `${siteUrl}/membership?checkout=canceled`,
      metadata: {
        authUserId: user._id,
        planKey: input.tier,
      },
      subscription_data: {
        metadata: {
          authUserId: user._id,
          planKey: input.tier,
        },
      },
    });
    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Stripe checkout session failed", error);
    return NextResponse.json(
      { error: "Secure checkout is temporarily unavailable" },
      { status: 503 },
    );
  }
}
