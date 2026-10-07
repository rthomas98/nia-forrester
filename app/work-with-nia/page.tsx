import type { Metadata } from "next";
import WorkWithNiaPage from "@/components/pages/work-with-nia-page";

export const metadata: Metadata = {
  title: "Work with Nia",
  description:
    "Request developmental editing, one-on-one coaching, or a workshop with Nia Forrester.",
  alternates: { canonical: "/work-with-nia" },
};

export default function Page() {
  return <WorkWithNiaPage />;
}
