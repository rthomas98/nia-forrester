import Link from "next/link";

const colHead: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(228,216,215,0.6)",
  margin: "0 0 16px",
  fontWeight: 700,
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 11,
};

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(228,216,215,0.78)",
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="nf-footer-link" style={linkStyle}>
        {children}
      </Link>
    </li>
  );
}

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: "var(--bg-inverse)",
        color: "var(--st-soft-cream)",
        padding: "56px 0 36px",
        marginTop: 24,
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  background: "var(--accent)",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  letterSpacing: "-0.02em",
                }}
              >
                Nia Forrester
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 17,
                color: "rgba(228,216,215,0.88)",
                margin: "0 0 10px",
              }}
            >
              Woman-centered, romantic realism.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(228,216,215,0.6)",
                maxWidth: 320,
                lineHeight: 1.6,
                margin: "0 0 10px",
              }}
            >
              The books, the serials, the community — and the studio — all in one place.
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 12,
                letterSpacing: "0.04em",
                color: "rgba(228,216,215,0.45)",
                margin: 0,
              }}
            >
              She Who Writes Herself · niaforrester.com
            </p>
          </div>
          <div>
            <h6 style={colHead}>Read</h6>
            <ul style={list}>
              <FooterLink href="/serial">Serials</FooterLink>
              <FooterLink href="/read">Essays</FooterLink>
              <FooterLink href="/read">The backlist</FooterLink>
              <FooterLink href="/read">Audiobooks</FooterLink>
            </ul>
          </div>
          <div>
            <h6 style={colHead}>Connect</h6>
            <ul style={list}>
              <FooterLink href="/community">Reader Circle</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/academy">Writing Studio</FooterLink>
              <FooterLink href="/community">Instagram</FooterLink>
            </ul>
          </div>
          <div>
            <h6 style={colHead}>Account</h6>
            <ul style={list}>
              <FooterLink href="/signin">Sign in</FooterLink>
              <FooterLink href="/membership">Membership</FooterLink>
              <FooterLink href="/membership">Gift a membership</FooterLink>
              <FooterLink href="/membership">Help</FooterLink>
            </ul>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(228,216,215,0.12)",
            marginTop: 40,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-display)",
            fontSize: 12,
            color: "rgba(228,216,215,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          <span>© 2026 Nia Forrester</span>
          <span>Privacy · Terms · Contact</span>
        </div>
      </div>
    </footer>
  );
}
