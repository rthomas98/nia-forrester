import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/policy-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the Nia Forrester Reader Hub handles personal information.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Your information"
      title="Privacy Policy"
      intro="The Reader Hub collects only the information needed to run accounts, deliver requested reading and event services, process memberships, and improve the site."
      sections={[
        {
          title: "Information we collect",
          body: (
            <p>
              This may include your name, email address, account preferences,
              reading progress, community activity, event registrations,
              messages, and membership status. Stripe processes payment-card
              details; the Reader Hub does not store complete card numbers.
            </p>
          ),
        },
        {
          title: "How information is used",
          body: (
            <p>
              Information is used to authenticate you, personalize your
              library, enforce access levels, send emails you request, support
              events and services, moderate community spaces, answer messages,
              prevent abuse, and understand aggregate site performance.
            </p>
          ),
        },
        {
          title: "Service providers",
          body: (
            <p>
              The site uses Better Auth and Convex for accounts and application
              data, Stripe for billing, Resend for transactional email, and
              Vercel for hosting and privacy-conscious site analytics. Each
              provider processes information under its own terms and security
              controls.
            </p>
          ),
        },
        {
          title: "Choices and retention",
          body: (
            <p>
              You may unsubscribe from editorial email at any time, update
              account preferences, or request account deletion. Records needed
              for legal, fraud-prevention, accounting, or dispute purposes may
              be retained for the required period.
            </p>
          ),
        },
        {
          title: "Security and children",
          body: (
            <p>
              Reasonable technical and organizational safeguards are used, but
              no online service can promise absolute security. The Reader Hub
              is not directed to children under 13.
            </p>
          ),
        },
      ]}
    />
  );
}
