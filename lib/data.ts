/* =============================================================
   Shared content data for the Nia Forrester Reader Hub.
   Ported from the Claude Design source (Nia Forrester Reader Hub v2).
   ============================================================= */

/* ---------- Book-cover gradients ---------- */
export const COCOA = "bg-[linear-gradient(160deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_100%)]";
export const NAVY = "bg-[linear-gradient(160deg,var(--color-deep-plum)_0%,var(--color-cool-teal)_140%)]";
export const TEAL = "bg-[linear-gradient(160deg,var(--color-cool-teal)_0%,var(--color-deep-plum)_100%)]";
export const BURNT = "bg-[linear-gradient(160deg,var(--color-cool-teal)_0%,var(--color-hot-magenta)_100%)]";
export const MAUVE = "bg-[linear-gradient(160deg,var(--color-hot-magenta)_0%,var(--color-deep-plum)_100%)]";
export const CORAL = "bg-[linear-gradient(160deg,var(--color-cool-teal)_0%,var(--color-hot-magenta)_100%)]";
export const AMBER = "bg-[linear-gradient(160deg,var(--color-cool-teal)_0%,var(--color-deep-plum)_100%)]";

/* ---------- Navigation ---------- */
export interface NavItem {
  key: string;
  label: string;
  href: string;
  /** paths that mark this item active */
  match: string[];
}

export const navItems: NavItem[] = [
  { key: "read", label: "Read", href: "/read", match: ["/read", "/serial"] },
  { key: "community", label: "Community", href: "/community", match: ["/community"] },
  { key: "events", label: "Events", href: "/events", match: ["/events"] },
  { key: "academy", label: "Academy", href: "/academy", match: ["/academy"] },
  { key: "membership", label: "Join the Circle", href: "/membership", match: ["/membership"] },
];

/* ---------- Books & series ---------- */
export interface Book {
  title: string;
  meta: string;
  gradient: string;
}

export interface Series {
  name: string;
  tag: string;
  books: Book[];
}

export const series: Series[] = [
  {
    name: "Forty-Nothing",
    tag: "Serial · in progress",
    books: [{ title: "Forty-Nothing", meta: "Ch. 11 live", gradient: COCOA }],
  },
  {
    name: "Commitment",
    tag: "5 books",
    books: [
      { title: "Commitment", meta: "2012", gradient: CORAL },
      { title: "Unsuitable Men", meta: "2012", gradient: NAVY },
      { title: "Maybe Never", meta: "2013", gradient: TEAL },
      { title: "The Fall", meta: "2016", gradient: BURNT },
      { title: "Four", meta: "2018", gradient: MAUVE },
    ],
  },
  {
    name: "The Shorts",
    tag: "12 books · standalone novellas",
    books: [
      { title: "Still", meta: "2017", gradient: NAVY },
      { title: "Coffee Date", meta: "2017", gradient: AMBER },
      { title: "Table for Two", meta: "2017", gradient: TEAL },
      { title: "Silent Nights", meta: "2020", gradient: COCOA },
      { title: "The Wanderer", meta: "2020", gradient: MAUVE },
      { title: "May December", meta: "2022", gradient: BURNT },
    ],
  },
  {
    name: "Mistress Trilogy",
    tag: "3 books",
    books: [
      { title: "Mistress", meta: "2013", gradient: MAUVE },
      { title: "Wife", meta: "2014", gradient: CORAL },
      { title: "Mother", meta: "2014", gradient: COCOA },
    ],
  },
  {
    name: "Standalones",
    tag: "Novels",
    books: [
      { title: "Ivy's League", meta: "Novel", gradient: MAUVE },
      { title: "The Broken", meta: "2022", gradient: NAVY },
      { title: "Snowflake", meta: "Novel", gradient: TEAL },
      { title: "The Lover", meta: "Novel", gradient: BURNT },
      { title: "Rapture", meta: "Novel", gradient: CORAL },
      { title: "Recall", meta: "Audio · 2026", gradient: AMBER },
    ],
  },
];

