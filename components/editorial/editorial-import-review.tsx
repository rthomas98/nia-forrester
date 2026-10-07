"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { StatePanel } from "@/components/catalog/catalog-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { alertText, heading3, label, muted, statusText } from "@/lib/typography";
import { EditorialArticle } from "./editorial-article";
import { editorialErrorMessage, kindCopy, validateEditorialInput, type EditorialInput } from "./editorial-model";
import { PreviewBanner } from "./editorial-preview";

type StagedImport = Doc<"editorialImports">;

const text = z.string();
/** Mirrors the backend import schema, but tolerates an unmapped kind so it can be shown. */
const payloadSchema = z.object({
  kind: z.enum(["blog", "quick_bite", "short_read", "outtake"]).nullable(),
  title: text, slug: text, excerpt: text, author: text, category: text, tags: z.array(text),
  coverUrl: text.optional(), coverAlt: text.optional(), publishedAt: z.number().optional(),
  status: z.literal("draft"),
  blocks: z.array(z.discriminatedUnion("type", [
    z.object({ type: z.literal("paragraph"), text }),
    z.object({ type: z.literal("heading"), text, level: z.union([z.literal(2), z.literal(3)]) }),
    z.object({ type: z.literal("quote"), text }),
    z.object({ type: z.literal("link"), text, url: text }),
    z.object({ type: z.literal("image"), url: text, alt: text, caption: text.optional() }),
    z.object({ type: z.literal("video"), url: text, title: text }),
  ])),
});

type Parsed =
  | { ok: true; value: z.infer<typeof payloadSchema> }
  | { ok: false; message: string };

/** Never trusts the staged payload: JSON and shape are both checked before display. */
function parsePayload(payload: string): Parsed {
  let raw: unknown;
  try { raw = JSON.parse(payload); } catch { return { ok: false, message: "The staged payload is not valid JSON." }; }
  const result = payloadSchema.safeParse(raw);
  return result.success ? { ok: true, value: result.data } : { ok: false, message: "The staged payload doesn’t match the editorial format." };
}

function ImportDetail({ record, parsed, onDrafted }: { record: StagedImport; parsed: Parsed; onDrafted: (id: Id<"editorialPosts">) => void }) {
  const review = useMutation(api.cms.reviewImport);
  const [pending, setPending] = useState<"approve" | "skip" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const value = parsed.ok ? parsed.value : null;
  const kind = value?.kind ?? null;
  const issues = value && kind ? Object.values(validateEditorialInput({ ...value, kind } satisfies EditorialInput)) : [];
  const blockedReason = !parsed.ok ? parsed.message
    : !kind ? "This source has no content type. Map it to Blog, Quick Bite, Short Read or Outtake before approving."
    : !value?.blocks.length ? "No content was extracted from this source."
    : issues.length ? `Fix before approving: ${issues.join(" ")}` : null;

  async function decide(decision: "approve" | "skip") {
    setPending(decision);
    setError(null);
    try {
      const target = await review({ id: record._id, decision, expectedChecksum: record.checksum });
      if (decision === "approve" && target) onDrafted(target);
    } catch (caught) {
      setError(editorialErrorMessage(caught, "We couldn’t record that decision. Reload the queue and try again."));
    } finally {
      setPending(null);
    }
  }

  return (
    <Card className="min-w-0 p-5 sm:p-8">
      <p className={label}>Staged import</p>
      <h2 className={`mt-2 break-words ${heading3}`}>{value?.title || "Unparsed source"}</h2>
      <dl className="mt-4 grid gap-2 text-small sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-x-4">
        <dt className="text-taupe">Source</dt>
        <dd className="break-all text-body">{record.sourceUrl}</dd>
        <dt className="text-taupe">Type</dt>
        <dd>{kind ? <Badge>{kindCopy[kind].singular}</Badge> : <Badge variant="alert">Unmapped</Badge>}</dd>
        <dt className="text-taupe">Checksum</dt>
        <dd className="font-mono text-tiny break-all text-taupe">{record.checksum}</dd>
      </dl>

      {blockedReason ? <p role="alert" className={`mt-6 ${alertText}`}>{blockedReason}</p> : null}
      {error ? <p role="alert" className={`mt-6 ${alertText}`}>{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" disabled={pending !== null || blockedReason !== null} onClick={() => void decide("approve")}>
          {pending === "approve" ? "Creating Draft…" : "Approve as Draft"}
        </Button>
        <Button type="button" variant="secondary" disabled={pending !== null} onClick={() => void decide("skip")}>
          {pending === "skip" ? "Skipping…" : "Skip"}
        </Button>
      </div>
      <p className={`mt-3 ${muted}`}>Approving creates an unpublished draft. Nothing goes live until it is published from the editor.</p>

      {value && kind ? (
        <Card variant="sunken" className="mt-8 max-h-[70vh] overflow-y-auto">
          <EditorialArticle
            post={{ ...value, kind }}
            showBackLink={false}
            headingLevel="h2"
            banner={<PreviewBanner>Import preview · draft only</PreviewBanner>}
          />
        </Card>
      ) : null}
    </Card>
  );
}

export function EditorialImportReview({ onDrafted }: { onDrafted: (id: Id<"editorialPosts">) => void }) {
  const queue = useQuery(api.cms.importQueue, {});
  const [selected, setSelected] = useState<Id<"editorialImports"> | null>(null);
  // Payloads can be large; parse each staged record once per queue update.
  const parsedById = useMemo(() => new Map(queue?.map(item => [item._id, parsePayload(item.payload)])), [queue]);

  if (queue === undefined) return <p role="status" className={statusText}>Loading the import queue…</p>;
  if (!queue.length) {
    return <StatePanel role="status" eyebrow="Import review" title="Nothing to Review">There are no staged imports waiting for review.</StatePanel>;
  }
  const record = queue.find(item => item._id === selected) ?? null;
  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <nav aria-label="Staged imports" className="min-w-0">
        <p className={`mb-3 ${muted}`}>{queue.length} staged</p>
        <ul className="grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
          {queue.map(item => {
            const parsed = parsedById.get(item._id);
            return (
              <li key={item._id} className="min-w-0">
                <button
                  type="button"
                  aria-current={item._id === selected || undefined}
                  onClick={() => setSelected(item._id)}
                  className="w-full rounded-form border border-scheme-border px-4 py-3 text-left transition-colors hover:border-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne aria-[current=true]:border-champagne aria-[current=true]:bg-wine-raised"
                >
                  <span className="block font-ui text-small font-semibold break-words text-cream">{parsed?.ok ? parsed.value.title || "Untitled" : "Unparsed source"}</span>
                  <span className="mt-1 block truncate text-tiny text-taupe">{item.sourceUrl}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {record ? <ImportDetail key={record._id} record={record} parsed={parsedById.get(record._id) ?? parsePayload(record.payload)} onDrafted={onDrafted} />
        : <StatePanel eyebrow="Import review" title="Choose an Import">Select a staged source to preview it before approving it as a draft.</StatePanel>}
    </div>
  );
}
