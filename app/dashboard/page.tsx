import type { Metadata } from "next";
import DashboardPage from "@/components/pages/dashboard-page";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "My Library",
  robots: { index: false, follow: false },
};

export default async function Page() {
  if (!(await isAuthenticated())) {
    redirect("/signin?next=/dashboard");
  }
  return <DashboardPage />;
}
