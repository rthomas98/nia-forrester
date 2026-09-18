import { query } from "./_generated/server";
import { requireAuth, hasTier } from "./security";
import { paidSubscription } from "./communityAccess";

/** Owner-scoped summary: no content bodies, emails, or meeting URLs. */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const profile = await ctx.db.query("profiles").withIndex("by_auth_user", q => q.eq("authUserId", user._id)).unique();
    const subscription = await paidSubscription(ctx, user._id);
    const tier = subscription?.planKey ?? "free";
    const progress = await ctx.db.query("readingProgress").withIndex("by_user_updated", q => q.eq("authUserId", user._id)).order("desc").collect();
    const library = [];
    const saved = await ctx.db.query("savedBooks").withIndex("by_user", q => q.eq("authUserId", user._id)).collect();
    const records = new Map(progress.map(record => [record.contentId, { contentId: record.contentId, percent: record.percent, completed: record.completed, updatedAt: record.updatedAt }]));
    for (const entry of saved) {
      if (!entry.active) records.delete(entry.contentId);
      else if (!records.has(entry.contentId)) records.set(entry.contentId, { contentId: entry.contentId, percent: 0, completed: false, updatedAt: entry.updatedAt });
    }
    for (const record of [...records.values()].sort((a,b) => b.updatedAt - a.updatedAt)) {
      const book = await ctx.db.get(record.contentId);
      if (!book || book.status !== "published" || book.visibility === "hidden") continue;
      library.push({ id: book._id, title: book.title, slug: book.slug, coverUrl: book.coverAsset?.path ?? book.coverUrl, percent: record.percent, completed: record.completed, status: record.completed ? "Finished" : record.percent > 0 ? "Reading" : "Want to Read" });
    }
    const membership = await ctx.db.query("communityMembers").withIndex("by_user", q => q.eq("authUserId", user._id)).unique();
    const communityAccess = !subscription ? "unpaid" : !membership ? "eligible" : "member";
    const discussions = [];
    if (communityAccess === "member") {
      const rows = await ctx.db.query("threads").withIndex("by_status_activity", q => q.eq("status", "open")).order("desc").collect();
      for (const row of rows) {
        if (row.clubId) {
          const club = await ctx.db.get(row.clubId);
          const joined = await ctx.db.query("clubMemberships").withIndex("by_club_user", q => q.eq("clubId", row.clubId!).eq("authUserId", user._id)).unique();
          if (!club || club.status !== "open" || !hasTier(tier, club.accessTier) || !joined) continue;
        }
        discussions.push({ id: row._id, title: row.title });
        if (discussions.length === 4) break;
      }
    }
    const upcoming = await ctx.db.query("events").withIndex("by_status_start", q => q.eq("status", "published").gte("startsAt", Date.now())).collect();
    return {
      name: profile?.displayName || user.name || "Reader",
      accountCreatedAt: user.createdAt,
      tier,
      renewalCanceled: subscription?.cancelAtPeriodEnd ?? false,
      paidThrough: subscription?.currentPeriodEnd ?? null,
      library: library.slice(0, 24),
      libraryCount: library.length,
      finished: library.filter(book => book.completed).length,
      continueReading: library.find(book => !book.completed && book.percent > 0) ?? null,
      communityAccess,
      discussions,
      events: upcoming.filter(event => !event.isTest && hasTier(tier, event.accessTier)).slice(0, 3).map(event => ({ id: event._id, title: event.title, startsAt: event.startsAt, timezone: event.timezone })),
    };
  },
});
