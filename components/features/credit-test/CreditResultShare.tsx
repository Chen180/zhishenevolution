"use client";

import { LoaderCircle, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { CapturedImages } from "@/components/ui/CapturedImages";
import {
  captureNode,
  saveImages,
  type CapturedImage,
} from "@/components/ui/image-capture";
import { CopyrightLine, WatermarkLayer } from "@/components/ui/Watermark";
import type { CreditAssessmentReport } from "@/lib/application/assess-credit";
import { CREDIT_DIMENSIONS } from "@/lib/domain/credit-questions";
import styles from "./CreditResultShare.module.css";

/**
 * 测评结果分享图：总览卡（六维得分 + 阶段）+ 解读卡（判断 + 行动）。
 * 截图/下载能力复用 components/ui/image-capture 与 CapturedImages。
 */
export function CreditResultShare({ report }: { report: CreditAssessmentReport }) {
  const overviewRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const { assessment, interpretation } = report;
  const prefix = "信用生命树测评报告";
  const focusColor = CREDIT_DIMENSIONS[assessment.focusDimension.id].color;

  async function handleGenerate() {
    if (generating) return;

    setGenerating(true);
    setImages([]);
    setNotice(null);

    try {
      const cards: [typeof overviewRef, string][] = [
        [overviewRef, "总览"],
        [insightRef, "解读与行动"],
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
    <div className={styles.top}>
      <span className={styles.brand}>
        智神进化纪 · 六维信用生命树测评
        <em>SIX-DIMENSIONAL CREDIT ASSESSMENT</em>
      </span>
      <span className={styles.tag}>自我观察工具</span>
    </div>
  );

  const cardFooter = (pageNo: number) => (
    <>
      <div className={styles.footer}>
        <span>zhishenevo.com · 第 {pageNo} 张 / 共 2 张</span>
        <span>制作人 · 智神进化纪 | 何明轩</span>
      </div>
      <CopyrightLine withDivider={false} />
    </>
  );

  return (
    <div className={styles.shareBox}>
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
          {generating ? "正在生成……" : "生成分享图（2 张）"}
        </button>
        {notice ? <span className={styles.notice}>{notice}</span> : null}
      </div>

      <CapturedImages images={images} onDownloadAll={handleDownloadAll} />

      {/* 离屏渲染的两张分享卡片，仅用于截图 */}
      <div className={styles.cardHost} aria-hidden>
        {/* 第 1 张：总览卡 */}
        <div ref={overviewRef} className={styles.card}>
          <WatermarkLayer />
          {cardHeader}

          <div className={styles.scoreRow}>
            <div className={styles.score}>
              <strong>{assessment.overallScore}</strong>
              <span>六维均衡值</span>
            </div>
            <div className={styles.stage}>
              <span className={styles.stageNo}>
                第 {String(assessment.stage.index).padStart(2, "0")} 阶段
              </span>
              <strong>{assessment.stage.name}</strong>
              <p>{assessment.stage.statement}</p>
            </div>
          </div>

          <div className={styles.bars}>
            {assessment.dimensions.map((dimension) => {
              const color = CREDIT_DIMENSIONS[dimension.id].color;
              return (
                <div key={dimension.id} className={styles.barRow}>
                  <span className={styles.barName}>{dimension.name}</span>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{
                        width: `${dimension.score}%`,
                        background: color,
                      }}
                    />
                  </span>
                  <span className={styles.barScore}>{dimension.score}</span>
                  <span className={styles.barLevel} style={{ color }}>
                    {dimension.level}
                  </span>
                </div>
              );
            })}
          </div>

          <p className={styles.focusLine} style={{ borderLeftColor: focusColor }}>
            {assessment.focusDimension.score >= 75 ? "持续巩固" : "优先加强"}
            <strong>{assessment.focusDimension.name}</strong>
          </p>

          {cardFooter(1)}
        </div>

        {/* 第 2 张：解读与行动卡 */}
        <div ref={insightRef} className={styles.card}>
          <WatermarkLayer />
          {cardHeader}

          <h3 className={styles.cardTitle}>
            解读与行动
            <span>本次共纳入 {assessment.answeredCount} 道计分题 · 结果依据为「{assessment.confidence}」</span>
          </h3>

          <div className={styles.section}>
            <div className={styles.sectionBar}>初步判断</div>
            <div className={styles.sectionBody}>
              <p>{interpretation.summary}</p>
              <p className={styles.focusText} style={{ borderLeftColor: focusColor }}>
                {interpretation.focus}
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionBar}>未来 30 天 · 三件具体的事</div>
            <div className={styles.sectionBody}>
              <ol>
                {interpretation.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </div>
          </div>

          <p className={styles.disclaimer}>
            这是一项自我观察工具，不属于社会征信，也不构成心理、医疗、法律或职业诊断。
          </p>

          {cardFooter(2)}
        </div>
      </div>
    </div>
  );
}
