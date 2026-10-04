"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Login7 } from "@/components/relume/login7";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { alertText, statusText, textLink } from "@/lib/typography";
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
    return (<main>
      <Login7
        tagline="Welcome Back"
        title="Pick Up Where You Left Off"
        description={<p>Your library, your chapters, your Circle.</p>}
        image={<Image src="/images/nia-hero.jpg" alt="Portrait of Nia Forrester" fill sizes="50vw" className="object-cover object-center" />}
        footer={<>
            <p>New here?</p>
            <Link href="/membership" className={textLink}>
              Join the Circle ↗
            </Link>
          </>}
      >
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
        }} className="grid grid-cols-1 gap-6">
          <div className="grid w-full items-center">
            <Label htmlFor="signin-email" className="mb-2">
              Email
            </Label>
            <Input id="signin-email" type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"/>
          </div>
          <div className="grid w-full grid-cols-1 items-center">
            <div className="flex items-start justify-between">
              <Label htmlFor="signin-password" className="mb-2">
                Password
              </Label>
              <Link href="/reset" className="text-small text-champagne underline underline-offset-4 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne">
                Forgot it?
              </Link>
            </div>
            <Input id="signin-password" type="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••"/>
          </div>
          {(error || notice) && (<p role={error ? "alert" : "status"} className={error ? alertText : statusText}>
              {error || notice}
            </p>)}
          <div className="grid grid-cols-1 gap-4">
            <Button type="submit" disabled={pending}>
              {pending ? "Signing in…" : "Sign In"}
            </Button>
            <div className="flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-scheme-border"/>
              <span className="font-ui text-tiny tracking-[0.16em] text-taupe uppercase">or</span>
              <span className="h-px flex-1 bg-scheme-border"/>
            </div>
            <Button type="button" variant="secondary" onClick={handleMagicLink} disabled={pending}>
              Email Me a Sign-In Link
            </Button>
          </div>
        </form>
      </Login7>
    </main>);
}
