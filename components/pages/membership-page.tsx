"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  tiers,
  tierPrice,
  compareGroups,
  compareTiers,
  memberVoices,
  faqs,
} from "@/lib/data";

const toggleBase: CSSProperties = {
  padding: "9px 22px",
  borderRadius: 999,
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontSize: 14,
  transition: "all var(--dur-base) var(--ease-editorial)",
};

const activeToggle: CSSProperties = {
  background: "var(--bg-inverse)",
  color: "var(--fg-on-dark)",
  boxShadow: "var(--shadow-sm)",
};

const inactiveToggle: CSSProperties = {
  background: "transparent",
  color: "var(--fg-2)",
};

export default function MembershipPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 40px 64px" }}>
      <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 44px" }}>
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
          One login · one subscription
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(40px,5vw,60px)",
            letterSpacing: "-0.03em",
            color: "var(--fg-strong)",
            margin: "0 0 16px",
            lineHeight: 1.02,
          }}
        >
          Find your seat in the Circle
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--fg-2)", margin: 0 }}>
          From free reader to working writer. Every tier includes everything below it — upgrade or
          cancel any time.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "var(--surface-card)",
            borderRadius: 999,
            padding: 5,
            marginTop: 28,
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <button
            onClick={() => setAnnual(false)}
            style={{ ...toggleBase, ...(!annual ? activeToggle : inactiveToggle) }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              ...toggleBase,
              display: "flex",
              alignItems: "center",
              gap: 8,
              ...(annual ? activeToggle : inactiveToggle),
            }}
          >
            Annual{" "}
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--accent)",
                background: "var(--accent-soft)",
                padding: "2px 7px",
                borderRadius: 999,
              }}
            >
              2 months free
            </span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        {tiers.map((t) => {
          const { price, per, note } = tierPrice(t.monthly, annual);
          return (
            <div
              key={t.name}
              style={{
                background: t.bg,
                borderRadius: 26,
                padding: "30px 26px",
                boxShadow: t.shadow,
                border: t.border,
                display: "flex",
                flexDirection: "column",
                minHeight: 520,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.04em",
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
              <div style={{ display: "flex", alignItems: "baseline", gap: 5, margin: "14px 0 4px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 44,
                    letterSpacing: "-0.03em",
                    color: t.priceColor,
                  }}
                >
                  {price}
                </span>
                <span style={{ fontSize: 14, color: t.perColor }}>{per}</span>
              </div>
              {note && (
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    minHeight: 14,
                  }}
                >
                  {note}
                </div>
              )}
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: t.descColor,
                  margin: "8px 0 22px",
                  minHeight: 44,
                }}
              >
                {t.desc}
              </p>
              <Link
                href={`/signup?tier=${encodeURIComponent(t.name)}`}
                className="nf-btn-primary"
                style={{
                  background: t.ctaBg,
                  color: t.ctaColor,
                  padding: 13,
                  borderRadius: 999,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  width: "100%",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                {t.cta}
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {t.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flex: "none", marginTop: 3, color: t.check }}
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span style={{ fontSize: 13, lineHeight: 1.5, color: t.featColor }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p
        style={{
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: 13,
          color: "var(--fg-3)",
          margin: "32px 0 0",
        }}
      >
        Free forever on the base tier · cancel in one click · readers keep access to everything
        they&apos;ve unlocked
      </p>

      {/* COMPARISON TABLE */}
      <section style={{ marginTop: 96 }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px" }}>
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
            Compare every tier
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
            Everything, side by side
          </h2>
        </div>
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: 28,
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.7fr) repeat(4,1fr)",
              alignItems: "end",
              padding: "26px 30px 20px",
            }}
          >
            <div></div>
            {compareTiers.map((ct) => (
              <div key={ct.name} style={{ textAlign: "center" }}>
                {ct.highlight ? (
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 14,
                      letterSpacing: "0.02em",
                      color: "var(--fg-on-accent)",
                      background: "var(--accent)",
                      padding: "5px 14px",
                      borderRadius: 999,
                    }}
                  >
                    {ct.name}
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 14,
                      letterSpacing: "0.02em",
                      color: "var(--fg-strong)",
                    }}
                  >
                    {ct.name}
                  </span>
                )}
              </div>
            ))}
          </div>
          {compareGroups.map((g) => (
            <div key={g.group}>
              <div
                style={{
                  padding: "18px 30px 8px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  background: "rgba(31,42,56,0.025)",
                }}
              >
                {g.group}
              </div>
              {g.rows.map((r) => (
                <div
                  key={r.feat}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1.7fr) repeat(4,1fr)",
                    alignItems: "center",
                    padding: "13px 30px",
                    borderTop: "1px solid var(--border-1)",
                  }}
                >
                  <div style={{ fontSize: 14, color: "var(--fg-1)", fontWeight: 500 }}>
                    {r.feat}
                  </div>
                  {r.cells.map((c, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      {"yes" in c && (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ color: "var(--accent)", verticalAlign: "middle" }}
                        >
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      )}
                      {"no" in c && (
                        <span style={{ color: "var(--fg-4)", fontSize: 16 }}>—</span>
                      )}
                      {"text" in c && (
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.02em",
                            color: "var(--feature)",
                          }}
                        >
                          {c.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* MEMBER VOICES */}
      <section style={{ marginTop: 96 }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px" }}>
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
            From the Circle
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
            What members say
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {memberVoices.map((m) => (
            <article
              key={m.name}
              style={{
                borderTop: "2px solid var(--border-rule)",
                padding: "26px 6px 0",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 52,
                  color: "var(--accent)",
                  lineHeight: 0.5,
                  height: 22,
                }}
              >
                &ldquo;
              </div>
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
                {m.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    flex: "none",
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: m.avBg,
                    color: m.avColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 17,
                  }}
                >
                  {m.initial}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--fg-strong)",
                    }}
                  >
                    {m.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                      fontWeight: 600,
                    }}
                  >
                    {m.role}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* GIFT A MEMBERSHIP */}
      <section
        style={{
          marginTop: 96,
          background: "var(--bg-inverse)",
          borderRadius: 36,
          padding: "clamp(40px,5vw,64px)",
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
            Gift a membership
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
              maxWidth: "14ch",
            }}
          >
            Give someone a year in the Circle
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "rgba(228,216,215,0.8)",
              margin: "0 0 28px",
              maxWidth: "46ch",
            }}
          >
            For the reader who has every book on her shelf and still wants more — twelve months of
            serials, bonus chapters, and the book club, wrapped and ready to send.
          </p>
          <button
            className="nf-btn-primary"
            style={{
              background: "var(--accent)",
              color: "var(--fg-on-accent)",
              padding: "15px 28px",
              borderRadius: 999,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Gift a membership ↗
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 300,
              background: "linear-gradient(155deg,var(--depth) 0%,#3c2117 100%)",
              borderRadius: 20,
              padding: 30,
              boxShadow: "var(--shadow-lg)",
              transform: "rotate(-2deg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 36,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--st-light-blush)",
                }}
              >
                Stiletto Press
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 20,
                  color: "var(--st-soft-cream)",
                }}
              >
                SP
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 26,
                color: "var(--st-soft-cream)",
                lineHeight: 1.1,
                marginBottom: 6,
              }}
            >
              The Reader Circle
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(244,227,215,0.7)",
                fontWeight: 600,
                marginBottom: 28,
              }}
            >
              12-month gift membership
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 32,
                  color: "var(--accent)",
                  letterSpacing: "-0.02em",
                }}
              >
                $70
              </span>
              <span style={{ fontSize: 13, color: "rgba(244,227,215,0.65)" }}>
                / year · sent by email
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{ marginTop: 96, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
            Good to know
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
            Questions, answered
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={f.q}
                style={{
                  background: "var(--surface-card)",
                  borderRadius: 18,
                  boxShadow: "var(--shadow-xs)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "20px 26px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 16,
                      color: "var(--fg-strong)",
                    }}
                  >
                    {f.q}
                  </span>
                  <span
                    style={{
                      flex: "none",
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: 24,
                      color: "var(--accent)",
                      lineHeight: 1,
                      width: 22,
                      textAlign: "center",
                    }}
                  >
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 26px 22px",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "var(--fg-2)",
                      maxWidth: "64ch",
                    }}
                  >
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "var(--fg-3)" }}
        >
          Still wondering?{" "}
          <span
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
            }}
          >
            Email the Circle ↗
          </span>
        </div>
      </section>

      <div style={{ marginTop: 56 }}></div>
    </main>
  );
}
