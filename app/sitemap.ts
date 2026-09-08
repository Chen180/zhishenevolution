import type { MetadataRoute } from "next";
import { getAllModels } from "@/lib/domain/thinking-models";

const BASE_URL = "https://zhishenevo.com";

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
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/models" ? 0.9 : 0.7,
  }));

  const modelRoutes: MetadataRoute.Sitemap = getAllModels().map((model) => ({
    url: `${BASE_URL}/models/${model.id}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...modelRoutes];
}
