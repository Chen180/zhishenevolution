import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Article, ArticleSummary } from "@/lib/domain/articles";
import styles from "./Articles.module.css";

export function ArticleDetail({
  article,
  prev,
  next,
}: {
  article: Article;
  prev?: ArticleSummary;
  next?: ArticleSummary;
}) {
  return (
    <div className={styles.page}>
      <article className={styles.detail}>
        <nav className={styles.breadcrumb} aria-label="面包屑">
          <Link href="/articles">
            <ArrowLeft size={14} />
            全部文章
          </Link>
          <span>/ {article.date}</span>
        </nav>

        <header className={styles.detailHeader}>
          <p className={styles.cardMeta}>
            <time dateTime={article.date}>{article.date}</time>
          </p>
          <h1>{article.title}</h1>
          {article.tags.length > 0 ? (
            <p className={styles.tags}>
              {article.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </p>
          ) : null}
        </header>

        <div className={styles.body}>
          {article.blocks.map((block, index) =>
            block.type === "heading" ? (
              <h2 key={index}>{block.text}</h2>
            ) : (
              <p key={index}>{block.text}</p>
            ),
          )}
        </div>

        <nav className={styles.pagerNav} aria-label="文章翻页">
          {prev ? (
            <Link href={`/articles/${prev.slug}`}>
              <span className={styles.pagerLabel}>
                <ArrowLeft size={12} />
                上一篇（更新）
              </span>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/articles/${next.slug}`}>
              <span className={styles.pagerLabel}>
                下一篇（更早）
                <ArrowRight size={12} />
              </span>
              {next.title}
            </Link>
          ) : (
            <span />
          )}
        </nav>

        {article.sourceUrl ? (
          <p className={styles.sourceLine}>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              在微信原文中阅读
              <ArrowRight size={13} />
            </a>
          </p>
        ) : null}

        <p className={styles.copyright}>
          智神进化纪 zhishenevo.com ｜ 何明轩 · 保留所有权利
        </p>
      </article>
    </div>
  );
}
