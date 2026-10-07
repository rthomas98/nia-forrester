"use client";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Check } from "relume-icons";
import { eventTypeLabels } from "@/lib/inquiries";
import { academyOffers } from "@/lib/legacy-offers";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { alertText, fieldHint, heading4, muted, nativeSelect } from "@/lib/typography";
import { cn } from "@/lib/utils";

const select = cn(nativeSelect, "mt-0");

/** Event types accepted by POST /api/inquiries for `kind: "invitation"`. */
const eventTypes = Object.entries(eventTypeLabels);

const DETAILS_MIN = 20;
const DETAILS_MAX = 4000;

function formatPrice(cents: number) {
  return cents === 0 ? "Free" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function text(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

type InquiryBody = Record<string, string | number | undefined>;
type SavedResponse = Record<string, unknown> & { saved: true };
type InquiryResult = { ok: true; response: SavedResponse } | { ok: false; error: string };

/** Posts one inquiry. Only an HTTP 202 whose JSON body has `saved: true` counts as saved. */
async function postInquiry(body: InquiryBody): Promise<InquiryResult> {
  try {
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result: unknown = await response.json().catch(() => null);
    const record = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : null;
    if (response.status === 202 && record?.saved === true) return { ok: true, response: record as SavedResponse };
    return {
      ok: false,
      error: typeof record?.error === "string" && record.error
        ? record.error
        : "We couldn’t save your request. Please check the form and try again.",
    };
  } catch {
    return { ok: false, error: "We couldn’t reach the server. Please check your connection and try again." };
  }
}

function useInquiry(build: (form: FormData) => InquiryBody) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedResponse | null>(null);
  const [submitted, setSubmitted] = useState<InquiryBody | null>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const body = build(new FormData(event.currentTarget));
      const result = await postInquiry(body);
      if (result.ok) {
        setSubmitted(body);
        setSaved(result.response);
      } else setError(result.error);
    } finally {
      setPending(false);
    }
  }
  return { pending, error, saved, submitted, onSubmit };
}

function Saved({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex items-start gap-4 rounded-card border border-scheme-border bg-wine-card p-6 text-body">
      <span className="flex size-10 flex-none items-center justify-center rounded-full bg-champagne text-wine-sunken">
        <Check aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="font-display text-h6 font-semibold text-cream">Your request has been saved.</p>
        <div className="mt-1 grid gap-3 text-small text-body">{children}</div>
      </div>
    </div>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid w-full items-center">
      <Label htmlFor={id} className="mb-2">{label}</Label>
      {children}
      {hint ? <p id={`${id}-hint`} className={`mt-2 ${fieldHint}`}>{hint}</p> : null}
    </div>
  );
}

/** Off-screen honeypot; real visitors never see or fill it. */
function Honeypot() {
  return (
    <label aria-hidden="true" className="absolute -left-[10000px]">
      Website
      <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  );
}

function FormFooter({ pending, error, errorId, label }: { pending: boolean; error: string; errorId: string; label: string }) {
  return (
    <>
      {error ? <p id={errorId} role="alert" className={alertText}>{error}</p> : null}
      <div>
        <Button type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? "Sending…" : label}
        </Button>
      </div>
    </>
  );
}

const detailsHint = `Between ${DETAILS_MIN} and ${DETAILS_MAX.toLocaleString("en-US")} characters.`;

/** Work with Nia: an editing, coaching or workshop request. */
export function AcademyInquiryForm() {
  const id = useId();
  const errorId = `${id}-error`;
  const { pending, error, saved, onSubmit } = useInquiry((form) => ({
    kind: "academy",
    name: text(form, "name"),
    email: text(form, "email"),
    optionId: text(form, "optionId"),
    details: text(form, "details"),
    requestedDate: text(form, "requestedDate") || undefined,
    website: text(form, "website"),
  }));

  if (saved) {
    return <Saved>Nia’s studio will review it and reply to the email you provided. This is not a confirmed booking, and no payment has been taken.</Saved>;
  }

  return (
    <form onSubmit={onSubmit} aria-describedby={error ? errorId : undefined} className="relative grid w-full grid-cols-1 gap-6">
      <Field id={`${id}-option`} label="How Would You Like to Work With Nia?">
        <select id={`${id}-option`} name="optionId" required defaultValue="" className={select}>
          <option value="" disabled>Select an option</option>
          {academyOffers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.title} · {formatPrice(offer.priceInCents)}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Name">
          <Input id={`${id}-name`} name="name" autoComplete="name" required maxLength={120} />
        </Field>
        <Field id={`${id}-email`} label="Email">
          <Input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={320} />
        </Field>
      </div>
      <Field id={`${id}-details`} label="Tell Nia About Your Project" hint={detailsHint}>
        <Textarea id={`${id}-details`} name="details" required minLength={DETAILS_MIN} maxLength={DETAILS_MAX} rows={7} aria-describedby={`${id}-details-hint`} className="min-h-[11.25rem] resize-y overflow-auto" />
      </Field>
      <Field id={`${id}-date`} label="Preferred Start Date (Optional)">
        <Input id={`${id}-date`} name="requestedDate" type="date" />
      </Field>
      <Honeypot />
      <p className={muted}>Sending this form saves a request. It does not book a session or collect payment.</p>
      <FormFooter pending={pending} error={error} errorId={errorId} label="Send Request" />
    </form>
  );
}

