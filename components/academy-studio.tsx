"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth-context";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { authIsConfigured } from "@/lib/auth-client";

const button = "inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-deep-plum)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50";
const input = "mt-2 block min-h-11 w-full rounded-xl border border-current/25 bg-white p-3 text-[var(--color-deep-plum)]";
const card = "min-w-0 rounded-3xl bg-[var(--color-brand-surface)] p-6 shadow-sm sm:p-8";
type Catalog = FunctionReturnType<typeof api.academy.catalog>;
type Mine = FunctionReturnType<typeof api.academy.mine>;
function message(error: unknown) { return error instanceof ConvexError && typeof error.data === "string" ? error.data : "We couldn’t save that change. Please try again."; }
function safeUrl(value?: string) { try { return value && new URL(value).protocol === "https:" ? value : null; } catch { return null; } }
function price(cents?: number) { return cents === undefined ? "Quote Required" : cents === 0 ? "Free" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100); }
function ServiceForm({ service, close }: { service: Catalog["services"][number]; close: () => void }) {
  const { user } = useAuth(); const request = useMutation(api.academy.request);
  const [busy,setBusy] = useState(false); const [error,setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const data = new FormData(e.currentTarget); setBusy(true); setError("");
    try { await request({ serviceId: service._id, name: String(data.get("name")), projectTitle: String(data.get("title")), genre: String(data.get("genre")), wordCount: Number(data.get("words")), timeline: String(data.get("timeline")), notes: String(data.get("goals")), sample: String(data.get("sample")), consent: data.get("consent") === "on" }); close(); }
    catch (err) { setError(message(err)); } finally { setBusy(false); }
  }
  return <form className="mt-6 grid gap-4 border-t border-current/15 pt-5" onSubmit={submit}>
    <h3 className="text-xl font-bold">Your Project Brief</h3><p className="text-sm">This is a request, not a confirmed appointment. No payment is collected. Availability, scope, and any fee must be agreed before work begins.</p>
    <label>Name<input className={input} name="name" defaultValue={user?.name} autoComplete="name" required minLength={2} maxLength={100} /></label>
    <p className="break-all text-sm">Account Email: {user?.email}</p>
    <label>Project Title<input className={input} name="title" required minLength={2} maxLength={200} /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label>Genre<input className={input} name="genre" required minLength={2} maxLength={100} /></label><label>Manuscript Word Count<input className={input} name="words" type="number" required min={1} max={1000000} step={1} /></label></div>
    <label>Preferred Timeline<input className={input} name="timeline" placeholder="For example: flexible, or hoping for October" required minLength={2} maxLength={300} /></label>
    <label>What Would You Like Help With?<textarea className={input} name="goals" rows={4} required minLength={20} maxLength={5000} /></label>
    <label>Manuscript Sample {service.slug === "first-ten-pages-review" ? "(Required)" : "(Optional)"}<textarea className={input} name="sample" rows={7} required={service.slug === "first-ten-pages-review"} minLength={service.slug === "first-ten-pages-review" ? 20 : undefined} maxLength={30000} /><span className="text-sm">Paste up to ten manuscript pages, maximum 3,000 words. Text only; no public document link is needed.</span></label>
    <label className="flex items-start gap-3"><input name="consent" type="checkbox" required className="mt-1 size-5 shrink-0" /><span>I have permission to share this writing and authorize studio staff to review it and respond about this request. This does not subscribe me to marketing.</span></label>
    {error && <p role="alert">{error}</p>}<div className="flex flex-wrap gap-3"><button className={button} disabled={busy}>{busy ? "Saving…" : "Send Request"}</button><button className="min-h-11 px-4 underline" type="button" disabled={busy} onClick={close}>Close</button></div>
  </form>;
}
function ServiceCard({ service, mine, authenticated }: { service: Catalog["services"][number]; mine?: Mine; authenticated: boolean }) {
  const [open,setOpen] = useState(false);
  const active = mine?.requests.some(r => r.serviceId === service._id && (r.status === "requested" || r.status === "scheduled"));
  const bookingUrl = safeUrl(service.bookingUrl);
  return <article className={card}><div className="flex flex-wrap items-start justify-between gap-3"><h2 className="text-2xl font-bold">{service.title}</h2><span className="font-bold text-[var(--color-hot-magenta)]">{price(service.priceInCents)}</span></div><p className="my-4 whitespace-pre-wrap">{service.description}</p>{service.durationMinutes && <p className="mb-3">{service.durationMinutes} minutes</p>}{service.intakeInstructions && <p className="mb-4 whitespace-pre-wrap text-sm">{service.intakeInstructions}</p>}
    {active ? <a href="#studio-requests" className={button}>View Your Request</a> : bookingUrl ? <a href={bookingUrl} className={button} target="_blank" rel="noopener noreferrer">Open Booking Provider ↗</a> : service.bookingUrl ? <p>Booking is temporarily unavailable. Please contact the studio.</p> : !authenticated ? <Link className={button} href="/signin?next=/academy">Sign In to Request</Link> : !mine ? <p role="status">Loading your requests…</p> : !open ? <button className={button} onClick={() => setOpen(true)}>Request {service.priceInCents === 0 ? "a Free Review" : "This Service"}</button> : <ServiceForm service={service} close={() => setOpen(false)} />}
  </article>;
}
function InterestButton({ courseId, active }: { courseId?: Catalog["courses"][number]["_id"]; active: boolean }) {
  const mutate = useMutation(api.academy.interest); const [busy,setBusy] = useState(false); const [error,setError] = useState("");
  async function change() { setBusy(true); setError(""); try { await mutate({ courseId, active: !active }); } catch(err) { setError(message(err)); } finally { setBusy(false); } }
  return <div>{active && <p role="status" className="mb-3 font-semibold">Your Interest Is Saved</p>}<button className={button} disabled={busy} onClick={() => void change()}>{busy ? "Saving…" : active ? "Remove My Interest" : "Save My Interest"}</button>{error && <p role="alert" className="mt-3">{error}</p>}</div>;
}
function RequestCard({ request }: { request: Mine["requests"][number] }) {
  const cancel = useMutation(api.academy.cancelRequest); const [confirm,setConfirm] = useState(false); const [busy,setBusy] = useState(false); const [error,setError] = useState("");
  async function withdraw() { setBusy(true); setError(""); try { await cancel({id:request._id}); setConfirm(false); } catch(err) { setError(message(err)); } finally { setBusy(false); } }
  return <article className={card}><h3 className="text-xl font-bold">{request.serviceTitle}</h3><p className="my-2 break-words">{request.projectTitle ?? "Your Project"} · <span className="capitalize">{request.status}</span></p><p className="text-sm">Submitted {new Date(request.createdAt).toISOString().slice(0,10)}</p>{request.scheduledAt && <p>Appointment: {new Date(request.scheduledAt).toISOString().replace("T"," ").slice(0,16)} UTC</p>}{request.staffReply && <div className="my-4 rounded-xl bg-[var(--color-cool-teal)]/15 p-4"><h4 className="font-bold">Studio Reply</h4><p className="whitespace-pre-wrap break-words">{request.staffReply}</p></div>}<details className="my-4"><summary className="min-h-11 cursor-pointer py-2">Your Submitted Brief</summary><p className="whitespace-pre-wrap break-words">{request.notes}</p><pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm">{request.sample}</pre></details>{request.status === "requested" && (confirm ? <div><p>Withdraw this pending request?</p><button className={button} disabled={busy} onClick={() => void withdraw()}>Confirm Withdrawal</button><button className="min-h-11 px-4 underline" onClick={() => setConfirm(false)}>Keep Request</button></div> : <button className="min-h-11 underline" onClick={() => setConfirm(true)}>Withdraw Request</button>)}{error && <p role="alert">{error}</p>}</article>;
}
function StaffReply({ request }: { request: FunctionReturnType<typeof api.academy.inbox>[number] }) {
  const reply = useMutation(api.academy.reply); const [busy,setBusy] = useState(false); const [notice,setNotice] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const data = new FormData(e.currentTarget); const raw = data.get("status"); const status = raw === "scheduled" || raw === "completed" || raw === "canceled" ? raw : "requested"; setBusy(true); setNotice(""); try { await reply({id:request._id, reply:String(data.get("reply")),status,scheduledAt:data.get("date") ? new Date(String(data.get("date"))+"Z").getTime() : undefined}); setNotice("Reply saved to the member’s account. No email sent."); } catch(err) {setNotice(message(err));} finally {setBusy(false);} }
  return <details className={card}><summary className="cursor-pointer font-bold">{request.name} · {request.serviceTitle} · {request.status}</summary><p className="my-3 break-all">{request.email}</p><p>{request.projectTitle} · {request.genre} · {request.wordCount} words</p><p>Timeline: {request.timeline}</p><p className="my-3 whitespace-pre-wrap break-words">{request.notes}</p><pre className="whitespace-pre-wrap break-words font-sans text-sm">{request.sample}</pre><form className="mt-4 grid gap-3" onSubmit={submit}><label>Reply<textarea name="reply" className={input} defaultValue={request.staffReply} minLength={2} maxLength={5000} required /></label><label>Status<select name="status" className={input} defaultValue={request.status}>{["requested","scheduled","completed","canceled"].map(s=><option key={s}>{s}</option>)}</select></label><label>Appointment Time (UTC, Required for Scheduled)<input name="date" className={input} type="datetime-local" /></label><button className={button} disabled={busy}>Save Reply</button>{notice && <p role="status">{notice}</p>}</form></details>;
}
function StaffInbox() { const rows=useQuery(api.academy.inbox,{}); const interests=useQuery(api.academy.interestInbox,{}); return <section className="mt-12"><h2 className="mb-5 text-2xl font-bold">Studio Inbox</h2><p className="mb-4 text-sm">Latest 100 requests. Replies appear in the member’s account; email delivery is not connected.</p><div className="grid gap-4">{rows ? rows.length ? rows.map(r=><StaffReply key={r._id} request={r}/>) : <p>No requests yet.</p> : <p role="status">Loading inbox…</p>}</div><h3 className="my-5 text-xl font-bold">Course Interest</h3><p className="mb-3 text-sm">Latest 100 active interests. Contact permission is limited to the selected class or future studio classes.</p>{interests ? interests.length ? <ul className="grid gap-3">{interests.map(i=><li key={i._id} className={card}><p className="break-all">{i.email}</p><p>{i.courseTitle}</p><p className="text-sm">Consent recorded {new Date(i.consentedAt).toISOString().slice(0,10)}</p></li>)}</ul> : <p>No active course interests.</p> : <p role="status">Loading interests…</p>}</section>; }
function LiveStudio() {
  const catalog = useQuery(api.academy.catalog,{}); const {isAuthenticated} = useConvexAuth();
  const mine = useQuery(api.academy.mine,isAuthenticated ? {} : "skip");
  if (!catalog) return <p role="status">Loading the studio…</p>;
  return <>
    <div className="grid items-start gap-6 lg:grid-cols-2">{catalog.services.length ? catalog.services.map(s=><ServiceCard key={s._id} service={s} authenticated={isAuthenticated} mine={mine}/>) : <p className={card}>No services are accepting requests at the moment.</p>}</div>
    <section className="mt-12 rounded-3xl bg-[var(--color-cool-teal)]/40 p-6 sm:p-8"><h2 className="text-3xl font-bold">Courses, Workshops &amp; Masterclasses</h2><p className="my-4">{catalog.courses.length ? "Explore the studio’s published learning opportunities." : "No courses are announced yet. Save your interest for future writing classes."}</p><div className="grid gap-4">{catalog.courses.map(c=><article key={c._id} className={card}><h3 className="text-2xl font-bold">{c.title}</h3><p className="my-3">{c.description}</p><p>{c.instructor} · {c.format.replaceAll("_"," ")} · {c.level}</p><p className="my-2">{c.workload} · {price(c.priceInCents)}</p>{c.startsAt && <p>{new Date(c.startsAt).toISOString().replace("T"," ").slice(0,16)} UTC</p>}<ul className="my-4 list-disc pl-5">{c.outcomes.map(o=><li key={o}>{o}</li>)}</ul>{c.status === "closed" ? <p>Registration Closed</p> : c.status === "open" && safeUrl(c.enrollmentUrl) ? <a className={button} href={safeUrl(c.enrollmentUrl)!} target="_blank" rel="noopener noreferrer">View Enrollment Details ↗</a> : <><p className="mb-3">Coming Soon · Not an Enrollment</p>{isAuthenticated && mine ? <InterestButton courseId={c._id} active={mine.interests.some(i=>i.courseId===c._id && i.active)}/> : <Link href="/signin?next=/academy" className={button}>Sign In to Save Interest</Link>}</>}</article>)}</div><div className="mt-6"><h3 className="mb-3 text-xl font-bold">Future Studio Classes</h3><p className="mb-4 text-sm">Saving interest allows the studio to contact your account email about future classes. It does not enroll you, charge you, or add you to the general newsletter. Automated emails are not active yet.</p>{isAuthenticated && mine ? <InterestButton active={mine.interests.some(i=>!i.courseId && i.active)}/> : <Link href="/signin?next=/academy" className={button}>Sign In to Save Interest</Link>}</div></section>
    {mine && <section id="studio-requests" className="mt-12 scroll-mt-28"><h2 className="text-3xl font-bold">My Studio Requests</h2><p className="my-4">Requests and staff replies are saved here. Check back for a response; no confirmation email is sent.</p><div className="grid gap-4">{mine.requests.length ? mine.requests.map(r=><RequestCard key={r._id} request={r}/>) : <p>You haven’t submitted a studio request yet.</p>}</div></section>}
    {mine?.canManage && <StaffInbox/>}
  </>;
}
export function AcademyStudio() { return authIsConfigured ? <QueryBoundary fallback={(_error,retry)=><div role="alert"><h2 className="text-xl font-bold">The Studio Is Temporarily Unavailable</h2><button className={button} onClick={retry}>Try Again</button></div>}><LiveStudio/></QueryBoundary> : <p>The studio is not connected yet. Please check back soon.</p>; }
