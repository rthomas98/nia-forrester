import type { Metadata } from "next";
import EditorialAdminPage from "@/components/editorial/editorial-admin-page";

export const metadata: Metadata = {
  title: "Content Editor",
  robots: { index: false, follow: false },
};

// Access is decided by convex/cms.ts (api.cms.access); the page never trusts a client role.
export default function Page() {
  return <EditorialAdminPage />;
}
