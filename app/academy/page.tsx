import type { Metadata } from "next";
import AcademyPage from "@/components/pages/academy-page";

export const metadata: Metadata = {
  title: "The Writing Studio",
  description:
    "Book manuscript feedback, consultations, developmental editing, courses, workshops, and masterclasses with Nia Forrester.",
  alternates: { canonical: "/academy" },
};

export default function Page() {
  return <AcademyPage />;
}
