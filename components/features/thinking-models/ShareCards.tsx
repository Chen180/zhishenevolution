"use client";

import { LoaderCircle, Share2 } from "lucide-react";
import { useRef, useState, type CSSProperties, type RefObject } from "react";
import { CapturedImages } from "@/components/ui/CapturedImages";
import {
  captureNode,
  saveImages,
  type CapturedImage,
} from "@/components/ui/image-capture";
import {
  CopyrightLine,
  WatermarkLayer,
} from "@/components/ui/Watermark";
import {
  getLayerById,
  type ThinkingModel,
} from "@/lib/domain/thinking-models";
import { getLayerVisual } from "./layer-meta";
import styles from "./ThinkingModels.module.css";

/** 取列表项的短标题（「标题：内容」取冒号前部分） */
function shortTitle(item: string): string {
  const [title] = item.split(/[：:]/);
  return title.trim();
}

/** 取列表项冒号后的说明文字，超长截断 */
function briefOf(item: string, maxLength: number): string {
  const parts = item.split(/[：:]/);
  const brief = (parts.length < 2 ? parts[0] : parts.slice(1).join("：")).trim();
  return brief.length > maxLength ? `${brief.slice(0, maxLength)}…` : brief;
}

function excerpt(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

const LAYER_BLOCK_COLORS = ["#6e98aa", "#3f6249", "#b9684d"] as const;

/**
 * 每个模型生成 3 张分享图：总览卡 / 读懂它（原理·背景·故事）/ 用好它
 * （场景·方法·误区）。卡片常时挂载在离屏宿主中，点击按钮逐张截图。
 */
export function ShareCards({ model }: { model: ThinkingModel }) {
  const overviewRef = useRef<HTMLDivElement>(null);
  const understandRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const layer = getLayerById(model.layer);
  const { color } = getLayerVisual(model.layer);
  const cardStyle = { "--layer-color": color } as CSSProperties;

  const modelNo = String(model.id).padStart(2, "0");
  const prefix = `思维模型-${modelNo}-${model.name}`;
  const layerInfo = layer ? `${layer.name} · ${layer.theme}` : "";
  const footerLeft = `${layerInfo} · ${modelNo} / 100`;

  const methods = model.methods.slice(0, 3);
  const overviewBlocks = [
    {
      label: "核心定义",
      sub: "一句话看懂",
      text: excerpt(model.definition, 52),
      background: color,
    },
    {
      label: "典型场景",
      sub: "在哪里用",
      text: briefOf(model.scenarios[0], 52),
      background: LAYER_BLOCK_COLORS[0],
    },
    {
      label: "关键动作",
      sub: "第一步做什么",
      text: briefOf(model.methods[0], 52),
      background: LAYER_BLOCK_COLORS[1],
    },
    {
      label: "常见误区",
      sub: "避开什么坑",
      text: briefOf(model.pitfalls[0], 52),
      background: LAYER_BLOCK_COLORS[2],
    },
  ];

  async function handleGenerate() {
    if (generating) return;

    setGenerating(true);
    setImages([]);
    setNotice(null);

    try {
      const cards: [RefObject<HTMLDivElement | null>, string][] = [
        [overviewRef, "总览"],
        [understandRef, "读懂它"],
        [applyRef, "用好它"],
      ];

      const result: CapturedImage[] = [];
      for (const [index, [ref, label]] of cards.entries()) {
        const node = ref.current;
        if (!node) continue;
        result.push(
          await captureNode(node, `${prefix}-${index + 1}-${label}.png`),
        );
      }
      setImages(result);
    } catch {
      setNotice("生成失败，请重试。");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownloadAll() {
    const outcome = await saveImages(prefix, images);
    if (outcome === "folder") {
      setNotice(`已将 ${images.length} 张图保存到「${prefix}」文件夹。`);
    } else if (outcome === "downloads") {
      setNotice("当前浏览器不支持选择文件夹，图片已保存到默认下载目录。");
    }
  }

  const cardHeader = (
    <div className={styles.shareCardTop}>
      <span className={styles.shareCardBrand}>
        智神进化纪 · 世界顶尖 100 个思维模型
        <em>THINKING MODELS · COGNITIVE UPGRADE</em>
      </span>
      <span className={styles.shareCardTag}>{layer?.name}</span>
    </div>
  );

  const cardFooter = (pageNo: number) => (
    <>
      <div className={styles.shareCardFooter}>
        <span>
          {footerLeft} · 第 {pageNo} 张 / 共 3 张
        </span>
        <span>制作人 · 智神进化纪 | 何明轩</span>
      </div>
      <CopyrightLine withDivider={false} />
    </>
  );

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
          {generating ? "正在生成……" : "生成分享图（3 张）"}
        </button>
        {notice ? <span className={styles.shareNotice}>{notice}</span> : null}
      </div>

      {images.length > 0 ? (
        <CapturedImages images={images} onDownloadAll={handleDownloadAll} />
      ) : null}

      {/* 离屏渲染的三张分享卡片，仅用于截图 */}
      <div className={styles.shareCardHost} aria-hidden>
        {/* 第 1 张：总览卡 */}
        <div ref={overviewRef} className={styles.shareCard} style={cardStyle}>
          {cardHeader}
          <WatermarkLayer />
          <h3 className={styles.shareCardName}>
            {model.name}
            <span>{model.nameEn}</span>
          </h3>

          <div className={styles.shareBlocks}>
            {overviewBlocks.map((block) => (
              <div
                key={block.label}
                className={styles.shareBlock}
                style={{ background: block.background }}
              >
                <p className={styles.shareBlockLabel}>{block.label}</p>
                <p className={styles.shareBlockSub}>{block.sub}</p>
                <p className={styles.shareBlockText}>{block.text}</p>
              </div>
            ))}
          </div>

          <p className={styles.sharePrinciple}>
            <strong>核心原理</strong>
            {excerpt(model.principle, 120)}
          </p>

          <div className={styles.shareSection}>
            <div className={styles.shareSectionBar}>
              {model.name}的落地方法
              <span>HOW TO APPLY</span>
            </div>
            {methods.map((method, index) => (
              <div key={method} className={styles.shareMethodRow}>
                <span className={styles.shareMethodNo}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{shortTitle(method)}</strong>
                  <p>{briefOf(method, 64)}</p>
                </div>
              </div>
            ))}
          </div>

          {cardFooter(1)}
        </div>

        {/* 第 2 张：读懂它（原理 · 背景 · 故事全文） */}
        <div ref={understandRef} className={styles.shareCard} style={cardStyle}>
          {cardHeader}
          <WatermarkLayer />
          <h3 className={styles.shareCardNameCompact}>
            {model.name}
            <span>
              {model.nameEn} · 读懂它 UNDERSTAND
            </span>
          </h3>

          <div className={styles.shareSection}>
            <div className={styles.shareSectionBar}>
              核心原理
              <span>PRINCIPLE</span>
            </div>
            <div className={styles.shareSectionBody}>
              <p>{model.principle}</p>
            </div>
          </div>

          <div className={styles.shareSection}>
            <div className={styles.shareSectionBar}>
              跨学科背景
              <span>INTERDISCIPLINARY</span>
            </div>
            <div className={styles.shareSectionBody}>
              <p>{model.background}</p>
            </div>
          </div>

          <div className={styles.shareSection}>
            <div className={styles.shareSectionBar}>
              故事 / 案例
              <span>STORY</span>
            </div>
            <div className={styles.shareSectionBody}>
              <p className={styles.shareStory}>{model.story}</p>
            </div>
          </div>

          {cardFooter(2)}
        </div>

        {/* 第 3 张：用好它（场景 · 方法 · 误区全文） */}
        <div ref={applyRef} className={styles.shareCard} style={cardStyle}>
          {cardHeader}
          <WatermarkLayer />
          <h3 className={styles.shareCardNameCompact}>
            {model.name}
            <span>
              {model.nameEn} · 用好它 APPLY
            </span>
          </h3>

          <div className={styles.shareSection}>
            <div className={styles.shareSectionBar}>
              应用场景
              <span>WHERE TO USE</span>
            </div>
            <div className={styles.shareSectionBody}>
              <ul>
                {model.scenarios.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.shareSection}>
            <div className={styles.shareSectionBar}>
              落地方法
              <span>HOW TO APPLY</span>
            </div>
            <div className={styles.shareSectionBody}>
              <ol>
                {model.methods.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className={styles.shareSection}>
            <div className={styles.shareSectionBar}>
              常见误区
              <span>COMMON PITFALLS</span>
            </div>
            <div className={styles.shareSectionBody}>
              <ul>
                {model.pitfalls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {cardFooter(3)}
        </div>
      </div>
    </>
  );
}
