import { expect, it } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
import { upsertBookRecord } from "../convex/catalog";
import { readFileSync } from "node:fs";
import { groupEditorialBooks, recentCatalogBooks, isComingSoon } from "../lib/editorial-catalog";
import { getSignedCopyOffer, academyOffers } from "../lib/legacy-offers";
import { inquiryInput, inquiryMessage, signedCopyMessage } from "../lib/inquiries";
const modules = import.meta.glob("../convex/**/*.ts");
const book = (title, extra = {}) => ({ title, catalogKey: title, sortOrder: 0, formats: ["ebook"], series: null, ...extra });

it("groups every supplied book exactly once in the requested editorial order", () => {
  const books = [book("Unplanned"), book("Courtship"), book("Snowflake"), book("Rhyme & Reason"), book("The Takedown"), book("Young, Rich & Black"), book("The Come Up"), book("Afterburn"), book("Afterwards"), book("Commitment: 10th Anniversary Edition"), book("Commitment"), book("Jane Doe Black (Lainey Abbott Series)"), book("Mother"), book("Ivy’s League"), book("The Lover"), book("À la Carte"), book("The Broken")];
  const groups = groupEditorialBooks(books);
  expect(groups.map(g => g.key)).toEqual(["lainey", "commitment", "afterwards", "mistress", "ivy-lover", "coffee", "standalone"]);
  expect(groups.find(g => g.key === "afterwards").books.map(b => b.title)).toEqual(["Afterwards", "Afterburn", "The Come Up", "The Takedown", "Young, Rich & Black", "Snowflake", "Rhyme & Reason", "Courtship", "Unplanned"]);
  expect(groups.find(g => g.key === "ivy-lover").title).toBeNull();
  expect(new Set(groups.flatMap(g => g.books.map(b => b.catalogKey))).size).toBe(books.length);
  expect(groupEditorialBooks(books.filter(b => b.formats.includes("audiobook")))).toEqual([]);
});

it("sorts forthcoming then known publication dates and never fabricates forthcoming metadata", () => {
  const books = [book("Older", {publicationDate:"2021"}), book("Unknown"), book("Latest", {publicationDate:"2026-09"}), book("Forthcoming", {comingSoon:true})];
  expect(recentCatalogBooks(books).map(b => b.title)).toEqual(["Forthcoming", "Latest", "Older", "Unknown"]);
  expect(isComingSoon(book("Reversible Error"))).toBe(false);
});

it("groups the actual Amazon catalog including the anniversary edition and all standalone remainders", () => {
  const source = JSON.parse(readFileSync(new URL("../data/catalog/amazon-author-page.json", import.meta.url), "utf8"));
  const groups = groupEditorialBooks(source.listings.map(row => book(row.title, {catalogKey:row.asin,sortOrder:row.sourceOrder,series:row.series})));
  expect(groups.find(g => g.key === "commitment").books.map(b => b.title)).toEqual([
    "Commitment (The 'Commitment' Series Book 1)", "Commitment (10th Anniversary Edition)",
    "Unsuitable Men (The 'Commitment' Series Book 2)", "Maybe Never (The 'Commitment' Series Book 3)",
    "The Fall (The 'Commitment' Series Book 4)", "Four: Stories of Marriage (The 'Commitment' Series Book 5)",
  ]);
  expect(groups.flatMap(g => g.books)).toHaveLength(source.listings.length);
});

it("persists explicit Coming Soon metadata without making unpublished drafts public", async () => {
  const t = convexTest(schema, modules); betterAuth.register(t);
  const input = {catalogKey:"catalog:amazon:test-forthcoming",slug:"test-forthcoming",title:"TEST Forthcoming",publicationDate:"2027-01-01",formats:["ebook"],status:"published",visibility:"public",sortOrder:0,comingSoon:true};
  await t.run(ctx => upsertBookRecord(ctx, "TEST Editor", input));
  expect((await t.query(api.catalog.listPublishedBooks, {}))[0].comingSoon).toBe(true);
  const { comingSoon, ...withoutFlag } = input;
  expect(comingSoon).toBe(true);
  await t.run(ctx => upsertBookRecord(ctx, "TEST Editor", withoutFlag));
  expect((await t.query(api.catalog.listPublishedBooks, {}))[0].comingSoon).toBe(true);
  await t.run(ctx => upsertBookRecord(ctx, "TEST Editor", {...input,status:"scheduled"}));
  expect(await t.query(api.catalog.listPublishedBooks, {})).toEqual([]);
});

