import { SITE } from "@/lib/config/site";
import { listArticles } from "@/lib/domain/articles";

/** RSS 2.0 订阅源，数据来自 data/articles.json（见 docs/adr/0005）。 */

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const articles = listArticles();

  const items = articles
    .map((article) => {
      const url = `${SITE.url}/articles/${encodeURIComponent(article.slug)}`;
      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(`${article.date}T00:00:00+08:00`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(article.excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(SITE.name)}</title>`,
    `    <link>${SITE.url}</link>`,
    `    <description>${escapeXml(SITE.description)}</description>`,
    "    <language>zh-CN</language>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
