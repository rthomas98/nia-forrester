"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/auth-context";
export default function ResetPage({ token, tokenError, }: {
    token?: string;
    tokenError?: string;
}) {
    const { configured } = useAuth();
    const [resetStep, setResetStep] = useState(token ? 3 : 1);
    const [resetEmail, setResetEmail] = useState("");
    const [resetPw1, setResetPw1] = useState("");
    const [resetPw2, setResetPw2] = useState("");
    const [resetError, setResetError] = useState("");
    const [resetResent, setResetResent] = useState(false);
    const [pending, setPending] = useState(false);
    const resetSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const em = resetEmail.trim();
        if (!em || em.indexOf("@") < 1 || em.indexOf(".") < 0) {
            setResetError("That doesn’t look like an email address.");
            return;
        }
        if (!configured) {
            setResetError("Account services are being connected. Please try again shortly.");
            return;
        }
        setResetError("");
        setResetResent(false);
        setPending(true);
        try {
            const result = await authClient.requestPasswordReset({
                email: em,
                redirectTo: `${window.location.origin}/reset`,
            });
            if (result.error) {
                setResetError(result.error.message ?? "We couldn’t send the reset email.");
                return;
            }
            setResetStep(2);
        }
        catch {
            setResetError("We couldn’t reach the account service.");
        }
        finally {
            setPending(false);
        }
    };
    const resetSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (resetPw1.length < 8) {
            setResetError("Password needs at least 8 characters.");
            return;
        }
        if (resetPw1 !== resetPw2) {
            setResetError("Those passwords don’t match.");
            return;
        }
        if (!token) {
            setResetError("This reset link is missing or has expired.");
            return;
        }
        setResetError("");
        setPending(true);
        try {
            const result = await authClient.resetPassword({
                newPassword: resetPw1,
                token,
            });
            if (result.error) {
                setResetError(result.error.message ?? "This reset link is invalid or has expired.");
                return;
            }
            setResetStep(4);
        }
        catch {
            setResetError("We couldn’t reach the account service.");
        }
        finally {
            setPending(false);
        }
    };
    const pwVal = resetPw1 || "";
    let pwScore = 0;
    if (pwVal.length >= 8)
        pwScore++;
    if (pwVal.length >= 12)
        pwScore++;
    if (/[A-Z]/.test(pwVal) && /[a-z]/.test(pwVal))
        pwScore++;
    if (/[0-9]/.test(pwVal) || /[^A-Za-z0-9]/.test(pwVal))
        pwScore++;
    const pw = pwVal.length === 0
        ? { width: "w-0", color: "bg-[var(--color-plum-faint)]", text: "text-[var(--color-plum-faint)]", label: " " }
        : pwScore <= 1
            ? { width: "w-1/4", color: "bg-[var(--color-hot-magenta)]", text: "text-[var(--color-hot-magenta)]", label: "Weak" }
            : pwScore === 2
                ? { width: "w-[55%]", color: "bg-[var(--color-cool-teal)]", text: "text-[var(--color-cool-teal)]", label: "Okay" }
                : pwScore === 3
                    ? { width: "w-4/5", color: "bg-[var(--color-cool-teal)]", text: "text-[var(--color-cool-teal)]", label: "Good" }
                    : { width: "w-full", color: "bg-[var(--color-deep-plum)]", text: "text-[var(--color-deep-plum)]", label: "Strong" };
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:520px] [margin:0_auto] [padding:64px_40px_96px]">
      {resetStep === 1 && (<>
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            Reset password
          </div>
          <h1 className="font-sans [font-weight:700] [font-size:36px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_8px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            Forgot your password?
          </h1>
          <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_28px] text-pretty">
            No drama. Tell us your email and we&apos;ll send a reset link.
          </p>
          <form onSubmit={resetSend} noValidate className="flex flex-col [gap:14px]">
            <label className="flex flex-col [gap:7px]">
              <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                Email
              </span>
              <input type="email" name="email" autoComplete="email" value={resetEmail} onChange={(e) => {
                setResetEmail(e.target.value);
                setResetError("");
            }} placeholder="you@example.com" className={`rounded-[14px] border bg-[var(--color-brand-surface)] px-4 py-[13px] font-sans text-[15px] text-[var(--color-deep-plum)] ${resetError && resetStep === 1 ? "border-[var(--color-hot-magenta)]" : "border-[rgba(53,5,73,0.16)]"}`}/>
            </label>
            {resetError && (<div className="flex items-center [gap:8px] [font-size:13px] [color:var(--color-hot-magenta)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                {resetError}
              </div>)}
            <button type="submit" disabled={pending} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [margin-top:6px] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              {pending ? "Sending…" : "Send reset link"}
            </button>
          </form>
          <p className="[font-size:14px] [color:var(--color-plum-copy)] [margin:22px_0_0] text-center text-pretty">
            Remembered it?{" "}
            <Link href="/signin" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-hot-magenta)] [padding:0px]">
              Back to sign in
            </Link>
          </p>
        </>)}

      {resetStep === 2 && (<>
          <div className="[width:64px] [height:64px] [border-radius:999px] [background:var(--color-cool-teal)] [color:var(--color-deep-plum)] flex items-center justify-center [margin-bottom:24px]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <h1 className="font-sans [font-weight:700] [font-size:36px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_8px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            Check your email
          </h1>
          <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_6px] text-pretty">
            We sent a reset link to{" "}
            <strong className="font-sans [font-weight:600] [color:var(--color-deep-plum)]">
              {resetEmail}
            </strong>
            .
          </p>
          <p className="[font-size:14px] [line-height:1.6] [color:var(--color-plum-muted)] [margin:0_0_28px] text-pretty">
            The link expires in 30 minutes. Check spam if it&apos;s shy.
          </p>
          <div className="flex items-center [gap:6px] [margin-top:22px]">
            <span className="[font-size:14px] [color:var(--color-plum-copy)]">
              Nothing arrived?
            </span>
            <button type="button" onClick={async () => {
                setPending(true);
                try {
                    const result = await authClient.requestPasswordReset({
                        email: resetEmail,
                        redirectTo: `${window.location.origin}/reset`,
                    });
                    if (result.error) {
                        setResetError(result.error.message ?? "We couldn’t resend the link.");
                        return;
                    }
                    setResetResent(true);
                }
                catch {
                    setResetError("We couldn’t reach the account service.");
                }
                finally {
                    setPending(false);
                }
            }} disabled={pending} className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-hot-magenta)] [padding:0px]">
              {resetResent ? "Sent again ✓" : "Resend the link"}
            </button>
          </div>
        </>)}

      {resetStep === 3 && (<>
          {tokenError && (<p role="alert" className="[color:var(--color-hot-magenta)] [font-size:14px] text-pretty">
              This password reset link is invalid or has expired. Request a new
              one below.
            </p>)}
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            Almost there
          </div>
          <h1 className="font-sans [font-weight:700] [font-size:36px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_8px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            Choose a new password
          </h1>
          <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_28px] text-pretty">
            For{" "}
            <strong className="font-sans [font-weight:600] [color:var(--color-deep-plum)]">
              {resetEmail}
            </strong>
          </p>
          <form onSubmit={resetSave} className="flex flex-col [gap:14px]">
            <label className="flex flex-col [gap:7px]">
              <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                New password
              </span>
              <input type="password" name="new-password" autoComplete="new-password" value={resetPw1} onChange={(e) => {
                setResetPw1(e.target.value);
                setResetError("");
            }} placeholder="At least 8 characters" className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] font-sans [font-size:15px] [color:var(--color-deep-plum)]"/>
            </label>
            <div className="flex items-center [gap:10px]">
              <div className="[flex:1] [height:4px] [border-radius:999px] [background:rgba(53,5,73,0.08)] overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-200 ${pw.width} ${pw.color}`}></div>
              </div>
              <span className={`whitespace-nowrap font-sans text-xs font-semibold ${pw.text}`}>
                {pw.label}
              </span>
            </div>
            <label className="flex flex-col [gap:7px]">
              <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                Repeat it
              </span>
              <input type="password" name="confirm-password" autoComplete="new-password" value={resetPw2} onChange={(e) => {
                setResetPw2(e.target.value);
                setResetError("");
            }} placeholder="Same again" className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] font-sans [font-size:15px] [color:var(--color-deep-plum)]"/>
            </label>
            {resetError && (<div className="flex items-center [gap:8px] [font-size:13px] [color:var(--color-hot-magenta)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                {resetError}
              </div>)}
            <button type="submit" disabled={pending} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [margin-top:6px] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              {pending ? "Saving…" : "Save new password"}
            </button>
          </form>
        </>)}

      {resetStep === 4 && (<>
          <div className="[width:64px] [height:64px] [border-radius:999px] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] flex items-center justify-center [margin-bottom:24px]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </div>
          <h1 className="font-sans [font-weight:700] [font-size:36px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_8px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            Password updated
          </h1>
          <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_28px] text-pretty">
            You&apos;re all set. Sign in with your new password and get back to
            Chapter 11.
          </p>
          <Link href="/signin" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 inline-block [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
            Back to sign in
          </Link>
        </>)}
    </main>);
}
