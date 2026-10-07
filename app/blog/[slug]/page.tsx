import { EditorialDetailRoute, editorialDetailMetadata } from "@/components/editorial/editorial-routes";

type Props = { params: Promise<{ slug: string }> };

export function generateMetadata(props: Props) {
  return editorialDetailMetadata("blog", props);
}

export default function Page({ params }: Props) {
  return <EditorialDetailRoute kind="blog" params={params} />;
}
