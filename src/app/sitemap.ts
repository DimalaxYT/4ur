import type { MetadataRoute } from "next";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://4ur.fr"
).replace(/\/$/, "");

const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/realisations", priority: 0.9, changeFrequency: "monthly" },
  { path: "/web", priority: 0.9, changeFrequency: "monthly" },
  { path: "/security", priority: 0.9, changeFrequency: "monthly" },
  { path: "/lab", priority: 0.85, changeFrequency: "monthly" },
  { path: "/simulateur", priority: 0.85, changeFrequency: "monthly" },
  { path: "/methode", priority: 0.8, changeFrequency: "yearly" },
  { path: "/tarifs", priority: 0.85, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.75, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.85, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
