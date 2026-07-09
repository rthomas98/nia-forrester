"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { prefOptions } from "@/lib/data";
import { useAuth } from "@/components/auth-context";

export default function SignUpPage() {
  const params = useSearchParams();
  const signupTier = params.get("tier") ?? "Reader Circle";
  const { signIn } = useAuth();

  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [alerts, setAlerts] = useState(true);

  const dotOn = "var(--accent)";
  const dotOff = "var(--border-2)";
  const stepDot1 = step >= 1 ? dotOn : dotOff;
  const stepDot2 = step >= 2 ? dotOn : dotOff;
  const stepDot3 = step >= 3 ? dotOn : dotOff;

  const togglePref = (label: string) => {
    setPrefs((prev) =>
      prev.indexOf(label) >= 0
        ? prev.filter((p) => p !== label)
        : [...prev, label]
    );
  };

  const signupContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const signupFinish = () => {
    setStep(3);
    signIn();
  };

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "52px 40px 88px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 36,
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
          }}
        >
          Join the Circle
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 22,
              height: 4,
              borderRadius: 999,
              background: stepDot1,
            }}
          ></span>
          <span
            style={{
              width: 22,
              height: 4,
              borderRadius: 999,
              background: stepDot2,
            }}
          ></span>
          <span
            style={{
              width: 22,
              height: 4,
              borderRadius: 999,
              background: stepDot3,
            }}
          ></span>
        </div>
      </div>

      {step === 1 && (
        <>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 8px",
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 28px",
            }}
          >
            Two minutes, and every chapter is yours.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              background: "var(--bg-3)",
              borderRadius: 18,
              padding: "16px 20px",
              marginBottom: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(31,42,56,0.6)",
                  fontWeight: 700,
                  marginBottom: 3,
                }}
              >
                Your plan
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--bg-inverse)",
                }}
              >
                {signupTier}
              </div>
            </div>
            <Link
              href="/membership"
              className="nf-link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--depth)",
              }}
            >
              Change plan
            </Link>
          </div>

          <form
            onSubmit={signupContinue}
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
                First name
              </span>
              <input
                type="text"
                placeholder="What should we call you?"
                style={{
                  border: "1px solid var(--border-2)",
                  background: "var(--surface-card)",
                  borderRadius: 14,
                  padding: "13px 16px",
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  color: "var(--fg-1)",
                }}
              />
            </label>
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
                  background: "var(--surface-card)",
                  borderRadius: 14,
                  padding: "13px 16px",
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  color: "var(--fg-1)",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
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
              <input
                type="password"
                placeholder="At least 8 characters"
                style={{
                  border: "1px solid var(--border-2)",
                  background: "var(--surface-card)",
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
              Continue
            </button>
          </form>
          <p
            style={{
              fontSize: 14,
              color: "var(--fg-2)",
              margin: "22px 0 0",
              textAlign: "center",
            }}
          >
            Already a member?{" "}
            <Link
              href="/signin"
              className="nf-link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                color: "var(--accent)",
                padding: 0,
              }}
            >
              Sign in
            </Link>
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 8px",
            }}
          >
            What do you love to read?
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 28px",
            }}
          >
            Pick a few — your shelf and recommendations start here.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 32,
            }}
          >
            {prefOptions.map((label) => {
              const on = prefs.indexOf(label) >= 0;
              return (
                <button
                  key={label}
                  onClick={() => togglePref(label)}
                  style={{
                    background: on ? "var(--bg-inverse)" : "var(--surface-card)",
                    color: on ? "var(--fg-on-dark)" : "var(--fg-strong)",
                    border: `1px solid ${on ? "var(--bg-inverse)" : "var(--border-2)"}`,
                    padding: "11px 20px",
                    borderRadius: 999,
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "all 140ms ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              background: "var(--surface-card)",
              borderRadius: 18,
              padding: "16px 20px",
              marginBottom: 32,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--fg-strong)",
                }}
              >
                Tuesday chapter alerts
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--fg-3)",
                  marginTop: 2,
                }}
              >
                One email when a new chapter drops. Nothing else.
              </div>
            </div>
            <button
              onClick={() => setAlerts((a) => !a)}
              style={{
                flex: "none",
                width: 46,
                height: 26,
                borderRadius: 999,
                background: alerts ? "var(--accent)" : "var(--border-2)",
                position: "relative",
                transition: "background 140ms ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: alerts ? "23px" : "3px",
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: "var(--st-white)",
                  boxShadow: "var(--shadow-xs)",
                  transition: "left 140ms ease",
                }}
              ></span>
            </button>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={signupFinish}
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
              Create my account
            </button>
            <button
              onClick={() => setStep(1)}
              className="nf-link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                color: "var(--fg-2)",
              }}
            >
              Back
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <div style={{ textAlign: "center", padding: "24px 0 0" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "var(--accent)",
              color: "var(--fg-on-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 26px",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 10px",
            }}
          >
            You&apos;re in.
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              maxWidth: "40ch",
              margin: "0 auto 30px",
            }}
          >
            Your{" "}
            <strong
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "var(--fg-strong)",
              }}
            >
              {signupTier}
            </strong>{" "}
            membership is live. Chapter 11 of{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
              Forty-Nothing
            </em>{" "}
            is waiting.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/serial"
              className="nf-btn-primary"
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "15px 28px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Start reading ↗
            </Link>
            <Link
              href="/dashboard"
              className="nf-btn-ghost"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "var(--fg-strong)",
                border: "1px solid var(--border-2)",
                padding: "14px 26px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Go to my shelf
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
