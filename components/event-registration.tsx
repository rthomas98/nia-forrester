"use client";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { alertText, fieldHint, fieldLabel, heading5, muted, nativeCheckbox, nativeSelect, statusText } from "@/lib/typography";

type Event = FunctionReturnType<typeof api.events.upcoming>[number];
export function EventRegistration({ event }: { event: Event }) {
  const { user } = useAuth();
  const registration = useQuery(api.events.mine, { eventId: event._id });
  const register = useMutation(api.events.register);
  const cancel = useMutation(api.events.cancel);
  const [open, setOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [attendance, setAttendance] = useState<"virtual" | "in_person">(event.format === "in_person" ? "in_person" : "virtual");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try {
      await register({ eventId: event._id, attendeeName: String(data.get("name") ?? ""), attendance, guests: attendance === "virtual" ? 0 : Number(data.get("guests") ?? 0), note: String(data.get("note") ?? ""), acknowledged: data.get("acknowledged") === "on" });
      setOpen(false);
    } catch { setError("We couldn’t complete registration. Check availability and your membership, then try again."); }
    finally { setBusy(false); }
  }
  async function withdraw() {
    setBusy(true); setError("");
    try { await cancel({ eventId: event._id }); setConfirmCancel(false); }
    catch { setError("Cancellation failed. Please try again."); }
    finally { setBusy(false); }
  }
  const active = registration?.status === "registered" || registration?.status === "waitlisted";
  return <div className="mt-5 border-t border-hairline pt-5">
    {registration === undefined ? <p role="status" className={statusText}>Loading your registration…</p> : active ? <div className="text-body">
      <p role="status" className={heading5}>{registration.status === "registered" ? "You’re Registered" : "You’re on the Waitlist"}</p>
      {registration.status === "waitlisted" && <p className="mt-2 text-small">This is not a confirmed place. Check this page for your registration status.</p>}
      <p className="mt-2 break-words">{registration.attendeeName ?? user?.name} · {(registration.attendance ?? event.format) === "virtual" ? "Online" : (registration.attendance ?? event.format) === "in_person" ? "In Person" : "Attendance Not Specified"} · {1 + registration.guests} attendee{registration.guests ? "s" : ""}</p>
      <p className={`mt-2 ${muted}`}>Your registration is saved to your account. No confirmation email has been sent.</p>
      {registration.status === "registered" && registration.attendance === "virtual" && !event.meetingUrl && <p className={`mt-2 ${muted}`}>Online joining details have not been published yet.</p>}
      {confirmCancel ? <div className="mt-4"><p className="text-cream">Cancel your {registration.status === "waitlisted" ? "waitlist request" : "registration"}?</p><div className="mt-3 flex flex-wrap gap-3"><Button size="sm" disabled={busy} onClick={() => void withdraw()}>Confirm Cancellation</Button><Button variant="link" size="link" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep Registration</Button></div></div> : <Button variant="link" size="link" className="mt-3" onClick={() => setConfirmCancel(true)}>Cancel Registration</Button>}
    </div> : !open ? <Button size="sm" disabled={event.full && !event.waitlistEnabled} onClick={() => setOpen(true)}>{event.full ? event.waitlistEnabled ? "Join Waitlist" : "Event Full" : "Register"}</Button> : <form onSubmit={submit} className="grid max-w-xl gap-5 rounded-card border border-scheme-border bg-wine-card p-5 sm:p-6">
      <h3 className={heading5}>{event.full ? "Join the Waitlist" : "Event Registration"}</h3>
      <label className={fieldLabel}>Attendee Name<Input name="name" autoComplete="name" defaultValue={user?.name ?? ""} required minLength={2} maxLength={100} /></label>
      <label className={fieldLabel}>Account Email<Input type="email" value={user?.email ?? ""} readOnly /><span className={fieldHint}>Registration belongs to this signed-in account.</span></label>
      {event.format === "hybrid" ? <label className={fieldLabel}>How Will You Attend?<select className={nativeSelect} value={attendance} onChange={e => setAttendance(e.target.value === "in_person" ? "in_person" : "virtual")}><option value="virtual">Online</option><option value="in_person">In Person</option></select></label> : <p className="text-body">Attendance: <strong className="text-cream">{attendance === "virtual" ? "Online" : "In Person"}</strong></p>}
      {attendance === "in_person" && <label className={fieldLabel}>Additional Guests<select name="guests" className={nativeSelect} defaultValue="0">{[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select><span className={fieldHint}>Your whole group must fit; otherwise the group is waitlisted if enabled.</span></label>}
      <label className={fieldLabel}>Note for the Organizer (Optional)<Textarea name="note" rows={3} maxLength={1000} /><span className={fieldHint}>Share logistics or access requests. Please don’t include medical or sensitive information.</span></label>
      <label className="flex items-start gap-3 text-small text-body"><input className={nativeCheckbox} type="checkbox" name="acknowledged" required /><span>I’ve checked the date, timezone, and attendance option. If capacity is reached, I understand my request may be waitlisted rather than confirmed.</span></label>
      <div className="flex flex-wrap items-center gap-4"><Button type="submit" disabled={busy}>{busy ? "Saving…" : event.full ? "Submit Waitlist Request" : "Confirm Registration"}</Button><Button type="button" variant="link" size="link" disabled={busy} onClick={() => setOpen(false)}>Close</Button></div>
    </form>}
    {error && <p role="alert" className={`mt-3 ${alertText}`}>{error}</p>}
  </div>;
}
