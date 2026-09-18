import type { Metadata } from "next";
import { BookNotFound } from "@/components/catalog/catalog-states";

export const metadata: Metadata = { title: "Book Not Found" };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-10 sm:px-8 md:pb-24 md:pt-14 lg:px-10">
      <BookNotFound />
    </main>
  );
}
