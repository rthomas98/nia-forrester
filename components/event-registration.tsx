"use client";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth-context";

type Event = FunctionReturnType<typeof api.events.upcoming>[number];
const button = "min-h-11 rounded-full bg-[var(--color-deep-plum)] px-5 py-3 font-semibold text-white disabled:opacity-50";
const input = "mt-2 block min-h-11 w-full rounded-xl border border-[var(--color-deep-plum)]/30 bg-white p-3 text-[var(--color-deep-plum)]";
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
  return <div className="mt-5 border-t border-current/15 pt-5">
    {registration === undefined ? <p role="status">Loading your registration…</p> : active ? <div>
      <p role="status" className="text-lg font-bold">{registration.status === "registered" ? "You’re Registered" : "You’re on the Waitlist"}</p>
      {registration.status === "waitlisted" && <p className="mt-2">This is not a confirmed place. Check this page for your registration status.</p>}
      <p className="mt-2 break-words">{registration.attendeeName ?? user?.name} · {(registration.attendance ?? event.format) === "virtual" ? "Online" : (registration.attendance ?? event.format) === "in_person" ? "In Person" : "Attendance Not Specified"} · {1 + registration.guests} attendee{registration.guests ? "s" : ""}</p>
      <p className="mt-2 text-sm">Your registration is saved to your account. No confirmation email has been sent.</p>
      {registration.status === "registered" && registration.attendance === "virtual" && !event.meetingUrl && <p className="mt-2 text-sm">Online joining details have not been published yet.</p>}
      {confirmCancel ? <div className="mt-4"><p>Cancel your {registration.status === "waitlisted" ? "waitlist request" : "registration"}?</p><div className="mt-3 flex flex-wrap gap-3"><button className={button} disabled={busy} onClick={() => void withdraw()}>Confirm Cancellation</button><button className="min-h-11 px-4 underline" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep Registration</button></div></div> : <button className="mt-3 min-h-11 underline" onClick={() => setConfirmCancel(true)}>Cancel Registration</button>}
    </div> : !open ? <button className={button} disabled={event.full && !event.waitlistEnabled} onClick={() => setOpen(true)}>{event.full ? event.waitlistEnabled ? "Join Waitlist" : "Event Full" : "Register"}</button> : <form onSubmit={submit} className="grid max-w-xl gap-5">
      <h3 className="text-xl font-bold">{event.full ? "Join the Waitlist" : "Event Registration"}</h3>
      <label className="font-semibold">Attendee Name<input className={input} name="name" autoComplete="name" defaultValue={user?.name ?? ""} required minLength={2} maxLength={100} /></label>
      <label className="font-semibold">Account Email<input className={input} type="email" value={user?.email ?? ""} readOnly /><span className="text-sm font-normal">Registration belongs to this signed-in account.</span></label>
      {event.format === "hybrid" ? <label className="font-semibold">How Will You Attend?<select className={input} value={attendance} onChange={e => setAttendance(e.target.value === "in_person" ? "in_person" : "virtual")}><option value="virtual">Online</option><option value="in_person">In Person</option></select></label> : <p>Attendance: <strong>{attendance === "virtual" ? "Online" : "In Person"}</strong></p>}
      {attendance === "in_person" && <label className="font-semibold">Additional Guests<select name="guests" className={input} defaultValue="0">{[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select><span className="text-sm font-normal">Your whole group must fit; otherwise the group is waitlisted if enabled.</span></label>}
      <label className="font-semibold">Note for the Organizer (Optional)<textarea name="note" className={input} rows={3} maxLength={1000} /><span className="text-sm font-normal">Share logistics or access requests. Please don’t include medical or sensitive information.</span></label>
      <label className="flex items-start gap-3"><input className="mt-1 size-5 shrink-0" type="checkbox" name="acknowledged" required /><span>I’ve checked the date, timezone, and attendance option. If capacity is reached, I understand my request may be waitlisted rather than confirmed.</span></label>
      <div className="flex flex-wrap gap-3"><button className={button} disabled={busy}>{busy ? "Saving…" : event.full ? "Submit Waitlist Request" : "Confirm Registration"}</button><button type="button" className="min-h-11 px-4 underline" disabled={busy} onClick={() => setOpen(false)}>Close</button></div>
    </form>}
    {error && <p role="alert" className="mt-3">{error}</p>}
  </div>;
}