/** Invite Nia: a festival, book club, podcast or panel invitation. */
export function InvitationForm() {
  const id = useId();
  const errorId = `${id}-error`;
  const { pending, error, saved, onSubmit } = useInquiry((form) => ({
    kind: "invitation",
    name: text(form, "name"),
    email: text(form, "email"),
    date: text(form, "date"),
    location: text(form, "location"),
    eventType: text(form, "eventType"),
    details: text(form, "details"),
    website: text(form, "website"),
  }));

  if (saved) {
    return <Saved>We’ll review the details and reply to the email you provided. This is not a confirmed appearance.</Saved>;
  }

  return (
    <div className="rounded-card border border-scheme-border bg-wine-card p-6 sm:p-8">
      <h3 id={`${id}-title`} className={`mb-6 ${heading4}`}>Invite Nia</h3>
      <form onSubmit={onSubmit} aria-labelledby={`${id}-title`} aria-describedby={error ? errorId : undefined} className="relative grid w-full grid-cols-1 gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={`${id}-name`} label="Name">
            <Input id={`${id}-name`} name="name" autoComplete="name" required maxLength={120} />
          </Field>
          <Field id={`${id}-email`} label="Email">
            <Input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={320} />
          </Field>
          <Field id={`${id}-date`} label="Event Date">
            <Input id={`${id}-date`} name="date" type="date" required />
          </Field>
          <Field id={`${id}-location`} label="Location">
            <Input id={`${id}-location`} name="location" required maxLength={250} placeholder="City, venue, or online" />
          </Field>
        </div>
        <Field id={`${id}-type`} label="Event Type">
          <select id={`${id}-type`} name="eventType" required defaultValue="" className={select}>
            <option value="" disabled>Select an event type</option>
            {eventTypes.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-details`} label="Event Details" hint={detailsHint}>
          <Textarea id={`${id}-details`} name="details" required minLength={DETAILS_MIN} maxLength={DETAILS_MAX} rows={6} aria-describedby={`${id}-details-hint`} className="min-h-[9rem] resize-y overflow-auto" />
        </Field>
        <Honeypot />
        <FormFooter pending={pending} error={error} errorId={errorId} label="Send Invitation" />
      </form>
    </div>
  );
}

const PERSONALIZATION_MAX = 500;
const QUANTITY_MAX = 10;

/** Accepts only an https product page on Nia’s original shop. */
function originalShopUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const host = url.hostname === "niaforrester.com" || url.hostname === "www.niaforrester.com";
    return url.protocol === "https:" && host && url.pathname.startsWith("/product-page/") ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Signed copy: saves the inscription request, then hands the reader to the original
 * shop to pay. Nothing is sent to the shop until the reader follows the link.
 */
export function SignedCopyInquiryForm({ bookSlug, fallbackCheckoutUrl }: { bookSlug: string; fallbackCheckoutUrl: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  const { pending, error, saved, submitted, onSubmit } = useInquiry((form) => ({
    kind: "signed_copy",
    bookSlug,
    name: text(form, "name"),
    email: text(form, "email"),
    quantity: Number(text(form, "quantity")),
    personalization: text(form, "personalization"),
    website: text(form, "website"),
  }));

  if (saved) {
    const checkoutUrl = originalShopUrl(saved.checkoutUrl) ?? originalShopUrl(fallbackCheckoutUrl);
    const email = typeof submitted?.email === "string" ? submitted.email : "";
    const quantity = typeof submitted?.quantity === "number" ? submitted.quantity : null;
    return (
      <Saved>
        <p>
          Your inscription request is saved. Your order is not placed yet and no payment has been taken.
        </p>
        <p>
          To finish, complete your purchase on Nia’s original shop using the same email address
          {email ? <> (<span className="break-all text-cream">{email}</span>)</> : null}
          {quantity ? <> and the same quantity ({quantity} {quantity === 1 ? "copy" : "copies"})</> : null} so your
          request can be matched to your order. Shipping and payment are handled by the original shop.
        </p>
        {checkoutUrl ? (
          <div>
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "gap-2")}>
              Complete Purchase on Original Shop
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        ) : (
          <p>The shop link is unavailable right now. Please contact the studio to finish your order.</p>
        )}
      </Saved>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-describedby={error ? errorId : undefined} className="relative grid w-full grid-cols-1 gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Name">
          <Input id={`${id}-name`} name="name" autoComplete="name" required maxLength={120} />
        </Field>
        <Field id={`${id}-email`} label="Email" hint="Use this same email when you check out on the original shop.">
          <Input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={320} aria-describedby={`${id}-email-hint`} />
        </Field>
      </div>
      <Field id={`${id}-quantity`} label="Quantity" hint={`1 to ${QUANTITY_MAX} copies.`}>
        <Input id={`${id}-quantity`} name="quantity" type="number" inputMode="numeric" required min={1} max={QUANTITY_MAX} step={1} defaultValue={1} aria-describedby={`${id}-quantity-hint`} className="max-w-32" />
      </Field>
      <Field
        id={`${id}-personalization`}
        label="Personalization (Optional)"
        hint={`Who should Nia sign it to, and anything you’d like her to write. Leave blank for a signature only. Up to ${PERSONALIZATION_MAX} characters.`}
      >
        <Textarea id={`${id}-personalization`} name="personalization" maxLength={PERSONALIZATION_MAX} rows={4} aria-describedby={`${id}-personalization-hint`} className="resize-y overflow-auto" />
      </Field>
      <Honeypot />
      <p className={muted}>Sending this form saves your inscription request only. Payment and shipping happen on the original shop in the next step.</p>
      <FormFooter pending={pending} error={error} errorId={errorId} label="Save Request" />
    </form>
  );
}
