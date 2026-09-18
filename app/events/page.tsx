import type { Metadata } from "next";
import EventsPage from "@/components/pages/events-page";

export const metadata: Metadata = {
  title: "Events & Readings",
  description:
    "Festival appearances, live readings, workshops and retreats with Nia Forrester.",
  alternates: { canonical: "/events" },
};

export default function Page() {
  return <EventsPage />;
}
