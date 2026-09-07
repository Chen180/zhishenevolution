import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { ThinkingModel } from "@/lib/domain/thinking-models";
import { getLayerVisual } from "./layer-meta";
import styles from "./ThinkingModels.module.css";

/** 取列表项的短标题（「标题：内容」取冒号前部分） */
function shortTitle(item: string): string {
  const [title] = item.split(/[：:]/);
  return title.trim();
}

/**
 * 程序化图解：场景 → 模型 → 方法 的三段流程图。
 * 纯 HTML/CSS（非 SVG），中文排版与响应式更稳，也可被 html-to-image 截图。
 */
export function ModelDiagram({ model }: { model: ThinkingModel }) {
  const { color } = getLayerVisual(model.layer);
  const scenario = shortTitle(model.scenarios[0]);
  const methods = model.methods.slice(0, 3).map(shortTitle);

  return (
    <div
      className={styles.diagram}
      style={{ "--layer-color": color } as CSSProperties}
    >
      <div className={styles.diagramNode}>
        <span className={styles.diagramLabel}>场景</span>
        <span className={styles.diagramText}>{scenario}</span>
      </div>
      <ArrowRight className={styles.diagramArrow} aria-hidden />
      <div className={styles.diagramCore}>
        <span className={styles.diagramCoreText}>{model.name}</span>
      </div>
      <ArrowRight className={styles.diagramArrow} aria-hidden />
      <div className={styles.diagramNode}>
        <span className={styles.diagramLabel}>方法</span>
        {methods.map((method) => (
          <span key={method} className={styles.diagramText}>
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}
