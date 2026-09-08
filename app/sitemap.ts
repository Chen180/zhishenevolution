import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config/site";
import { getAllModels } from "@/lib/domain/thinking-models";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/people",
    "/credit-test",
    "/text-to-image",
    "/models",
    "/copyright",
    "/disclaimer",
    "/privacy",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/models" ? 0.9 : 0.7,
  }));

  const modelRoutes: MetadataRoute.Sitemap = getAllModels().map((model) => ({
    url: `${SITE.url}/models/${model.id}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...modelRoutes];
}
