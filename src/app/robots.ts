import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/create/", "/demo/"],
    },
    sitemap: [
      "https://aspoem.com/sitemap.xml",
      "https://aspoem.com/author/sitemap.xml",
      "https://aspoem.com/poem/sitemap.xml",
      "https://aspoem.com/list/sitemap.xml",
    ],
  };
}
