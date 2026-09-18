import type { Metadata } from "next";
import ReadPage from "@/components/pages/read-page";

export const metadata: Metadata = {
  title: "Read",
  description:
    "Explore Nia Forrester’s serials, essays, novels, short reads, and audio work.",
  alternates: { canonical: "/read" },
};

export default function Page() {
  return <ReadPage />;
}
