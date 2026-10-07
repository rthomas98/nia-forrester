/**
 * Relume Footer 15 (slug: footer15), vendored via the Relume Library MCP.
 * Adaptations: Next.js `Link`, typed link columns and brand block slot. The address,
 * phone and company-logo rows were removed because the site has no real data for
 * them (no placeholder contact details are rendered). Social icons are not built in
 * here; the site passes `SocialLinks` (Instagram, TikTok, Threads, Facebook) through the
 * brand slot from `components/site-footer.tsx`.
 */
import Link from "next/link";
import type { ReactNode } from "react";

type Links = {
  title: string;
  url: string;
};

type ColumnLinks = {
  heading: string;
  links: Links[];
};

export type Footer15Props = {
  brand: ReactNode;
  columnLinks: ColumnLinks[];
  footerText: string;
  footerLinks: Links[];
};

const footerLink =
  "inline-flex min-h-11 items-center transition-colors hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne";

export const Footer15 = ({ brand, columnLinks, footerText, footerLinks }: Footer15Props) => {
  return (
    <footer className="border-t border-hairline bg-wine-sunken px-[5%] py-12 md:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-content">
        <div className="grid grid-cols-1 gap-x-[4vw] gap-y-12 pb-10 md:gap-y-16 md:pb-14 lg:grid-cols-[1fr_1fr] lg:gap-y-4 lg:pb-16">
          <div>{brand}</div>
          <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-8 md:gap-y-4">
            {columnLinks.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-2 font-ui text-tiny font-semibold tracking-[0.22em] text-champagne uppercase">
                  {column.heading}
                </h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={`${link.title}-${link.url}`} className="text-small font-semibold text-body">
                      <Link href={link.url} className={footerLink}>
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-scheme-border" />
        <div className="flex flex-col-reverse items-start justify-between pt-6 pb-4 text-small text-taupe md:flex-row md:items-center md:pt-8 md:pb-0">
          <p className="mt-8 md:mt-0">{footerText}</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-1 text-small md:grid-flow-col md:gap-x-6 md:gap-y-0">
            {footerLinks.map((link) => (
              <li key={link.url} className="underline underline-offset-4">
                <Link href={link.url} className={footerLink}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
