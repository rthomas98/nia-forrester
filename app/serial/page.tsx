import type { Metadata } from "next";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import SerialPage from "@/components/pages/serial-page";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Forty-Nothing",
  description:
    "Read Forty-Nothing, Nia Forrester’s novel-in-series, one chapter at a time.",
  alternates: { canonical: "/serial" },
};

export default async function Page() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  let initialChapter = 11;

  if (convexUrl && convexSiteUrl) {
    try {
      const { fetchAuthQuery } = convexBetterAuthNextJs({
        convexUrl,
        convexSiteUrl,
      });
      const progress = await fetchAuthQuery(api.progress.currentBySlug, {
        slug: "forty-nothing",
      });
      if (
        progress?.chapterNumber &&
        progress.chapterNumber >= 1 &&
        progress.chapterNumber <= 11
      ) {
        initialChapter = progress.chapterNumber;
      }
    } catch {
      // Public readers start at the latest chapter; authenticated progress is
      // restored when a session exists.
    }
  }

  return <SerialPage initialChapter={initialChapter} />;
}
