import type { Metadata } from "next";
import ContactPage from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Nia Forrester about books, events, memberships, or the Writing Studio.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactPage />;
}
