import Link from "next/link";
import {
  THINKING_MODEL_LAYERS,
  getModelsByLayer,
} from "@/lib/domain/thinking-models";
import styles from "./ThinkingModels.module.css";

export function ModelsIndex() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>THINKING MODELS</p>
        <h1>世界顶尖 100 个思维模型</h1>
        <p className={styles.lead}>
          融合心理学、社会学、哲学、经济学、物理学等多学科智慧，
          帮助你看清世界本质，提升决策质量，实现认知跃迁。
        </p>
        <nav className={styles.layerNav} aria-label="层级导航">
          {THINKING_MODEL_LAYERS.map((layer) => (
            <a key={layer.id} href={`#${layer.id}`}>
              {layer.name}
              <span>
                {String(layer.from).padStart(2, "0")}–
                {String(layer.to).padStart(2, "0")}
              </span>
            </a>
          ))}
        </nav>
      </section>

      {THINKING_MODEL_LAYERS.map((layer) => (
        <section key={layer.id} id={layer.id} className={styles.layer}>
          <div className={styles.layerHeader}>
            <h2>{layer.name}</h2>
            <p>
              {layer.theme} · 共 {layer.to - layer.from + 1} 个模型
            </p>
          </div>
          <div className={styles.cardGrid}>
            {getModelsByLayer(layer.id).map((model) => (
              <Link
                key={model.id}
                href={`/models/${model.id}`}
                className={styles.card}
              >
                <span className={styles.cardNumber}>
                  {String(model.id).padStart(2, "0")}
                </span>
                <span className={styles.cardName}>{model.name}</span>
                {model.nameEn ? (
                  <span className={styles.cardNameEn}>{model.nameEn}</span>
                ) : null}
                <span className={styles.cardDef}>{model.definition}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
