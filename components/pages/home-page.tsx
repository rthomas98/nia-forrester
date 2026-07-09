"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { popular, reactions, tiers, tierPrice } from "@/lib/data";
import { ImageSlot } from "@/components/ui";

export default function HomePage() {
  const [homeEmail, setHomeEmail] = useState("");
  const [homeSubscribed, setHomeSubscribed] = useState(false);
  // The hero photo is optional (drop one into /public/images/nia-hero.jpg).
  // Preload it client-side so a missing file never flashes broken-image alt text.
  const [heroImgOk, setHeroImgOk] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setHeroImgOk(true);
    img.src = "/images/nia-hero.jpg";
  }, []);

  return (
    <main>
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "28px 40px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1.02fr",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "grid", gridTemplateRows: "1fr auto", gap: 16, minWidth: 0 }}>
          <div
            style={{
              background: "var(--bg-3)",
              borderRadius: 28,
              padding: "44px 44px 38px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 40,
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(38px,3.9vw,54px)",
                lineHeight: 1.06,
                letterSpacing: "-0.015em",
                textTransform: "uppercase",
                color: "var(--fg-strong)",
                margin: 0,
              }}
            >
              Every story
              <svg
                width="88"
                height="20"
                viewBox="0 0 88 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ verticalAlign: "baseline", marginLeft: 20 }}
              >
                <path d="M2 10h78"></path>
                <path d="M72 3l8 7-8 7"></path>
              </svg>
              <br />
              finally in
              <br />
              one place
            </h1>
            <div>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "rgba(31,42,56,0.78)",
                  maxWidth: "44ch",
                  margin: "0 0 16px",
                }}
              >
                The serials, the backlist, the essays, the community, the events — and the writing
                studio. No more link-in-bio maze. Just Nia, and the people who read her.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(31,42,56,0.65)",
                }}
              >
                <span>46 books</span>
                <span
                  style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(31,42,56,0.4)" }}
                ></span>
                <span>11 series</span>
                <span
                  style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(31,42,56,0.4)" }}
                ></span>
                <span>New chapters weekly</span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Link
              href="/serial"
              className="nf-card-hover"
              style={{
                cursor: "pointer",
                position: "relative",
                borderRadius: 28,
                overflow: "hidden",
                height: 216,
                background: "linear-gradient(160deg,#6B3E2E 0%,#2a1810 100%)",
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 30,
                  lineHeight: 1.05,
                  color: "var(--st-soft-cream)",
                  maxWidth: "8ch",
                }}
              >
                Forty-Nothing
              </div>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 19,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "var(--st-soft-cream)",
                  }}
                >
                  #TheSerial
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  Ch. 11 live
                </span>
              </div>
            </Link>
            <Link
              href="/read"
              className="nf-card-hover"
              style={{
                cursor: "pointer",
                position: "relative",
                borderRadius: 28,
                overflow: "hidden",
                height: 216,
                background: "linear-gradient(160deg,#2A3A4D 0%,#0d141d 100%)",
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 30,
                  lineHeight: 1.05,
                  color: "var(--st-soft-cream)",
                  maxWidth: "9ch",
                }}
              >
                46 books deep
              </div>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 19,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "var(--st-soft-cream)",
                  }}
                >
                  #TheBacklist
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--st-light-blush)",
                  }}
                >
                  11 series
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            minHeight: 560,
          }}
        >
          <ImageSlot label="Portrait of Nia" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          {heroImgOk && (
            <img
              src="/images/nia-hero.jpg"
              alt="Nia Forrester"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 22%",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 22,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              zIndex: 2,
              flexWrap: "wrap",
              padding: "0 20px",
            }}
          >
            <Link
              href="/serial"
              className="nf-hero-pill"
              style={{
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(228,216,215,0.94)",
                color: "var(--fg-strong)",
                padding: "8px 8px 8px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                boxShadow: "var(--shadow-sm)",
                transition: "transform var(--dur-base) var(--ease-editorial)",
              }}
            >
              Read the latest chapter
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  background: "var(--accent)",
                  color: "var(--fg-on-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                ↗
              </span>
            </Link>
            <Link
              href="/membership"
              className="nf-hero-ghost"
              style={{
                whiteSpace: "nowrap",
                background: "rgba(31,42,56,0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "var(--st-soft-cream)",
                border: "1px solid rgba(228,216,215,0.55)",
                padding: "8px 24px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                transition: "background var(--dur-fast) var(--ease-out)",
              }}
            >
              See membership
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 40px" }}>
        <div
          style={{
            background: "var(--bg-3)",
            borderRadius: 36,
            padding: "44px 52px",
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--bg-inverse)",
              }}
            >
              Now serializing · She Who Writes Herself
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 48,
                lineHeight: 1.02,
                color: "var(--bg-inverse)",
                margin: "14px 0 14px",
              }}
            >
              Forty-Nothing
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(31,42,56,0.78)",
                margin: "0 0 24px",
                maxWidth: 460,
              }}
            >
              Six years of silence. One doorbell. And all that carefully constructed composure about
              to come undone. Chapter 11 is live — and the comments have become part of the book.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <Link
                href="/serial"
                style={{
                  background: "var(--bg-inverse)",
                  color: "var(--fg-on-dark)",
                  padding: "13px 22px",
                  borderRadius: 999,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Start reading ↗
              </Link>
              <span
                style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "rgba(31,42,56,0.7)" }}
              >
                11 chapters · ~6 min each · updated weekly
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/serial"
              className="nf-cover-hover"
              style={{
                cursor: "pointer",
                width: 236,
                height: 344,
                borderRadius: 2,
                boxShadow: "var(--shadow-book)",
                background: "linear-gradient(160deg,#6B3E2E 0%,#2a1810 100%)",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transform: "rotate(-3deg)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(244,227,215,0.78)",
                  fontWeight: 700,
                }}
              >
                Nia Forrester
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: 34,
                    color: "var(--st-soft-cream)",
                    lineHeight: 1.04,
                  }}
                >
                  Forty-
                  <br />
                  Nothing
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    fontWeight: 700,
                  }}
                >
                  Chapter 11
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, margin: "0 0 28px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: "-0.02em",
              color: "var(--fg-strong)",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Four ways in
          </h2>
          <span
            style={{ flex: 1, height: 1, background: "var(--border-1)", transform: "translateY(-7px)" }}
          ></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          <Link
            href="/read"
            className="nf-card-hover"
            style={{
              textAlign: "left",
              background: "var(--surface-card)",
              borderRadius: 28,
              padding: 28,
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              minHeight: 230,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent)",
                fontWeight: 700,
              }}
            >
              Read
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.02em",
                color: "var(--fg-strong)",
                margin: "12px 0 8px",
              }}
            >
              Books, serials &amp; essays
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0, flex: 1 }}>
              46 books across 11 series, the live serial, and the column.
            </p>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--fg-strong)",
                marginTop: 16,
              }}
            >
              Browse the library ↗
            </span>
          </Link>
          <Link
            href="/community"
            className="nf-card-hover"
            style={{
              textAlign: "left",
              background: "var(--depth)",
              borderRadius: 28,
              padding: 28,
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              minHeight: 230,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--st-light-blush)",
                fontWeight: 700,
              }}
            >
              Connect
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.02em",
                color: "var(--st-soft-cream)",
                margin: "12px 0 8px",
              }}
            >
              The Reader Circle
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "rgba(228,216,215,0.78)",
                margin: 0,
                flex: 1,
              }}
            >
              Discussions, book clubs, character debates — a private home for Black women&apos;s
              fiction.
            </p>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--st-soft-cream)",
                marginTop: 16,
              }}
            >
              Step inside ↗
            </span>
          </Link>
          <Link
            href="/events"
            className="nf-card-hover"
            style={{
              textAlign: "left",
              background: "var(--bg-3)",
              borderRadius: 28,
              padding: 28,
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              minHeight: 230,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--strong)",
                fontWeight: 700,
              }}
            >
              Gather
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.02em",
                color: "var(--fg-strong)",
                margin: "12px 0 8px",
              }}
            >
              Events &amp; readings
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0, flex: 1 }}>
              Festival appearances, live readings, workshops and retreats.
            </p>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--fg-strong)",
                marginTop: 16,
              }}
            >
              See what&apos;s coming ↗
            </span>
          </Link>
          <Link
            href="/academy"
            className="nf-card-hover"
            style={{
              textAlign: "left",
              background: "var(--surface-card)",
              borderRadius: 28,
              padding: 28,
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              minHeight: 230,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--feature)",
                fontWeight: 700,
              }}
            >
              Learn
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.02em",
                color: "var(--fg-strong)",
                margin: "12px 0 8px",
              }}
            >
              The Writing Studio
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0, flex: 1 }}>
              Critique, editing, coaching — and courses on the way.
            </p>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--fg-strong)",
                marginTop: 16,
              }}
            >
              Work with Nia ↗
            </span>
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 40px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 26,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              Reader favorites
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: "-0.025em",
                color: "var(--fg-strong)",
                margin: "10px 0 0",
              }}
            >
              Where readers start
            </h2>
          </div>
          <Link
            href="/read"
            className="nf-link"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--fg-2)",
            }}
          >
            Browse the library
          </Link>
        </div>
        <div className="nf-row" style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 14 }}>
          {popular.map((b) => (
            <div key={b.title} style={{ flex: "none", width: 152 }}>
              <Link
                href="/read"
                className="nf-cover-hover"
                style={{
                  cursor: "pointer",
                  width: 152,
                  height: 224,
                  borderRadius: 2,
                  boxShadow: "var(--shadow-book)",
                  background: b.gradient,
                  padding: "16px 13px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(244,227,215,0.8)",
                    fontWeight: 600,
                  }}
                >
                  Nia Forrester
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: 19,
                    lineHeight: 1.05,
                    color: "var(--st-soft-cream)",
                  }}
                >
                  {b.title}
                </div>
              </Link>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--fg-1)",
                  lineHeight: 1.25,
                }}
              >
                {b.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{b.meta}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ background: "var(--bg-2)", marginTop: 32 }}>
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: "-0.025em",
                color: "var(--fg-strong)",
                margin: 0,
              }}
            >
              What&apos;s new this week
            </h2>
            <Link
              href="/read"
              className="nf-link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                color: "var(--fg-2)",
              }}
            >
              All updates
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            <Link
              href="/serial"
              className="nf-card-hover"
              style={{
                cursor: "pointer",
                display: "block",
                background: "var(--surface-card)",
                borderRadius: 24,
                padding: 26,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                New chapter
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 24,
                  color: "var(--fg-strong)",
                  margin: "12px 0 8px",
                }}
              >
                Forty-Nothing, Ch. 11 — &quot;Undone&quot;
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0 }}>
                Norah thought she was ready. She was not.
              </p>
            </Link>
            <Link
              href="/read"
              className="nf-card-hover"
              style={{
                cursor: "pointer",
                display: "block",
                background: "var(--surface-card)",
                borderRadius: 24,
                padding: 26,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--soft)",
                  fontWeight: 700,
                }}
              >
                Essay
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "-0.01em",
                  color: "var(--fg-strong)",
                  margin: "12px 0 8px",
                }}
              >
                Is the &quot;Magic Negro&quot; hiding in your favorite IR romance?
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0 }}>
                The trope nobody wants to name.
              </p>
            </Link>
            <Link
              href="/events"
              className="nf-card-hover"
              style={{
                cursor: "pointer",
                display: "block",
                background: "var(--bg-inverse)",
                borderRadius: 24,
                padding: 26,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--st-light-blush)",
                  fontWeight: 700,
                }}
              >
                Upcoming
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "-0.01em",
                  color: "var(--st-soft-cream)",
                  margin: "12px 0 8px",
                }}
              >
                Forty-Nothing, read live
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(228,216,215,0.78)", margin: 0 }}>
                March 2 · Online · Reader Circle
              </p>
            </Link>
          </div>
        </section>
      </div>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 40px" }}>
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: 36,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            alignItems: "stretch",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <img
            src="/images/nia-hero.jpg"
            alt="Nia Forrester seated on a porch swing"
            style={{
              width: "100%",
              height: "100%",
              minHeight: 440,
              objectFit: "cover",
              objectPosition: "62% 20%",
              background: "var(--bg-3)",
            }}
          />
          <div
            style={{
              padding: "52px 56px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 14,
              }}
            >
              Meet the author
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(36px,4vw,52px)",
                letterSpacing: "-0.03em",
                color: "var(--fg-strong)",
                margin: "0 0 18px",
                lineHeight: 1.0,
              }}
            >
              Nia Forrester
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: "var(--fg-2)",
                margin: "0 0 16px",
                maxWidth: "52ch",
              }}
            >
              By day, a public-policy attorney in Philadelphia. By night, she writes woman-centered
              fiction about love, race, and the interior lives of Black women — forty-six books,
              eleven series, and a serial that updates every week.
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 20,
                lineHeight: 1.45,
                color: "var(--depth)",
                margin: "0 0 28px",
                maxWidth: "44ch",
              }}
            >
              &ldquo;I write the women I know — difficult, tender, and fully grown.&rdquo;
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <Link
                href="/read"
                className="nf-btn-primary"
                style={{
                  background: "var(--accent)",
                  color: "var(--fg-on-accent)",
                  padding: "13px 24px",
                  borderRadius: 999,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Read her work ↗
              </Link>
              <Link
                href="/community"
                className="nf-btn-ghost"
                style={{
                  background: "transparent",
                  color: "var(--fg-strong)",
                  border: "1px solid var(--border-2)",
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Join the conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 40px 8px" }}>
        <div
          style={{
            background: "var(--bg-inverse)",
            borderRadius: 36,
            padding: "52px 56px",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 0,
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--st-soft-cream)",
              margin: 0,
              paddingRight: 48,
            }}
          >
            A backlist deep enough to live in.
          </h3>
          <div style={{ borderLeft: "1px solid rgba(228,216,215,0.16)", paddingLeft: 36 }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 54,
                color: "var(--st-soft-cream)",
                lineHeight: 1,
              }}
            >
              46
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(228,216,215,0.6)",
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              Books
            </div>
          </div>
          <div style={{ borderLeft: "1px solid rgba(228,216,215,0.16)", paddingLeft: 36 }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 54,
                color: "var(--st-soft-cream)",
                lineHeight: 1,
              }}
            >
              11
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(228,216,215,0.6)",
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              Series
            </div>
          </div>
          <div style={{ borderLeft: "1px solid rgba(228,216,215,0.16)", paddingLeft: 36 }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 54,
                color: "var(--st-soft-cream)",
                lineHeight: 1,
              }}
            >
              1,200+
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(228,216,215,0.6)",
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              Readers
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 40px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 36px" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            Loved by readers
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(30px,3.4vw,40px)",
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: 0,
              lineHeight: 1.06,
            }}
          >
            The margins are half the fun
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {reactions.map((r) => (
            <article
              key={r.name}
              style={{
                borderTop: "2px solid var(--border-rule)",
                padding: "26px 6px 0",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 19,
                  lineHeight: 1.55,
                  color: "var(--fg-1)",
                  margin: 0,
                  flex: 1,
                }}
              >
                &ldquo;{r.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    flex: "none",
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    background: r.color,
                    color: "var(--st-soft-cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {r.initials}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--fg-strong)",
                  }}
                >
                  {r.name}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              Pick your seat
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: "-0.025em",
                color: "var(--fg-strong)",
                margin: "10px 0 0",
              }}
            >
              Join the Reader Circle
            </h2>
          </div>
          <Link
            href="/membership"
            className="nf-link"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--fg-2)",
            }}
          >
            Compare all plans
          </Link>
        </div>
        <p style={{ fontSize: 16, color: "var(--fg-2)", maxWidth: 560, margin: "14px 0 28px" }}>
          Free gets you the newsletter and the blog. A few dollars a month gets you the serials, the
          early chapters, and a seat at the table.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {tiers.map((t) => {
            const p = tierPrice(t.monthly, false);
            return (
              <div
                key={t.name}
                className="nf-card-hover"
                style={{
                  background: t.bg,
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  border: t.border,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: t.label,
                    }}
                  >
                    {t.name}
                  </div>
                  {t.featured && (
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--fg-on-accent)",
                        background: "var(--accent)",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "16px 0 4px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 38,
                      letterSpacing: "-0.03em",
                      color: t.priceColor,
                    }}
                  >
                    {p.price}
                  </span>
                  <span style={{ fontSize: 13, color: t.perColor }}>{p.per}</span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: t.descColor,
                    margin: "6px 0 16px",
                    minHeight: 38,
                  }}
                >
                  {t.desc}
                </p>
                <Link
                  href="/membership"
                  style={{
                    background: t.ctaBg,
                    color: t.ctaColor,
                    padding: 12,
                    borderRadius: 999,
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 13,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {t.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 40px 64px" }}>
        <div
          style={{
            background: "var(--bg-inverse)",
            borderRadius: 36,
            padding: "clamp(40px,5vw,60px)",
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 16,
              }}
            >
              The weekly letter
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(30px,3.6vw,44px)",
                letterSpacing: "-0.03em",
                color: "var(--st-soft-cream)",
                margin: "0 0 14px",
                lineHeight: 1.04,
                maxWidth: "16ch",
              }}
            >
              She Who Writes Herself, in your inbox
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "rgba(228,216,215,0.8)",
                margin: 0,
                maxWidth: "48ch",
              }}
            >
              New chapters, essays on craft and culture, and book news — one considered email a week.
              No noise, no spam, unsubscribe any time.
            </p>
          </div>
          <div>
            {!homeSubscribed ? (
              <>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <input
                    className="nf-news-input"
                    type="email"
                    placeholder="Email address"
                    value={homeEmail}
                    onChange={(e) => setHomeEmail(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 200,
                      border: "1px solid rgba(228,216,215,0.16)",
                      background: "rgba(247,198,188,0.1)",
                      borderRadius: 999,
                      padding: "14px 22px",
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      color: "var(--st-soft-cream)",
                    }}
                  />
                  <button
                    onClick={() => setHomeSubscribed(true)}
                    className="nf-btn-primary"
                    style={{
                      flex: "none",
                      background: "var(--accent)",
                      color: "var(--fg-on-accent)",
                      padding: "15px 28px",
                      borderRadius: 999,
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 15,
                    }}
                  >
                    Subscribe ↗
                  </button>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    color: "rgba(228,216,215,0.55)",
                    marginTop: 14,
                  }}
                >
                  Joining 1,200+ readers · free, always
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "rgba(247,198,188,0.1)",
                  borderRadius: 20,
                  padding: "22px 24px",
                }}
              >
                <span
                  style={{
                    flex: "none",
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: "var(--accent)",
                    color: "var(--fg-on-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 16,
                      color: "var(--st-soft-cream)",
                    }}
                  >
                    You&apos;re on the list.
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(228,216,215,0.7)", marginTop: 2 }}>
                    The next letter lands Sunday morning.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
