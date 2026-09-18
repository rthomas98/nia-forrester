import type { Metadata } from "next";
import MembershipPage from "@/components/pages/membership-page";
import PrelaunchPage from "@/components/pages/prelaunch-page";

export const metadata: Metadata = {
  title: "Join the Circle",
  description:
    "Choose the Nia Forrester Reader Hub membership that fits how you read, gather, or write.",
  alternates: { canonical: "/membership" },
};

export default function Page() {
  if (process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "false") {
    return (
      <PrelaunchPage
        eyebrow="The Circle is opening soon"
        title="No checkout before the experience is ready."
        body="Membership accounts and billing are built, but paid plans remain paused until the reading library, community calendar, and member email flows finish their launch review."
      />
    );
  }
  return <MembershipPage />;
}
