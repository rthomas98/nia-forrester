import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/policy-page";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the Nia Forrester Reader Hub.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Site terms"
      title="Terms of Use"
      intro="These terms govern use of the Reader Hub, including its reading library, community, events, Writing Studio services, and paid memberships."
      sections={[
        {
          title: "Accounts and acceptable use",
          body: (
            <p>
              Keep account credentials private and provide accurate
              information. Do not disrupt the service, scrape protected
              material, evade access controls, impersonate others, harass
              community members, or use the site unlawfully.
            </p>
          ),
        },
        {
          title: "Books and other content",
          body: (
            <p>
              Text, audio, artwork, branding, and downloads are protected by
              intellectual-property law. Access is personal and
              non-transferable unless a product expressly grants broader
              rights. Purchasing or subscribing does not transfer copyright.
            </p>
          ),
        },
        {
          title: "Memberships and billing",
          body: (
            <p>
              Paid memberships renew at the cadence shown at checkout until
              canceled. Stripe manages payment details and billing changes.
              Cancel before renewal to avoid the next charge; access continues
              through the paid period unless otherwise stated at checkout.
            </p>
          ),
        },
        {
          title: "Community and submissions",
          body: (
            <p>
              You retain ownership of what you post while granting the Reader
              Hub permission to display and moderate it for operating the
              community. Spoilers must be marked. Content may be removed and
              accounts restricted for safety, rights, or rule violations.
            </p>
          ),
        },
        {
          title: "Events and professional services",
          body: (
            <p>
              Event, course, and editorial-service details may include separate
              scheduling, cancellation, refund, and participation terms. Those
              terms are presented before purchase or booking and control if
              they conflict with this general page.
            </p>
          ),
        },
        {
          title: "Availability and changes",
          body: (
            <p>
              Features and content may change, pause, or end. The service is
              provided as available, subject to rights that cannot legally be
              excluded. Material changes to these terms will be posted here.
            </p>
          ),
        },
      ]}
    />
  );
}
