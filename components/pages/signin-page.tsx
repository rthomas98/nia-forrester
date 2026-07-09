"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignIn = () => {
    signIn();
    router.push("/dashboard");
  };

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 40px 72px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: 36,
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          minHeight: 600,
        }}
      >
        <div
          style={{
            background: "var(--surface-card)",
            padding: "clamp(40px,4.5vw,64px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
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
              Welcome back
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 38,
                letterSpacing: "-0.025em",
                color: "var(--fg-strong)",
                margin: "0 0 8px",
              }}
            >
              Pick up where you left off
            </h1>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--fg-2)",
                margin: "0 0 32px",
              }}
            >
              Your library, your chapters, your Circle.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignIn();
              }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--fg-strong)",
                  }}
                >
                  Email
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  style={{
                    border: "1px solid var(--border-2)",
                    background: "var(--bg)",
                    borderRadius: 14,
                    padding: "13px 16px",
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
                    color: "var(--fg-1)",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 13,
                      color: "var(--fg-strong)",
                    }}
                  >
                    Password
                  </span>
                  <Link
                    href="/reset"
                    className="nf-link"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 12,
                      color: "var(--fg-3)",
                      padding: 0,
                    }}
                  >
                    Forgot it?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  style={{
                    border: "1px solid var(--border-2)",
                    background: "var(--bg)",
                    borderRadius: 14,
                    padding: "13px 16px",
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
                    color: "var(--fg-1)",
                  }}
                />
              </label>
              <button
                type="submit"
                className="nf-btn-primary"
                style={{
                  marginTop: 8,
                  background: "var(--accent)",
                  color: "var(--fg-on-accent)",
                  padding: "15px 26px",
                  borderRadius: 999,
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Sign in
              </button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "24px 0",
              }}
            >
              <span style={{ flex: 1, height: 1, background: "var(--border-1)" }} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--fg-4)",
                }}
              >
                or
              </span>
              <span style={{ flex: 1, height: 1, background: "var(--border-1)" }} />
            </div>
            <button
              onClick={handleSignIn}
              className="nf-btn-ghost"
              style={{
                width: "100%",
                background: "transparent",
                color: "var(--fg-strong)",
                border: "1px solid var(--border-2)",
                padding: "14px 24px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Email me a sign-in link
            </button>

            <p
              style={{
                fontSize: 14,
                color: "var(--fg-2)",
                margin: "28px 0 0",
                textAlign: "center",
              }}
            >
              New here?{" "}
              <Link
                href="/membership"
                className="nf-link"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--accent)",
                  padding: 0,
                }}
              >
                Join the Circle ↗
              </Link>
            </p>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-inverse)",
            padding: "clamp(40px,4.5vw,64px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 48,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
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
                fontSize: 16,
                letterSpacing: "-0.01em",
                color: "var(--st-soft-cream)",
              }}
            >
              The Reader Circle
            </span>
          </div>
          <blockquote style={{ margin: 0 }}>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "clamp(24px,2.4vw,32px)",
                lineHeight: 1.4,
                color: "var(--st-soft-cream)",
                margin: "0 0 24px",
              }}
            >
              &ldquo;I came for the books. I stayed because Tuesday chapter drops turned
              into the best group chat I&apos;ve ever been in.&rdquo;
            </p>
            <footer style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  flex: "none",
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  background: "var(--st-muted-mauve)",
                  color: "var(--st-soft-cream)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                IK
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--st-soft-cream)",
                  }}
                >
                  Imani K.
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 12,
                    color: "rgba(228,216,215,0.6)",
                  }}
                >
                  Member since 2023 · 112 threads
                </div>
              </div>
            </footer>
          </blockquote>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(228,216,215,0.65)",
            }}
          >
            <span>46 books</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: 999,
                background: "rgba(228,216,215,0.4)",
              }}
            />
            <span>1,240 readers</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: 999,
                background: "rgba(228,216,215,0.4)",
              }}
            />
            <span>New chapters weekly</span>
          </div>
        </div>
      </div>
    </main>
  );
}
