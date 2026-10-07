"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { prefOptions } from "@/lib/data";
import { useAuth } from "@/components/auth-context";
import { authClient } from "@/lib/auth-client";
import { completeReaderProfile } from "@/app/signup/actions";
import Image from "next/image";
import { Check } from "relume-icons";
import { Login7 } from "@/components/relume/login7";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { alertText, muted, textLink } from "@/lib/typography";

const stepTitles = {
    1: "Create Your Account",
    2: "What Do You Love to Read?",
    3: "You’re In.",
} as const;
const stepDescriptions = {
    1: "Create an account to build your reading library.",
    2: "Pick a few — your shelf and recommendations start here.",
    3: "Your account is ready.",
} as const;

export default function SignUpPage() {
    const params = useSearchParams();
    const signupTier = params.get("tier") ?? "Reader Circle";
    const cadence = params.get("cadence") === "annual" ? "annual" : "monthly";
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
                body: JSON.stringify({ tier: paidTier, cadence }),
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
    const currentStep = step as 1 | 2 | 3;
    return (<main>
      <Login7
        tagline={`Join the Circle · Step ${step} of 3`}
        title={stepTitles[currentStep]}
        description={<>
            <p>{stepDescriptions[currentStep]}</p>
            <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((dot) => (<span key={dot} className={`h-0.5 w-8 rounded-full ${step >= dot ? "bg-champagne" : "bg-scheme-border"}`}/>))}
            </div>
          </>}
        image={<Image src="/images/reader-circle.png" alt="An imagined book-club gathering of four women sharing a novel and conversation" fill sizes="50vw" className="object-cover"/>}
        footer={step === 1 ? <>
            <p>Already a member?</p>
            <Link href="/signin" className={textLink}>Sign In</Link>
          </> : undefined}
      >
        {step === 1 && (<>
            <div className="mb-6 flex items-center justify-between gap-4 rounded-card border border-scheme-border bg-wine-card px-5 py-4">
              <div>
                <p className="font-ui text-tiny font-semibold tracking-[0.16em] text-taupe uppercase">Your Plan</p>
                <p className="font-display text-h6 font-semibold text-cream">{signupTier}</p>
              </div>
              <Link href="/membership" className={textLink}>
                Change Plan
              </Link>
            </div>
            <form onSubmit={signupContinue} className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1">
                <Label htmlFor="signup-name" className="mb-2">First Name</Label>
                <Input id="signup-name" type="text" name="name" autoComplete="given-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="What should we call you?"/>
              </div>
              <div className="grid grid-cols-1">
                <Label htmlFor="signup-email" className="mb-2">Email</Label>
                <Input id="signup-email" type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"/>
              </div>
              <div className="grid grid-cols-1">
                <Label htmlFor="signup-password" className="mb-2">Password</Label>
                <Input id="signup-password" type="password" name="new-password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters"/>
              </div>
              {error && (<p role="alert" className={alertText}>{error}</p>)}
              <Button type="submit">Continue</Button>
            </form>
          </>)}

        {step === 2 && (<>
            <div role="group" aria-label="Reading preferences" className="mb-8 flex flex-wrap justify-center gap-2.5">
              {prefOptions.map((label) => {
                const on = selectedPreferences.has(label);
                return (<button key={label} type="button" aria-pressed={on} onClick={() => togglePref(label)} className={cn(buttonVariants({ variant: on ? "alternate" : "secondary", size: "sm" }), "normal-case tracking-[0.04em]")}>
                    {label}
                  </button>);
              })}
            </div>

            <div className="mb-8 flex items-center justify-between gap-4 rounded-card border border-scheme-border bg-wine-card px-5 py-4">
              <div>
                <p className="font-ui text-small font-semibold text-cream">Chapter Alerts</p>
                <p className={muted}>Save your preference for chapter updates.</p>
              </div>
              <button type="button" onClick={() => setAlerts((a) => !a)} aria-pressed={alerts} aria-label="Toggle Chapter alerts" className={`relative h-[26px] w-[46px] flex-none cursor-pointer rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne ${alerts ? "bg-champagne" : "bg-wine-raised"}`}>
                <span className={`absolute top-[3px] size-5 rounded-full bg-cream shadow-sm transition-[left] duration-150 motion-reduce:transition-none ${alerts ? "left-[23px]" : "left-[3px]"}`}></span>
              </button>
            </div>

            {error && (<p role="alert" className={`mb-4 ${alertText}`}>{error}</p>)}
            <div className="grid grid-cols-1 gap-4">
              <Button type="button" onClick={signupFinish} disabled={pending}>
                {pending ? "Creating your account…" : "Create My Account"}
              </Button>
              <Button type="button" variant="link" size="link" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </>)}

        {step === 3 && (<div className="text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-champagne text-wine-sunken">
              <Check aria-hidden="true" className="size-7"/>
            </div>
            <p className="mx-auto mb-8 max-w-[40ch] text-pretty text-body">
              Your{" "}
              <strong className="font-semibold text-cream">{signupTier}</strong>{" "}
              account is ready. If you selected a paid Circle, checkout is the
              next step. Explore the library when you’re ready.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {paidTier ? (<Button type="button" onClick={startCheckout} disabled={pending}>
                  {pending ? "Opening checkout…" : "Continue to Secure Checkout ↗"}
                </Button>) : (<Link href="/serial" className={buttonVariants()}>
                  Start Reading ↗
                </Link>)}
              <Link href="/dashboard" className={buttonVariants({ variant: "secondary" })}>
                Go to My Shelf
              </Link>
            </div>
            {error && (<p role="alert" className={`mx-auto mt-5 max-w-[44ch] ${alertText}`}>{error}</p>)}
          </div>)}
      </Login7>
    </main>);
}
