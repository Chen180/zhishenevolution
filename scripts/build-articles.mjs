/**
 * 把 Resource/articles 下的公众号文章母版 md 解析为 data/articles.json。
 *
 * 用法：npm run build:articles
 * 母版不入 Git（见 docs/adr/0005），本脚本在母版变更后手动运行。
 *
 * 解析规则：
 * - 文件名 YYYYMMDD_标题.md → slug（完整文件名，不含 .md）与 date。
 * - 第一个非空行是完整标题，剥掉开头的 `# ` 前缀。
 * - 单独一行的「图片」（公众号配图占位）丢弃。
 * - 整行由「#词」组成的话题标签行（行尾可带或不带 #）提取为 tags 并丢弃。
 * - 「原文：URL」或「原文链接：URL」行提取为 sourceUrl（公众号原文
 *   链接，用于文章页导流入口），从正文丢弃。
 * - 从 END 行（含）起，或没有 END 时从「作者：」行起，尾部全部丢弃。
 * - markdown 小标题（# xxx / ## xxx）剥掉井号，与中文编号行
 *   （1、xxx / 八、xxx）统一视为 heading 块；其余非空行为 paragraph 块。
 * - 摘要取正文前 1～2 个段落，截断到约 100 字。
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = join(root, "Resource", "articles");
const OUTPUT = join(root, "data", "articles.json");

const EXCERPT_LENGTH = 100;

/** 话题标签行：整行由「#词」组成，词间可无空格（#a#b#c#）或空格分隔
 * （#a #b #c），行尾可带或不带 #。markdown 标题是 `# 词`（井号后紧跟
 * 空格），不会误判。 */
const TAG_TOKEN = /^#.+/;

/** 从标签行提取话题标签 */
function extractTags(line) {
  return line
    .split("#")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}
/** 公众号原文链接行：原文：https://… 或 原文链接：https://… */
const SOURCE_URL_LINE = /^(?:原文|原文链接|公众号原文)[:：]\s*(\S+)$/;

/** markdown 小标题：# xxx / ## xxx */
const MD_HEADING = /^#{1,6}\s+\S/;
/** 中文编号小标题：1、xxx 或 八、xxx */
const NUMBERED_HEADING = /^(?:\d+|[一二三四五六七八九十]+)、/;

function fail(message) {
  console.error(`[build:articles] ${message}`);
  process.exit(1);
}

/** 从文件名解析 slug 与日期：YYYYMMDD_标题.md */
export function parseArticleFilename(filename) {
  const base = filename.replace(/\.md$/i, "");
  const match = base.match(/^(\d{4})(\d{2})(\d{2})_(.+)$/);
  if (!match) {
    throw new Error(`文件名不符合「YYYYMMDD_标题.md」格式：${filename}`);
  }
  const [, year, month, day] = match;
  return { slug: base, date: `${year}-${month}-${day}` };
}

/** 是否话题标签行（每个空白分隔的词都以 # 开头，如 #中公教育#注意力# 或 #时间信用 #王计兵） */
export function isTagLine(line) {
  return line.split(/\s+/).every((token) => TAG_TOKEN.test(token));
}

/** 是否小标题行（markdown 井号标题或中文编号行） */
export function isHeadingLine(line) {
  return MD_HEADING.test(line) || NUMBERED_HEADING.test(line);
}

/** 取摘要：正文前 1～2 个段落，截断到约 maxLength 字 */
export function buildExcerpt(paragraphs, maxLength = EXCERPT_LENGTH) {
  const picked = [];
  let length = 0;
  for (const text of paragraphs) {
    if (picked.length === 2) break;
    if (picked.length === 1 && length >= maxLength) break;
    picked.push(text);
    length += text.length;
  }
  const excerpt = picked.join("");
  return excerpt.length > maxLength
    ? `${excerpt.slice(0, maxLength)}…`
    : excerpt;
}

/** 解析单篇母版 md 为结构化文章记录 */
export function parseArticle(markdown, { slug, date }) {
  const lines = markdown.split(/\r?\n/);

  // 尾注：从 END 行（含）起丢弃；没有 END 时从「作者：」行起丢弃
  let endIndex = lines.length;
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed === "END" || trimmed.startsWith("作者：")) {
      endIndex = i;
      break;
    }
  }
  const body = lines.slice(0, endIndex);

  // 标题：第一个非空行，剥掉开头的井号前缀
  const titleIndex = body.findIndex((line) => line.trim().length > 0);
  if (titleIndex === -1) throw new Error(`文章 ${slug} 正文为空`);
  const title = body[titleIndex].trim().replace(/^#+\s*/, "");

  const tags = [];
  let sourceUrl;
  const blocks = [];
  for (const line of body.slice(titleIndex + 1)) {
    const text = line.trim();
    if (!text || text === "图片") continue;
    const sourceMatch = text.match(SOURCE_URL_LINE);
    if (sourceMatch) {
      sourceUrl = sourceMatch[1];
      continue;
    }
    if (isTagLine(text)) {
      tags.push(...extractTags(text));
      continue;
    }
    if (isHeadingLine(text)) {
      blocks.push({ type: "heading", text: text.replace(/^#+\s*/, "") });
    } else {
      blocks.push({ type: "paragraph", text });
    }
  }

  const excerpt = buildExcerpt(
    blocks.filter((block) => block.type === "paragraph").map((b) => b.text),
  );

  return {
    slug,
    title,
    date,
    tags: [...new Set(tags)],
    excerpt,
    blocks,
    ...(sourceUrl ? { sourceUrl } : {}),
  };
}

/** 扫描母版目录，解析全部文章并按日期倒序 */
export function buildArticles(dir = ARTICLES_DIR) {
  const files = readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort();
  if (files.length === 0) fail(`未在 ${dir} 找到任何文章母版`);

  const articles = files.map((file) =>
    parseArticle(readFileSync(join(dir, file), "utf8"), parseArticleFilename(file)),
  );
  articles.sort((a, b) => b.date.localeCompare(a.date));
  return articles;
}

function main() {
  const articles = buildArticles();

  // 完整性断言：任何一个不满足都拒绝产出
  const slugs = new Set();
  for (const article of articles) {
    if (slugs.has(article.slug)) fail(`slug 重复：${article.slug}`);
    slugs.add(article.slug);
    if (!article.title) fail(`文章 ${article.slug} 缺少标题`);
    if (!article.excerpt) fail(`文章 ${article.slug}（${article.title}）摘要为空`);
    if (article.blocks.length === 0) {
      fail(`文章 ${article.slug}（${article.title}）没有正文块`);
    }
  }

  const output = { generatedAt: new Date().toISOString(), articles };
  writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`[build:articles] 已生成 ${OUTPUT}（${articles.length} 篇文章）`);
}

// 供测试 import 时不触发构建，仅作为脚本直接运行时才执行
const invokedAsScript =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedAsScript) main();
