import type { CSSProperties } from "react";
import {
  THINKING_MODEL_LAYERS,
  listModelSummaries,
} from "@/lib/domain/thinking-models";
import { getLayerVisual } from "./layer-meta";
import { ModelsExplorer } from "./ModelsExplorer";
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
          {THINKING_MODEL_LAYERS.map((layer) => {
            const { color, Icon } = getLayerVisual(layer.id);
            return (
              <a
                key={layer.id}
                href={`#${layer.id}`}
                style={{ "--layer-color": color } as CSSProperties}
              >
                <Icon size={14} aria-hidden />
                {layer.name}
                <span>
                  {String(layer.from).padStart(2, "0")}–
                  {String(layer.to).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </nav>
      </section>

      <ModelsExplorer
        summaries={listModelSummaries()}
        layers={THINKING_MODEL_LAYERS}
      />
    </div>
  );
}
