"use client";

import { useState } from "react";
import Image from "next/image";
import { coverPath, type CatalogBook } from "@/lib/catalog";

const titleSizes = {
  shelf: "p-3 text-[15px]",
  detail: "p-6 text-[28px]",
} as const;

/**
 * Renders `coverAsset.path` through next/image. A book without a usable local
 * asset (or one whose file fails to load) gets a typographic brand cover
 * rather than someone else's artwork.
 */
export function CatalogCover({
  book,
  sizes,
  variant = "shelf",
  eager = false,
}: {
  book: Pick<CatalogBook, "title" | "coverAsset">;
  sizes: string;
  variant?: keyof typeof titleSizes;
  eager?: boolean;
}) {
  const path = coverPath(book);
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const showImage = path !== null && failedPath !== path;

  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[3px] bg-[linear-gradient(160deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_100%)] shadow-[0_26px_46px_-22px_rgba(53,5,73,0.52),0_8px_18px_-8px_rgba(53,5,73,0.24)] ring-1 ring-white/20">
      {showImage ? (
        <Image
          src={path}
          alt={`Cover of ${book.title}`}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          onError={() => setFailedPath(path)}
          className="object-cover"
        />
      ) : (
        <div
          className={`flex h-full flex-col justify-between ${titleSizes[variant]}`}
        >
          <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-[rgba(196,185,203,0.85)]">
            Cover Unavailable
          </span>
          <span className="break-words font-serif font-medium leading-[1.05] text-[var(--color-brand-surface)]">
            {book.title}
          </span>
        </div>
      )}
    </div>
  );
}