it("uses verified signed-copy prices, distinguishes anniversary editions, and omits unavailable offers", () => {
  expect(getSignedCopyOffer("Commitment: 10th Anniversary Edition").priceInCents).toBe(1899);
  expect(getSignedCopyOffer("Commitment (The Commitment Series Book 1)").priceInCents).toBe(1799);
  expect(getSignedCopyOffer("Ivy’s League").url).toBe("https://www.niaforrester.com/product-page/ivy-s-league");
  expect(getSignedCopyOffer("The Best Bad Idea")).toBeNull();
  expect(academyOffers.filter(o => o.priceInCents === 0)).toHaveLength(2);
});

const invitation = {kind:"invitation",name:"TEST Invitation",email:"invitation@example.test",date:"2027-10-01",location:"Online",eventType:"book_club",details:"A clearly labeled test book club invitation."};
it("validates inquiry boundaries and derives prices on the server, not from the visitor", () => {
  expect(inquiryInput.safeParse(invitation).success).toBe(true);
  for (const change of [{date:"2027-02-30"}, {eventType:"unknown"}, {details:"short"}, {email:"bad"}]) expect(inquiryInput.safeParse({...invitation,...change}).success).toBe(false);
  expect(inquiryInput.safeParse({...invitation,kind:"academy",optionId:"made-up"}).success).toBe(false);
  const parsed = inquiryInput.parse({kind:"academy",name:invitation.name,email:invitation.email,optionId:"single-session",details:invitation.details,priceInCents:1});
  expect(inquiryMessage(parsed)).toContain("$150.00 USD");
  expect(inquiryMessage(parsed)).toContain("not confirmed");
});

it("saves the exact requested inscription or signature-only intent without accepting an invented book price", () => {
  const input = {kind:"signed_copy",name:"TEST Signed Copy",email:"signed@example.test",bookSlug:"ivys-league-b015n7gnx2",quantity:2,personalization:"For TEST Reader — happy reading!"};
  const parsed = inquiryInput.parse({...input,priceInCents:1});
  const offer = getSignedCopyOffer("Ivy's League");
  expect(signedCopyMessage(parsed,offer)).toContain("$10.99 USD");
  expect(signedCopyMessage(parsed,offer)).toContain(input.personalization);
  expect(signedCopyMessage(parsed,offer)).toContain("Quantity: 2");
  expect(signedCopyMessage({...parsed,personalization:""},offer)).toContain("Author signature only");
  for (const change of [{quantity:0},{quantity:11},{quantity:1.5},{personalization:"x".repeat(501)},{bookSlug:"../private"}]) expect(inquiryInput.safeParse({...input,...change}).success).toBe(false);
});

it("persists structured invitations in the existing backend staff inbox with email rate limits", async () => {
  const t = convexTest(schema, modules); betterAuth.register(t);
  const input = inquiryInput.parse(invitation);
  const id = await t.mutation(api.contact.submit, {name:input.name,email:input.email,message:inquiryMessage(input),source:"website-invite-nia"});
  const saved = await t.run(ctx => ctx.db.get(id));
  expect(saved.message).toContain("Date: 2027-10-01");
  expect(saved.message).toContain("Type: Book Club");
  expect(saved.status).toBe("new");
  await expect(t.query(api.contact.inbox, {})).rejects.toThrow();
  await expect(t.mutation(api.contact.submit, {name:input.name,email:input.email,message:inquiryMessage(input),source:"website-invite-nia"})).rejects.toThrow();
});

it("previews only the latest published free chapter of a free serial", async () => {
  const t = convexTest(schema, modules); betterAuth.register(t);
  const id = await t.run(ctx => ctx.db.insert("content", {slug:"preview",kind:"serial",title:"TEST Serial",excerpt:"Summary",status:"published",visibility:"public",accessTier:"free",tags:[],sortOrder:0,createdAt:1,updatedAt:1}));
  const chapter = await t.run(ctx => ctx.db.insert("chapters", {contentId:id,slug:"preview-one",number:1,title:"One",body:"Public chapter opening",status:"published",accessTier:"free",createdAt:1,updatedAt:1}));
  expect((await t.query(api.content.listPublished, {kind:"serial"}))[0].latestChapterPreview).toBe("Public chapter opening");
  await t.run(ctx => ctx.db.patch(chapter, {accessTier:"reader",body:"PRIVATE CHAPTER"}));
  expect(JSON.stringify(await t.query(api.content.listPublished, {kind:"serial"}))).not.toContain("PRIVATE");
  await t.run(ctx => ctx.db.patch(chapter, {accessTier:"free"}));
  await t.run(ctx => ctx.db.patch(id, {accessTier:"reader"}));
  expect((await t.query(api.content.listPublished, {kind:"serial"}))[0].latestChapterPreview).toBeUndefined();
});
