/**
 * Contact form submission with every failure mode resolved to a result, so the UI can
 * always leave its pending state. Success requires the documented `200 { sent: true }`
 * contract from `/api/contact`; anything else is an actionable, retryable failure.
 * Dependency-free (fetch is injectable) so it can be unit tested with `node --test`.
 */
export type ContactPayload = {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
  website: FormDataEntryValue | null;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

export const CONTACT_NETWORK_ERROR =
  "We couldn’t reach the server. Check your connection and try again — your message is still here.";
export const CONTACT_UNCONFIRMED_ERROR =
  "We couldn’t confirm your message was sent. Please try again — your message is still here.";

export function contactHttpError(status: number) {
  return `We couldn’t send your message (error ${status}). Please try again — your message is still here.`;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function submitContact(
  payload: ContactPayload,
  fetchImpl: typeof fetch = fetch,
): Promise<ContactResult> {
  let response: Response;
  try {
    response = await fetchImpl("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: CONTACT_NETWORK_ERROR };
  }
  const body = await readJson(response);
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  if (!response.ok) {
    const message = typeof record?.error === "string" && record.error.trim() ? record.error : null;
    return { ok: false, error: message ?? contactHttpError(response.status) };
  }
  return record?.sent === true ? { ok: true } : { ok: false, error: CONTACT_UNCONFIRMED_ERROR };
}
