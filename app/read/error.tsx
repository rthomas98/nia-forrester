"use client";

import { CatalogQueryError } from "@/components/catalog/catalog-states";

export default function ReadError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="px-[5%] py-16 md:py-24">
      <div className="mx-auto w-full max-w-content">
        <CatalogQueryError error={error} onRetry={unstable_retry} headingLevel="h1" />
      </div>
    </main>
  );
}
