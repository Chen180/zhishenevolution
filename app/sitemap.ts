import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config/site";
import { listArticles } from "@/lib/domain/articles";
import { getAllModels } from "@/lib/domain/thinking-models";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/people",
    "/credit-test",
    "/text-to-image",
    "/models",
    "/articles",
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

  const articleRoutes: MetadataRoute.Sitemap = listArticles().map(
    (article) => ({
      url: `${SITE.url}/articles/${article.slug}`,
      lastModified: article.date,
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...modelRoutes, ...articleRoutes];
}