export const popular: Book[] = [
  { title: "Forty-Nothing", meta: "Serial", gradient: COCOA },
  { title: "Ivy's League", meta: "Standalone", gradient: MAUVE },
  { title: "The Broken", meta: "2022", gradient: NAVY },
  { title: "Snowflake", meta: "Standalone", gradient: TEAL },
  { title: "The Lover", meta: "Standalone", gradient: BURNT },
  { title: "Commitment", meta: "Series", gradient: CORAL },
  { title: "Recall", meta: "Audio", gradient: AMBER },
];

/* ---------- Essays ---------- */
export interface Essay {
  tag: string;
  date: string;
  title: string;
  excerpt: string;
}

export const essays: Essay[] = [
  {
    tag: "Tropes",
    date: "3 days ago",
    title: 'Is the "Magic Negro" hiding in your favorite IR romance?',
    excerpt:
      "I'm not here to cancel the swirl — I've written it myself. But too many Black heroines exist only to heal or complete a white man. Let's name the trope.",
  },
  {
    tag: "On love",
    date: "1 week ago",
    title: "Love Isn't War",
    excerpt:
      'He was funny, smart, made me smile. Then came twenty minutes of "women like you don’t need a man." Not mad. Just disappointed.',
  },
  {
    tag: "Craft",
    date: "2 weeks ago",
    title: "Why I serialized a novel instead of publishing it",
    excerpt:
      "Forty-Nothing arrives one chapter at a time, and the comments have become part of the book. Here’s what that changed.",
  },
  {
    tag: "Dispatch",
    date: "3 weeks ago",
    title: "Three thousand women, empty suitcases",
    excerpt:
      "They showed up to Black Romance Book Fest with empty luggage and full intentions. It reset my whole calibration of what a book event is.",
  },
];

/* ---------- Events ---------- */
export interface EventItem {
  mon: string;
  day: string;
  type: string;
  title: string;
  where: string;
  cta: string;
  cat: "inperson" | "online" | "workshop";
}

export const events: EventItem[] = [
  { mon: "FEB", day: "14", type: "Appearance", title: "Black Romance Book Fest 2026", where: "Atlanta, GA · Table 7", cta: "Get tickets", cat: "inperson" },
  { mon: "MAR", day: "02", type: "Virtual reading", title: "Forty-Nothing: Chapters 9–11, read live", where: "Online · Reader Circle", cta: "RSVP", cat: "online" },
  { mon: "MAR", day: "18", type: "Workshop", title: "Writing the slow burn", where: "Online · Writers Circle", cta: "Reserve seat", cat: "workshop" },
  { mon: "APR", day: "05", type: "Live Q&A", title: "Ask Nia anything", where: "Online · Inner Circle", cta: "Add to calendar", cat: "online" },
  { mon: "JUN", day: "12", type: "Retreat", title: "Woman-Centered Writing Retreat", where: "Asheville, NC · 3 days", cta: "Join waitlist", cat: "inperson" },
];

export const featuredEvent = {
  mon: "FEB",
  day: "14",
  type: "Marquee appearance",
  title: "Black Romance Book Fest 2026",
  blurb:
    "Three thousand readers, empty suitcases, full intentions. Nia signs at Table 7 all weekend, joins the second-chance-romance panel Saturday, and reads new pages Sunday before anyone else gets them.",
  where: "Atlanta, GA",
  when: "Feb 14–16 · all weekend",
  gradient: CORAL,
};

export interface Recording {
  type: string;
  title: string;
  date: string;
  duration: string;
  gradient: string;
}

export const recordings: Recording[] = [
  { type: "Live read", title: "Forty-Nothing: Chapters 5–8", date: "Recorded Jan 2026", duration: "1h 04m", gradient: COCOA },
  { type: "Live Q&A", title: "On writing the second-chance trope", date: "Recorded Dec 2025", duration: "52m", gradient: MAUVE },
  { type: "Workshop", title: "Scene, summary, and the white space between", date: "Recorded Nov 2025", duration: "1h 18m", gradient: TEAL },
];

