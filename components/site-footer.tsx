import Link from "next/link";

const columnHeading =
  "mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(196,185,203,0.6)]";
const linkList = "m-0 flex list-none flex-col gap-[11px] p-0";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex min-h-11 min-w-11 cursor-pointer items-center text-sm text-[rgba(196,185,203,0.78)] transition-colors duration-150 hover:text-[var(--color-cool-teal)]"
      >
        {children}
      </Link>
    </li>
  );
}

export default function SiteFooter() {
  return (
    <footer className="mt-6 bg-[var(--color-deep-plum)] py-14 pb-9 font-sans text-[var(--color-soft-lavender)]">
      <div className="mx-auto max-w-[1240px] px-10 max-[640px]:px-5">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 max-[900px]:grid-cols-3 max-[900px]:gap-8 max-[640px]:grid-cols-2 max-[380px]:grid-cols-1">
          <div className="max-[900px]:col-span-3 max-[640px]:col-span-2 max-[380px]:col-span-1">
            <div className="mb-3.5 flex items-baseline gap-2">
              <span className="inline-block size-[9px] rounded-full bg-[var(--color-hot-magenta)]" />
              <span className="font-sans text-xl font-bold tracking-[-0.02em]">
                Nia Forrester
              </span>
            </div>
            <p className="mb-2.5 max-w-[320px] text-pretty font-serif text-[17px] font-medium italic text-[rgba(196,185,203,0.88)]">
              Woman-centered, romantic realism.
            </p>
            <p className="mb-2.5 max-w-[320px] text-pretty text-sm leading-[1.6] text-[rgba(196,185,203,0.6)]">
              The books, the serials, the community — and the studio — all in
              one place.
            </p>
            <p className="text-pretty font-sans text-xs tracking-[0.04em] text-[rgba(196,185,203,0.45)]">
              She Who Writes Herself · niaforrester.com
            </p>
          </div>
          <div>
            <h6 className={columnHeading}>Read</h6>
            <ul className={linkList}>
              <FooterLink href="/serial">Serials</FooterLink>
              <FooterLink href="/read">Essays</FooterLink>
              <FooterLink href="/read">The backlist</FooterLink>
              <FooterLink href="/read">Audiobooks</FooterLink>
            </ul>
          </div>
          <div>
            <h6 className={columnHeading}>Connect</h6>
            <ul className={linkList}>
              <FooterLink href="/community">Reader Circle</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/academy">Writing Studio</FooterLink>
            </ul>
          </div>
          <div>
            <h6 className={columnHeading}>Account</h6>
            <ul className={linkList}>
              <FooterLink href="/signin">Sign in</FooterLink>
              <FooterLink href="/membership">Membership</FooterLink>
              <FooterLink href="/contact">Help & contact</FooterLink>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex justify-between border-t border-[rgba(196,185,203,0.12)] pt-6 font-sans text-xs tracking-[0.04em] text-[rgba(196,185,203,0.5)] max-[640px]:flex-col max-[640px]:gap-4">
          <span>© 2026 Nia Forrester</span>
          <span className="flex flex-wrap gap-x-3.5 gap-y-1">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center transition-colors duration-150 hover:text-[var(--color-cool-teal)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center transition-colors duration-150 hover:text-[var(--color-cool-teal)]"
            >
              Terms
            </Link>
            <Link
              href="/accessibility"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center transition-colors duration-150 hover:text-[var(--color-cool-teal)]"
            >
              Accessibility
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center transition-colors duration-150 hover:text-[var(--color-cool-teal)]"
            >
              Contact
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
