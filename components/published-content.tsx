"use client";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authIsConfigured } from "@/lib/auth-client";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { StatePanel } from "@/components/catalog/catalog-states";
import { Blog60Card, blog60Grid } from "@/components/relume/blog60";
import { Product1Item, product1Grid } from "@/components/relume/product1";
import { Button } from "@/components/ui/button";

const label = (kind: "serial" | "essay") => (kind === "essay" ? "essays" : "serials");

function FeedSkeleton() {
  return (
    <div role="status" className={blog60Grid}>
      <span className="sr-only">Loading published writing…</span>
      {[0, 1].map((n) => (
        <div key={n} aria-hidden="true" className="h-64 animate-pulse rounded-card border border-hairline bg-wine-card motion-reduce:animate-none" />
      ))}
    </div>
  );
}

function Feed({ kind }: { kind: "serial" | "essay" }) {
  const rows = useQuery(api.content.listPublished, { kind });
  if (!rows) return <FeedSkeleton />;
  if (!rows.length) {
    return (
      <StatePanel role="status" eyebrow="Nothing published yet" title={`No ${label(kind)} yet`}>
        No {label(kind)} have been published here yet.
      </StatePanel>
    );
  }
  return (
    <div className={blog60Grid}>
      {rows.map((r) => (
        <Blog60Card
          key={r._id}
          url={`/serial?slug=${encodeURIComponent(r.slug)}`}
          image={r.coverUrl?.startsWith("/images/") ? { src: r.coverUrl, alt: `Cover of ${r.title}` } : null}
          category={kind === "essay" ? "Essay" : "Serial"}
          title={r.title}
          description={r.excerpt}
          linkLabel="Read"
        />
      ))}
    </div>
  );
}

export function PublishedContent({ kind }: { kind: "serial" | "essay" }) {
  return authIsConfigured ? (
    <QueryBoundary
      fallback={(_e, retry) => (
        <StatePanel
          role="alert"
          eyebrow="Something went wrong"
          title="Published content is unavailable"
          actions={<Button type="button" onClick={retry}>Try Again</Button>}
        >
          We couldn’t load the published {label(kind)}. This is usually temporary.
        </StatePanel>
      )}
    >
      <Feed kind={kind} />
    </QueryBoundary>
  ) : (
    <StatePanel role="status" eyebrow="Not connected" title="Published content is not connected yet">
      Reading will appear here once the site is connected to its content service.
    </StatePanel>
  );
}

function Counts() {
  const data = useQuery(api.site.summary, {});
  if (!data || (!data.books && !data.series)) return null;
  return (
    <p className="font-ui text-tiny font-semibold tracking-[0.18em] text-taupe uppercase">
      {data.books} {data.books === 1 ? "book" : "books"} · {data.series} series · Explore the library
    </p>
  );
}

/** Live catalog totals; renders nothing until real numbers arrive (never a placeholder). */
export function CatalogCounts() {
  return authIsConfigured ? (
    <QueryBoundary fallback={() => null}>
      <Counts />
    </QueryBoundary>
  ) : null;
}

function Shelf() {
  const data = useQuery(api.site.summary, {});
  if (!data) {
    return (
      <div role="status" className={product1Grid}>
        <span className="sr-only">Loading books…</span>
        {Array.from({ length: 6 }, (_, n) => (
          <div key={n} aria-hidden="true" className="aspect-[2/3] animate-pulse rounded-image bg-wine-card motion-reduce:animate-none" />
        ))}
      </div>
    );
  }
  if (!data.featured.length) {
    return (
      <StatePanel role="status" eyebrow="Nothing published yet" title="The shelves are being stocked">
        No books have been published to the library yet.
      </StatePanel>
    );
  }
  return (
    <ul className={product1Grid}>
      {data.featured.map((b) => (
        <li key={b.id} className="min-w-0">
          <Product1Item
            url={`/read/${b.slug}`}
            name={b.title}
            description="View book"
            image={
              b.coverUrl ? (
                <div className="relative aspect-[2/3] overflow-hidden rounded-image bg-wine-sunken shadow-[0_24px_40px_-24px_rgb(0_0_0/0.7)] ring-1 ring-hairline">
                  <Image src={b.coverUrl} alt={`Cover of ${b.title}`} fill sizes="(max-width: 640px) 45vw, 180px" className="object-cover" />
                </div>
              ) : (
                <div className="flex aspect-[2/3] items-end rounded-image bg-wine-raised p-3 ring-1 ring-hairline">
                  <span className="font-display text-large leading-tight font-semibold text-cream">{b.title}</span>
                </div>
              )
            }
          />
        </li>
      ))}
    </ul>
  );
}

export function PublishedShelf() {
  return authIsConfigured ? (
    <QueryBoundary
      fallback={() => (
        <StatePanel role="alert" eyebrow="Something went wrong" title="Books are temporarily unavailable">
          The featured shelf couldn’t load. The full library is still available.
        </StatePanel>
      )}
    >
      <Shelf />
    </QueryBoundary>
  ) : (
    <StatePanel role="status" eyebrow="Library unavailable" title="The catalog is not connected yet">
      Books will appear here once the site is connected to its catalog service.
    </StatePanel>
  );
}
