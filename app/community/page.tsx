import type { Metadata } from "next";
import CommunityPage from "@/components/pages/community-page";
import PrelaunchPage from "@/components/pages/prelaunch-page";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join Nia Forrester readers for book clubs, chapter conversations, live reads, and craft talk.",
  alternates: { canonical: "/community" },
};

export default function Page() {
  if (process.env.NEXT_PUBLIC_COMMUNITY_ENABLED === "false") {
    return (
      <PrelaunchPage
        eyebrow="Community is warming up"
        title="The room opens when it is ready."
        body="Book clubs, chapter conversations, and live reads are being prepared with the moderation and launch content they deserve. Join the weekly note to hear when the doors open."
      />
    );
  }
  return <CommunityPage />;
}
