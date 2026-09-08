import Link from "next/link";
import { listArticles } from "@/lib/domain/articles";
import styles from "./Articles.module.css";

export function ArticlesIndex() {
  const articles = listArticles();

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>ARTICLES</p>
        <h1>文章</h1>
        <p className={styles.lead}>
          用现实案例看见时代，用文明智慧理解人生。
          公众号「智神进化纪」的长文存档，记录一个普通人在巨变时代的观察与思考。
        </p>
      </section>

      <section className={styles.list} aria-label="文章列表">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className={styles.card}
          >
            <p className={styles.cardMeta}>
              <time dateTime={article.date}>{article.date}</time>
            </p>
            <h2 className={styles.cardTitle}>{article.title}</h2>
            <p className={styles.cardExcerpt}>{article.excerpt}</p>
            {article.tags.length > 0 ? (
              <p className={styles.tags}>
                {article.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </p>
            ) : null}
          </Link>
        ))}
      </section>
    </div>
  );
}
