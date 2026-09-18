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
    <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-10 sm:px-8 md:pb-24 md:pt-14 lg:px-10">
      <CatalogQueryError error={error} onRetry={unstable_retry} />
    </main>
  );
}
