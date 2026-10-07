import type { Metadata } from "next";
import ResetPage from "@/components/pages/reset-page";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;
  return <ResetPage token={params.token} tokenError={params.error} />;
}
