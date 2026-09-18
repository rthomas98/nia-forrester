import { purchaseTarget, type CatalogBook } from "@/lib/catalog";
import { primaryAction } from "@/lib/catalog-styles";

/**
 * Outbound retailer link. Uses the backend-derived `purchaseUrl` untouched and
 * discloses affiliate links in visible text and in `rel`.
 */
export function PurchaseLink({
  book,
}: {
  book: Pick<CatalogBook, "title" | "purchaseUrl" | "isAffiliate">;
}) {
  const target = purchaseTarget(book);
  if (!target) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <a
        href={target.href}
        target="_blank"
        rel={
          book.isAffiliate
            ? "sponsored noopener noreferrer"
            : "noopener noreferrer"
        }
        className={`${primaryAction} gap-2 self-start`}
      >
        {target.retailer ? `Buy on ${target.retailer}` : "Buy this book"}
        <span aria-hidden="true">↗</span>
        <span className="sr-only">
          {` — ${book.title}${book.isAffiliate ? ", affiliate link" : ""}, opens in a new tab`}
        </span>
      </a>
      {book.isAffiliate ? (
        <p className="m-0 max-w-[46ch] font-sans text-xs leading-[1.5] text-[var(--color-plum-muted)]">
          Affiliate link — Nia may earn a small commission if you buy through
          it, at no extra cost to you.
        </p>
      ) : null}
    </div>
  );
}
