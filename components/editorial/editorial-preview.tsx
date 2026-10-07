"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { statusText } from "@/lib/typography";
import { EditorialArticle } from "./editorial-article";

export function PreviewBanner({ children }: { children: React.ReactNode }) {
  return (
    <p role="note" className="mb-8 rounded-form border border-champagne/40 bg-wine-sunken px-4 py-3 font-ui text-tiny font-semibold tracking-[0.14em] text-champagne uppercase">
      {children}
    </p>
  );
}

/** Staff-only preview of the saved document; convex/cms.ts enforces the role. */
export function EditorialPreview({ id }: { id: Id<"editorialPosts"> }) {
  const post = useQuery(api.cms.preview, { id });
  return (
    <Card variant="sunken" className="max-h-[80vh] overflow-y-auto">
      {post === undefined ? <p role="status" className={`p-6 ${statusText}`}>Loading preview…</p>
        : post === null ? <p role="status" className={`p-6 ${statusText}`}>This post no longer exists.</p>
        : (
          <EditorialArticle
            post={post}
            showBackLink={false}
            headingLevel="h2"
            banner={<PreviewBanner>Staff preview · {post.status} · not visible to readers unless published</PreviewBanner>}
          />
        )}
    </Card>
  );
}
