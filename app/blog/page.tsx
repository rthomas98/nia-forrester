import { EditorialListRoute, editorialListMetadata } from "@/components/editorial/editorial-routes";

export const metadata = editorialListMetadata("blog");

export default function Page() {
  return <EditorialListRoute kind="blog" />;
}