/* ---------- Community ---------- */
export interface Thread {
  tag: string;
  title: string;
  author: string;
  initials: string;
  avatarColor: string;
  when: string;
  count: string;
  pinned: boolean;
}

export const threads: Thread[] = [
  { tag: "Forty-Nothing", title: "Did Luke deserve a second chance after six years of silence?", author: "Tasha R.", initials: "TR", avatarColor: "bg-[var(--color-deep-plum)]", when: "2h ago", count: "48", pinned: false },
  { tag: "Backlist", title: "Best grown-folks romance in the whole catalogue — defend your pick", author: "Imani K.", initials: "IK", avatarColor: "bg-[var(--color-hot-magenta)]", when: "5h ago", count: "112", pinned: false },
  { tag: "Character debate", title: "Riley vs. Robyn: who actually grew the most?", author: "Denise W.", initials: "DW", avatarColor: "bg-[var(--color-cool-teal)]", when: "yesterday", count: "27", pinned: false },
  { tag: "Craft talk", title: "Loving the serial format — why serialize instead of publish?", author: "Nia F.", initials: "NF", avatarColor: "bg-[var(--color-deep-plum)]", when: "3d ago", count: "19", pinned: true },
];

export interface Club {
  name: string;
  desc: string;
  members: string;
  gradient: string;
}

export const clubs: Club[] = [
  { name: "The Commitment Readalong", desc: "Five books, one chapter a week. Currently on Unsuitable Men.", members: "214 members", gradient: CORAL },
  { name: "New Chapter Club", desc: "Serial readers who unpack Forty-Nothing the day each chapter drops.", members: "389 members", gradient: COCOA },
  { name: "Backlist Book Club", desc: "A monthly pick from the archive. This month: Ivy's League.", members: "156 members", gradient: TEAL },
];

export interface Reaction {
  initials: string;
  name: string;
  color: string;
  quote: string;
}

export const reactions: Reaction[] = [
  { initials: "TR", name: "Tasha R.", color: "bg-[var(--color-deep-plum)]", quote: "The drawer line. I gasped. She would NOT open it in my house." },
  { initials: "IK", name: "Imani K.", color: "bg-[var(--color-hot-magenta)]", quote: "Six years and he shows up empty-handed? Bold. Reading on." },
  { initials: "DW", name: "Denise W.", color: "bg-[var(--color-deep-plum)]", quote: '"Don’t" doing all the heavy lifting here. Chills.' },
];

export const communityStats = [
  { num: "1,240", label: "Members" },
  { num: "89", label: "Threads this week" },
  { num: "6", label: "Book clubs" },
  { num: "320", label: "In live reads" },
];

export const circleSessions = [
  { mon: "MAR", day: "02", type: "Live read", title: "Forty-Nothing, Ch. 9–11 — read live", where: "Reader Circle", host: "With Nia", accent: "text-[var(--color-hot-magenta)]" },
  { mon: "MAR", day: "18", type: "Workshop", title: "Writing the slow burn", where: "Writers Circle", host: "With Nia", accent: "text-[var(--color-cool-teal)]" },
  { mon: "APR", day: "05", type: "Live Q&A", title: "Ask Nia anything", where: "Inner Circle", host: "With Nia", accent: "text-[var(--color-cool-teal)]" },
];

export const principles = [
  { num: "1", title: "Spoilers stay behind the cut", desc: "Tag chapter numbers and use the spoiler toggle. Everyone reads at her own pace here." },
  { num: "2", title: "Argue with the book, not the reader", desc: "Strong opinions on Luke are welcome. Strong opinions on each other are not." },
  { num: "3", title: "The author is in the room", desc: "Nia reads the threads and answers in them. Keep it the kind of place she’d want to stay." },
];

/* ---------- Membership tiers ---------- */
export interface Tier {
  name: string;
  monthly: number; // 0 = free
  desc: string;
  cta: string;
  featured: boolean;
  features: string[];
}

