import data from "@/data/articles.json";

/**
 * 文章库的只读数据访问层。
 * 数据来源：data/articles.json（由 scripts/build-articles.mjs
 * 从 Resource/articles 母版生成，见 docs/adr/0005），按日期倒序。
 */

export interface ArticleBlock {
  type: "heading" | "paragraph";
  text: string;
}

export interface Article {
  /** 文件名（不含 .md），含日期前缀，如 20260707_注意力 */
  slug: string;
  title: string;
  /** ISO 日期，如 2026-07-07 */
  date: string;
  /** 公众号话题标签 */
  tags: string[];
  /** 摘要：正文前 1～2 个段落，截断到约 100 字 */
  excerpt: string;
  /** 预解析的正文内容块 */
  blocks: ArticleBlock[];
}

export type ArticleSummary = Omit<Article, "blocks">;

const ARTICLES = data.articles as Article[];

/** 文章摘要列表（不含正文块），按日期倒序。 */
export function listArticles(): ArticleSummary[] {
  return ARTICLES.map(({ slug, title, date, tags, excerpt }) => ({
    slug,
    title,
    date,
    tags,
    excerpt,
  }));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function listArticleSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}

/** 按日期倒序的相邻篇：prev 是更新的一篇，next 是更早的一篇。 */
export function getArticleNeighbors(slug: string): {
  prev?: ArticleSummary;
  next?: ArticleSummary;
} {
  const index = ARTICLES.findIndex((article) => article.slug === slug);
  if (index === -1) return {};
  const toSummary = ({ slug: s, title, date, tags, excerpt }: Article) => ({
    slug: s,
    title,
    date,
    tags,
    excerpt,
  });
  return {
    prev: index > 0 ? toSummary(ARTICLES[index - 1]) : undefined,
    next:
      index < ARTICLES.length - 1 ? toSummary(ARTICLES[index + 1]) : undefined,
  };
}
