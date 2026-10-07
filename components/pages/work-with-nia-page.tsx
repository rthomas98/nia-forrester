import { AcademyInquiryForm } from "@/components/inquiry-form";
import { Header46 } from "@/components/relume/header46";
import { cardVariants } from "@/components/ui/card";
import { academyOffers } from "@/lib/legacy-offers";
import { container, heading4, label, section } from "@/lib/typography";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const formatPrice = (cents: number) => (cents === 0 ? "Free" : usd.format(cents / 100));

export default function WorkWithNiaPage() {
  return (
    <main>
      <Header46
        tagline="Academy · Learn"
        heading="Work with Nia"
        description="Choose the kind of support you’re looking for, tell Nia about your project, and the studio will review your request."
      />
      <section aria-labelledby="work-with-nia-options" className={`${section} pt-0 md:pt-0 lg:pt-0`}>
        <div className={`${container} grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
          <div>
            <h2 id="work-with-nia-options" className={`mb-6 ${heading4}`}>Ways to Work Together</h2>
            <ul className="grid gap-4">
              {academyOffers.map((offer) => (
                <li key={offer.id} className={`${cardVariants()} p-6`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-h6 font-semibold text-cream">{offer.title}</h3>
                    <p className={label}>{formatPrice(offer.priceInCents)}</p>
                  </div>
                  <p className="mt-3 text-small text-pretty text-body">{offer.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${cardVariants({ variant: "raised" })} p-6 sm:p-8`}>
            <h2 className={`mb-6 ${heading4}`}>Send a Request</h2>
            <AcademyInquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
