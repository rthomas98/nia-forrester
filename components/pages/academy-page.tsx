import Link from "next/link";
import { services } from "@/lib/data";

export default function AcademyPage() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 40px 64px" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--feature)",
          marginBottom: 14,
        }}
      >
        For writers · Learn
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: "-0.03em",
          color: "var(--fg-strong)",
          margin: "0 0 12px",
          maxWidth: "18ch",
        }}
      >
        The Writing Studio
      </h1>
      <p style={{ fontSize: 18, color: "var(--fg-2)", maxWidth: 620, margin: "0 0 40px" }}>
        A public-policy attorney by day, a novelist by night, and an editor for writers who are
        serious about the craft. Work directly with Nia — booking lives right here now.
      </p>

      {/* Stock photo: Unsplash (free license) — a writing desk with notebook and coffee */}
      <img
        src="/images/academy-banner.jpg"
        alt="A writing desk with an open notebook, fountain pen, and coffee"
        style={{
          display: "block",
          width: "100%",
          height: 240,
          objectFit: "cover",
          objectPosition: "50% 60%",
          borderRadius: 24,
          boxShadow: "var(--shadow-sm)",
          margin: "0 0 40px",
          background: "var(--surface-card)",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 18,
          marginBottom: 48,
        }}
      >
        {services.map((s) => (
          <article
            key={s.name}
            className="nf-card-hover"
            style={{
              background: "var(--surface-card)",
              borderRadius: 24,
              padding: 30,
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                  color: "var(--fg-strong)",
                  margin: 0,
                }}
              >
                {s.name}
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--accent)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.price}
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--fg-2)",
                margin: "0 0 22px",
                flex: 1,
              }}
            >
              {s.desc}
            </p>
            <button
              className="nf-btn-primary"
              style={{
                background: "var(--bg-inverse)",
                color: "var(--fg-on-dark)",
                padding: "12px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                alignSelf: "flex-start",
              }}
            >
              Book a slot ↗
            </button>
          </article>
        ))}
      </div>

      <div
        style={{
          background: "var(--bg-3)",
          borderRadius: 32,
          padding: "44px 48px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--bg-inverse)",
              marginBottom: 10,
            }}
          >
            Coming soon
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.025em",
              color: "var(--bg-inverse)",
              margin: "0 0 10px",
            }}
          >
            Courses, workshops &amp; masterclasses
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(31,42,56,0.78)",
              margin: 0,
              maxWidth: 520,
            }}
          >
            Self-paced craft courses and live cohorts on writing woman-centered romance. Writers
            Circle members get them first, and at a discount.
          </p>
        </div>
        <Link
          href="/membership"
          style={{
            flex: "none",
            background: "var(--bg-inverse)",
            color: "var(--fg-on-dark)",
            padding: "14px 26px",
            borderRadius: 999,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Join the waitlist
        </Link>
      </div>
      <div style={{ marginTop: 56 }}></div>
    </main>
  );
}
