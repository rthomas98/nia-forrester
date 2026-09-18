import Link from "next/link";
import { CatalogCover } from "@/components/catalog/catalog-cover";
import { bookMetaLine, type CatalogBook } from "@/lib/catalog";
import { focusRing } from "@/lib/catalog-styles";

export function BookCard({
  book,
  sizes,
}: {
  book: CatalogBook;
  sizes: string;
}) {
  const meta = bookMetaLine(book);

  return (
    <Link
      href={`/read/${book.slug}`}
      className={`group block rounded-lg transition duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
    >
      <CatalogCover book={book} sizes={sizes} />
      <span className="mt-3 block break-words font-sans text-[13px] font-semibold leading-[1.3] text-[var(--color-deep-plum)] group-hover:text-[var(--color-hot-magenta)]">
        {book.title}
      </span>
      {meta ? (
        <span className="mt-1 block font-sans text-xs leading-[1.4] text-[var(--color-plum-muted)]">
          {meta}
        </span>
      ) : null}
    </Link>
  );
}
