"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { alertText, fieldHint, fieldLabel, heading3, muted, nativeSelect, statusText, tagline } from "@/lib/typography";
import { BlockEditor, keyBlock, type KeyedBlock } from "./editorial-block-editor";
import { MediaUpload } from "./editorial-media-upload";
import {
  editorialErrorCode, editorialErrorMessage, editorialKinds, editorialPath, kindCopy, slugify, validateEditorialInput,
  type EditorialBlock, type EditorialInput, type EditorialIssues, type EditorialKind, type EditorialStatus,
} from "./editorial-model";
import { EditorialPreview } from "./editorial-preview";

type Post = Doc<"editorialPosts">;

type FormState = Omit<EditorialInput, "tags" | "blocks" | "publishedAt" | "status"> & {
  tags: string;
  publishedOn: string;
  blocks: KeyedBlock[];
};

const toDateInput = (value: number | undefined) => (value === undefined ? "" : new Date(value).toISOString().slice(0, 10));
const fromDateInput = (value: string) => (value ? Date.parse(`${value}T12:00:00Z`) : undefined);

function initialForm(post: Post | undefined, kind: EditorialKind): FormState {
  return {
    kind: post?.kind ?? kind,
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    author: post?.author ?? "Nia Forrester",
    category: post?.category ?? "",
    tags: post?.tags.join(", ") ?? "",
    coverUrl: post?.coverUrl ?? "",
    coverAlt: post?.coverAlt ?? "",
    publishedOn: toDateInput(post?.publishedAt),
    blocks: (post?.blocks ?? [{ type: "paragraph" as const, text: "" }]).map(keyBlock),
  };
}

function toInput(form: FormState, status: EditorialStatus): EditorialInput {
  const coverUrl = form.coverUrl?.trim();
  return {
    kind: form.kind,
    title: form.title.trim(),
    slug: form.slug.trim(),
    excerpt: form.excerpt.trim(),
    author: form.author.trim(),
    category: form.category.trim(),
    tags: [...new Set(form.tags.split(",").map(tag => tag.trim()).filter(Boolean))],
    coverUrl: coverUrl || undefined,
    coverAlt: coverUrl ? form.coverAlt?.trim() : undefined,
    // Always send the stored date so updating a published post never moves it.
    publishedAt: fromDateInput(form.publishedOn),
    status,
    // Drop empty optional captions rather than sending undefined fields.
    blocks: form.blocks.map(({ block }): EditorialBlock =>
      block.type === "image" && !block.caption?.trim() ? { type: "image", url: block.url, alt: block.alt.trim() } : block),
  };
}

const snapshot = (form: FormState) => JSON.stringify({ ...form, blocks: form.blocks.map(item => item.block) });

function Field({ id, label, hint, issue, children }: { id: string; label: string; hint?: string; issue?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className={fieldLabel}>{label}</label>
      {hint ? <p id={`${id}-hint`} className={fieldHint}>{hint}</p> : null}
      {children}
      {issue ? <p id={`${id}-error`} className={alertText}>{issue}</p> : null}
    </div>
  );
}

const statusVariant = { draft: "outline", published: "default", archived: "alert" } as const;