export const tiers: Tier[] = [
  {
    name: "Free Reader",
    monthly: 0,
    desc: "The front door — everything public, no card needed.",
    cta: "Start free",
    featured: false,
    features: ["Weekly newsletter", "Blog & Quick Bites", "New-release alerts", "Public serial chapters"],
  },
  {
    name: "Reader Circle",
    monthly: 7,
    desc: "Read the serials as they unfold, with the early drops.",
    cta: "Join Reader Circle",
    featured: false,
    features: ["Everything in Free", "Full serialized fiction", "Early chapters", "Reader discussions", "Monthly live chat"],
  },
  {
    name: "Inner Circle",
    monthly: 18,
    desc: "The full reader experience, closest to Nia.",
    cta: "Join Inner Circle",
    featured: true,
    features: ["Everything in Reader", "Bonus stories & outtakes", "Live Q&A with Nia", "Members-only book club", "Audiobook previews"],
  },
  {
    name: "Writers Circle",
    monthly: 49,
    desc: "For writers who want the craft and the room.",
    cta: "Join Writers Circle",
    featured: false,
    features: ["Everything in Inner", "Craft discussions", "Monthly workshops", "Writing office hours", "25% off editing services"],
  },
];

/** Price display for a tier under monthly/annual billing (annual = 2 months free). */
export function tierPrice(monthly: number, annual: boolean): { price: string; per: string; note: string } {
  if (monthly === 0) return { price: "$0", per: "forever", note: "" };
  if (!annual) return { price: "$" + monthly, per: "/month", note: "" };
  return { price: "$" + monthly * 10, per: "/year", note: "2 months free" };
}

/* ---------- Membership comparison table ---------- */
export type CompareCell = { yes: true } | { no: true } | { text: true; label: string };

const mkCell = (v: string): CompareCell =>
  v === "x" ? { yes: true } : !v ? { no: true } : { text: true, label: v };

const compareGroupsRaw = [
  {
    group: "Reading",
    rows: [
      { feat: "Weekly newsletter & blog", cols: ["x", "x", "x", "x"] },
      { feat: "New-release alerts", cols: ["x", "x", "x", "x"] },
      { feat: "Public serial chapters", cols: ["x", "x", "x", "x"] },
      { feat: "Full serialized fiction", cols: ["", "x", "x", "x"] },
      { feat: "Early chapter drops", cols: ["", "x", "x", "x"] },
      { feat: "Bonus stories & outtakes", cols: ["", "", "x", "x"] },
      { feat: "Audiobook previews", cols: ["", "", "x", "x"] },
    ],
  },
  {
    group: "Community",
    rows: [
      { feat: "Reader discussions", cols: ["", "x", "x", "x"] },
      { feat: "Monthly live chat", cols: ["", "x", "x", "x"] },
      { feat: "Members-only book club", cols: ["", "", "x", "x"] },
      { feat: "Live Q&A with Nia", cols: ["", "", "x", "x"] },
    ],
  },
  {
    group: "Craft & writing",
    rows: [
      { feat: "Craft discussions", cols: ["", "", "", "x"] },
      { feat: "Monthly workshops", cols: ["", "", "", "x"] },
      { feat: "Writing office hours", cols: ["", "", "", "x"] },
      { feat: "Editing services", cols: ["", "", "", "25% off"] },
    ],
  },
];

export const compareGroups = compareGroupsRaw.map((g) => ({
  group: g.group,
  rows: g.rows.map((r) => ({ feat: r.feat, cells: r.cols.map(mkCell) })),
}));

export const compareTiers = [
  { name: "Free", highlight: false },
  { name: "Reader", highlight: false },
  { name: "Inner", highlight: true },
  { name: "Writers", highlight: false },
];

