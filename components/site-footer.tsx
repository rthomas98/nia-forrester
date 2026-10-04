import { BrandMark } from "@/components/brand-mark";
import { Footer15 } from "@/components/relume/footer15";

export default function SiteFooter() {
  return (
    <Footer15
      brand={
        <>
          <BrandMark />
          <p className="mt-6 max-w-sm font-display text-h6 font-medium text-pretty text-cream">
            Woman-centered, romantic realism.
          </p>
          <p className="mt-3 max-w-sm text-small leading-relaxed text-pretty text-body">
            The books, the serials, the community — and the studio — all in one
            place.
          </p>
          <p className="mt-3 font-ui text-tiny tracking-[0.12em] text-taupe uppercase">
            She Who Writes Herself · niaforrester.com
          </p>
        </>
      }
      columnLinks={[
        {
          heading: "Read",
          links: [
            { title: "Serials", url: "/serial" },
            { title: "Essays", url: "/read" },
            { title: "The Backlist", url: "/read#backlist" },
            { title: "Audiobooks", url: "/read" },
          ],
        },
        {
          heading: "Connect",
          links: [
            { title: "Reader Circle", url: "/community" },
            { title: "Events", url: "/events" },
            { title: "Writing Studio", url: "/academy" },
          ],
        },
        {
          heading: "Account",
          links: [
            { title: "Sign In", url: "/signin" },
            { title: "Membership", url: "/membership" },
            { title: "Help & Contact", url: "/contact" },
          ],
        },
      ]}
      footerText="© 2026 Nia Forrester"
      footerLinks={[
        { title: "Privacy", url: "/privacy" },
        { title: "Terms", url: "/terms" },
        { title: "Accessibility", url: "/accessibility" },
        { title: "Contact", url: "/contact" },
      ]}
    />
  );
}
