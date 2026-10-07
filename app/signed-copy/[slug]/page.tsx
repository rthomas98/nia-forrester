import type { Metadata } from "next";
import SignedCopyPage from "@/components/pages/signed-copy-page";

// Per-book order pages are reachable from each book page; keep them out of search indexes.
export const metadata: Metadata = {
  title: "Signed & Personalized Copy",
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SignedCopyPage slug={slug} />;
}
