"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPage() {
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPw1, setResetPw1] = useState("");
  const [resetPw2, setResetPw2] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetResent, setResetResent] = useState(false);

  const resetSend = (e: React.FormEvent) => {
    e.preventDefault();
    const em = resetEmail.trim();
    if (!em || em.indexOf("@") < 1 || em.indexOf(".") < 0) {
      setResetError("That doesn’t look like an email address.");
      return;
    }
    setResetError("");
    setResetResent(false);
    setResetStep(2);
  };

  const resetSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPw1.length < 8) {
      setResetError("Password needs at least 8 characters.");
      return;
    }
    if (resetPw1 !== resetPw2) {
      setResetError("Those passwords don’t match.");
      return;
    }
    setResetError("");
    setResetStep(4);
  };

  const pwVal = resetPw1 || "";
  let pwScore = 0;
  if (pwVal.length >= 8) pwScore++;
  if (pwVal.length >= 12) pwScore++;
  if (/[A-Z]/.test(pwVal) && /[a-z]/.test(pwVal)) pwScore++;
  if (/[0-9]/.test(pwVal) || /[^A-Za-z0-9]/.test(pwVal)) pwScore++;
  const pw =
    pwVal.length === 0
      ? { pct: "0%", color: "var(--fg-4)", label: " " }
      : pwScore <= 1
        ? { pct: "25%", color: "var(--danger)", label: "Weak" }
        : pwScore === 2
          ? { pct: "55%", color: "var(--highlight)", label: "Okay" }
          : pwScore === 3
            ? { pct: "80%", color: "var(--feature)", label: "Good" }
            : { pct: "100%", color: "var(--success)", label: "Strong" };

  const resetEmailBorder =
    resetError && resetStep === 1 ? "var(--danger)" : "var(--border-2)";

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "64px 40px 96px" }}>
      {resetStep === 1 && (
        <>
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
            Reset password
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 8px",
            }}
          >
            Forgot your password?
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 28px",
            }}
          >
            No drama. Tell us your email and we&apos;ll send a reset link.
          </p>
          <form
            onSubmit={resetSend}
            noValidate
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
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetError("");
                }}
                placeholder="you@example.com"
                style={{
                  border: `1px solid ${resetEmailBorder}`,
                  background: "var(--surface-card)",
                  borderRadius: 14,
                  padding: "13px 16px",
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  color: "var(--fg-1)",
                }}
              />
            </label>
            {resetError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--danger)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                {resetError}
              </div>
            )}
            <button
              type="submit"
              className="nf-btn-primary"
              style={{
                marginTop: 6,
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "15px 26px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Send reset link
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
            Remembered it?{" "}
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
              Back to sign in
            </Link>
          </p>
        </>
      )}

      {resetStep === 2 && (
        <>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "var(--bg-3)",
              color: "var(--depth)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 8px",
            }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 6px",
            }}
          >
            We sent a reset link to{" "}
            <strong
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "var(--fg-strong)",
              }}
            >
              {resetEmail}
            </strong>
            .
          </p>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--fg-3)",
              margin: "0 0 28px",
            }}
          >
            The link expires in 30 minutes. Check spam if it&apos;s shy.
          </p>
          <button
            onClick={() => {
              setResetStep(3);
              setResetError("");
            }}
            className="nf-btn-primary"
            style={{
              background: "var(--accent)",
              color: "var(--fg-on-accent)",
              padding: "15px 26px",
              borderRadius: 999,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Open the reset link
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 22,
            }}
          >
            <span style={{ fontSize: 14, color: "var(--fg-2)" }}>
              Nothing arrived?
            </span>
            <button
              onClick={() => setResetResent(true)}
              className="nf-link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                color: "var(--accent)",
                padding: 0,
              }}
            >
              {resetResent ? "Sent again ✓" : "Resend the link"}
            </button>
          </div>
        </>
      )}

      {resetStep === 3 && (
        <>
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
            Almost there
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 8px",
            }}
          >
            Choose a new password
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 28px",
            }}
          >
            For{" "}
            <strong
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "var(--fg-strong)",
              }}
            >
              {resetEmail}
            </strong>
          </p>
          <form
            onSubmit={resetSave}
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
                New password
              </span>
              <input
                type="password"
                value={resetPw1}
                onChange={(e) => {
                  setResetPw1(e.target.value);
                  setResetError("");
                }}
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 999,
                  background: "var(--border-1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: pw.pct,
                    height: "100%",
                    borderRadius: 999,
                    background: pw.color,
                    transition: "all 220ms ease",
                  }}
                ></div>
              </div>
              <span
                style={{
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 12,
                  color: pw.color,
                }}
              >
                {pw.label}
              </span>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--fg-strong)",
                }}
              >
                Repeat it
              </span>
              <input
                type="password"
                value={resetPw2}
                onChange={(e) => {
                  setResetPw2(e.target.value);
                  setResetError("");
                }}
                placeholder="Same again"
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
            {resetError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--danger)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                {resetError}
              </div>
            )}
            <button
              type="submit"
              className="nf-btn-primary"
              style={{
                marginTop: 6,
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "15px 26px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Save new password
            </button>
          </form>
        </>
      )}

      {resetStep === 4 && (
        <>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "var(--accent)",
              color: "var(--fg-on-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg
              width="26"
              height="26"
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
              fontSize: 36,
              letterSpacing: "-0.025em",
              color: "var(--fg-strong)",
              margin: "0 0 8px",
            }}
          >
            Password updated
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 28px",
            }}
          >
            You&apos;re all set. Sign in with your new password and get back to
            Chapter 11.
          </p>
          <Link
            href="/signin"
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
            Back to sign in
          </Link>
        </>
      )}
    </main>
  );
}
