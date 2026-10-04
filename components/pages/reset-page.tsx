"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Mail } from "relume-icons";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/auth-context";
import { Login7 } from "@/components/relume/login7";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { alertText, muted, textLink } from "@/lib/typography";

const steps = {
    1: { tagline: "Reset Password", title: "Forgot Your Password?" },
    2: { tagline: "Reset Password", title: "Check Your Email" },
    3: { tagline: "Almost There", title: "Choose a New Password" },
    4: { tagline: "All Set", title: "Password Updated" },
} as const;

function ResetError({ message }: { message: string }) {
    return (<p role="alert" className={alertText}>
        {message}
      </p>);
}

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
    const resetResend = async () => {
        // Clear the previous attempt's outcome so a stale failure never sits beside "Sent again".
        setResetError("");
        setResetResent(false);
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
        ? { width: "w-0", color: "bg-taupe", text: "text-taupe", label: " " }
        : pwScore <= 1
            ? { width: "w-1/4", color: "bg-rose", text: "text-rose", label: "Weak" }
            : pwScore === 2
                ? { width: "w-[55%]", color: "bg-champagne/70", text: "text-champagne", label: "Okay" }
                : pwScore === 3
                    ? { width: "w-4/5", color: "bg-champagne", text: "text-champagne", label: "Good" }
                    : { width: "w-full", color: "bg-cream", text: "text-cream", label: "Strong" };
    const step = steps[resetStep as 1 | 2 | 3 | 4];
    return (<main>
      <Login7
        tagline={step.tagline}
        title={step.title}
        description={resetStep === 1 ? <p>No drama. Tell us your email and we&apos;ll send a reset link.</p>
            : resetStep === 2 ? <>
                <p>If an account exists for this email address, a reset link will be sent.</p>
                <p className="mt-2 text-small text-taupe">Address entered: <strong className="font-semibold text-cream">{resetEmail}</strong></p>
              </>
                : resetStep === 3 ? (resetEmail ? <p>For <strong className="font-semibold text-cream">{resetEmail}</strong></p> : <p>Choose a password you haven’t used here before.</p>)
                    : <p>You&apos;re all set. Sign in with your new password and pick up your reading where you left off.</p>}
        image={<Image src="/images/nia-closeup-pensive.jpeg" alt="Close-up portrait of Nia Forrester" fill sizes="50vw" className="object-cover object-center"/>}
        footer={resetStep === 1 ? <>
            <p>Remembered it?</p>
            <Link href="/signin" className={textLink}>Back to Sign In</Link>
          </> : undefined}
      >
        {resetStep === 1 && (<form onSubmit={resetSend} noValidate className="grid grid-cols-1 gap-6">
            <div className="grid w-full items-center">
              <Label htmlFor="reset-email" className="mb-2">Email</Label>
              <Input id="reset-email" type="email" name="email" autoComplete="email" value={resetEmail} aria-invalid={resetError ? true : undefined} onChange={(e) => {
                setResetEmail(e.target.value);
                setResetError("");
            }} placeholder="you@example.com"/>
            </div>
            {resetError && <ResetError message={resetError}/>}
            <Button type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send Reset Link"}
            </Button>
          </form>)}

        {resetStep === 2 && (<div className="text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-champagne/50 text-champagne">
              <Mail aria-hidden="true" className="size-7"/>
            </div>
            <p className={`mb-6 ${muted}`}>
              {/* Matches convex/auth.ts resetPasswordTokenExpiresIn (60 * 60) and the reset email copy. */}
              Reset links expire in one hour. Check spam if it&apos;s shy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-2">
              <span className="text-body">Nothing arrived?</span>
              <Button type="button" variant="link" size="link" onClick={resetResend} disabled={pending}>
                {resetResent ? "Sent again ✓" : "Resend the link"}
              </Button>
            </div>
            {resetError && <div className="mt-3"><ResetError message={resetError}/></div>}
          </div>)}

        {resetStep === 3 && (<>
            {tokenError && (<p role="alert" className={`mb-6 ${alertText}`}>
                This password reset link is invalid or has expired. Request a new
                one below.
              </p>)}
            <form onSubmit={resetSave} className="grid grid-cols-1 gap-6">
              <div className="grid w-full items-center">
                <Label htmlFor="reset-new-password" className="mb-2">New Password</Label>
                <Input id="reset-new-password" type="password" name="new-password" autoComplete="new-password" value={resetPw1} onChange={(e) => {
                setResetPw1(e.target.value);
                setResetError("");
            }} placeholder="At least 8 characters"/>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-wine-sunken">
                    <div className={`h-full rounded-full transition-all duration-200 motion-reduce:transition-none ${pw.width} ${pw.color}`}></div>
                  </div>
                  <span className={`font-ui text-tiny font-semibold whitespace-nowrap ${pw.text}`}>
                    {pw.label}
                  </span>
                </div>
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="reset-confirm-password" className="mb-2">Repeat It</Label>
                <Input id="reset-confirm-password" type="password" name="confirm-password" autoComplete="new-password" value={resetPw2} onChange={(e) => {
                setResetPw2(e.target.value);
                setResetError("");
            }} placeholder="Same again"/>
              </div>
              {resetError && <ResetError message={resetError}/>}
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save New Password"}
              </Button>
            </form>
          </>)}

        {resetStep === 4 && (<div className="text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-champagne text-wine-sunken">
              <Check aria-hidden="true" className="size-7"/>
            </div>
            <Link href="/signin" className={buttonVariants()}>
              Back to Sign In
            </Link>
          </div>)}
      </Login7>
    </main>);
}
