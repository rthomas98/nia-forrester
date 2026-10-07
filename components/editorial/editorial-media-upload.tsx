"use client";

import { useId, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Upload } from "relume-icons";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { alertText, fieldHint } from "@/lib/typography";
import { editorialErrorMessage } from "./editorial-model";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Uploads one image through a staff-only signed URL, then asks the backend to
 * verify type and size before returning its public URL.
 */
export function MediaUpload({ label, onUploaded }: { label: string; onUploaded: (url: string) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.cms.uploadUrl);
  const acceptMedia = useMutation(api.cms.acceptMedia);
  const [state, setState] = useState<{ status: "idle" | "uploading" } | { status: "error"; message: string }>({ status: "idle" });

  async function upload(file: File) {
    if (!ACCEPTED.includes(file.type) || file.size > MAX_BYTES) {
      setState({ status: "error", message: "Use a JPEG, PNG, or WebP image up to 5 MB." });
      return;
    }
    setState({ status: "uploading" });
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      if (!response.ok) throw new Error("upload failed");
      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };
      const accepted = await acceptMedia({ storageId });
      onUploaded(accepted.url);
      setState({ status: "idle" });
    } catch (error) {
      setState({ status: "error", message: editorialErrorMessage(error, "The upload didn’t finish. Please try again.") });
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <input
        ref={input}
        id={id}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file); }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={state.status === "uploading"}
          onClick={() => input.current?.click()}
          iconLeft={<Upload aria-hidden="true" className="size-4" />}
        >
          {state.status === "uploading" ? "Uploading…" : label}
        </Button>
        <span className={fieldHint}>JPEG, PNG or WebP, up to 5 MB.</span>
      </div>
      <p aria-live="polite" className={state.status === "error" ? alertText : "sr-only"}>
        {state.status === "error" ? state.message : state.status === "uploading" ? "Uploading image…" : ""}
      </p>
    </div>
  );
}
