"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookCover } from "@/components/ui";
import {
  readingPaths,
  mostRead,
  essays,
  audiobooks,
  shortReads,
  series,
} from "@/lib/data";

const chips = [
  { key: "all", label: "All" },
  { key: "serials", label: "Serials" },
  { key: "essays", label: "Essays" },
  { key: "books", label: "Books" },
  { key: "shorts", label: "Short Reads" },
  { key: "audio", label: "Audiobooks" },
] as const;

export default function ReadPage() {
  const router = useRouter();
  const [readFilter, setReadFilter] = useState<string>("all");

  const showSerial = readFilter === "all" || readFilter === "serials";
  const showStart = readFilter === "all" || readFilter === "books";
  const showMost = readFilter === "all" || readFilter === "books";
  const showBacklist = readFilter === "all" || readFilter === "books";
  const showEssays = readFilter === "all" || readFilter === "essays";
  const showAudio = readFilter === "all" || readFilter === "audio";
  const showShorts = readFilter === "all" || readFilter === "shorts";

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 40px" }}>
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
        The Library
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: "-0.03em",
          color: "var(--fg-strong)",
          margin: "0 0 12px",
        }}
      >
        Read
      </h1>
      <p
        style={{
          fontSize: 18,
          color: "var(--fg-2)",
          maxWidth: 600,
          margin: "0 0 28px",
        }}
      >
        The serial, the essays, and the whole backlist — 46 books across 11
        series. Everything that used to live on Substack now starts here.
      </p>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >
        {chips.map((chip) => {
          const active = readFilter === chip.key;
          return (
            <button
              key={chip.key}
              onClick={() => setReadFilter(chip.key)}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                padding: "9px 16px",
                borderRadius: 999,
                transition: "all var(--dur-base) var(--ease-editorial)",
                background: active
                  ? "var(--bg-inverse)"
                  : "var(--surface-card)",
                color: active ? "var(--fg-on-dark)" : "var(--fg-strong)",
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {showSerial && (
        <div
          style={{
            background: "var(--bg-3)",
            borderRadius: 32,
            padding: 40,
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 36,
            alignItems: "center",
            marginBottom: 56,
          }}
        >
          <div
            onClick={() => router.push("/serial")}
            className="nf-cover-hover"
            style={{
              cursor: "pointer",
              width: 200,
              height: 292,
              borderRadius: 2,
              boxShadow: "var(--shadow-book)",
              background: "linear-gradient(160deg,#6B3E2E 0%,#2a1810 100%)",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(244,227,215,0.78)",
                fontWeight: 700,
              }}
            >
              Nia Forrester
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 30,
                color: "var(--st-soft-cream)",
                lineHeight: 1.04,
              }}
            >
              Forty-Nothing
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--bg-inverse)",
              }}
            >
              Current serial · Second-chance romance
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 36,
                color: "var(--bg-inverse)",
                margin: "10px 0 12px",
              }}
            >
              Forty-Nothing
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "rgba(31,42,56,0.78)",
                margin: "0 0 20px",
                maxWidth: 520,
              }}
            >
              A new chapter every week. Norah built a careful life after Luke
              walked out — until the doorbell rings six years later. Read it as
              it unfolds, and argue about it in the margins.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => router.push("/serial")}
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
                Open the reader ↗
              </button>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  color: "rgba(31,42,56,0.7)",
                }}
              >
                11 chapters live
              </span>
            </div>
          </div>
        </div>
      )}

      {showStart && (
        <>
          <div style={{ marginBottom: 22 }}>
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
              Not sure where to begin?
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: "-0.025em",
                color: "var(--fg-strong)",
                margin: "8px 0 0",
              }}
            >
              Start here
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 18,
              marginBottom: 56,
            }}
          >
            {readingPaths.map((p) => (
              <article
                key={p.title}
                onClick={() => router.push("/serial")}
                className="nf-card-hover"
                style={{
                  cursor: "pointer",
                  background: "var(--surface-card)",
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                }}
              >
                <BookCover
                  title={p.title}
                  gradient={p.gradient}
                  width={84}
                  height={124}
                  titleSize={13}
                  authorSize={7}
                  padding="10px 9px"
                  style={{ flex: "none" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: 6,
                    }}
                  >
                    {p.eyebrow}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 18,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                      color: "var(--fg-strong)",
                      margin: "0 0 6px",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "var(--fg-2)",
                      margin: "0 0 8px",
                    }}
                  >
                    {p.desc}
                  </p>
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
                    {p.meta}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {showMost && (
        <div
          style={{
            background: "var(--bg-2)",
            borderRadius: 32,
            padding: "36px 40px",
            marginBottom: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 24,
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
                Trending in the Circle
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: "-0.025em",
                  color: "var(--fg-strong)",
                  margin: "8px 0 0",
                }}
              >
                Most read this month
              </h2>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {mostRead.map((m) => (
              <div
                key={m.rank}
                onClick={() => router.push("/read")}
                className="nf-link"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "14px 0",
                  borderTop: "1px solid var(--border-1)",
                }}
              >
                <span
                  style={{
                    flex: "none",
                    width: 40,
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 24,
                    letterSpacing: "-0.02em",
                    color: "var(--fg-4)",
                  }}
                >
                  {m.rank}
                </span>
                <div
                  style={{
                    flex: "none",
                    width: 40,
                    height: 58,
                    borderRadius: 2,
                    boxShadow: "var(--shadow-xs)",
                    background: m.gradient,
                  }}
                ></div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 17,
                      letterSpacing: "-0.01em",
                      color: "var(--fg-strong)",
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 12,
                      letterSpacing: "0.04em",
                      color: "var(--fg-3)",
                      marginTop: 2,
                    }}
                  >
                    {m.meta}
                  </div>
                </div>
                <span
                  style={{
                    flex: "none",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--fg-2)",
                  }}
                >
                  Read
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEssays && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 22,
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
                She Who Writes Herself
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: "-0.025em",
                  color: "var(--fg-strong)",
                  margin: "8px 0 0",
                }}
              >
                Essays &amp; commentary
              </h2>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 18,
              marginBottom: 56,
            }}
          >
            {essays.map((e) => (
              <article
                key={e.title}
                className="nf-card-hover"
                style={{
                  cursor: "pointer",
                  background: "var(--surface-card)",
                  borderRadius: 22,
                  padding: 26,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      fontWeight: 700,
                    }}
                  >
                    {e.tag}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                    }}
                  >
                    {e.date}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    lineHeight: 1.18,
                    letterSpacing: "-0.015em",
                    color: "var(--fg-strong)",
                    margin: "0 0 10px",
                  }}
                >
                  {e.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--fg-2)",
                    margin: 0,
                  }}
                >
                  {e.excerpt}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      {showAudio && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 22,
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
                  color: "var(--feature)",
                }}
              >
                Listen
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: "-0.025em",
                  color: "var(--fg-strong)",
                  margin: "8px 0 0",
                }}
              >
                Audiobooks
              </h2>
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                color: "var(--fg-3)",
              }}
            >
              Narrated unabridged
            </span>
          </div>
          <div
            className="nf-row"
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              paddingBottom: 12,
              marginBottom: 56,
            }}
          >
            {audiobooks.map((a) => (
              <div key={a.title} style={{ flex: "none", width: 150 }}>
                <div
                  className="nf-cover-hover"
                  style={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    borderRadius: 14,
                    boxShadow: "var(--shadow-book)",
                    background: a.gradient,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 8,
                      letterSpacing: "0.12em",
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
                      fontSize: 18,
                      lineHeight: 1.05,
                      color: "var(--st-soft-cream)",
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: "rgba(244,227,215,0.92)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--bg-inverse)",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ marginLeft: 2 }}
                    >
                      <path d="M8 5.14v13.72L19 12z"></path>
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    lineHeight: 1.25,
                  }}
                >
                  {a.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--fg-3)",
                    marginTop: 2,
                  }}
                >
                  {a.narrator}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    color: "var(--fg-4)",
                    marginTop: 2,
                  }}
                >
                  {a.duration}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showShorts && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 22,
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
                  color: "var(--strong)",
                }}
              >
                An hour or less
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: "-0.025em",
                  color: "var(--fg-strong)",
                  margin: "8px 0 0",
                }}
              >
                Short Reads
              </h2>
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                color: "var(--fg-3)",
              }}
            >
              Novellas &amp; one-sitting stories
            </span>
          </div>
          <div
            className="nf-row"
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              paddingBottom: 12,
              marginBottom: 56,
            }}
          >
            {shortReads.map((b) => (
              <div key={b.title} style={{ flex: "none", width: 132 }}>
                <BookCover
                  title={b.title}
                  gradient={b.gradient}
                  width={132}
                  height={194}
                  titleSize={17}
                />
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    lineHeight: 1.25,
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}
                >
                  {b.meta}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showBacklist && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 22,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: "-0.025em",
                color: "var(--fg-strong)",
                margin: 0,
              }}
            >
              The backlist
            </h2>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                color: "var(--fg-3)",
              }}
            >
              By series · read order kept intact
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {series.map((s) => (
              <div key={s.name}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 20,
                      letterSpacing: "-0.01em",
                      color: "var(--fg-strong)",
                      margin: 0,
                    }}
                  >
                    {s.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                    }}
                  >
                    {s.tag}
                  </span>
                </div>
                <div
                  className="nf-row"
                  style={{
                    display: "flex",
                    gap: 20,
                    overflowX: "auto",
                    paddingBottom: 12,
                  }}
                >
                  {s.books.map((b) => (
                    <div key={b.title} style={{ flex: "none", width: 132 }}>
                      <BookCover
                        title={b.title}
                        gradient={b.gradient}
                        width={132}
                        height={194}
                        titleSize={17}
                      />
                      <div
                        style={{
                          marginTop: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--fg-1)",
                          lineHeight: 1.25,
                        }}
                      >
                        {b.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--fg-3)",
                          marginTop: 2,
                        }}
                      >
                        {b.meta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ marginTop: 64 }}></div>
    </main>
  );
}
