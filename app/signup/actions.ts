"use server";

import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { api } from "@/convex/_generated/api";

type MembershipTier = "free" | "reader" | "inner" | "writers";

export async function completeReaderProfile(input: {
  displayName: string;
  selectedTier: MembershipTier;
  preferences: string[];
  chapterAlerts: boolean;
  newsletterOptIn: boolean;
}) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!convexUrl || !convexSiteUrl) {
    throw new Error("Convex is not configured");
  }
  const { fetchAuthMutation } = convexBetterAuthNextJs({
    convexUrl,
    convexSiteUrl,
  });
  return fetchAuthMutation(api.profiles.ensure, input);
}
