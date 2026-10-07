import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import type Stripe from "stripe";
import { api } from "@/convex/_generated/api";
import { getStripe, tierFromPriceId } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const internalSecret = process.env.INTERNAL_API_SECRET;
  if (!signature || !webhookSecret || !convexUrl || !internalSecret) {
    return NextResponse.json(
      { error: "Webhook configuration is incomplete" },
      { status: 503 },
    );
  }

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.warn("Rejected Stripe webhook", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let subscription: Stripe.Subscription | null = null;
  if (event.type.startsWith("customer.subscription.")) {
    subscription = event.data.object as Stripe.Subscription;
  } else if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (typeof session.subscription === "string") {
      subscription = await getStripe().subscriptions.retrieve(
        session.subscription,
      );
    }
  }

  const client = new ConvexHttpClient(convexUrl);
  if (!subscription) {
    await client.mutation(api.billing.applyStripeEvent, {
      internalSecret,
      eventId: event.id,
      eventType: event.type,
    });
    return NextResponse.json({ received: true });
  }

  const item = subscription.items.data[0];
  const priceId = item?.price.id;
  const planKey = priceId ? tierFromPriceId(priceId) : null;
  const authUserId = subscription.metadata.authUserId;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  await client.mutation(api.billing.applyStripeEvent, {
    internalSecret,
    eventId: event.id,
    eventType: event.type,
    authUserId: authUserId || undefined,
    planKey: planKey || undefined,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: item?.current_period_end
      ? item.current_period_end * 1000
      : undefined,
  });

  return NextResponse.json({ received: true });
}
