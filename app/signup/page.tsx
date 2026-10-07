import type { Metadata } from "next";
import { Suspense } from "react";
import SignUpPage from "@/components/pages/signup-page";

export const metadata: Metadata = {
  title: "Create Your Reader Account",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}
