import { EditorialListRoute, editorialListMetadata } from "@/components/editorial/editorial-routes";

export const metadata = editorialListMetadata("quick_bite");

export default function Page() {
  return <EditorialListRoute kind="quick_bite" />;
}
