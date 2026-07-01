import type { MetadataRoute } from "next";

const siteUrl = "https://montjeffrey.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/contact",
    "/resume",
    "/projects",
    "/projects/sports-analytics",
    "/projects/levelz-barber-studio",
    "/projects/the-gen-z-mama",
    "/projects/security-assessment",
    "/projects/crm-integration",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/projects/") ? 0.7 : 0.8,
  }));
}
