import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/features/articles/ArticleDetail";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE } from "@/lib/config/site";
import {
  getArticleBySlug,
  getArticleNeighbors,
  listArticleSlugs,
} from "@/lib/domain/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return listArticleSlugs().map((slug) => ({ slug }));
}

// 当前版本 Next 会把含中文的动态参数以 percent-encoded 形式传入，
// 查询数据前先解码；对纯 ASCII slug 解码是幂等的。
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(decodeSlug(slug));
  if (!article) return {};

  const url = `/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url,
      publishedTime: article.date,
      authors: [SITE.author],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(decodeSlug(slug));
  if (!article) notFound();

  const url = `${SITE.url}/articles/${article.slug}`;
  const { prev, next } = getArticleNeighbors(article.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: SITE.author,
      url: SITE.url,
    },
    inLanguage: "zh-CN",
    mainEntityOfPage: url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "文章",
        item: `${SITE.url}/articles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ArticleDetail article={article} prev={prev} next={next} />
    </>
  );
}
