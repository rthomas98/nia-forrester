import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/admin", "/signin", "/signup", "/reset"],
    },
    sitemap: "https://www.niaforrester.com/sitemap.xml",
    host: "https://www.niaforrester.com",
  };
}
