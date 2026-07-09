"use client";

import Link from "next/link";
import { BookCover } from "@/components/ui";
import { popular, threads, COCOA } from "@/lib/data";

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 40px 64px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(270px,320px)",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0 }}>
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
            Your shelf · Tuesday
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(38px,4vw,52px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "var(--fg-strong)",
              margin: "0 0 10px",
            }}
          >
            Happy reading, Maya
          </h1>
          <p style={{ fontSize: 15, color: "var(--fg-2)", margin: "0 0 32px" }}>
            You&apos;re a chapter behind on{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
              Forty-Nothing
            </em>{" "}
            — and Chapter 11 just dropped.
          </p>

          <div
            style={{
              background: "var(--bg-3)",
              borderRadius: 26,
              padding: 28,
              display: "flex",
              gap: 24,
              alignItems: "center",
              marginBottom: 44,
            }}
          >
            <Link href="/serial" style={{ flex: "none" }}>
              <BookCover
                title="Forty-Nothing"
                gradient={COCOA}
                width={104}
                height={152}
                titleSize={16}
                authorSize={8}
                padding="12px 10px"
                style={{ cursor: "pointer" }}
              />
            </Link>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--bg-inverse)",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Continue reading
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 24,
                  color: "var(--bg-inverse)",
                  margin: "0 0 12px",
                }}
              >
                Chapter 11 — &ldquo;Undone&rdquo;
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                  maxWidth: 340,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(31,42,56,0.14)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "38%",
                      height: "100%",
                      borderRadius: 999,
                      background: "var(--accent)",
                    }}
                  />
                </div>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "rgba(31,42,56,0.65)",
                  }}
                >
                  38% · 12 min left
                </span>
              </div>
              <Link
                href="/serial"
                className="nf-btn-primary"
                style={{
                  display: "inline-block",
                  background: "var(--bg-inverse)",
                  color: "var(--fg-on-dark)",
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Pick up where you left off ↗
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: "-0.02em",
                color: "var(--fg-strong)",
                margin: 0,
              }}
            >
              Your library
            </h2>
            <Link
              href="/read"
              className="nf-link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--fg-2)",
              }}
            >
              Browse all
            </Link>
          </div>
          <div
            className="nf-row"
            style={{
              display: "flex",
              gap: 18,
              overflowX: "auto",
              paddingBottom: 12,
              marginBottom: 44,
            }}
          >
            {popular.map((b) => (
              <div key={b.title} style={{ flex: "none", width: 120 }}>
                <BookCover
                  title={b.title}
                  gradient={b.gradient}
                  width={120}
                  height={176}
                  titleSize={15}
                  authorSize={8}
                  padding="12px 10px"
                />
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    lineHeight: 1.25,
                  }}
                >
                  {b.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{b.meta}</div>
              </div>
            ))}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "-0.02em",
              color: "var(--fg-strong)",
              margin: "0 0 18px",
            }}
          >
            From the Circle
          </h2>
          <div
            style={{
              background: "var(--surface-card)",
              borderRadius: 18,
              boxShadow: "var(--shadow-xs)",
              overflow: "hidden",
            }}
          >
            {threads.map((t) => (
              <Link
                key={t.title}
                href="/community"
                className="nf-thread"
                style={{
                  cursor: "pointer",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderTop: "1px solid var(--border-1)",
                }}
              >
                <div
                  style={{
                    flex: "none",
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: t.avatarColor,
                    color: "var(--st-soft-cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {t.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      fontWeight: 700,
                    }}
                  >
                    {t.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 15,
                      lineHeight: 1.3,
                      color: "var(--fg-strong)",
                      margin: "4px 0 0",
                    }}
                  >
                    {t.title}
                  </h3>
                </div>
                <span
                  style={{
                    flex: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--fg-3)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {t.count}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <aside
          style={{
            position: "sticky",
            top: 90,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ background: "var(--bg-inverse)", borderRadius: 24, padding: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: "var(--st-warm-tan)",
                  color: "var(--st-soft-cream)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                M
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--st-soft-cream)",
                  }}
                >
                  Maya Okafor
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    fontWeight: 700,
                    marginTop: 2,
                  }}
                >
                  Inner Circle member
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderTop: "1px solid rgba(228,216,215,0.14)",
                paddingTop: 16,
                marginBottom: 18,
              }}
            >
              {[
                { label: "Books finished", value: "14" },
                { label: "Reading streak", value: "9 weeks" },
                { label: "Member since", value: "2024" },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "rgba(228,216,215,0.6)" }}>{row.label}</span>
                  <span style={{ color: "var(--st-soft-cream)", fontWeight: 600 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/membership"
              className="nf-manage-btn"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                background: "rgba(247,198,188,0.14)",
                color: "var(--st-soft-cream)",
                padding: 11,
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                transition: "background 140ms ease",
              }}
            >
              Manage membership
            </Link>
          </div>

          <div style={{ background: "var(--surface-card)", borderRadius: 24, padding: 24 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--fg-strong)",
                margin: "0 0 16px",
              }}
            >
              Next up
            </h3>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  flex: "none",
                  width: 54,
                  textAlign: "center",
                  background: "var(--bg-3)",
                  borderRadius: 12,
                  padding: "10px 0",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  MAR
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "var(--fg-strong)",
                    lineHeight: 1,
                    marginTop: 2,
                  }}
                >
                  02
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    lineHeight: 1.3,
                  }}
                >
                  Forty-Nothing, read live
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 3 }}>
                  Online · Reader Circle
                </div>
              </div>
            </div>
            <Link
              href="/events"
              className="nf-link"
              style={{
                display: "inline-block",
                marginTop: 16,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--fg-2)",
              }}
            >
              All events
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
