import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bookDetails, getBookDetail } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return bookDetails.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookDetail(slug);

  if (!book) {
    return { title: "Book Not Found" };
  }

  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/read/${book.slug}` },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookDetail(slug);

  if (!book) notFound();

  const relatedBooks = bookDetails
    .filter((candidate) => candidate.slug !== book.slug)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-[1120px] px-10 pb-24 pt-10 max-[900px]:px-8 max-[640px]:px-5 max-[640px]:pb-16 max-[640px]:pt-7">
      <Link
        href="/read"
        className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[var(--color-plum-copy)] transition-colors hover:text-[var(--color-hot-magenta)]"
      >
        ← Back to Read
      </Link>

      <section className="mt-8 grid grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] overflow-hidden rounded-[36px] bg-[var(--color-brand-surface)] shadow-[0_12px_28px_rgba(53,5,73,0.08),0_2px_6px_rgba(53,5,73,0.04)] max-[760px]:grid-cols-1">
        <div className="flex min-h-[520px] items-center justify-center bg-[var(--color-brand-surface)] p-14 max-[760px]:min-h-0 max-[640px]:p-10">
          <div
            className={`flex h-[390px] w-[268px] flex-col justify-between rounded-[3px] p-7 shadow-[0_32px_44px_-22px_rgba(53,5,73,0.38),0_14px_22px_-10px_rgba(53,5,73,0.20)] ${book.gradient}`}
          >
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(196,185,203,0.82)]">
              Nia Forrester
            </span>
            <span className="font-serif text-[34px] font-medium leading-[1.04] text-[var(--color-brand-surface)]">
              {book.title}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center px-14 py-16 max-[900px]:px-10 max-[640px]:px-6 max-[640px]:py-10">
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-hot-magenta)]">
            {book.eyebrow}
          </div>
          <h1 className="mb-5 mt-3 font-sans text-[clamp(42px,5vw,68px)] font-bold leading-none tracking-[-0.035em] text-[var(--color-deep-plum)]">
            {book.title}
          </h1>
          <p className="m-0 max-w-[58ch] text-[17px] leading-[1.7] text-[var(--color-plum-copy)]">
            {book.description}
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-3 max-[520px]:grid-cols-1">
            {[
              ["Category", book.category],
              ["Published", book.published],
              ["Reading order", book.readingOrder],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-[rgba(53,5,73,0.08)] bg-[var(--color-soft-lavender)]/55 p-4"
              >
                <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-plum-muted)]">
                  {label}
                </dt>
                <dd className="mt-1.5 font-sans text-sm font-semibold text-[var(--color-deep-plum)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/read#backlist"
              className="rounded-full bg-[var(--color-deep-plum)] px-6 py-3.5 font-sans text-sm font-semibold text-[var(--color-brand-surface)] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse the backlist
            </Link>
            <Link
              href="/read"
              className="rounded-full border border-[rgba(53,5,73,0.16)] px-6 py-3.5 font-sans text-sm font-semibold text-[var(--color-deep-plum)] transition hover:bg-black/5"
            >
              Explore all reading paths
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[1fr_1.2fr] gap-6 py-14 max-[760px]:grid-cols-1">
        <div className="rounded-[28px] bg-[var(--color-cool-teal)] p-8">
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-deep-plum)]">
            A good fit for
          </div>
          <ul className="mt-5 flex list-none flex-col gap-3 p-0">
            {book.bestFor.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 font-sans text-[15px] font-semibold text-[var(--color-deep-plum)]"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-[var(--color-hot-magenta)] text-xs text-[var(--color-brand-surface)]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] bg-[var(--color-deep-plum)] p-8 text-[var(--color-soft-lavender)]">
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-hot-magenta)]">
            {book.seriesName ? `${book.seriesName} reading order` : "How to read it"}
          </div>
          {book.seriesBooks ? (
            <ol className="mt-5 grid list-none grid-cols-2 gap-3 p-0 max-[480px]:grid-cols-1">
              {book.seriesBooks.map((title, index) => (
                <li
                  key={title}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 font-sans text-sm ${
                    title === book.title
                      ? "bg-[var(--color-hot-magenta)] font-bold text-[var(--color-brand-surface)]"
                      : "bg-white/5 text-[rgba(196,185,203,0.82)]"
                  }`}
                >
                  <span className="text-xs opacity-60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {title}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mb-0 mt-5 max-w-[48ch] text-[15px] leading-[1.65] text-[rgba(196,185,203,0.78)]">
              This is a standalone story. You can read it without starting
              another series first, then return to the library for your next
              book.
            </p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-hot-magenta)]">
              Keep exploring
            </div>
            <h2 className="mb-0 mt-2 font-sans text-3xl font-bold tracking-[-0.025em] text-[var(--color-deep-plum)]">
              More reader favorites
            </h2>
          </div>
          <Link
            href="/read"
            className="font-sans text-sm font-semibold text-[var(--color-plum-copy)] hover:text-[var(--color-hot-magenta)]"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 max-[700px]:grid-cols-1">
          {relatedBooks.map((related) => (
            <Link
              key={related.slug}
              href={`/read/${related.slug}`}
              className="group flex items-center gap-4 rounded-3xl bg-[var(--color-brand-surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span
                className={`h-20 w-14 flex-none rounded-[2px] shadow-sm ${related.gradient}`}
              />
              <span className="min-w-0">
                <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-hot-magenta)]">
                  {related.category}
                </span>
                <span className="mt-1 block font-sans text-base font-bold text-[var(--color-deep-plum)] group-hover:text-[var(--color-hot-magenta)]">
                  {related.title}
                </span>
                <span className="mt-1 block font-sans text-xs text-[var(--color-plum-muted)]">
                  {related.readingOrder}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
