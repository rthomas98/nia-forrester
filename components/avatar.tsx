"use client";
import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { authIsConfigured } from "@/lib/auth-client";
const button = "min-h-11 rounded-full border border-current px-4 py-2 text-sm font-semibold disabled:opacity-50";
function Initial({ name }: { name: string }) { return <span aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>; }
function Picture({ name }: { name: string }) {
  const { isAuthenticated } = useConvexAuth();
  const url = useQuery(api.avatars.mine, isAuthenticated ? {} : "skip");
  return url ? <Image src={url} unoptimized width={256} height={256} alt={`${name}'s avatar`} className="size-full rounded-full object-cover" /> : <Initial name={name} />;
}
export function UserAvatar({ name }: { name: string }) {
  if (!authIsConfigured) return <Initial name={name} />;
  return <QueryBoundary fallback={() => <Initial name={name} />}><Picture name={name} /></QueryBoundary>;
}
function UploadControl({ name }: { name: string }) {
  const { isAuthenticated } = useConvexAuth();
  const url = useQuery(api.avatars.mine, isAuthenticated ? {} : "skip");
  const remove = useMutation(api.avatars.remove);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5*1024*1024 || !file.size) { setMessage("Choose a JPEG, PNG, or WebP up to 5 MB."); return; }
    setBusy(true); setMessage("");
    try {
      const form = new FormData(); form.set("avatar", file);
      const response = await fetch("/api/avatar", { method: "POST", body: form });
      const result = await response.json();
      setMessage(response.ok ? "Avatar updated." : result.error ?? "Upload failed. Try again.");
    } catch { setMessage("Upload failed. Check your connection and try again."); }
    finally { setBusy(false); }
  }
  async function clear() {
    setBusy(true); setMessage("");
    try { await remove({}); setMessage("Avatar removed."); }
    catch { setMessage("Could not remove your avatar. Try again."); }
    finally { setBusy(false); }
  }
  return <div className="mb-5 space-y-3"><div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-[var(--color-cool-teal)] text-2xl font-bold text-[var(--color-deep-plum)]"><UserAvatar name={name} /></div><label className="block text-sm font-semibold" htmlFor="avatar-upload">Upload Avatar</label><input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || !isAuthenticated} onChange={event => void upload(event)} className="block w-full min-w-0 text-xs file:mr-2 file:rounded-full file:border-0 file:px-3 file:py-3 file:font-semibold" /><p className="text-xs">JPEG, PNG, or WebP · up to 5 MB. Center-cropped to a square. Profile images are visible to anyone with the image link.</p>{url && <button type="button" className={button} disabled={busy} onClick={() => void clear()}>Remove Avatar</button>}<p role="status" className="text-sm">{busy ? "Updating avatar…" : message}</p></div>;
}
export function AvatarUpload({ name }: { name: string }) {
  return <QueryBoundary fallback={(_error, retry) => <div role="alert">Avatar unavailable. <button className={button} onClick={retry}>Try Again</button></div>}><UploadControl name={name} /></QueryBoundary>;
}
