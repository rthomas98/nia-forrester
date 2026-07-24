"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { authClient } from "@/lib/auth-client";
export default function SignInPage() {
    const router = useRouter();
    const { configured } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [pending, setPending] = useState(false);
    const handleSignIn = async () => {
        if (!configured) {
            setError("Account services are being connected. Please try again shortly.");
            return;
        }
        setPending(true);
        setError("");
        try {
            const result = await authClient.signIn.email({
                email: email.trim(),
                password,
                callbackURL: "/dashboard",
            });
            if (result.error) {
                setError(result.error.message ?? "We couldn’t sign you in.");
                return;
            }
            router.push("/dashboard");
            router.refresh();
        }
        catch {
            setError("We couldn’t reach the account service.");
        }
        finally {
            setPending(false);
        }
    };
    const handleMagicLink = async () => {
        if (!configured) {
            setError("Account services are being connected. Please try again shortly.");
            return;
        }
        if (!email.trim()) {
            setError("Enter your email first, then request a sign-in link.");
            return;
        }
        setPending(true);
        setError("");
        setNotice("");
        try {
            const result = await authClient.signIn.magicLink({
                email: email.trim(),
                callbackURL: "/dashboard",
                errorCallbackURL: "/signin",
            });
            if (result.error) {
                setError(result.error.message ?? "We couldn’t send the sign-in link.");
                return;
            }
            setNotice("Check your inbox. Your private sign-in link is on its way.");
        }
        catch {
            setError("We couldn’t reach the account service.");
        }
        finally {
            setPending(false);
        }
    };
    return (<main className="mx-auto max-w-[1240px] px-10 pb-[72px] pt-10 max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9">
      <div className="grid min-h-[600px] grid-cols-2 overflow-hidden rounded-[36px] shadow-[0_12px_28px_rgba(53,5,73,0.08),0_2px_6px_rgba(53,5,73,0.04)] max-[900px]:grid-cols-1 max-[640px]:min-h-0 max-[640px]:rounded-3xl">
        <div className="flex flex-col justify-center bg-[var(--color-brand-surface)] p-[clamp(40px,4.5vw,64px)] max-[640px]:p-6 max-[640px]:py-8">
          <div className="[max-width:400px] w-full [margin:0_auto]">
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
              Welcome back
            </div>
            <h1 className="font-sans [font-weight:700] [font-size:38px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0_0_8px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
              Pick up where you left off
            </h1>
            <p className="[font-size:15px] [line-height:1.6] [color:var(--color-plum-copy)] [margin:0_0_32px] text-pretty">
              Your library, your chapters, your Circle.
            </p>

            <form onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
        }} className="flex flex-col [gap:14px]">
              <label className="flex flex-col [gap:7px]">
                <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                  Email
                </span>
                <input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-soft-lavender)] [border-radius:14px] [padding:13px_16px] font-sans [font-size:15px] [color:var(--color-deep-plum)]"/>
              </label>
              <label className="flex flex-col [gap:7px]">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)]">
                    Password
                  </span>
                  <Link href="/reset" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:12px] [color:var(--color-plum-muted)] [padding:0px]">
                    Forgot it?
                  </Link>
                </div>
                <input type="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-soft-lavender)] [border-radius:14px] [padding:13px_16px] font-sans [font-size:15px] [color:var(--color-deep-plum)]"/>
              </label>
              {(error || notice) && (<p role={error ? "alert" : "status"} className={`mt-0.5 text-[13px] leading-normal ${error ? "text-[var(--color-hot-magenta)]" : "text-[var(--color-deep-plum)]"}`}>
                  {error || notice}
                </p>)}
              <button type="submit" disabled={pending} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [margin-top:8px] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_26px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
                {pending ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="flex items-center [gap:14px] [margin:24px_0]">
              <span className="[flex:1] [height:1px] [background:rgba(53,5,73,0.08)]"/>
              <span className="font-sans [font-size:12px] [font-weight:500] [color:var(--color-plum-faint)]">
                or
              </span>
              <span className="[flex:1] [height:1px] [background:rgba(53,5,73,0.08)]"/>
            </div>
            <button type="button" onClick={handleMagicLink} disabled={pending} className="transition duration-150 hover:border-[var(--color-plum-copy)] hover:bg-black/5 w-full [background:transparent] [color:var(--color-deep-plum)] [border:1px_solid_rgba(53,5,73,0.16)] [padding:14px_24px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
              Email me a sign-in link
            </button>

            <p className="[font-size:14px] [color:var(--color-plum-copy)] [margin:28px_0_0] text-center text-pretty">
              New here?{" "}
              <Link href="/membership" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-hot-magenta)] [padding:0px]">
                Join the Circle ↗
              </Link>
            </p>
          </div>
        </div>

        <div className="[background:var(--color-deep-plum)] [padding:clamp(40px,4.5vw,64px)] flex flex-col justify-between [gap:48px]">
          <div className="flex items-baseline [gap:8px]">
            <span className="[width:9px] [height:9px] [border-radius:999px] [background:var(--color-hot-magenta)] inline-block"/>
            <span className="font-sans [font-weight:700] [font-size:16px] [letter-spacing:-0.01em] [color:var(--color-soft-lavender)]">
              The Reader Circle
            </span>
          </div>
          <blockquote className="[margin:0px]">
            <p className="font-serif [font-style:italic] [font-weight:500] [font-size:clamp(24px,2.4vw,32px)] [line-height:1.4] [color:var(--color-soft-lavender)] [margin:0_0_24px] text-pretty">
              &ldquo;I came for the books. I stayed because Tuesday chapter drops turned
              into the best group chat I&apos;ve ever been in.&rdquo;
            </p>
            <footer className="flex items-center [gap:12px]">
              <div className="flex-none [width:42px] [height:42px] [border-radius:999px] [background:var(--color-hot-magenta)] [color:var(--color-soft-lavender)] flex items-center justify-center font-sans [font-weight:700] [font-size:13px]">
                IK
              </div>
              <div>
                <div className="font-sans [font-weight:600] [font-size:14px] [color:var(--color-soft-lavender)]">
                  Imani K.
                </div>
                <div className="font-sans [font-size:12px] [color:rgba(196,185,203,0.6)]">
                  Member since 2023 · 112 threads
                </div>
              </div>
            </footer>
          </blockquote>
          <div className="flex items-center [gap:12px] font-sans [font-size:13px] [font-weight:500] [color:rgba(196,185,203,0.65)]">
            <span>46 books</span>
            <span className="[width:3px] [height:3px] [border-radius:999px] [background:rgba(196,185,203,0.4)]"/>
            <span>1,240 readers</span>
            <span className="[width:3px] [height:3px] [border-radius:999px] [background:rgba(196,185,203,0.4)]"/>
            <span>New chapters weekly</span>
          </div>
        </div>
      </div>
    </main>);
}
