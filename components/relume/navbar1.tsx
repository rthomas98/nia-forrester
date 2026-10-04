"use client";

/**
 * Relume Navbar 1 (slug: navbar1), vendored via the Relume Library MCP.
 * Adaptations: Next.js `Link` navigation, typed link/action slots instead of
 * placeholder defaults, active-link indicator, Escape/link-click closing, accessible
 * menu button (`aria-expanded`/`aria-controls`), collapsed menu hidden from
 * the tab order below `lg`, sticky wine surface with hairline. Relume's Motion
 * variants (hamburger morph, menu height) are expressed as Tailwind utility
 * transitions with `motion-reduce` fallbacks, so no runtime inline styles are
 * generated. Sub-menus are not used by this site and were removed.
 */
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Navbar1Link = {
  key: string;
  url: string;
  title: string;
  active?: boolean;
};

export type Navbar1Props = {
  logo: { url: string; content: ReactNode; label: string };
  navLinks: Navbar1Link[];
  /** Rendered after the links; receives a callback that closes the mobile menu. */
  actions: (closeMenu: () => void) => ReactNode;
  navLabel?: string;
};

const hamburgerLine =
  "my-[3px] h-0.5 w-6 bg-scheme-text transition-all duration-300 ease-standard motion-reduce:transition-none";

export const Navbar1 = ({ logo, navLinks, actions, navLabel = "Primary navigation" }: Navbar1Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b border-hairline bg-wine-page/92 backdrop-blur-md lg:min-h-18 lg:px-[5%]">
      <div className="mx-auto size-full max-w-content lg:flex lg:items-center lg:justify-between">
        <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
          <Link
            href={logo.url}
            aria-label={logo.label}
            onClick={closeMenu}
            className="flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
          >
            {logo.content}
          </Link>
          <button
            type="button"
            className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center focus-visible:outline-2 focus-visible:outline-champagne lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span aria-hidden="true" className={cn(hamburgerLine, isMobileMenuOpen && "translate-y-2 -rotate-45")} />
            <span aria-hidden="true" className={cn(hamburgerLine, isMobileMenuOpen && "w-0 opacity-0")} />
            <span aria-hidden="true" className={cn(hamburgerLine, isMobileMenuOpen && "-translate-y-2 rotate-45")} />
          </button>
        </div>
        <div
          id="primary-navigation"
          className={cn(
            "overflow-hidden px-[5%] transition-[height,visibility] duration-400 ease-standard motion-reduce:transition-none max-lg:overflow-y-auto lg:flex lg:h-auto lg:items-center lg:overflow-visible lg:px-0",
            isMobileMenuOpen ? "max-lg:h-[calc(100dvh-4rem)]" : "max-lg:invisible max-lg:h-0",
          )}
        >
          <nav aria-label={navLabel} className="lg:flex lg:items-center">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.key}
                href={navLink.url}
                onClick={closeMenu}
                aria-current={navLink.active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center py-3 font-ui text-[0.8125rem] font-semibold tracking-[0.14em] uppercase transition-colors first:pt-7 hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne lg:px-4 lg:py-2 first:lg:pt-2",
                  navLink.active ? "text-champagne" : "text-body",
                )}
              >
                {navLink.title}
                {navLink.active ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-0 h-px w-6 bg-champagne lg:right-4 lg:left-4 lg:w-auto"
                  />
                ) : null}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col items-stretch gap-4 pb-8 lg:mt-0 lg:ml-4 lg:flex-row lg:items-center lg:pb-0">
            {actions(closeMenu)}
          </div>
        </div>
      </div>
    </header>
  );
};
