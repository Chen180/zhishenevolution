"use client";

import { toPng } from "html-to-image";
import { LoaderCircle, Share2 } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import {
  getLayerById,
  type ThinkingModel,
} from "@/lib/domain/thinking-models";
import { getLayerVisual } from "./layer-meta";
import styles from "./ThinkingModels.module.css";

function shortTitle(item: string): string {
  const [title] = item.split(/[：:]/);
  return title.trim();
}

/**
 * 把模型内容渲染成一张 720px 宽的分享卡片 PNG 并下载。
 * 卡片常时挂载在离屏宿主中，点击按钮时对节点截图。
 */
export function ShareCardButton({ model }: { model: ThinkingModel }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layer = getLayerById(model.layer);
  const { color } = getLayerVisual(model.layer);

  async function handleGenerate() {
    const node = cardRef.current;
    if (!node || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const url = await toPng(node, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.href = url;
      link.download = `思维模型-${String(model.id).padStart(2, "0")}-${model.name}.png`;
      link.click();
    } catch {
      setError("生成失败，请重试。");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <div className={styles.shareRow}>
        <button
          type="button"
          className={styles.shareButton}
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <LoaderCircle size={15} className={styles.spinner} />
          ) : (
            <Share2 size={15} />
          )}
          {generating ? "正在生成……" : "生成分享图"}
        </button>
        {error ? <span className={styles.shareError}>{error}</span> : null}
      </div>

      {/* 离屏渲染的分享卡片，仅用于截图 */}
      <div className={styles.shareCardHost} aria-hidden>
        <div
          ref={cardRef}
          className={styles.shareCard}
          style={{ "--layer-color": color } as CSSProperties}
        >
          <div className={styles.shareCardTop}>
            <span>智神进化纪 · 世界顶尖 100 个思维模型</span>
            <span>{String(model.id).padStart(2, "0")} / 100</span>
          </div>
          <h3 className={styles.shareCardName}>{model.name}</h3>
          {model.nameEn ? (
            <p className={styles.shareCardNameEn}>{model.nameEn}</p>
          ) : null}
          <div className={styles.shareCardDivider} />
          <p className={styles.shareCardDef}>{model.definition}</p>
          <div className={styles.shareCardMethods}>
            {model.methods.slice(0, 3).map((method, index) => (
              <p key={method}>
                <span>{index + 1}</span>
                {shortTitle(method)}
              </p>
            ))}
          </div>
          <div className={styles.shareCardFooter}>
            <span>
              {layer ? `${layer.name} · ${layer.theme}` : ""}
            </span>
            <span>六维信用生命树</span>
          </div>
        </div>
      </div>
    </>
  );
}
