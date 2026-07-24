import type { MetadataRoute } from "next";

const baseUrl = "https://www.niaforrester.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/read", changeFrequency: "weekly", priority: 0.9 },
    { path: "/read/commitment", changeFrequency: "monthly", priority: 0.7 },
    { path: "/read/ivys-league", changeFrequency: "monthly", priority: 0.7 },
    { path: "/read/the-fall", changeFrequency: "monthly", priority: 0.7 },
    { path: "/read/the-broken", changeFrequency: "monthly", priority: 0.7 },
    { path: "/serial", changeFrequency: "weekly", priority: 0.9 },
    { path: "/events", changeFrequency: "weekly", priority: 0.8 },
    { path: "/academy", changeFrequency: "monthly", priority: 0.7 },
    { path: "/community", changeFrequency: "weekly", priority: 0.6 },
    { path: "/membership", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.2 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.2 },
    { path: "/accessibility", changeFrequency: "monthly", priority: 0.2 },
  ];

  return routes
    .filter((route) => {
      if (
        route.path === "/community" &&
        process.env.NEXT_PUBLIC_COMMUNITY_ENABLED === "false"
      ) {
        return false;
      }
      if (
        route.path === "/membership" &&
        process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "false"
      ) {
        return false;
      }
      return true;
    })
    .map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date("2026-07-23"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    }));
}
