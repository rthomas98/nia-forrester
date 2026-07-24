"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { prefOptions } from "@/lib/data";
import { useAuth } from "@/components/auth-context";
import { authClient } from "@/lib/auth-client";
import { completeReaderProfile } from "@/app/signup/actions";
export default function SignUpPage() {
    const params = useSearchParams();
    const signupTier = params.get("tier") ?? "Reader Circle";
    const { configured } = useAuth();
    const [step, setStep] = useState(1);
    const [prefs, setPrefs] = useState<string[]>([]);
    const [alerts, setAlerts] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const selectedPreferences = useMemo(() => new Set(prefs), [prefs]);
    const togglePref = (label: string) => {
        setPrefs((prev) => prev.indexOf(label) >= 0
            ? prev.filter((p) => p !== label)
            : [...prev, label]);
    };
    const signupContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim()) {
            setError("Tell us what to call you.");
            return;
        }
        if (!email.includes("@")) {
            setError("Enter a valid email address.");
            return;
        }
        if (password.length < 8) {
            setError("Password needs at least 8 characters.");
            return;
        }
        setError("");
        setStep(2);
        window.scrollTo(0, 0);
    };
    const signupFinish = async () => {
        if (!configured) {
            setError("Account services are being connected. Please try again shortly.");
            return;
        }
        setPending(true);
        setError("");
        try {
            const result = await authClient.signUp.email({
                name: firstName.trim(),
                email: email.trim(),
                password,
                callbackURL: "/dashboard",
            });
            if (result.error) {
                setError(result.error.message ?? "We couldn’t create your account.");
                return;
            }
            const selectedTier = signupTier.toLowerCase().startsWith("inner")
                ? ("inner" as const)
                : signupTier.toLowerCase().startsWith("writers")
                    ? ("writers" as const)
                    : signupTier.toLowerCase().startsWith("reader")
                        ? ("reader" as const)
                        : ("free" as const);
            await completeReaderProfile({
                displayName: firstName.trim(),
                selectedTier,
                preferences: prefs,
                chapterAlerts: alerts,
                newsletterOptIn: true,
            });
            setStep(3);
        }
        catch {
            setError("Your account was created, but we couldn’t save your reading preferences. You can finish them from your library.");
        }
        finally {
            setPending(false);
        }
    };
    const paidTier = signupTier.toLowerCase().startsWith("inner")
        ? ("inner" as const)
        : signupTier.toLowerCase().startsWith("writers")
            ? ("writers" as const)
            : signupTier.toLowerCase().startsWith("reader")
                ? ("reader" as const)
                : null;
    const startCheckout = async () => {
        if (!paidTier)
            return;
        setPending(true);
        setError("");
        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier: paidTier, cadence: "monthly" }),
            });
            if (!response.ok) {
                const result = (await response.json()) as {
                    error?: string;
                };
                setError(result.error ?? "Secure checkout is temporarily unavailable.");
                return;
            }
            const result = (await response.json()) as {
                url?: string;
            };
            if (!result.url) {
                setError("Secure checkout is temporarily unavailable.");
                return;
            }
            window.location.assign(result.url);
        }
        catch {
            setError("We couldn’t reach secure checkout.");
        }
        finally {
            setPending(false);
        }
    };
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:640px] [margin:0_auto] [padding:52px_40px_88px]">
      <div className="flex items-center justify-between [margin-bottom:36px]">
        <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
          Join the Circle
        </div>
        <div className="flex items-center [gap:6px]">
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`h-1 w-[22px] rounded-full ${step >= dot ? "bg-[var(--color-hot-magenta)]" : "bg-[rgba(53,5,73,0.16)]"}`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (<>
          <h1 className="font-sans [font-weight:700] [font-size:40px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_8px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            Create your account
          </h1>
          <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_28px] text-pretty">
            Two minutes, and every chapter is yours.
          </p>

          <div className="flex items-center justify-between [gap:16px] [background:var(--color-cool-teal)] [border-radius:18px] [padding:16px_20px] [margin-bottom:24px]">
            <div>
              <div className="font-sans [font-size:10px] [letter-spacing:0.14em] uppercase [color:rgba(53,5,73,0.6)] [font-weight:700] [margin-bottom:3px]">
                Your plan
              </div>
              <div className="font-sans [font-weight:700] [font-size:16px] [color:var(--color-deep-plum)]">
                {signupTier}
              </div>
            </div>
            <Link href="/membership" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
              Change plan
            </Link>
          </div>

          <form onSubmit={signupContinue} className="flex flex-col [gap:14px]">
            <label className="flex flex-col [gap:7px]">
              <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                First name
              </span>
              <input type="text" name="name" autoComplete="given-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="What should we call you?" className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] font-sans [font-size:15px] [color:var(--color-deep-plum)]"/>
            </label>
            <label className="flex flex-col [gap:7px]">
              <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                Email
              </span>
              <input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] font-sans [font-size:15px] [color:var(--color-deep-plum)]"/>
            </label>
            <label className="flex flex-col [gap:7px]">
              <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                Password
              </span>
              <input type="password" name="new-password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] font-sans [font-size:15px] [color:var(--color-deep-plum)]"/>
            </label>
            {error && (<p role="alert" className="[margin:2px_0_0] [color:var(--color-hot-magenta)] [font-size:13px] [line-height:1.5] text-pretty">
                {error}
              </p>)}
            <button type="submit" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [margin-top:8px] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              Continue
            </button>
          </form>
          <p className="[font-size:14px] [color:var(--color-plum-copy)] [margin:22px_0_0] text-center text-pretty">
            Already a member?{" "}
            <Link href="/signin" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-hot-magenta)] [padding:0px]">
              Sign in
            </Link>
          </p>
        </>)}

      {step === 2 && (<>
          <h1 className="font-sans [font-weight:700] [font-size:40px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_8px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            What do you love to read?
          </h1>
          <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_28px] text-pretty">
            Pick a few — your shelf and recommendations start here.
          </p>

          <div className="flex flex-wrap [gap:10px] [margin-bottom:32px]">
            {prefOptions.map((label) => {
                const on = selectedPreferences.has(label);
                return (<button key={label} type="button" onClick={() => togglePref(label)} className={`rounded-full border px-5 py-[11px] font-sans text-sm font-semibold transition-colors duration-150 ${on ? "border-[var(--color-deep-plum)] bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)]" : "border-[rgba(53,5,73,0.16)] bg-[var(--color-brand-surface)] text-[var(--color-deep-plum)]"}`}>
                  {label}
                </button>);
            })}
          </div>

          <div className="flex items-center justify-between [gap:16px] [background:var(--color-brand-surface)] [border-radius:18px] [padding:16px_20px] [margin-bottom:32px]">
            <div>
              <div className="font-sans [font-weight:600] [font-size:14px] [color:var(--color-deep-plum)]">
                Tuesday chapter alerts
              </div>
              <div className="[font-size:13px] [color:var(--color-plum-muted)] [margin-top:2px]">
                One email when a new chapter drops. Nothing else.
              </div>
            </div>
            <button type="button" onClick={() => setAlerts((a) => !a)} aria-pressed={alerts} aria-label="Toggle Tuesday chapter alerts" className={`relative h-[26px] w-[46px] flex-none rounded-full transition-colors duration-150 ${alerts ? "bg-[var(--color-hot-magenta)]" : "bg-[rgba(53,5,73,0.16)]"}`}>
              <span className={`absolute top-[3px] size-5 rounded-full bg-white shadow-sm transition-[left] duration-150 ${alerts ? "left-[23px]" : "left-[3px]"}`}></span>
            </button>
          </div>

          <div className="flex [gap:12px] items-center">
            {error && (<p role="alert" className="[flex-basis:100%] [margin:0_0_6px] [color:var(--color-hot-magenta)] [font-size:13px] text-pretty">
                {error}
              </p>)}
            <button type="button" onClick={signupFinish} disabled={pending} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_28px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              {pending ? "Creating your account…" : "Create my account"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-plum-copy)]">
              Back
            </button>
          </div>
        </>)}

      {step === 3 && (<div className="text-center [padding:24px_0_0]">
          <div className="[width:72px] [height:72px] [border-radius:999px] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] flex items-center justify-center [margin:0_auto_26px]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </div>
          <h1 className="font-sans [font-weight:700] [font-size:40px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_10px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
            You&apos;re in.
          </h1>
          <p className="[font-size:16px] [line-height:1.6] [color:var(--color-plum-copy)] [max-width:40ch] [margin:0_auto_30px] text-pretty">
            Your{" "}
            <strong className="font-sans [font-weight:600] [color:var(--color-deep-plum)]">
              {signupTier}
            </strong>{" "}
            account is ready. If you selected a paid Circle, checkout is the
            next step. Chapter 11 of{" "}
            <em className="font-serif [font-style:normal]">
              Forty-Nothing
            </em>{" "}
            is waiting.
          </p>
          <div className="flex [gap:12px] justify-center flex-wrap">
            {paidTier ? (<button type="button" onClick={startCheckout} disabled={pending} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_28px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
                {pending ? "Opening checkout…" : "Continue to secure checkout ↗"}
              </button>) : (<Link href="/serial" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 inline-block [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_28px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
                Start reading ↗
              </Link>)}
            <Link href="/dashboard" className="transition duration-150 hover:border-[var(--color-plum-copy)] hover:bg-black/5 inline-block [background:transparent] [color:var(--color-deep-plum)] [border:1px_solid_rgba(53,5,73,0.16)] [padding:14px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
              Go to my shelf
            </Link>
          </div>
          {error && (<p role="alert" className="[margin:18px_auto_0] [color:var(--color-hot-magenta)] [font-size:13px] [max-width:44ch] text-pretty">
              {error}
            </p>)}
        </div>)}
    </main>);
}
