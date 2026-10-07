import "server-only";

import Stripe from "stripe";

export type PaidTier = "reader" | "inner" | "writers";
export type BillingCadence = "monthly" | "annual";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(secretKey);
}

export function getPriceId(tier: PaidTier, cadence: BillingCadence) {
  const key = `STRIPE_${tier.toUpperCase()}_${cadence.toUpperCase()}_PRICE_ID`;
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
}

export function tierFromPriceId(priceId: string): PaidTier | null {
  const entries: Array<[PaidTier, BillingCadence]> = [
    ["reader", "monthly"],
    ["reader", "annual"],
    ["inner", "monthly"],
    ["inner", "annual"],
    ["writers", "monthly"],
    ["writers", "annual"],
  ];
  return (
    entries.find(([tier, cadence]) => {
      try {
        return getPriceId(tier, cadence) === priceId;
      } catch {
        return false;
      }
    })?.[0] ?? null
  );
}
