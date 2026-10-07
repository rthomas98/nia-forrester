"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { StatePanel } from "@/components/catalog/catalog-states";
import { Button, buttonVariants } from "@/components/ui/button";
import { catalogIsConfigured } from "@/lib/catalog";
import { container, statusText } from "@/lib/typography";
import { EditorialArticle } from "./editorial-article";
import { editorialPaths, kindCopy, type EditorialKind } from "./editorial-model";

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="px-[5%] py-16 md:py-24"><div className={`${container} max-w-[720px]`}>{children}</div></div>;
}

function LiveArticle({ kind, slug }: { kind: EditorialKind; slug: string }) {
  const post = useQuery(api.cms.bySlug, { kind, slug });
  if (post === undefined) {
    return <Shell><h1 className="sr-only">{kindCopy[kind].singular}</h1><p role="status" className={statusText}>Loading…</p></Shell>;
  }
  if (post === null) {
    return (
      <Shell>
        <StatePanel headingLevel="h1" eyebrow="Not found" title="This Piece Isn’t Available" actions={<Link className={buttonVariants()} href={editorialPaths[kind]}>All {kindCopy[kind].plural}</Link>}>
          It may have moved or been unpublished.
        </StatePanel>
      </Shell>
    );
  }
  return <EditorialArticle post={post} />;
}

/**
 * Client fallback when the server lookup was deferred (backend unreachable during
 * render). Retries live and reports failures instead of a false "not found".
 */
export function EditorialDetailClient({ kind, slug }: { kind: EditorialKind; slug: string }) {
  if (!catalogIsConfigured) {
    return (
      <Shell>
        <StatePanel headingLevel="h1" role="status" eyebrow="Not connected" title="Content Isn’t Available Yet">
          This site hasn’t been connected to its content service yet.
        </StatePanel>
      </Shell>
    );
  }
  return (
    <QueryBoundary
      fallback={(_error, retry) => (
        <Shell>
          <StatePanel headingLevel="h1" role="alert" eyebrow="Something went wrong" title="We Couldn’t Load This Piece" actions={<Button type="button" onClick={retry}>Try Again</Button>}>
            Please try again in a moment.
          </StatePanel>
        </Shell>
      )}
    >
      <LiveArticle kind={kind} slug={slug} />
    </QueryBoundary>
  );
}
