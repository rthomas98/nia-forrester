"use client";
import { useState } from "react";
export default function ContactPage() {
    const [sent, setSent] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.get("name"),
                email: form.get("email"),
                message: form.get("message"),
                website: form.get("website"),
            }),
        });
        const result = (await response.json()) as {
            error?: string;
        };
        setPending(false);
        if (!response.ok) {
            setError(result.error ?? "We couldn’t send your message.");
            return;
        }
        setSent(true);
    }
    return (<main className="max-[900px]:px-8 max-[900px]:py-12 max-[640px]:px-5 max-[640px]:py-9 [max-width:720px] [margin:0_auto] [padding:64px_40px_96px]">
      <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
        Contact
      </div>
      <h1 className="font-sans [font-size:48px] [color:var(--color-deep-plum)] [margin:0_0_12px] text-balance max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">
        Send a note
      </h1>
      <p className="[color:var(--color-plum-copy)] [line-height:1.65] [margin:0_0_32px] text-pretty">
        Questions about books, events, memberships, or the Writing Studio are
        welcome. This form sends a private message; it does not subscribe you.
      </p>

      {sent ? (<div role="status" className="[background:var(--color-soft-lavender)] [color:var(--color-deep-plum)] [border-radius:20px] [padding:28px] [line-height:1.6]">
          Thank you. Your message is safely in the inbox.
        </div>) : (<form onSubmit={submit} className="flex flex-col [gap:18px]">
          <label className="flex flex-col [gap:7px]">
            <span className="[font-weight:700]">Name</span>
            <input name="name" autoComplete="name" required maxLength={120} className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] [font-size:16px]"/>
          </label>
          <label className="flex flex-col [gap:7px]">
            <span className="[font-weight:700]">Email</span>
            <input type="email" name="email" autoComplete="email" required className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] [font-size:16px]"/>
          </label>
          <label className="flex flex-col [gap:7px]">
            <span className="[font-weight:700]">Message</span>
            <textarea name="message" required minLength={10} maxLength={5000} rows={8} className="[border:1px_solid_rgba(53,5,73,0.16)] [background:var(--color-brand-surface)] [border-radius:14px] [padding:13px_16px] [font:inherit] [resize:vertical]"/>
          </label>
          <label aria-hidden="true" className="absolute [left:-10000px]">
            Website
            <input name="website" tabIndex={-1} autoComplete="off"/>
          </label>
          {error && (<p role="alert" className="[color:var(--color-hot-magenta)] [margin:0px] text-pretty">
              {error}
            </p>)}
          <button type="submit" disabled={pending} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [align-self:flex-start] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_28px] [border-radius:999px] [font-weight:700] [font-size:15px]">
            {pending ? "Sending…" : "Send message"}
          </button>
        </form>)}
    </main>);
}
