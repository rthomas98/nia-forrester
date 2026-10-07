"use client";

/**
 * Relume Navbar 1 (slug: navbar1), vendored via the Relume Library MCP.
 * Adaptations: Next.js `Link` navigation, typed link/action slots instead of
 * placeholder defaults, active-link indicator, Escape/link-click closing, accessible
 * menu button (`aria-expanded`/`aria-controls`), collapsed menu hidden from
 * the tab order below `lg`, sticky wine surface with hairline. Relume's Motion
 * variants (hamburger morph, menu height) are expressed as Tailwind utility
 * transitions with `motion-reduce` fallbacks, so no runtime inline styles are
 * generated. Relume's sub-menus are replaced by a disclosure pattern: a link with
 * children keeps its direct link and gains a separate labelled toggle that shows
 * a plain list of links (a dropdown at `lg`, inline below it). It is deliberately
 * not an ARIA menu, so native Tab order applies.
 */
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { ChevronRight } from "relume-icons";
import { cn } from "@/lib/utils";

export type Navbar1Child = {
  key: string;
  url: string;
  title: string;
  active?: boolean;
};

export type Navbar1Link = Navbar1Child & {
  /** Destinations revealed by the link's dropdown (desktop) or disclosure (mobile). */
  children?: Navbar1Child[];
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

const navLinkClass =
  "relative flex min-h-11 items-center py-3 font-ui text-[0.8125rem] font-semibold tracking-[0.14em] uppercase transition-colors hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne lg:px-4 lg:py-2";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne";

/** Matches Tailwind's `lg` breakpoint; outside-pointer and focus-out closing apply to the dropdown only. */
const isDesktop = () => window.matchMedia("(min-width: 64rem)").matches;

function ActiveIndicator() {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-1 left-0 h-px w-6 bg-champagne lg:right-4 lg:left-4 lg:w-auto"
    />
  );
}

export const Navbar1 = ({ logo, navLinks, actions, navLabel = "Primary navigation" }: Navbar1Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const toggleRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const idPrefix = useId();
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenGroup(null);
  };

  useEffect(() => {
    if (!isMobileMenuOpen && !openGroup) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Close the innermost open layer and return focus to the control that opened it.
      if (openGroup) {
        setOpenGroup(null);
        toggleRefs.current[openGroup]?.focus();
        return;
      }
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen, openGroup]);

  useEffect(() => {
    if (!openGroup) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const group = groupRefs.current[openGroup];
      if (isDesktop() && group && !group.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [openGroup]);

  // Keyboard focus leaving the dropdown closes it. A null relatedTarget (pointer
  // presses that don't move focus, e.g. Safari links) is left to the pointer handler.
  const closeOnFocusOut = (key: string) => (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (openGroup === key && next && isDesktop() && !event.currentTarget.contains(next as Node)) setOpenGroup(null);
  };

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
            ref={menuButtonRef}
            type="button"
            className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center focus-visible:outline-2 focus-visible:outline-champagne lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => (isMobileMenuOpen ? closeMenu() : setIsMobileMenuOpen(true))}
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
            {navLinks.map((navLink, index) => {
              const linkTone = navLink.active ? "text-champagne" : "text-body";
              if (!navLink.children?.length) {
                return (
                  <Link
                    key={navLink.key}
                    href={navLink.url}
                    onClick={closeMenu}
                    aria-current={navLink.active ? "page" : undefined}
                    className={cn(navLinkClass, index === 0 && "pt-7 lg:pt-2", linkTone)}
                  >
                    {navLink.title}
                    {navLink.active ? <ActiveIndicator /> : null}
                  </Link>
                );
              }
              const isOpen = openGroup === navLink.key;
              const panelId = `${idPrefix}-${navLink.key}-links`;
              return (
                <div
                  key={navLink.key}
                  ref={(element) => {
                    groupRefs.current[navLink.key] = element;
                  }}
                  onBlur={closeOnFocusOut(navLink.key)}
                  className="lg:relative"
                >
                  <div className={cn("flex items-center justify-between lg:justify-start", index === 0 && "pt-4 lg:pt-0")}>
                    <Link
                      href={navLink.url}
                      onClick={closeMenu}
                      aria-current={navLink.active ? "page" : undefined}
                      className={cn(navLinkClass, "flex-1 lg:flex-none lg:pr-1", linkTone)}
                    >
                      {navLink.title}
                      {navLink.active ? <ActiveIndicator /> : null}
                    </Link>
                    <button
                      ref={(element) => {
                        toggleRefs.current[navLink.key] = element;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${navLink.title} destinations`}
                      onClick={() => setOpenGroup((current) => (current === navLink.key ? null : navLink.key))}
                      className={cn(
                        "-mr-3 flex size-11 cursor-pointer items-center justify-center transition-colors hover:text-champagne lg:mr-0 lg:w-7",
                        focusRing,
                        isOpen || navLink.active ? "text-champagne" : "text-body",
                      )}
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className={cn(
                          "size-4 transition-transform duration-200 ease-standard motion-reduce:transition-none",
                          isOpen ? "-rotate-90" : "rotate-90",
                        )}
                      />
                    </button>
                  </div>
                  <ul
                    id={panelId}
                    aria-label={`${navLink.title} destinations`}
                    className={cn(
                      isOpen ? "flex" : "hidden",
                      "mb-2 flex-col border-l border-hairline pl-4 lg:absolute lg:top-full lg:left-0 lg:z-10 lg:mt-1 lg:mb-0 lg:min-w-60 lg:rounded-card lg:border lg:bg-wine-card lg:p-2 lg:shadow-[0_24px_40px_-24px_rgb(0_0_0/0.75)]",
                    )}
                  >
                    {navLink.children.map((child) => (
                      <li key={child.key}>
                        <Link
                          href={child.url}
                          onClick={closeMenu}
                          aria-current={child.active ? "page" : undefined}
                          className={cn(
                            "flex min-h-11 items-center rounded-button px-3 py-2 font-ui text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-wine-raised hover:text-champagne",
                            focusRing,
                            child.active ? "text-champagne" : "text-body",
                          )}
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
          <div className="mt-6 flex flex-col items-stretch gap-4 pb-8 lg:mt-0 lg:ml-4 lg:flex-row lg:items-center lg:pb-0">
            {actions(closeMenu)}
          </div>
        </div>
      </div>
    </header>
  );
};
