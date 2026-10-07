"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { Add } from "relume-icons";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { useAuth } from "@/components/auth-context";
import { StatePanel } from "@/components/catalog/catalog-states";
import { Header46 } from "@/components/relume/header46";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogIsConfigured } from "@/lib/catalog";
import { container, fieldLabel, muted, nativeSelect, statusText } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { EditorialEditor } from "./editorial-editor";
import { EditorialImportReview } from "./editorial-import-review";
import { editorialErrorCode, editorialKinds, kindCopy, type EditorialKind, type EditorialStatus } from "./editorial-model";

const ADMIN_PATH = "/admin/content";

type Selection =
  | { mode: "new"; kind: EditorialKind; nonce: number }
  | { mode: "edit"; id: Id<"editorialPosts"> }
  | null;

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="px-[5%] py-16 md:py-24"><div className={container}>{children}</div></div>;
}

const statusVariant = { draft: "outline", published: "default", archived: "alert" } as const;

function PostsWorkspace({ selection, onSelect }: { selection: Selection; onSelect: (selection: Selection) => void }) {
  const id = useId();
  const posts = useQuery(api.cms.listStaff, {});
  const [kind, setKind] = useState<EditorialKind | "">("");
  const [status, setStatus] = useState<EditorialStatus | "">("");
  const [search, setSearch] = useState("");

  if (posts === undefined) return <p role="status" className={statusText}>Loading content…</p>;
  const needle = search.trim().toLowerCase();
  const visible = posts.filter(post => (!kind || post.kind === kind) && (!status || post.status === status)
    && (!needle || `${post.title} ${post.slug} ${post.category}`.toLowerCase().includes(needle)));
  const selected = selection?.mode === "edit" ? posts.find(post => post._id === selection.id) : undefined;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="grid gap-4">
        <div className="grid gap-3">
          <label htmlFor={`${id}-search`} className={fieldLabel}>
            Find content
            <Input id={`${id}-search`} type="search" value={search} onChange={event => setSearch(event.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label htmlFor={`${id}-kind`} className={fieldLabel}>
              Type
              <select id={`${id}-kind`} className={`${nativeSelect} mt-0`} value={kind} onChange={event => setKind(event.target.value as EditorialKind | "")}>
                <option value="">All</option>
                {editorialKinds.map(value => <option key={value} value={value}>{kindCopy[value].plural}</option>)}
              </select>
            </label>
            <label htmlFor={`${id}-status`} className={fieldLabel}>
              Status
              <select id={`${id}-status`} className={`${nativeSelect} mt-0`} value={status} onChange={event => setStatus(event.target.value as EditorialStatus | "")}>
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </div>
        <p role="status" className={muted}>{visible.length} of {posts.length} posts</p>
        <ul aria-label="Posts" className="grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
          {visible.map(post => (
            <li key={post._id}>
              <button
                type="button"
                aria-current={selection?.mode === "edit" && selection.id === post._id ? true : undefined}
                onClick={() => onSelect({ mode: "edit", id: post._id })}
                className="w-full rounded-form border border-scheme-border px-4 py-3 text-left transition-colors hover:border-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne aria-[current=true]:border-champagne aria-[current=true]:bg-wine-raised"
              >
                <span className="block font-ui text-small font-semibold break-words text-cream">{post.title || "Untitled"}</span>
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariant[post.status]}>{post.status}</Badge>
                  <span className="text-tiny text-taupe">{kindCopy[post.kind].singular}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0">
        {selection?.mode === "new" ? (
          <EditorialEditor
            key={`new-${selection.kind}-${selection.nonce}`}
            kind={selection.kind}
            onSaved={savedId => onSelect({ mode: "edit", id: savedId })}
            onClose={() => onSelect(null)}
          />
        ) : selection?.mode === "edit" ? (
          selected ? (
            <EditorialEditor key={selected._id} post={selected} kind={selected.kind} onSaved={() => {}} onClose={() => onSelect(null)} />
          ) : <p role="status" className={statusText}>Loading post…</p>
        ) : (
          <StatePanel eyebrow="Content editor" title="Choose a Post">
            Select a post to edit it, or add a new Blog Post, Quick Bite, Short Read or Outtake.
          </StatePanel>
        )}
      </div>
    </div>
  );
}

const tabs = [
  { key: "posts", label: "Posts" },
  { key: "imports", label: "Import Review" },
] as const;

function Workspace() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("posts");
  const [selection, setSelection] = useState<Selection>(null);
  const add = (kind: EditorialKind) => { setTab("posts"); setSelection(prev => ({ mode: "new", kind, nonce: (prev?.mode === "new" ? prev.nonce : 0) + 1 })); };
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // WAI-ARIA tabs: one tab stop; arrows, Home and End move focus and select.
  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = tabs.findIndex(item => item.key === tab);
    const next = event.key === "ArrowRight" ? (current + 1) % tabs.length
      : event.key === "ArrowLeft" ? (current - 1 + tabs.length) % tabs.length
      : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setTab(tabs[next].key);
    tabRefs.current[next]?.focus();
  };
  const tabClass = (active: boolean) => cn(
    "min-h-11 border-b-2 px-4 font-ui text-small font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
    active ? "border-champagne text-cream" : "border-transparent text-taupe hover:text-cream",
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Add content">
        {editorialKinds.map(kind => (
          <Button key={kind} type="button" size="sm" variant={kind === "blog" ? "default" : "secondary"} iconLeft={<Add aria-hidden="true" className="size-4" />} onClick={() => add(kind)}>
            Add {kindCopy[kind].singular}
          </Button>
        ))}
      </div>
      <div role="tablist" aria-label="Content editor sections" onKeyDown={onTabKey} className="mb-8 flex gap-2 border-b border-hairline">
        {tabs.map(({ key, label }, index) => (
          <button
            key={key}
            ref={element => { tabRefs.current[index] = element; }}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-controls={`panel-${key}`}
            aria-selected={tab === key}
            tabIndex={tab === key ? 0 : -1}
            className={tabClass(tab === key)}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Both panels stay mounted so switching tabs never discards unsaved edits. */}
      <div role="tabpanel" id="panel-posts" aria-labelledby="tab-posts" hidden={tab !== "posts"}>
        <PostsWorkspace selection={selection} onSelect={setSelection} />
      </div>
      <div role="tabpanel" id="panel-imports" aria-labelledby="tab-imports" hidden={tab !== "imports"}>
        <EditorialImportReview onDrafted={id => { setTab("posts"); setSelection({ mode: "edit", id }); }} />
      </div>
    </>
  );
}

/**
 * Staff content editor. The page asks convex/cms.ts whether the signed-in user may
 * edit; staff-only queries are not even subscribed until the backend says yes.
 */
function AdminGate() {
  const { ready } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const access = useQuery(api.cms.access, ready && isAuthenticated ? {} : "skip");

  if (!ready || isLoading || (isAuthenticated && access === undefined)) {
    return <Shell><h1 className="sr-only">Content Editor</h1><p role="status" className={statusText}>Checking your access…</p></Shell>;
  }
  if (!isAuthenticated || !access) {
    return (
      <Shell>
        <StatePanel headingLevel="h1" eyebrow="Staff only" title="Sign In to Edit Content" actions={<Link className={buttonVariants()} href={`/signin?next=${encodeURIComponent(ADMIN_PATH)}`}>Sign In</Link>}>
          The content editor is available to editors and admins.
        </StatePanel>
      </Shell>
    );
  }
  if (!access.allowed) {
    return (
      <Shell>
        <StatePanel headingLevel="h1" role="alert" eyebrow="Access denied" title="You Don’t Have Editor Access" actions={<Link className={buttonVariants({ variant: "secondary" })} href="/dashboard">Go to My Library</Link>}>
          Your account can’t edit site content. If you need access, ask an administrator to update your role.
        </StatePanel>
      </Shell>
    );
  }
  return (
    <>
      <Header46 tagline="Staff" heading="Content Editor" description="Write, preview and publish blog posts, quick bites, short reads and outtakes." className="pb-6 md:pb-8" />
      <div className="px-[5%] pb-16 md:pb-24"><div className={container}><Workspace /></div></div>
    </>
  );
}

export default function EditorialAdminPage() {
  if (!catalogIsConfigured) {
    return (
      <main>
        <Shell>
          <StatePanel headingLevel="h1" role="status" eyebrow="Not connected" title="The Content Editor Isn’t Connected">
            This site hasn’t been connected to its content service yet.
          </StatePanel>
        </Shell>
      </main>
    );
  }
  return (
    <main>
      <QueryBoundary
        fallback={(error, retry) => (
          <Shell>
            <StatePanel headingLevel="h1" role="alert" eyebrow={editorialErrorCode(error) === "FORBIDDEN" ? "Access denied" : "Something went wrong"} title={editorialErrorCode(error) === "FORBIDDEN" ? "Editor Access Was Removed" : "The Content Editor Is Unavailable"} actions={<Button type="button" onClick={retry}>Try Again</Button>}>
              {editorialErrorCode(error) === "FORBIDDEN" ? "Your account no longer has permission to edit content." : "We couldn’t load the editor. No content has been changed."}
            </StatePanel>
          </Shell>
        )}
      >
        <AdminGate />
      </QueryBoundary>
    </main>
  );
}
