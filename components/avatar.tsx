"use client";
import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryBoundary } from "@/components/catalog/query-boundary";
import { authIsConfigured } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { muted, statusText } from "@/lib/typography";
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
  return <div className="mb-6 space-y-3"><div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-cabernet font-display text-h4 font-semibold text-cream ring-1 ring-champagne/40"><UserAvatar name={name} /></div><label className="block font-ui text-small font-semibold text-cream" htmlFor="avatar-upload">Upload Avatar</label><input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || !isAuthenticated} onChange={event => void upload(event)} className="block w-full min-w-0 cursor-pointer text-tiny text-body file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-button file:border file:border-scheme-border file:bg-transparent file:px-4 file:font-ui file:text-tiny file:font-semibold file:tracking-[0.12em] file:text-cream file:uppercase hover:file:border-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne" /><p className={muted}>JPEG, PNG, or WebP · up to 5 MB. Center-cropped to a square. Profile images are visible to anyone with the image link.</p>{url && <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => void clear()}>Remove Avatar</Button>}<p role="status" className={statusText}>{busy ? "Updating avatar…" : message}</p></div>;
}
export function AvatarUpload({ name }: { name: string }) {
  return <QueryBoundary fallback={(_error, retry) => <div role="alert" className="mb-6 space-y-3"><p className={statusText}>Avatar unavailable.</p><Button type="button" variant="secondary" size="sm" onClick={retry}>Try Again</Button></div>}><UploadControl name={name} /></QueryBoundary>;
}
