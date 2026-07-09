"use client";

import { useState } from "react";
import { featuredEvent, events, recordings } from "@/lib/data";

type EventFilter = "all" | "inperson" | "online" | "workshop";

const chips: { key: EventFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "inperson", label: "In person" },
  { key: "online", label: "Online" },
  { key: "workshop", label: "Workshops" },
];

export default function EventsPage() {
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");

  const eventsFiltered =
    eventFilter === "all"
      ? events
      : events.filter((e) => e.cat === eventFilter);

  return (
    <main
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "56px 40px 64px",
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
        Gather
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
        Events &amp; readings
      </h1>
      <p
        style={{
          fontSize: 18,
          color: "var(--fg-2)",
          maxWidth: 600,
          margin: "0 0 40px",
        }}
      >
        Festival appearances, live readings, workshops and retreats — book it
        all here. No more leaving for a separate ticketing site.
      </p>

      <article
        style={{
          background: "var(--surface-card)",
          borderRadius: 32,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          alignItems: "stretch",
          boxShadow: "var(--shadow-md)",
          margin: "0 0 36px",
        }}
      >
        <div
          style={{
            position: "relative",
            background: featuredEvent.gradient,
            minHeight: 300,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              alignSelf: "flex-start",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fg-on-accent)",
              background: "rgba(31,42,56,0.28)",
              padding: "6px 14px",
              borderRadius: 999,
            }}
          >
            {featuredEvent.type}
          </span>
          <div
            style={{ display: "flex", alignItems: "baseline", gap: 12 }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {featuredEvent.mon}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 72,
                letterSpacing: "-0.04em",
                color: "var(--st-white)",
                lineHeight: 0.85,
              }}
            >
              {featuredEvent.day}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "40px 44px",
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
              marginBottom: 12,
            }}
          >
            Next up · don&apos;t miss it
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px,3vw,38px)",
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 14px",
              lineHeight: 1.04,
            }}
          >
            {featuredEvent.title}
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 22px",
              maxWidth: "52ch",
            }}
          >
            {featuredEvent.blurb}
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
              className="nf-btn-primary"
              style={{
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "14px 26px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Get tickets ↗
            </button>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                color: "var(--fg-3)",
              }}
            >
              {featuredEvent.where} · {featuredEvent.when}
            </span>
          </div>
        </div>
      </article>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 22,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "-0.02em",
            color: "var(--fg-strong)",
            margin: 0,
          }}
        >
          Upcoming
        </h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {chips.map((chip) => {
            const active = eventFilter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => setEventFilter(chip.key)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 13,
                  padding: "9px 18px",
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
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {eventsFiltered.map((e) => (
          <article
            key={e.title}
            className="nf-card-hover"
            style={{
              background: "var(--surface-card)",
              borderRadius: 22,
              padding: "24px 28px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                flex: "none",
                width: 80,
                textAlign: "center",
                background: "var(--bg-3)",
                borderRadius: 16,
                padding: "14px 0",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                {e.mon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: "-0.02em",
                  color: "var(--fg-strong)",
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                {e.day}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--strong)",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {e.type}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "-0.015em",
                  color: "var(--fg-strong)",
                  margin: "0 0 6px",
                }}
              >
                {e.title}
              </h3>
              <div style={{ fontSize: 14, color: "var(--fg-2)" }}>
                {e.where}
              </div>
            </div>
            <button
              className="nf-btn-primary"
              style={{
                flex: "none",
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "13px 24px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {e.cta}
            </button>
          </article>
        ))}
      </div>

      <section style={{ padding: "64px 0 8px" }}>
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
              Missed one?
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: "-0.025em",
                color: "var(--fg-strong)",
                margin: "8px 0 0",
              }}
            >
              Catch up on the recordings
            </h2>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              color: "var(--fg-3)",
            }}
          >
            Members watch back any time
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 18,
          }}
        >
          {recordings.map((r) => (
            <article
              key={r.title}
              className="nf-card-hover"
              style={{
                cursor: "pointer",
                background: "var(--surface-card)",
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 130,
                  background: r.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 999,
                    background: "rgba(244,227,215,0.92)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--bg-inverse)",
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ marginLeft: 3 }}
                  >
                    <path d="M8 5.14v13.72L19 12z"></path>
                  </svg>
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    color: "var(--st-soft-cream)",
                    background: "rgba(31,42,56,0.5)",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  {r.duration}
                </span>
              </div>
              <div style={{ padding: "20px 22px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: 8,
                  }}
                >
                  {r.type}
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
                  {r.title}
                </h3>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    color: "var(--fg-3)",
                  }}
                >
                  {r.date}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: "40px 0 0" }}>
        <div
          style={{
            background: "var(--bg-inverse)",
            borderRadius: 36,
            padding: "clamp(40px,5vw,56px)",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 40,
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
              Invite Nia
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(28px,3.4vw,40px)",
                letterSpacing: "-0.03em",
                color: "var(--st-soft-cream)",
                margin: "0 0 14px",
                lineHeight: 1.04,
                maxWidth: "18ch",
              }}
            >
              Bring Nia to your festival or book club
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(228,216,215,0.8)",
                margin: 0,
                maxWidth: "48ch",
              }}
            >
              Readings, panels, craft talks, and book-club drop-ins — in person
              or virtual. Tell us about your event and a date you have in mind.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
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
              Send an invitation ↗
            </button>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                color: "rgba(228,216,215,0.6)",
              }}
            >
              or email events@stilettopress.com
            </span>
          </div>
        </div>
      </section>

      <div style={{ marginTop: 56 }}></div>
    </main>
  );
}
