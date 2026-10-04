import type { Metadata } from "next";
import { BookNotFound } from "@/components/catalog/catalog-states";

export const metadata: Metadata = { title: "Book Not Found" };

export default function NotFound() {
  return (
    <main className="px-[5%] py-16 md:py-24">
      <div className="mx-auto w-full max-w-content">
        <BookNotFound headingLevel="h1" />
      </div>
    </main>
  );
}
