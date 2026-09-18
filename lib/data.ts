// Static navigation and preference labels only. Runtime content comes from Convex.
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

export const prefOptions = [
  "The serials",
  "Grown-folks romance",
  "Second chances",
  "Novellas & short reads",
  "Audiobooks",
  "Craft & writing",
];
