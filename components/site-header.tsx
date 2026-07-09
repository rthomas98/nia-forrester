"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/data";
import { useAuth } from "@/components/auth-context";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { authed, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <header
      className={scrolled ? "nf-header nf-header-scrolled" : "nf-header"}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(228,216,215,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border-1)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 8, padding: 0 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: "var(--accent)",
              display: "inline-block",
              transform: "translateY(-1px)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "-0.02em",
              color: "var(--fg-strong)",
            }}
          >
            Nia Forrester
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 2, flex: 1, alignItems: "center" }}>
          {navItems.map((item) => {
            const active = item.match.some((m) => pathname.startsWith(m));
            return (
              <Link
                key={item.key}
                href={item.href}
                className="nf-link"
                style={{
                  whiteSpace: "nowrap",
                  position: "relative",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--fg-strong)",
                  padding: "10px 13px",
                }}
              >
                {item.label}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 13,
                      right: 13,
                      bottom: 2,
                      height: 2,
                      borderRadius: 999,
                      background: "var(--accent)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!authed ? (
            <>
              <Link
                href="/signin"
                className="nf-link"
                style={{
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--fg-strong)",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/membership"
                className="nf-btn-primary"
                style={{
                  whiteSpace: "nowrap",
                  background: "var(--accent)",
                  color: "var(--fg-on-accent)",
                  padding: "11px 20px",
                  borderRadius: 999,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Join the Circle
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleSignOut}
                className="nf-link"
                style={{
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--fg-2)",
                }}
              >
                Sign out
              </button>
              <Link
                href="/dashboard"
                title="My library"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-1)",
                  borderRadius: 999,
                  padding: "4px 14px 4px 4px",
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    background: "var(--st-warm-tan)",
                    color: "var(--st-soft-cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  M
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--fg-strong)",
                  }}
                >
                  My library
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