export function EditorialEditor({ post, kind, onSaved, onClose }: {
  /** Undefined when creating a new post. */
  post?: Post;
  kind: EditorialKind;
  onSaved: (id: Id<"editorialPosts">) => void;
  onClose: () => void;
}) {
  const id = useId();
  const save = useMutation(api.cms.save);
  const [form, setForm] = useState(() => initialForm(post, kind));
  const [saved, setSaved] = useState(() => snapshot(initialForm(post, kind)));
  const [baseVersion, setBaseVersion] = useState(post?.version);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [issues, setIssues] = useState<EditorialIssues>({});
  const [result, setResult] = useState<{ tone: "error" | "status"; message: string } | null>(null);
  const [pending, setPending] = useState<EditorialStatus | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const dirty = snapshot(form) !== saved;
  const changedElsewhere = post !== undefined && baseVersion !== undefined && post.version !== baseVersion;
  const status = post?.status ?? "draft";
  const copy = kindCopy[form.kind];

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(current => ({ ...current, [key]: value }));
  const issueProps = (key: string) => issues[key]
    ? { "aria-invalid": true as const, "aria-describedby": `${id}-${key}-error` }
    : {};
  const errorSummary = useMemo(() => Object.values(issues).filter(Boolean) as string[], [issues]);

  async function submit(next: EditorialStatus) {
    const input = toInput(form, next);
    const found = validateEditorialInput(input);
    setIssues(found);
    if (Object.keys(found).length) {
      setResult({ tone: "error", message: "Please fix the highlighted fields before saving." });
      return;
    }
    setPending(next);
    setResult(null);
    try {
      const response = await save({ ...input, ...(post ? { id: post._id, expectedVersion: baseVersion } : {}) });
      setBaseVersion(response.version);
      setSaved(snapshot(form));
      setResult({ tone: "status", message: next === "published" ? "Published." : next === "archived" ? "Archived." : "Draft saved." });
      onSaved(response.id);
    } catch (error) {
      const code = editorialErrorCode(error);
      setResult({
        tone: "error",
        message: code === "FORBIDDEN" ? "Your account no longer has permission to edit content."
          : editorialErrorMessage(error, "We couldn’t save this post. Your changes are still here; please try again."),
      });
    } finally {
      setPending(null);
    }
  }

  const busy = pending !== null;
  const fieldId = (key: string) => `${id}-${key}`;

  return (
    <Card className="p-5 sm:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={tagline}>{post ? `Editing ${copy.singular}` : `New ${copy.singular}`}</p>
          <h2 className={`break-words ${heading3}`}>{form.title.trim() || "Untitled"}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[status]}>{post ? status : "unsaved"}</Badge>
            {post ? <span className={muted}>Version {baseVersion} · updated {new Date(post.updatedAt).toLocaleString("en-US")}</span> : null}
            {dirty ? <Badge variant="alert">Unsaved changes</Badge> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {post?.status === "published" ? (
            <a className="inline-flex min-h-11 items-center font-ui text-small font-semibold text-champagne underline-offset-4 hover:underline" href={editorialPath(post.kind, post.slug)} target="_blank" rel="noopener noreferrer">
              View Live<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          {post ? <Button type="button" size="sm" variant="secondary" aria-expanded={showPreview} onClick={() => setShowPreview(open => !open)}>{showPreview ? "Hide Preview" : "Preview"}</Button> : null}
          <Button type="button" size="sm" variant="ghost" onClick={() => { if (!dirty || window.confirm("Discard unsaved changes?")) onClose(); }}>Close</Button>
        </div>
      </div>

      {changedElsewhere ? (
        <p role="alert" className={`mb-6 rounded-form border border-rose/60 bg-rose/15 p-4 ${statusText}`}>
          Someone else saved this post (now version {post.version}). Saving will be refused until you reload it; copy any changes you need first.
        </p>
      ) : null}

      {showPreview && post ? (
        <div className="mb-8">
          {dirty ? <p className={`mb-3 ${muted}`}>The preview shows the last saved version. Save a draft to preview your current changes.</p> : null}
          <EditorialPreview id={post._id} />
        </div>
      ) : null}

      <form noValidate onSubmit={event => { event.preventDefault(); void submit(status === "published" ? "published" : "draft"); }} className="grid gap-8">
        {errorSummary.length ? (
          <div role="alert" className="rounded-form border border-rose/60 bg-rose/15 p-4">
            <p className="font-ui text-small font-semibold text-cream">Please fix {errorSummary.length === 1 ? "this issue" : `these ${errorSummary.length} issues`}:</p>
            <ul className="mt-2 list-disc pl-5 text-small text-body">{errorSummary.map(message => <li key={message}>{message}</li>)}</ul>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <Field id={fieldId("kind")} label="Content type">
            <select id={fieldId("kind")} className={`${nativeSelect} mt-0`} value={form.kind} onChange={event => set("kind", event.target.value as EditorialKind)}>
              {editorialKinds.map(value => <option key={value} value={value}>{kindCopy[value].singular}</option>)}
            </select>
          </Field>
          <Field id={fieldId("category")} label="Category" issue={issues.category}>
            <Input id={fieldId("category")} maxLength={100} value={form.category} onChange={event => set("category", event.target.value)} {...issueProps("category")} />
          </Field>
          <div className="md:col-span-2">
            <Field id={fieldId("title")} label="Title" issue={issues.title}>
              <Input
                id={fieldId("title")}
                required
                maxLength={200}
                value={form.title}
                onChange={event => setForm(current => ({ ...current, title: event.target.value, slug: slugTouched ? current.slug : slugify(event.target.value) }))}
                {...issueProps("title")}
              />
            </Field>
          </div>
          <Field id={fieldId("slug")} label="URL slug" hint={`${editorialPath(form.kind, form.slug || "your-slug")}`} issue={issues.slug}>
            <Input id={fieldId("slug")} required maxLength={180} value={form.slug} onChange={event => { setSlugTouched(true); set("slug", event.target.value.toLowerCase()); }} {...issueProps("slug")} />
          </Field>
          <Field id={fieldId("author")} label="Author" issue={issues.author}>
            <Input id={fieldId("author")} required maxLength={120} value={form.author} onChange={event => set("author", event.target.value)} {...issueProps("author")} />
          </Field>
          <div className="md:col-span-2">
            <Field id={fieldId("excerpt")} label="Excerpt" hint="Shown on list pages and in search results." issue={issues.excerpt}>
              <Textarea id={fieldId("excerpt")} rows={3} maxLength={1000} value={form.excerpt} onChange={event => set("excerpt", event.target.value)} {...issueProps("excerpt")} />
            </Field>
          </div>
          <Field id={fieldId("tags")} label="Tags" hint="Separate tags with commas." issue={issues.tags}>
            <Input id={fieldId("tags")} value={form.tags} onChange={event => set("tags", event.target.value)} {...issueProps("tags")} />
          </Field>
          <Field id={fieldId("publishedAt")} label="Publication date" hint="Leave blank to use the moment you publish." issue={issues.publishedAt}>
            <Input id={fieldId("publishedAt")} type="date" value={form.publishedOn} onChange={event => set("publishedOn", event.target.value)} {...issueProps("publishedAt")} />
          </Field>
        </div>

        <fieldset className="grid gap-4 md:grid-cols-2">
          <legend className="mb-4 font-display text-h5 font-semibold text-cream">Cover image (optional)</legend>
          <Field id={fieldId("coverUrl")} label="Cover URL" issue={issues.coverUrl}>
            <Input id={fieldId("coverUrl")} type="url" inputMode="url" placeholder="https://" value={form.coverUrl} onChange={event => set("coverUrl", event.target.value.trim())} {...issueProps("coverUrl")} />
          </Field>
          <Field id={fieldId("coverAlt")} label="Cover alternative text" issue={issues.coverAlt}>
            <Input id={fieldId("coverAlt")} value={form.coverAlt} onChange={event => set("coverAlt", event.target.value)} {...issueProps("coverAlt")} />
          </Field>
          <div className="md:col-span-2">
            <MediaUpload label="Upload Cover" onUploaded={url => set("coverUrl", url)} />
          </div>
        </fieldset>

        <BlockEditor blocks={form.blocks} onChange={blocks => set("blocks", blocks)} issues={issues} />

        <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-hairline bg-wine-card/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <Button type="button" variant="secondary" disabled={busy || changedElsewhere} onClick={() => void submit("draft")}>
            {pending === "draft" ? "Saving…" : status === "published" ? "Unpublish to Draft" : "Save Draft"}
          </Button>
          <Button type="button" disabled={busy || changedElsewhere} onClick={() => void submit("published")}>
            {pending === "published" ? "Publishing…" : status === "published" ? "Update Published" : "Publish"}
          </Button>
          {post && status !== "archived" ? (
            <Button type="button" variant="ghost" disabled={busy || changedElsewhere} onClick={() => { if (window.confirm("Archive this post? It will be removed from public pages.")) void submit("archived"); }}>
              {pending === "archived" ? "Archiving…" : "Archive"}
            </Button>
          ) : null}
          <p role={result?.tone === "error" ? "alert" : "status"} className={result?.tone === "error" ? alertText : statusText}>
            {result?.message}
          </p>
        </div>
      </form>
    </Card>
  );
}
