/**
 * Cross-links the four editorial sections. Server-safe so it can be dropped into
 * the read hub, home page or footer without a client boundary.
 */
import Link from "next/link";
import { ChevronRight } from "relume-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { container, heading3, sectionTight, tagline } from "@/lib/typography";
import { editorialKinds, editorialPaths, kindCopy, type EditorialKind } from "./editorial-model";

export function EditorialDiscovery({
  current,
  heading = "More to Read",
  className,
}: {
  /** Omitted from the list when rendered inside that section. */
  current?: EditorialKind;
  heading?: string;
  className?: string;
}) {
  const kinds = editorialKinds.filter(kind => kind !== current);
  return (
    <nav aria-labelledby="editorial-discovery" className={cn(sectionTight, "border-t border-hairline", className)}>
      <div className={container}>
        <p className={tagline}>Keep Reading</p>
        <h2 id="editorial-discovery" className={`mb-8 ${heading3}`}>{heading}</h2>
        <ul className={cn("grid gap-6 sm:grid-cols-2", kinds.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {kinds.map(kind => (
            <li key={kind}>
              <Card className="h-full">
                <Link
                  href={editorialPaths[kind]}
                  className="flex h-full flex-col gap-2 p-6 transition-colors hover:bg-wine-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                >
                  <span className="font-display text-h5 font-semibold text-cream">{kindCopy[kind].plural}</span>
                  <span className="text-small text-pretty text-body">{kindCopy[kind].description}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 font-ui text-tiny font-semibold tracking-[0.12em] text-champagne uppercase">
                    Browse <ChevronRight aria-hidden="true" className="size-4" />
                  </span>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
