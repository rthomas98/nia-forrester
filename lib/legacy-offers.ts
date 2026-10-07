import { normalizedBookTitle } from "./editorial-catalog";

/** Original-site public offers verified 2026-10-06; requests are not payments. */
export const academyOffers = [
  { id: "book-talk", title: "Book Club / Book Talk", priceInCents: 0, description: "A book club or podcast appearance, up to 90 minutes." },
  { id: "trial", title: "Free Trial Critique and Coaching Session", priceInCents: 0, description: "One free coaching session or a critique of up to 20 pages." },
  { id: "single-session", title: "For Writers and Aspiring Writers", priceInCents: 15000, description: "A one-hour writing consultation, with notes or critique." },
  { id: "three-sessions", title: "3 Session Pack", priceInCents: 40000, description: "Three private consultations; valid for six months." },
  { id: "five-sessions", title: "5 Session Pack", priceInCents: 70000, description: "Five private consultations; valid for six months." },
  { id: "ten-sessions", title: "10 Session Pack", priceInCents: 125000, description: "Ten private consultations; valid for twelve months." },
] as const;

export const academyOffersSource = "https://www.niaforrester.com/pricing-plans/list";

interface SignedCopyOffer { title: string; priceInCents: number; url: string }
const signedCopyRows: [string, number, string][] = [
  ["Reversible Error", 1599, "reversible-error"],
  ["Jane Doe Black", 1599, "jane-doe-black-lainey-abbott-series"],
  ["The Broken", 1599, "the-broken"],
  ["Commitment", 1799, "commitment-signed-copy"],
  ["Unsuitable Men", 1299, "unsuitable-men-signed-copy"],
  ["Afterwards", 1399, "afterwards-signed-copy"],
  ["Maybe Never", 799, "maybe-never-signed-copy"],
  ["Afterburn", 1399, "afterburn-signed-copy"],
  ["Four: Stories of Marriage", 1799, "four-stories-of-marriage-signed-copy"],
  ["Commitment (10th Anniversary Edition)", 1899, "commitment-10th-anniversary-edition"],
  ["Mistress", 899, "mistress-the-mistress-trilogy-book-1"],
  ["Wife", 1299, "wife-the-mistress-trilogy-book2"],
  ["Mother", 1299, "mother-the-mistress-trilogy-book-3"],
  ["Young, Rich & Black", 1099, "young-rich-black"],
  ["Rhyme & Reason", 1599, "rhyme-reason-signed-copy"],
  ["Snowflake", 1599, "snowflake-signed-copy"],
  ["The Come Up", 1599, "the-come-up"],
  ["The Takedown", 1599, "the-takedown"],
  ["The Fall", 1599, "the-fall-signed-copy"],
  ["Courtship", 1599, "courtship-signed-copy"],
  ["Secret", 1099, "secret-the-secret-series-book-1"],
  ["The Art of Endings", 1099, "the-art-of-endings-the-secret-series-book-2"],
  ["Lifted", 1099, "lifted-the-secret-series-book-3"],
  ["Silent Nights", 899, "silent-nights"],
  ["The Darkest Morning", 899, "the-darkest-morning"],
  ["Not That Kind of Girl", 799, "not-that-kind-of-girl"],
  ["May December", 899, "may-december-1"],
  ["A la Carte", 1599, "a-la-carte-the-complete-coffee-date-novellas"],
  ["The Lover", 1599, "the-lover-signed-copy"],
  ["In Black & White", 1199, "in-black-white-signed-copy"],
  ["Ivy's League", 1099, "ivy-s-league"],
];
const signedCopyOffers: SignedCopyOffer[] = signedCopyRows.map(([title, priceInCents, slug]) => ({ title, priceInCents, url: `https://www.niaforrester.com/product-page/${slug}` }));

export function getSignedCopyOffer(title: string): SignedCopyOffer | null {
  const normalized = normalizedBookTitle(title);
  if (normalized.startsWith("commitment ") && normalized.includes("10th anniversary")) {
    return signedCopyOffers.find(offer => offer.title.includes("10th Anniversary")) ?? null;
  }
  return signedCopyOffers.find(offer => {
    const name = normalizedBookTitle(offer.title);
    return normalized === name || normalized.startsWith(`${name} `);
  }) ?? null;
}
