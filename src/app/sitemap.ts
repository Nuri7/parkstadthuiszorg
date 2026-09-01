import type { MetadataRoute } from "next";

import { gemeenten } from "@/data/gemeenten";

const BASE_URL = "https://parkstadthuiszorg.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/diensten`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/over-ons`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/vergoedingen`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/kennisbank`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    ...gemeenten.map((g) => ({
      url: `${BASE_URL}/thuiszorg/${g.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/voorwaarden`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
