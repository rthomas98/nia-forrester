import { mutation } from "./_generated/server";
import { requireRole } from "./security";

const planSeed = [
  {
    key: "free" as const,
    name: "Free Reader",
    description: "Public essays, news, and sample serial chapters.",
    monthlyPriceInCents: 0,
    annualPriceInCents: 0,
    features: [
      "Weekly newsletter",
      "Blog and Quick Bites",
      "New-release alerts",
      "Public serial chapters",
    ],
  },
  {
    key: "reader" as const,
    name: "Reader Circle",
    description: "Full serial access, early chapters, and reader discussions.",
    monthlyPriceInCents: 700,
    annualPriceInCents: 7000,
    features: [
      "Everything in Free",
      "Full serialized fiction",
      "Early chapters",
      "Reader discussions",
      "Monthly live chat",
    ],
  },
  {
    key: "inner" as const,
    name: "Inner Circle",
    description: "Bonus stories, book club, live Q&A, and audio previews.",
    monthlyPriceInCents: 1800,
    annualPriceInCents: 18000,
    features: [
      "Everything in Reader",
      "Bonus stories and outtakes",
      "Live Q&A with Nia",
      "Members-only book club",
      "Audiobook previews",
    ],
  },
  {
    key: "writers" as const,
    name: "Writers Circle",
    description: "Craft discussions, workshops, and writing office hours.",
    monthlyPriceInCents: 4900,
    annualPriceInCents: 49000,
    features: [
      "Everything in Inner",
      "Craft discussions",
      "Monthly workshops",
      "Writing office hours",
      "25% off editing services",
    ],
  },
];

const serviceSeed = [
  {
    slug: "first-ten-pages-review",
    title: "First 10 Pages Review",
    description:
      "A complimentary editorial review of the opening ten pages of your manuscript.",
    priceInCents: 0,
    sortOrder: 0,
  },
  {
    slug: "manuscript-consultation",
    title: "Manuscript Consultation",
    description:
      "A focused conversation about story direction, structure, and next steps.",
    sortOrder: 1,
  },
  {
    slug: "developmental-editing",
    title: "Developmental Editing",
    description:
      "A full editorial engagement for writers who are serious about the craft.",
    sortOrder: 2,
  },
];

export const productionDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["admin"]);
    const now = Date.now();

    for (const [sortOrder, plan] of planSeed.entries()) {
      const existing = await ctx.db
        .query("membershipPlans")
        .withIndex("by_key", (q) => q.eq("key", plan.key))
        .unique();
      const values = {
        ...plan,
        active: true,
        sortOrder,
        updatedAt: now,
      };
      if (existing) {
        await ctx.db.patch(existing._id, values);
      } else {
        await ctx.db.insert("membershipPlans", {
          ...values,
          createdAt: now,
        });
      }
    }

    for (const service of serviceSeed) {
      const existing = await ctx.db
        .query("services")
        .withIndex("by_slug", (q) => q.eq("slug", service.slug))
        .unique();
      const values = {
        ...service,
        status: "published" as const,
        updatedAt: now,
      };
      if (existing) {
        await ctx.db.patch(existing._id, values);
      } else {
        await ctx.db.insert("services", {
          ...values,
          createdAt: now,
        });
      }
    }
  },
});