export const memberVoices = [
  {
    quote:
      "The early chapters ruin me every month and I wouldn’t have it any other way. Reading Forty-Nothing as it unfolds feels like being let in on a secret.",
    name: "Adaeze N.",
    role: "Inner Circle · 2 years",
    initial: "A",
  },
  {
    quote:
      "The book club is the only group chat I never mute. We argued about Luke for three weeks straight and I loved every second of it.",
    name: "Renata B.",
    role: "Reader Circle · 1 year",
    initial: "R",
  },
  {
    quote:
      "Office hours got my manuscript unstuck after eighteen months. Nia reads like an editor and talks to you like a friend.",
    name: "Camille O.",
    role: "Writers Circle · 8 months",
    initial: "C",
  },
];

export const faqs = [
  {
    q: "Can I switch tiers or cancel anytime?",
    a: "Yes. Upgrade, downgrade, or cancel in one click from your account. Changes take effect at your next billing date, and you keep access to everything you’ve already unlocked.",
  },
  {
    q: "What does “everything below it” include?",
    a: "Each tier is cumulative. Inner Circle includes everything in Reader Circle and Free; Writers Circle includes all three. You never lose a benefit by moving up.",
  },
  {
    q: "How does annual billing work?",
    a: "Choose annual and you pay for ten months and get twelve — two months free. You can still cancel anytime; we’ll refund the unused remainder of your year.",
  },
  {
    q: "Do the editing services come with membership?",
    a: "Writers Circle members get 25% off all editing and coaching services. The services themselves — critiques, manuscript reviews, coaching — are booked and priced separately.",
  },
  {
    q: "Is there a student or hardship rate?",
    a: "There is. The Free Reader tier is genuinely free forever, and we offer reduced Reader Circle rates on request — just email us. No reader is turned away for cost.",
  },
];

/* ---------- Academy / Writing Studio ---------- */
export const services = [
  { name: "First 10 Pages Review", price: "Free", desc: "Send the first ten pages of your manuscript for a focused review of what is working and where the opening could be stronger." },
  { name: "Story Critique", price: "from $150", desc: "A close read of your opening pages or a short, with honest, actionable notes on what’s working and what isn’t." },
  { name: "Manuscript Review", price: "from $600", desc: "A full-manuscript assessment — structure, pacing, character, and voice — delivered as a written editorial letter." },
  { name: "1:1 Coaching", price: "$120 / session", desc: "Work through plot knots, career questions, or accountability, one conversation at a time." },
  { name: "Developmental Editing", price: "Custom", desc: "A hands-on editing partnership from outline to final draft, for writers ready to go all the way." },
];

/* ---------- Serial (Forty-Nothing) ---------- */
export const chapterTitles = [
  "The Doorbell",
  "Six Years of Silence",
  "Carefully Constructed",
  "Kwesi Knows",
  "Slow",
  "Christy",
  "The Ex-Wife",
  "What He Didn't Say",
  "Bring Wine",
  "Or Does He?",
  "Undone",
];

/* ---------- Read hub extras ---------- */
export const readingPaths = [
  { eyebrow: "New to Nia", title: "Start with Commitment", desc: "The series that started it all — Riley and Shawn, five books deep.", meta: "5 books · Series", gradient: CORAL },
  { eyebrow: "Want it in one sitting", title: "Try the Shorts", desc: "Coffee-date novellas you can finish on a lunch break.", meta: "Novellas · The Shorts", gradient: AMBER },
  { eyebrow: "Here for the slow burn", title: "Read Ivy's League", desc: "A gilded cage, a man beneath her station, and a bond that shouldn’t last.", meta: "Standalone novel", gradient: MAUVE },
];

export const mostRead = [
  { rank: "01", title: "Forty-Nothing", meta: "Serial · 4,210 reading now", gradient: COCOA, href: "/serial" },
  { rank: "02", title: "Commitment", meta: "Series · 2,980 this month", gradient: CORAL, href: "/read/commitment" },
  { rank: "03", title: "Ivy's League", meta: "Standalone · 2,140", gradient: MAUVE, href: "/read/ivys-league" },
  { rank: "04", title: "The Fall", meta: "Commitment #4 · 1,870", gradient: BURNT, href: "/read/the-fall" },
  { rank: "05", title: "The Broken", meta: "2022 · 1,540", gradient: NAVY, href: "/read/the-broken" },
];

