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
  return (
    <CoverFrame
      title={book.title}
      src={coverPath(book)}
      sizes={sizes}
      variant={variant}
      eager={eager}
    />
  );
}

/** A cover image or, when missing or broken, the typographic brand cover. */
export function CoverFrame({
  title,
  src,
  sizes,
  variant = "shelf",
  eager = false,
}: {
  title: string;
  src: string | null;
  sizes: string;
  variant?: keyof typeof titleSizes;
  eager?: boolean;
}) {
  const path = src;
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const showImage = path !== null && failedPath !== path;

  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-image bg-wine-raised shadow-[0_24px_40px_-24px_rgb(0_0_0/0.75)] ring-1 ring-hairline">
      {showImage ? (
        <Image
          src={path}
          alt={`Cover of ${title}`}
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
          <span className="font-ui text-[0.5625rem] font-semibold tracking-[0.16em] text-champagne uppercase">
            Cover Unavailable
          </span>
          <span className="font-display leading-[1.05] font-semibold break-words text-cream">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
