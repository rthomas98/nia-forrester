import { EditorialDetailRoute, editorialDetailMetadata } from "@/components/editorial/editorial-routes";

type Props = { params: Promise<{ slug: string }> };

export function generateMetadata(props: Props) {
  return editorialDetailMetadata("short_read", props);
}

export default function Page({ params }: Props) {
  return <EditorialDetailRoute kind="short_read" params={params} />;
}
