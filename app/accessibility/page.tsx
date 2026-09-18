import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/policy-page";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility commitment for the Nia Forrester Reader Hub.",
  alternates: { canonical: "/accessibility" },
};

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Access for every reader"
      title="Accessibility"
      intro="The Reader Hub is being built so readers can navigate, understand, and use it across devices and with assistive technology."
      sections={[
        {
          title: "What we support",
          body: (
            <p>
              The site targets keyboard navigation, visible focus, semantic
              headings and labels, sufficient color contrast, responsive text
              and layouts, descriptive image alternatives, reduced-motion
              preferences, and clear form errors.
            </p>
          ),
        },
        {
          title: "Ongoing work",
          body: (
            <p>
              Accessibility is reviewed as new reading, audio, community,
              event, and checkout features are released. Third-party services
              may have their own accessibility behavior, and issues are raised
              with those providers when discovered.
            </p>
          ),
        },
        {
          title: "Tell us what is not working",
          body: (
            <p>
              Use the contact form with the page, device, browser, and
              assistive technology involved. We will acknowledge the report
              and work toward an accessible alternative.
            </p>
          ),
        },
      ]}
    />
  );
}
