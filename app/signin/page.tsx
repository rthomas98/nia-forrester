import type { Metadata } from "next";
import SignInPage from "@/components/pages/signin-page";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SignInPage />;
}
