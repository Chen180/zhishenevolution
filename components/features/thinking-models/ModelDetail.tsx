import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  getLayerById,
  getModelById,
  type ThinkingModel,
} from "@/lib/domain/thinking-models";
import styles from "./ThinkingModels.module.css";

export function ModelDetail({ model }: { model: ThinkingModel }) {
  const layer = getLayerById(model.layer);
  const prev = getModelById(model.id - 1);
  const next = getModelById(model.id + 1);

  return (
    <div className={styles.page}>
      <article className={styles.detail}>
        <nav className={styles.breadcrumb} aria-label="面包屑">
          <Link href="/models">
            <ArrowLeft size={14} />
            全部模型
          </Link>
          {layer ? <span>/ {layer.name}</span> : null}
        </nav>

        <header className={styles.detailHeader}>
          <p className={styles.cardNumber}>
            {String(model.id).padStart(2, "0")} / 100
          </p>
          <h1>{model.name}</h1>
          {model.nameEn ? (
            <p className={styles.detailNameEn}>{model.nameEn}</p>
          ) : null}
          <p className={styles.detailDefinition}>{model.definition}</p>
        </header>

        <section className={styles.detailSection}>
          <h2>核心原理</h2>
          <p>{model.principle}</p>
        </section>

        <section className={styles.detailSection}>
          <h2>跨学科背景</h2>
          <p>{model.background}</p>
        </section>

        <section className={styles.detailSection}>
          <h2>应用场景</h2>
          <ul>
            {model.scenarios.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.detailSection}>
          <h2>落地方法</h2>
          <ol>
            {model.methods.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className={styles.detailSection}>
          <h2>故事 / 案例</h2>
          <p className={styles.story}>{model.story}</p>
        </section>

        <section className={styles.detailSection}>
          <h2>常见误区</h2>
          <ul>
            {model.pitfalls.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.detailSection}>
          <h2>延伸阅读</h2>
          <div className={styles.books}>
            <p className={styles.bookMain}>
              <BookOpen size={16} />
              {model.books.main}
            </p>
            {model.books.extras.length > 0 ? (
              <ul>
                {model.books.extras.map((book) => (
                  <li key={book}>{book}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <nav className={styles.pagerNav} aria-label="模型翻页">
          {prev ? (
            <Link href={`/models/${prev.id}`}>
              <ArrowLeft size={14} />
              {String(prev.id).padStart(2, "0")} {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/models/${next.id}`}>
              {String(next.id).padStart(2, "0")} {next.name}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}
