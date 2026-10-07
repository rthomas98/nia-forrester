import { CatalogCover } from "@/components/catalog/catalog-cover";
import { Product1Item } from "@/components/relume/product1";
import { bookMetaLine, type CatalogBook } from "@/lib/catalog";

/** A catalog book as a Relume Product 1 tile. */
export function BookCard({
  book,
  sizes,
}: {
  book: CatalogBook;
  sizes: string;
}) {
  return (
    <Product1Item
      url={`/read/${book.slug}`}
      name={book.title}
      description={bookMetaLine(book)}
      image={<CatalogCover book={book} sizes={sizes} />}
    />
  );
}
