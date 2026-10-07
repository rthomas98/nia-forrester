// Static navigation and preference labels only. Runtime content comes from Convex.
export interface NavChild {
  key: string;
  label: string;
  href: string;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  /** paths that mark this item active */
  match: string[];
  /** Optional destinations shown in the item's dropdown / mobile disclosure. */
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  {
    key: "read",
    label: "Read",
    href: "/read",
    match: ["/read", "/serial", "/blog", "/quick-bites", "/short-reads", "/outtakes"],
    children: [
      { key: "library", label: "Library", href: "/read" },
      { key: "backlist", label: "The Backlist", href: "/read#backlist" },
      { key: "serials", label: "Serials", href: "/serial" },
      { key: "blog", label: "Blog", href: "/blog" },
      { key: "quick-bites", label: "Quick Bites", href: "/quick-bites" },
      { key: "short-reads", label: "Short Reads", href: "/short-reads" },
      { key: "outtakes", label: "Outtakes", href: "/outtakes" },
    ],
  },
  // Connect stays visible during prelaunch; /membership and /community keep their own access gates.
  { key: "connect", label: "Connect", href: "/membership", match: ["/membership", "/community"] },
  { key: "gather", label: "Gather", href: "/events", match: ["/events"] },
  { key: "learn", label: "Learn", href: "/academy", match: ["/academy", "/work-with-nia"] },
];

export const prefOptions = [
  "The serials",
  "Grown-folks romance",
  "Second chances",
  "Novellas & short reads",
  "Audiobooks",
  "Craft & writing",
];
