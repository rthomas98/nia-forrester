import Link from "next/link";
import { Avatar, ImageSlot } from "@/components/ui";
import {
  communityStats,
  threads,
  clubs,
  circleSessions,
  reactions,
  principles,
} from "@/lib/data";

export default function CommunityPage() {
  return (
    <main>
      <section style={{ background: "var(--bg-inverse)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "64px 40px",
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 56,
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
              Members only · Connect
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 56,
                letterSpacing: "-0.03em",
                color: "var(--st-soft-cream)",
                margin: "0 0 14px",
                maxWidth: "16ch",
              }}
            >
              The Reader Circle
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "rgba(228,216,215,0.8)",
                maxWidth: 560,
                margin: "0 0 28px",
              }}
            >
              A private home for Black women&apos;s fiction. Discussions, book
              clubs, character debates — the conversations that used to scatter
              across the comments, finally in one room.
            </p>
            <Link
              href="/membership"
              className="nf-btn-primary"
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "15px 26px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Become a member ↗
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginTop: 32,
              }}
            >
              <div style={{ display: "flex" }}>
                <Avatar
                  initials="TR"
                  color="var(--st-cocoa-brown)"
                  size={36}
                  fontSize={11}
                  border="2px solid var(--bg-inverse)"
                />
                <Avatar
                  initials="IK"
                  color="var(--st-muted-mauve)"
                  size={36}
                  fontSize={11}
                  border="2px solid var(--bg-inverse)"
                  style={{ marginLeft: -9 }}
                />
                <Avatar
                  initials="DW"
                  color="var(--st-teal-green)"
                  size={36}
                  fontSize={11}
                  border="2px solid var(--bg-inverse)"
                  style={{ marginLeft: -9 }}
                />
                <Avatar
                  initials="RB"
                  color="var(--st-warm-tan)"
                  size={36}
                  fontSize={11}
                  border="2px solid var(--bg-inverse)"
                  style={{ marginLeft: -9 }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(228,216,215,0.72)",
                }}
              >
                1,240 readers already in the room
              </span>
            </div>
          </div>
          <div style={{ position: "relative", padding: "16px 16px 0 0" }}>
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                left: 16,
                bottom: 16,
                borderRadius: 28,
                border: "1px solid rgba(228,216,215,0.22)",
              }}
            ></span>
            <ImageSlot
              label="Drop a reader-community photo"
              style={{
                position: "relative",
                zIndex: 1,
                display: "block",
                width: "100%",
                height: 380,
                borderRadius: 28,
                boxShadow: "var(--shadow-lg)",
                background: "rgba(247,198,188,0.10)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -24,
                bottom: 36,
                zIndex: 3,
                background: "var(--surface-card)",
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: "var(--shadow-lg)",
                maxWidth: 270,
                display: "flex",
                gap: 11,
                alignItems: "flex-start",
              }}
            >
              <Avatar
                initials="TR"
                color="var(--st-cocoa-brown)"
                size={32}
                fontSize={11}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "var(--fg-strong)",
                  }}
                >
                  Tasha R.{" "}
                  <span style={{ color: "var(--fg-4)", fontWeight: 500 }}>
                    · in Ch. 11
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 13.5,
                    lineHeight: 1.45,
                    color: "var(--fg-2)",
                    marginTop: 3,
                  }}
                >
                  &ldquo;The drawer line. I gasped.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 40px 0" }}
      >
        <div
          style={{
            borderTop: "1px solid var(--border-rule)",
            borderBottom: "1px solid var(--border-1)",
            padding: "26px 6px",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
          }}
        >
          {communityStats.map((st) => (
            <div
              key={st.label}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                borderLeft: "1px solid var(--border-1)",
                paddingLeft: 24,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 36,
                  color: "var(--fg-strong)",
                  lineHeight: 1,
                }}
              >
                {st.num}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  fontWeight: 600,
                }}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "56px 40px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 0 18px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: "-0.02em",
                color: "var(--fg-strong)",
                margin: 0,
              }}
            >
              Active discussions
            </h2>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 12,
                color: "var(--fg-3)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: "var(--feature)",
                  animation: "nfPulse 2.4s ease-in-out infinite",
                }}
              ></span>
              212 online now
            </span>
          </div>
          <div
            style={{
              background: "var(--surface-card)",
              borderRadius: 22,
              boxShadow: "var(--shadow-xs)",
              overflow: "hidden",
            }}
          >
            {threads.map((t) => (
              <article
                key={t.title}
                className="nf-thread"
                style={{
                  cursor: "pointer",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  borderTop: "1px solid var(--border-1)",
                }}
              >
                <Avatar
                  initials={t.initials}
                  color={t.avatarColor}
                  size={42}
                  fontSize={13}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 17,
                      lineHeight: 1.3,
                      color: "var(--fg-strong)",
                      margin: "0 0 5px",
                    }}
                  >
                    {t.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--fg-3)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                        fontWeight: 700,
                      }}
                    >
                      {t.tag}
                    </span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: 999,
                        background: "var(--fg-4)",
                      }}
                    ></span>
                    <span>{t.author}</span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: 999,
                        background: "var(--fg-4)",
                      }}
                    ></span>
                    <span>{t.when}</span>
                    {t.pinned && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontFamily: "var(--font-display)",
                          fontSize: 10,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--feature)",
                          fontWeight: 700,
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 17v5"></path>
                          <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
                        </svg>
                        Pinned
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    flex: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--fg-3)",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                  </svg>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {t.count}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: "-0.02em",
              color: "var(--fg-strong)",
              margin: "0 0 18px",
              paddingTop: 5,
            }}
          >
            Book clubs
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {clubs.map((c) => (
              <article
                key={c.name}
                className="nf-card-hover"
                style={{
                  cursor: "pointer",
                  borderRadius: 20,
                  boxShadow: "var(--shadow-xs)",
                  background: "var(--surface-card)",
                  padding: "20px 22px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    flex: "none",
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: c.gradient,
                    marginTop: 5,
                  }}
                ></span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 17,
                        letterSpacing: "-0.01em",
                        color: "var(--fg-strong)",
                        margin: "0 0 5px",
                      }}
                    >
                      {c.name}
                    </h3>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-display)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--fg-3)",
                        fontWeight: 600,
                      }}
                    >
                      {c.members}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      color: "var(--fg-2)",
                      margin: 0,
                    }}
                  >
                    {c.desc}
                  </p>
                </div>
              </article>
            ))}
            <Link
              href="/membership"
              className="nf-btn-ghost"
              style={{
                display: "inline-block",
                textAlign: "center",
                background: "transparent",
                color: "var(--fg-strong)",
                border: "1px solid var(--border-2)",
                padding: "13px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Start a club with membership
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 40px 8px" }}
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
              Live together
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: "-0.02em",
                color: "var(--fg-strong)",
                margin: "8px 0 0",
              }}
            >
              This week in the Circle
            </h2>
          </div>
          <Link
            href="/events"
            className="nf-link"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--fg-2)",
            }}
          >
            All events
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 18,
          }}
        >
          {circleSessions.map((s) => (
            <Link
              key={s.title}
              href="/events"
              className="nf-card-hover"
              style={{
                cursor: "pointer",
                background: "var(--surface-card)",
                borderRadius: 22,
                padding: 24,
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 58,
                  textAlign: "center",
                  background: "var(--bg-3)",
                  borderRadius: 14,
                  padding: "10px 0",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: s.accent,
                  }}
                >
                  {s.mon}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 24,
                    color: "var(--fg-strong)",
                    lineHeight: 1,
                    marginTop: 2,
                  }}
                >
                  {s.day}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: s.accent,
                    marginBottom: 6,
                  }}
                >
                  {s.type}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 17,
                    lineHeight: 1.25,
                    color: "var(--fg-strong)",
                    margin: "0 0 8px",
                  }}
                >
                  {s.title}
                </h3>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    color: "var(--fg-3)",
                  }}
                >
                  {s.where} · {s.host}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 40px 24px" }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 36px",
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
            From the margins
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
            What the Circle is saying right now
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
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
              <div
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <Avatar
                  initials={r.initials}
                  color={r.color}
                  size={42}
                  fontSize={14}
                />
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

      <section
        style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 40px 64px" }}
      >
        <div
          style={{
            background: "var(--bg-3)",
            borderRadius: 36,
            padding: "clamp(36px,4vw,52px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--depth)",
              marginBottom: 8,
            }}
          >
            House rules
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px,3.2vw,36px)",
              letterSpacing: "-0.025em",
              color: "var(--bg-inverse)",
              margin: "0 0 32px",
            }}
          >
            How we read together
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 32,
            }}
          >
            {principles.map((p) => (
              <div key={p.num}>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: 34,
                    color: "var(--accent)",
                    lineHeight: 1,
                    marginBottom: 14,
                  }}
                >
                  {p.num}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 19,
                    letterSpacing: "-0.01em",
                    color: "var(--bg-inverse)",
                    margin: "0 0 8px",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "rgba(31,42,56,0.72)",
                    margin: 0,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
