import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.nikhilp.online";
  const basePath = "/carbonviz"; // keep in sync with next.config.ts

  return [
    {
      url: `${baseUrl}${basePath}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}