import { EditorialListRoute, editorialListMetadata } from "@/components/editorial/editorial-routes";

export const metadata = editorialListMetadata("outtake");

export default function Page() {
  return <EditorialListRoute kind="outtake" />;
}
