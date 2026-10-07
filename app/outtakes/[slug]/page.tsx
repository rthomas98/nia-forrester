import { EditorialDetailRoute, editorialDetailMetadata } from "@/components/editorial/editorial-routes";

type Props = { params: Promise<{ slug: string }> };

export function generateMetadata(props: Props) {
  return editorialDetailMetadata("outtake", props);
}

export default function Page({ params }: Props) {
  return <EditorialDetailRoute kind="outtake" params={params} />;
}
