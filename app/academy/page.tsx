import type { Metadata } from "next";
import AcademyPage from "@/components/pages/academy-page";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "Work with Nia Forrester through developmental editing, one-on-one coaching, courses, and workshops that sharpen your craft and strengthen your novel.",
  alternates: { canonical: "/academy" },
};

export default function Page() {
  return <AcademyPage />;
}
