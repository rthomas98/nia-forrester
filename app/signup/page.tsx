import { Suspense } from "react";
import SignUpPage from "@/components/pages/signup-page";

export default function Page() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}
