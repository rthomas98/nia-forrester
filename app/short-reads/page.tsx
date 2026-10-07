import { EditorialListRoute, editorialListMetadata } from "@/components/editorial/editorial-routes";

export const metadata = editorialListMetadata("short_read");

export default function Page() {
  return <EditorialListRoute kind="short_read" />;
}
