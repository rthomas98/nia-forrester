import { z } from "zod";
import { academyOffers } from "./legacy-offers";

export const eventTypeLabels = {
  book_club: "Book Club", book_festival: "Book Festival",
  podcast_social: "Podcast or Social Media Event", panel_discussion: "Panel Discussion", other: "Other",
} as const;

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
    && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}
const dateInput = z.string().refine(validDate, "Choose a valid date");
const fields = {
  name: z.string().trim().min(1).max(120), email: z.email().max(320),
  details: z.string().trim().min(20, "Please share at least 20 characters of detail").max(4000),
  website: z.string().max(200).optional(),
};
export const inquiryInput = z.discriminatedUnion("kind", [
  z.object({ ...fields, kind: z.literal("invitation"), date: dateInput, location: z.string().trim().min(1).max(250), eventType: z.enum(["book_club", "book_festival", "podcast_social", "panel_discussion", "other"]) }),
  z.object({ ...fields, kind: z.literal("academy"), optionId: z.string().refine(id => academyOffers.some(offer => offer.id === id), "Choose a booking option"), requestedDate: dateInput.optional() }),
  z.object({
    kind: z.literal("signed_copy"), name: fields.name, email: fields.email, website: fields.website,
    bookSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(200),
    quantity: z.number().int().min(1).max(10),
    personalization: z.string().trim().max(500),
  }),
]);
export type Inquiry = z.infer<typeof inquiryInput>;

export function inquiryMessage(inquiry: Exclude<Inquiry, {kind: "signed_copy"}>): string {
  if (inquiry.kind === "invitation") {
    return `Invite Nia\nDate: ${inquiry.date}\nLocation: ${inquiry.location}\nType: ${eventTypeLabels[inquiry.eventType]}\n\n${inquiry.details}`;
  }
  const offer = academyOffers.find(candidate => candidate.id === inquiry.optionId);
  if (!offer) throw new Error("Unknown booking option");
  return `Work with Nia\nOption: ${offer.title}\nListed price: $${(offer.priceInCents / 100).toFixed(2)} USD\nRequested date: ${inquiry.requestedDate ?? "To be discussed"}\nRequest only; availability and payment are not confirmed.\n\n${inquiry.details}`;
}

export function signedCopyMessage(
  inquiry: Extract<Inquiry, {kind: "signed_copy"}>,
  offer: {title: string; priceInCents: number; url: string},
): string {
  return `Signed & Personalized Copy Request\nBook: ${offer.title}\nCatalog slug: ${inquiry.bookSlug}\nQuantity: ${inquiry.quantity}\nListed unit price: $${(offer.priceInCents / 100).toFixed(2)} USD\nOriginal shop: ${offer.url}\nPersonalization: ${inquiry.personalization || "Author signature only"}\n\nRequest saved before checkout. Payment, availability, shipping and fulfillment are NOT confirmed. Match the original-shop purchase using this request's email address.`;
}
