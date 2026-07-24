"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-context";
import { navItems } from "@/lib/data";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { authed, signOut, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const visibleNavItems = navItems.filter((item) => {
    if (
      item.key === "community" &&
      process.env.NEXT_PUBLIC_COMMUNITY_ENABLED === "false"
    ) {
      return false;
    }
    if (
      item.key === "membership" &&
      process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "false"
    ) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 max-[640px]:px-3 max-[640px]:pt-2">
      <div
        className={`relative mx-auto flex max-w-[1200px] items-center gap-6 rounded-[20px] border px-7 py-3 transition duration-300 max-[800px]:justify-between max-[800px]:px-4 max-[640px]:py-2.5 ${
          scrolled
            ? "border-white/60 bg-[rgba(252,251,252,0.86)] shadow-[0_16px_44px_-24px_rgba(53,5,73,0.5)] backdrop-blur-2xl"
            : "border-white/45 bg-[rgba(252,251,252,0.68)] shadow-[0_10px_30px_-24px_rgba(53,5,73,0.4)] backdrop-blur-xl"
        }`}
      >
        <Link
          href="/"
          className="flex min-w-0 items-baseline gap-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="inline-block size-[9px] flex-none translate-y-[-1px] rounded-full bg-[var(--color-hot-magenta)]" />
          <span className="truncate font-sans text-xl font-semibold tracking-[0.12em] text-[var(--color-deep-plum)] max-[640px]:text-[15px] max-[380px]:text-[13px]">
            NIA FORRESTER
          </span>
        </Link>
        <nav
          id="primary-navigation"
          className={`ml-auto flex items-center max-[800px]:absolute max-[800px]:left-0 max-[800px]:right-0 max-[800px]:top-[calc(100%+8px)] max-[800px]:z-50 max-[800px]:origin-top max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-1 max-[800px]:rounded-2xl max-[800px]:border max-[800px]:border-white/60 max-[800px]:bg-[rgba(252,251,252,0.92)] max-[800px]:p-2 max-[800px]:shadow-[0_22px_48px_rgba(53,5,73,0.18)] max-[800px]:backdrop-blur-2xl max-[800px]:transition max-[800px]:duration-200 ${
            mobileMenuOpen
              ? "max-[800px]:visible max-[800px]:translate-y-0 max-[800px]:scale-100 max-[800px]:opacity-100"
              : "max-[800px]:invisible max-[800px]:-translate-y-2 max-[800px]:scale-[0.98] max-[800px]:opacity-0"
          }`}
          aria-label="Primary navigation"
        >
          {visibleNavItems.map((item) => {
            const active = item.match.some((match) =>
              pathname.startsWith(match),
            );
            return (
              <Link
                key={item.key}
                href={item.href}
                className="relative whitespace-nowrap px-[13px] py-2.5 font-sans text-sm font-semibold text-[var(--color-deep-plum)] transition duration-200 hover:-translate-y-0.5 hover:text-[var(--color-hot-magenta)] max-[800px]:rounded-xl max-[800px]:px-4 max-[800px]:py-3 max-[800px]:hover:translate-y-0 max-[800px]:hover:bg-white/70"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0.5 left-[13px] right-[13px] h-0.5 rounded-full bg-[var(--color-hot-magenta)] max-[800px]:bottom-2 max-[800px]:left-4 max-[800px]:right-auto max-[800px]:w-8" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-none items-center gap-3">
          {!authed ? (
            <Link
              href="/signin"
              className="whitespace-nowrap font-sans text-sm font-semibold text-[var(--color-deep-plum)] transition-colors duration-150 hover:text-[var(--color-hot-magenta)] max-[380px]:hidden"
            >
              Sign in
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSignOut}
                className="whitespace-nowrap font-sans text-sm font-semibold text-[var(--color-plum-copy)] transition-colors duration-150 hover:text-[var(--color-hot-magenta)] max-[640px]:hidden"
              >
                Sign out
              </button>
              <Link
                href="/dashboard"
                title="My library"
                className="flex items-center gap-2 rounded-full border border-[rgba(53,5,73,0.08)] bg-[var(--color-brand-surface)] p-1 pr-3.5 max-[640px]:pr-1"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-[var(--color-cool-teal)] font-sans text-[13px] font-bold text-[var(--color-deep-plum)]">
                  {(user?.name || user?.email || "Reader")
                    .slice(0, 1)
                    .toUpperCase()}
                </span>
                <span className="font-sans text-[13px] font-semibold text-[var(--color-deep-plum)] max-[640px]:sr-only">
                  My library
                </span>
              </Link>
            </>
          )}
          <button
            type="button"
            className="hidden size-10 items-center justify-center rounded-full border border-transparent text-[var(--color-deep-plum)] transition hover:border-white/70 hover:bg-white/70 max-[800px]:flex"
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