export interface BookDetail {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  gradient: string;
  category: string;
  published: string;
  readingOrder: string;
  seriesName?: string;
  seriesBooks?: string[];
  bestFor: string[];
}

export const bookDetails: BookDetail[] = [
  {
    slug: "commitment",
    title: "Commitment",
    eyebrow: "The Commitment Series",
    description:
      "The series that started it all — Riley and Shawn, five books deep. Begin here, then follow the complete Commitment reading order without losing your place.",
    gradient: CORAL,
    category: "Series opener",
    published: "2012",
    readingOrder: "Book 1 of 5",
    seriesName: "Commitment",
    seriesBooks: ["Commitment", "Unsuitable Men", "Maybe Never", "The Fall", "Four"],
    bestFor: ["New readers", "Series readers", "Relationship-driven fiction"],
  },
  {
    slug: "ivys-league",
    title: "Ivy's League",
    eyebrow: "Standalone Novel",
    description:
      "A gilded cage, a man beneath her station, and a bond that shouldn’t last. A complete standalone for readers who want one immersive story in a single volume.",
    gradient: MAUVE,
    category: "Standalone novel",
    published: "Available now",
    readingOrder: "Read in any order",
    bestFor: ["Standalone readers", "Slow-burn romance", "One-volume stories"],
  },
  {
    slug: "the-fall",
    title: "The Fall",
    eyebrow: "The Commitment Series",
    description:
      "The fourth novel in the Commitment series. Read the first three books before stepping into this chapter of the larger story.",
    gradient: BURNT,
    category: "Series novel",
    published: "2016",
    readingOrder: "Book 4 of 5",
    seriesName: "Commitment",
    seriesBooks: ["Commitment", "Unsuitable Men", "Maybe Never", "The Fall", "Four"],
    bestFor: ["Returning readers", "Long-form series", "Continuing character arcs"],
  },
  {
    slug: "the-broken",
    title: "The Broken",
    eyebrow: "Standalone Novel",
    description:
      "A complete standalone novel from Nia Forrester’s backlist. Start here when you want a full story without committing to a multi-book reading order.",
    gradient: NAVY,
    category: "Standalone novel",
    published: "2022",
    readingOrder: "Read in any order",
    bestFor: ["Standalone readers", "Backlist explorers", "Complete stories"],
  },
];

export function getBookDetail(slug: string) {
  return bookDetails.find((book) => book.slug === slug);
}

export const audiobooks = [
  { title: "Recall", narrator: "Bahni Turpin", duration: "9h 12m", gradient: AMBER },
  { title: "The Broken", narrator: "Adenrele Ojo", duration: "11h 04m", gradient: NAVY },
  { title: "Commitment", narrator: "Bahni Turpin", duration: "8h 47m", gradient: CORAL },
  { title: "Snowflake", narrator: "Karole Foreman", duration: "6h 33m", gradient: TEAL },
  { title: "The Fall", narrator: "Adenrele Ojo", duration: "10h 21m", gradient: BURNT },
];

export const shortReads: Book[] = [
  { title: "Coffee Date", meta: "Novella", gradient: AMBER },
  { title: "Just Lunch", meta: "Novella", gradient: TEAL },
  { title: "Table for Two", meta: "Novella", gradient: CORAL },
  { title: "Still", meta: "Short", gradient: NAVY },
  { title: "Silent Nights", meta: "Holiday short", gradient: COCOA },
  { title: "Not That Kind of Girl", meta: "Short", gradient: MAUVE },
];

/* ---------- Signup ---------- */
export const prefOptions = [
  "The serials",
  "Grown-folks romance",
  "Second chances",
  "Novellas & short reads",
  "Audiobooks",
  "Craft & writing",
];
