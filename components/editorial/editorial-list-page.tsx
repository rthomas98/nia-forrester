"use client";

import { useId, useState, type FormEvent } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Search } from "relume-icons";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { StatePanel } from "@/components/catalog/catalog-states";
import { Blog60, Blog60Card, blog60Grid } from "@/components/relume/blog60";
import { Header46 } from "@/components/relume/header46";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogIsConfigured } from "@/lib/catalog";
import { fieldLabel, muted, nativeSelect, statusText } from "@/lib/typography";
import { EditorialDiscovery } from "./editorial-discovery";
import { editorialPath, formatEditorialDate, kindCopy, safeEditorialMediaUrl, type EditorialKind } from "./editorial-model";

const PAGE_SIZE = 20;

function ListSkeleton() {
  return (
    <div role="status" className={blog60Grid}>
      <span className="sr-only">Loading…</span>
      {[0, 1, 2, 3].map(n => (
        <div key={n} aria-hidden="true" className="h-56 animate-pulse rounded-card border border-hairline bg-wine-card motion-reduce:animate-none" />
      ))}
    </div>
  );
}

function Filters({ kind, category, onCategory, onSearch, search }: {
  kind: EditorialKind;
  category: string;
  search: string;
  onCategory: (value: string) => void;
  onSearch: (value: string) => void;
}) {
  const id = useId();
  const categories = useQuery(api.cms.categories, { kind });
  const [draft, setDraft] = useState(search);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(draft.trim());
  };
  return (
    <form role="search" onSubmit={submit} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px_auto] md:items-end">
      <label htmlFor={`${id}-q`} className={fieldLabel}>
        Search {kindCopy[kind].plural}
        <Input
          id={`${id}-q`}
          type="search"
          value={draft}
          maxLength={120}
          onChange={event => setDraft(event.target.value)}
          icon={<Search aria-hidden="true" className="size-5 text-taupe" />}
        />
      </label>
      <label htmlFor={`${id}-c`} className={fieldLabel}>
        Category
        <select
          id={`${id}-c`}
          value={category}
          onChange={event => onCategory(event.target.value)}
          className={`${nativeSelect} mt-0`}
          disabled={!categories}
        >
          <option value="">All categories</option>
          {categories?.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>
      <Button type="submit" variant="secondary">Search</Button>
    </form>
  );
}

function Results({ kind, category, search, onReset }: {
  kind: EditorialKind;
  category: string;
  search: string;
  onReset: () => void;
}) {
  const copy = kindCopy[kind];
  const { results, status, loadMore } = usePaginatedQuery(
    api.cms.listPublic,
    { kind, category: category || undefined, search: search || undefined },
    { initialNumItems: PAGE_SIZE },
  );
  const filtered = Boolean(category || search);

  if (status === "LoadingFirstPage") return <ListSkeleton />;
  if (!results.length) {
    return (
      <StatePanel
        role="status"
        eyebrow={filtered ? "No matches" : "Coming soon"}
        title={filtered ? "Nothing Matches Those Filters" : `No ${copy.plural} Yet`}
        actions={filtered ? <Button type="button" variant="secondary" onClick={onReset}>Clear Filters</Button> : undefined}
      >
        {filtered ? "Try a different search term or category." : "New pieces will appear here as soon as they’re published."}
      </StatePanel>
    );
  }
  return (
    <>
      <p role="status" className={`mb-6 ${muted}`}>
        {filtered ? `Showing ${results.length}${status === "Exhausted" ? "" : "+"} matching ${copy.plural.toLowerCase()}` : `${results.length}${status === "Exhausted" ? "" : "+"} published`}
      </p>
      <ul className={blog60Grid}>
        {results.map(post => {
          const date = formatEditorialDate(post.publishedAt);
          return (
            <li key={post._id} className="min-w-0">
              <Blog60Card
                url={editorialPath(post.kind, post.slug)}
                image={safeEditorialMediaUrl(post.coverUrl) ? { src: post.coverUrl, alt: post.coverAlt ?? "" } : null}
                category={post.category || copy.singular}
                title={post.title}
                description={[date, post.excerpt].filter(Boolean).join(" — ")}
                linkLabel="Read"
              />
            </li>
          );
        })}
      </ul>
      {status !== "Exhausted" ? (
        <div className="mt-12 flex justify-center">
          <Button type="button" variant="secondary" disabled={status === "LoadingMore"} onClick={() => loadMore(PAGE_SIZE)}>
            {status === "LoadingMore" ? "Loading…" : "Load More"}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default function EditorialListPage({ kind }: { kind: EditorialKind }) {
  const copy = kindCopy[kind];
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  // Remount the filter form on reset so its draft search text clears too.
  const [filterKey, setFilterKey] = useState(0);
  const reset = () => { setCategory(""); setSearch(""); setFilterKey(key => key + 1); };

  return (
    <main>
      <Header46 tagline={copy.tagline} heading={copy.plural} description={copy.description} className="pb-6 md:pb-8" />
      <Blog60 heading={`All ${copy.plural}`} headingId={`${kind}-list`} className="pt-4 md:pt-6">
        {catalogIsConfigured ? (
          <QueryBoundary
            fallback={(_error, retry) => (
              <StatePanel role="alert" eyebrow="Something went wrong" title={`${copy.plural} Are Unavailable`} actions={<Button type="button" onClick={retry}>Try Again</Button>}>
                We couldn’t load this page right now. Please try again in a moment.
              </StatePanel>
            )}
          >
            <div className="mb-10">
              <Filters key={filterKey} kind={kind} category={category} search={search} onCategory={setCategory} onSearch={setSearch} />
            </div>
            <Results kind={kind} category={category} search={search} onReset={reset} />
          </QueryBoundary>
        ) : (
          <StatePanel role="status" eyebrow="Not connected" title={`${copy.plural} Aren’t Available Yet`}>
            <span className={statusText}>This site hasn’t been connected to its content service yet.</span>
          </StatePanel>
        )}
      </Blog60>
      <EditorialDiscovery current={kind} />
    </main>
  );
}
