"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CatalogCover } from "@/components/catalog/catalog-cover";
import {
  BookDetailSkeleton,
  BookNotFound,
  CatalogOffline,
  CatalogQueryError,
  CatalogUnconfigured,
  StatePanel,
} from "@/components/catalog/catalog-states";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { useCatalogQuery } from "@/components/catalog/use-catalog-query";
import { SignedCopyInquiryForm } from "@/components/inquiry-form";
import { buttonVariants } from "@/components/ui/button";
import { cardVariants } from "@/components/ui/card";
import { catalogApi, catalogIsConfigured, type CatalogBook } from "@/lib/catalog";
import { getSignedCopyOffer } from "@/lib/legacy-offers";
import { heading4, label, muted, tagline } from "@/lib/typography";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function Padded({ children }: { children: ReactNode }) {
  return (
    <div className="px-[5%] pt-8 pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-content">{children}</div>
    </div>
  );
}

function SignedCopy({ book }: { book: CatalogBook }) {
  const offer = getSignedCopyOffer(book.title);
  const bookUrl = `/read/${book.slug}`;

  if (!offer) {
    return (
      <Padded>
        <StatePanel
          headingLevel="h1"
          eyebrow="Signed copies"
          title="Signed Copies Aren’t Listed for This Title"
          actions={<Link href={bookUrl} className={buttonVariants({ variant: "secondary" })}>Back to {book.title}</Link>}
        >
          The original shop doesn’t list a signed edition of this book.
        </StatePanel>
      </Padded>
    );
  }

  return (
    <section aria-labelledby="signed-copy-heading" className="px-[5%] pt-8 pb-16 md:pt-12 md:pb-24">
      <div className="mx-auto grid w-full max-w-content items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="mx-auto w-full max-w-[18rem] md:mx-0">
          <CatalogCover book={book} variant="detail" eager sizes="(min-width: 768px) 288px, 70vw" />
        </div>
        <div>
          <p className={tagline}>Signed &amp; Personalized Copy</p>
          <h1 id="signed-copy-heading" className="font-display text-h2 font-semibold text-balance break-words text-cream">
            {book.title}
          </h1>
          <p className="mt-4 font-display text-h5 font-semibold text-cream">
            {usd.format(offer.priceInCents / 100)}
            <span className={`ml-3 align-middle ${label}`}>Listed price on the original shop</span>
          </p>
          <p className={`mt-4 max-w-[60ch] ${muted}`}>
            Tell Nia how you’d like your copy signed. Your request is saved here first; you then
            complete the purchase on Nia’s original shop, where payment and shipping are handled.
          </p>
          <div className={`${cardVariants({ variant: "raised" })} mt-8 p-6 sm:p-8`}>
            <h2 className={`mb-6 ${heading4}`}>Your Inscription Request</h2>
            <SignedCopyInquiryForm bookSlug={book.slug} fallbackCheckoutUrl={offer.url} />
          </div>
          <Link href={bookUrl} className={`mt-6 ${buttonVariants({ variant: "link", size: "link" })}`}>
            Back to {book.title}
          </Link>
        </div>
      </div>
    </section>
  );
}

function SignedCopyLookup({ slug }: { slug: string }) {
  const book = useCatalogQuery(catalogApi.bookBySlug, { slug });
  if (book.status === "loading") return <Padded><h1 className="sr-only">Loading Book</h1><BookDetailSkeleton /></Padded>;
  if (book.status === "offline") return <Padded><CatalogOffline headingLevel="h1" /></Padded>;
  if (!book.data) return <Padded><BookNotFound headingLevel="h1" /></Padded>;
  return <SignedCopy book={book.data} />;
}

export default function SignedCopyPage({ slug }: { slug: string }) {
  return (
    <main>
      {catalogIsConfigured ? (
        <QueryBoundary
          fallback={(error, retry) => (
            <Padded>
              <CatalogQueryError error={error} onRetry={retry} headingLevel="h1" />
            </Padded>
          )}
        >
          <SignedCopyLookup slug={slug} />
        </QueryBoundary>
      ) : (
        <Padded>
          <CatalogUnconfigured headingLevel="h1" />
        </Padded>
      )}
    </main>
  );
}
