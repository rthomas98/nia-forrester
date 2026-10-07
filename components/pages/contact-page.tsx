"use client";
import { useState } from "react";
import { Check } from "relume-icons";
import { Contact3 } from "@/components/relume/contact3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { alertText } from "@/lib/typography";
import { submitContact } from "@/lib/contact-submit";

export default function ContactPage() {
    const [sent, setSent] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        // submitContact never throws; the form (and its values) stays mounted on failure.
        try {
            const result = await submitContact({
                name: form.get("name"),
                email: form.get("email"),
                message: form.get("message"),
                website: form.get("website"),
            });
            if (result.ok) setSent(true);
            else setError(result.error);
        }
        finally {
            setPending(false);
        }
    }
    return (<main>
      <Contact3
        tagline="Contact"
        heading="Send a Note"
        description={<p>
            Questions about books, events, memberships, or the Writing Studio are
            welcome. This form sends a private message; it does not subscribe you.
          </p>}
      >
        {sent ? (<div role="status" className="flex items-center gap-4 rounded-card border border-scheme-border bg-wine-card p-6 text-body">
            <span className="flex size-10 flex-none items-center justify-center rounded-full bg-champagne text-wine-sunken">
              <Check aria-hidden="true" className="size-5"/>
            </span>
            Thank you. Your message is safely in the inbox.
          </div>) : (<form onSubmit={submit} className="relative grid w-full grid-cols-1 gap-6">
            <div className="grid w-full items-center">
              <Label htmlFor="contact-name" className="mb-2">Name</Label>
              <Input id="contact-name" name="name" autoComplete="name" required maxLength={120}/>
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="contact-email" className="mb-2">Email</Label>
              <Input id="contact-email" type="email" name="email" autoComplete="email" required/>
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="contact-message" className="mb-2">Message</Label>
              <Textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={8} placeholder="Type your message..." className="min-h-[11.25rem] resize-y overflow-auto"/>
            </div>
            <label aria-hidden="true" className="absolute -left-[10000px]">
              Website
              <input name="website" tabIndex={-1} autoComplete="off"/>
            </label>
            {error && (<p role="alert" className={alertText}>
                {error}
              </p>)}
            <div>
              <Button type="submit" disabled={pending}>
                {pending ? "Sending…" : "Send Message"}
              </Button>
            </div>
          </form>)}
      </Contact3>
    </main>);
}
