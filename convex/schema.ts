import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const publishStatus = v.union(
  v.literal("draft"),
  v.literal("scheduled"),
  v.literal("published"),
  v.literal("archived"),
);

const membershipTier = v.union(
  v.literal("free"),
  v.literal("reader"),
  v.literal("inner"),
  v.literal("writers"),
);

export default defineSchema({
  profiles: defineTable({
    authUserId: v.string(),
    email: v.string(),
    displayName: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(
      v.literal("reader"),
      v.literal("moderator"),
      v.literal("editor"),
      v.literal("admin"),
    ),
    membershipTier,
    membershipStatus: v.union(
      v.literal("free"),
      v.literal("trialing"),
      v.literal("active"),
      v.literal("past_due"),
      v.literal("paused"),
      v.literal("canceled"),
    ),
    preferences: v.array(v.string()),
    chapterAlerts: v.boolean(),
    newsletterOptIn: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_user", ["authUserId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  series: defineTable({
    catalogKey: v.optional(v.string()),
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: publishStatus,
    visibility: v.optional(
      v.union(v.literal("public"), v.literal("unlisted"), v.literal("hidden")),
    ),
    coverStorageId: v.optional(v.id("_storage")),
    coverUrl: v.optional(v.string()),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_catalog_key", ["catalogKey"])
    .index("by_slug", ["slug"])
    .index("by_status_sort", ["status", "sortOrder"]),

  content: defineTable({
    catalogKey: v.optional(v.string()),
    slug: v.string(),
    kind: v.union(
      v.literal("book"),
      v.literal("serial"),
      v.literal("essay"),
      v.literal("audio"),
      v.literal("quick_bite"),
      v.literal("outtake"),
    ),
    title: v.string(),
    subtitle: v.optional(v.string()),
    excerpt: v.string(),
    description: v.optional(v.string()),
    body: v.optional(v.string()),
    seriesId: v.optional(v.id("series")),
    seriesPosition: v.optional(v.number()),
    publicationDate: v.optional(v.string()),
    formats: v.optional(
      v.array(
        v.union(
          v.literal("ebook"),
          v.literal("paperback"),
          v.literal("hardcover"),
          v.literal("audiobook"),
        ),
      ),
    ),
    editions: v.optional(
      v.array(
        v.object({
          format: v.union(
            v.literal("ebook"),
            v.literal("paperback"),
            v.literal("hardcover"),
            v.literal("audiobook"),
          ),
          asin: v.string(),
          productUrl: v.string(),
        }),
      ),
    ),
    asin: v.optional(v.string()),
    productUrl: v.optional(v.string()),
    coverAsset: v.optional(
      v.object({
        path: v.string(),
        source: v.union(
          v.literal("stakeholder_provided"),
          v.literal("licensed"),
          v.literal("retailer_source"),
          v.literal("original"),
        ),
        sourceReference: v.optional(v.string()),
        sha256: v.optional(v.string()),
      }),
    ),
    status: publishStatus,
    visibility: v.optional(
      v.union(v.literal("public"), v.literal("unlisted"), v.literal("hidden")),
    ),
    accessTier: membershipTier,
    tags: v.array(v.string()),
    publishedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    coverStorageId: v.optional(v.id("_storage")),
    coverUrl: v.optional(v.string()),
    audioStorageId: v.optional(v.id("_storage")),
    audioUrl: v.optional(v.string()),
    externalPurchaseUrl: v.optional(v.string()),
    amazonAffiliateUrl: v.optional(v.string()),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_catalog_key", ["catalogKey"])
    .index("by_slug", ["slug"])
    .index("by_kind_status", ["kind", "status"])
    .index("by_status_published", ["status", "publishedAt"])
    .index("by_series_sort", ["seriesId", "sortOrder"])
    .searchIndex("search_content", {
      searchField: "title",
      filterFields: ["kind", "status"],
    }),

  chapters: defineTable({
    contentId: v.id("content"),
    slug: v.string(),
    number: v.number(),
    title: v.string(),
    body: v.string(),
    status: publishStatus,
    accessTier: membershipTier,
    publishedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    audioStorageId: v.optional(v.id("_storage")),
    audioUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_content_number", ["contentId", "number"])
    .index("by_content_status", ["contentId", "status"])
    .index("by_slug", ["slug"]),

  avatars: defineTable({
    authUserId: v.string(),
    storageId: v.id("_storage"),
    updatedAt: v.number(),
  }).index("by_user", ["authUserId"]),

  savedBooks: defineTable({
    authUserId: v.string(),
    contentId: v.id("content"),
    active: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user_content", ["authUserId", "contentId"])
    .index("by_user", ["authUserId"]),

  readingProgress: defineTable({
    authUserId: v.string(),
    contentId: v.id("content"),
    chapterId: v.optional(v.id("chapters")),
    percent: v.number(),
    position: v.optional(v.number()),
    completed: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_user_content", ["authUserId", "contentId"])
    .index("by_user_updated", ["authUserId", "updatedAt"]),

  bookmarks: defineTable({
    authUserId: v.string(),
    contentId: v.id("content"),
    chapterId: v.optional(v.id("chapters")),
    position: v.optional(v.number()),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user_content", ["authUserId", "contentId"]),

  communityMembers: defineTable({
    authUserId: v.string(),
    joinedAt: v.number(),
  }).index("by_user", ["authUserId"]),

  threads: defineTable({
    slug: v.string(),
    title: v.string(),
    body: v.string(),
    authorAuthUserId: v.string(),
    contentId: v.optional(v.id("content")),
    clubId: v.optional(v.id("clubs")),
    tags: v.array(v.string()),
    status: v.union(
      v.literal("open"),
      v.literal("locked"),
      v.literal("hidden"),
    ),
    pinned: v.boolean(),
    replyCount: v.number(),
    lastActivityAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status_activity", ["status", "lastActivityAt"])
    .index("by_club_activity", ["clubId", "lastActivityAt"]),

  posts: defineTable({
    threadId: v.id("threads"),
    authorAuthUserId: v.string(),
    body: v.string(),
    parentPostId: v.optional(v.id("posts")),
    spoilerChapter: v.optional(v.number()),
    status: v.union(
      v.literal("visible"),
      v.literal("hidden"),
      v.literal("removed"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_thread_created", ["threadId", "createdAt"]),

  postReactions: defineTable({
    postId: v.id("posts"),
    authUserId: v.string(),
    emoji: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_post_user", ["postId", "authUserId"]),

  clubs: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    accessTier: membershipTier,
    status: v.union(
      v.literal("draft"),
      v.literal("open"),
      v.literal("paused"),
      v.literal("archived"),
    ),
    currentContentId: v.optional(v.id("content")),
    memberCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  clubMemberships: defineTable({
    clubId: v.id("clubs"),
    authUserId: v.string(),
    role: v.union(
      v.literal("member"),
      v.literal("host"),
      v.literal("moderator"),
    ),
    joinedAt: v.number(),
  })
    .index("by_club_user", ["clubId", "authUserId"])
    .index("by_user", ["authUserId"]),

  events: defineTable({
    isTest: v.optional(v.boolean()),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("appearance"),
      v.literal("reading"),
      v.literal("workshop"),
      v.literal("retreat"),
      v.literal("qa"),
    ),
    format: v.union(
      v.literal("in_person"),
      v.literal("virtual"),
      v.literal("hybrid"),
    ),
    status: publishStatus,
    accessTier: membershipTier,
    startsAt: v.number(),
    endsAt: v.number(),
    timezone: v.string(),
    venue: v.optional(v.string()),
    city: v.optional(v.string()),
    meetingUrl: v.optional(v.string()),
    ticketUrl: v.optional(v.string()),
    capacity: v.optional(v.number()),
    waitlistEnabled: v.boolean(),
    coverStorageId: v.optional(v.id("_storage")),
    coverUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status_start", ["status", "startsAt"]),

  eventRegistrations: defineTable({
    attendeeName: v.optional(v.string()),
    attendeeEmail: v.optional(v.string()),
    attendance: v.optional(v.union(v.literal("in_person"), v.literal("virtual"))),
    note: v.optional(v.string()),
    acknowledgedAt: v.optional(v.number()),
    eventId: v.id("events"),
    authUserId: v.string(),
    status: v.union(
      v.literal("registered"),
      v.literal("waitlisted"),
      v.literal("canceled"),
      v.literal("attended"),
      v.literal("no_show"),
    ),
    guests: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event_user", ["eventId", "authUserId"])
    .index("by_user", ["authUserId"]),

  services: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    status: publishStatus,
    priceInCents: v.optional(v.number()),
    durationMinutes: v.optional(v.number()),
    bookingUrl: v.optional(v.string()),
    intakeInstructions: v.optional(v.string()),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status_sort", ["status", "sortOrder"]),

  bookings: defineTable({
    projectTitle: v.optional(v.string()),
    genre: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    timeline: v.optional(v.string()),
    sample: v.optional(v.string()),
    consentedAt: v.optional(v.number()),
    staffReply: v.optional(v.string()),
    serviceId: v.id("services"),
    authUserId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("requested"),
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("canceled"),
    ),
    scheduledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_service_status", ["serviceId", "status"])
    .index("by_auth_user", ["authUserId"]),

  studioCourses: defineTable({
    title: v.string(), description: v.string(), instructor: v.string(),
    format: v.union(v.literal("self_paced"), v.literal("live_online"), v.literal("in_person")),
    level: v.string(), workload: v.string(), outcomes: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("coming_soon"), v.literal("open"), v.literal("closed")),
    enrollmentUrl: v.optional(v.string()), priceInCents: v.optional(v.number()),
    startsAt: v.optional(v.number()), timezone: v.optional(v.string()),
    sortOrder: v.number(), createdAt: v.number(), updatedAt: v.number(),
  }).index("by_status_sort", ["status", "sortOrder"]),
  studioInterests: defineTable({
    authUserId: v.string(), email: v.string(), courseId: v.optional(v.id("studioCourses")),
    active: v.boolean(), consentedAt: v.number(), updatedAt: v.number(),
  }).index("by_user", ["authUserId"]),

  membershipPlans: defineTable({
    key: membershipTier,
    name: v.string(),
    description: v.string(),
    monthlyPriceInCents: v.number(),
    annualPriceInCents: v.number(),
    stripeMonthlyPriceId: v.optional(v.string()),
    stripeAnnualPriceId: v.optional(v.string()),
    features: v.array(v.string()),
    active: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_active_sort", ["active", "sortOrder"]),

  subscriptions: defineTable({
    authUserId: v.string(),
    planKey: membershipTier,
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.string(),
    cancelAtPeriodEnd: v.boolean(),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_user", ["authUserId"])
    .index("by_stripe_customer", ["stripeCustomerId"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),

  newsletterSubscriptions: defineTable({
    email: v.string(),
    authUserId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("subscribed"),
      v.literal("unsubscribed"),
      v.literal("bounced"),
      v.literal("complained"),
    ),
    source: v.string(),
    consentedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    source: v.string(),
    ipHash: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("spam"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email_created", ["email", "createdAt"])
    .index("by_status_created", ["status", "createdAt"]),

  webhookEvents: defineTable({
    provider: v.union(v.literal("stripe"), v.literal("resend")),
    eventId: v.string(),
    eventType: v.string(),
    processedAt: v.number(),
    payloadHash: v.optional(v.string()),
  }).index("by_provider_event", ["provider", "eventId"]),

  importJobs: defineTable({
    source: v.union(
      v.literal("wix"),
      v.literal("substack"),
      v.literal("csv"),
      v.literal("manual"),
      v.literal("catalog"),
    ),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    requestedBy: v.string(),
    sourceUrl: v.optional(v.string()),
    totalRecords: v.number(),
    importedRecords: v.number(),
    skippedRecords: v.number(),
    failedRecords: v.number(),
    errorSummary: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status_created", ["status", "createdAt"]),

  importRecords: defineTable({
    jobId: v.id("importJobs"),
    externalId: v.string(),
    identity: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    entityType: v.string(),
    status: v.union(
      v.literal("staged"),
      v.literal("imported"),
      v.literal("skipped"),
      v.literal("failed"),
    ),
    targetId: v.optional(v.string()),
    checksum: v.optional(v.string()),
    payload: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_identity", ["identity"])
    .index("by_job", ["jobId"])
    .index("by_job_external", ["jobId", "externalId"]),

  auditLog: defineTable({
    actorAuthUserId: v.string(),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_actor_created", ["actorAuthUserId", "createdAt"])
    .index("by_entity", ["entityType", "entityId"]),
});
