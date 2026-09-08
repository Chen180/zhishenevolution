/**
 * scripts/build-articles.mjs 的类型声明（供 tests/unit 在严格 TS 下导入）。
 * 接口与 lib/domain/articles.ts 保持一致。
 */

export interface ArticleBlock {
  type: "heading" | "paragraph";
  text: string;
}

export interface ParsedArticle {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  blocks: ArticleBlock[];
}

export declare function parseArticleFilename(filename: string): {
  slug: string;
  date: string;
};

export declare function isTagLine(line: string): boolean;

export declare function isHeadingLine(line: string): boolean;

export declare function buildExcerpt(
  paragraphs: string[],
  maxLength?: number,
): string;

export declare function parseArticle(
  markdown: string,
  meta: { slug: string; date: string },
): ParsedArticle;

export declare function buildArticles(dir?: string): ParsedArticle[];
