"use client";

import { toPng } from "html-to-image";
import { Download, ImagePlus, LoaderCircle, Type } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  paginateBlocks,
  splitIntoParagraphs,
  type TextBlock,
} from "@/lib/domain/text-pagination";
import styles from "./TextToImage.module.css";

type Theme = "paper" | "ink";
type FontSize = "small" | "medium" | "large";
type Mode = "single" | "paged";

interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  name: string;
}

const CANVAS_WIDTH = 720;
const PIXEL_RATIO = 2;
/** 浏览器 canvas 高度上限约 16384 设备像素，pixelRatio 2 下保守取 7500 CSS px */
const MAX_SINGLE_HEIGHT = 7500;
/** 分页模式每页内容区高度（不含上下 padding） */
const PAGE_CONTENT_HEIGHT = 1180;
const DEFAULT_PREFIX = "长文转图";

const FONT_SIZE_MAP: Record<FontSize, number> = {
  small: 15,
  medium: 17,
  large: 20,
};

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "paper", label: "米纸" },
  { value: "ink", label: "墨绿" },
];

const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: "small", label: "小" },
  { value: "medium", label: "中" },
  { value: "large", label: "大" },
];

const MODE_OPTIONS: { value: Mode; label: string; hint: string }[] = [
  { value: "single", label: "单张长图", hint: "全部内容生成一张图" },
  { value: "paged", label: "分页多图", hint: "超长内容拆成多张，清晰度更高" },
];

function downloadImage(image: GeneratedImage) {
  const link = document.createElement("a");
  link.href = image.url;
  link.download = image.name;
  link.click();
}

export function TextToImage() {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState<Theme>("paper");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [mode, setMode] = useState<Mode>("paged");
  const [prefix, setPrefix] = useState(DEFAULT_PREFIX);
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [previewBoxWidth, setPreviewBoxWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const paragraphs = splitIntoParagraphs(text);
  const prefixName = prefix.trim() || DEFAULT_PREFIX;
  const canvasClassName = `${styles.canvas} ${
    theme === "paper" ? styles.canvasPaper : styles.canvasInk
  }`;
  const canvasStyle = {
    width: CANVAS_WIDTH,
    fontSize: FONT_SIZE_MAP[fontSize],
  };

  const fileName = (index: number) =>
    `${prefixName}-${String(index + 1).padStart(2, "0")}.png`;

  // 预览缩放适配：画布恒为 720px（保证截图清晰度），仅显示层按比例缩放
  useEffect(() => {
    const box = previewBoxRef.current;
    const canvas = previewRef.current;
    if (!box || !canvas) return;

    const update = () => {
      setPreviewBoxWidth(box.clientWidth);
      setCanvasHeight(canvas.offsetHeight);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(box);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const previewScale =
    previewBoxWidth > 0 ? Math.min(1, previewBoxWidth / CANVAS_WIDTH) : 1;

  async function snapshotNode(node: HTMLElement, name: string) {
    const width = node.offsetWidth * PIXEL_RATIO;
    const height = node.offsetHeight * PIXEL_RATIO;
    const url = await toPng(node, { pixelRatio: PIXEL_RATIO });
    return { url, width, height, name };
  }

  function measureParagraphs(): TextBlock[] {
    const host = measureRef.current;
    if (!host) return [];

    return Array.from(host.children).map((child, index) => ({
      text: paragraphs[index],
      height: (child as HTMLElement).offsetHeight,
    }));
  }

  function buildPageNode(blocks: TextBlock[]): HTMLDivElement {
    const node = document.createElement("div");
    node.className = canvasClassName;
    node.style.width = `${CANVAS_WIDTH}px`;
    node.style.fontSize = `${FONT_SIZE_MAP[fontSize]}px`;

    for (const block of blocks) {
      const blockEl = document.createElement("div");
      blockEl.className = styles.block;
      const paragraph = document.createElement("p");
      paragraph.textContent = block.text;
      blockEl.appendChild(paragraph);
      node.appendChild(blockEl);
    }

    return node;
  }

  async function generatePaged(): Promise<GeneratedImage[]> {
    const blocks = measureParagraphs();
    const pages = paginateBlocks(blocks, PAGE_CONTENT_HEIGHT);

    const host = document.createElement("div");
    host.className = styles.renderHost;
    document.body.appendChild(host);

    try {
      const result: GeneratedImage[] = [];
      for (const [index, page] of pages.entries()) {
        const node = buildPageNode(page);
        host.appendChild(node);
        result.push(await snapshotNode(node, fileName(index)));
        node.remove();
      }
      return result;
    } finally {
      host.remove();
    }
  }

  async function handleGenerate() {
    if (generating) return;
    if (paragraphs.length === 0) {
      setNotice("请先粘贴需要转换的文案。");
      return;
    }

    setGenerating(true);
    setImages([]);
    setNotice(null);

    try {
      if (mode === "single") {
        const preview = previewRef.current;
        if (!preview) return;

        if (preview.offsetHeight <= MAX_SINGLE_HEIGHT) {
          setImages([await snapshotNode(preview, fileName(0))]);
          return;
        }

        setNotice("内容超出单张图片的高度上限，已自动切换为分页多图。");
      }

      setImages(await generatePaged());
    } catch {
      setNotice("生成失败，请减少内容或更换浏览器后重试。");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownloadAll() {
    // 支持 File System Access API 的浏览器：选目录后写入同名子文件夹
    if (window.showDirectoryPicker) {
      try {
        const root = await window.showDirectoryPicker({ mode: "readwrite" });
        const folder = await root.getDirectoryHandle(prefixName, {
          create: true,
        });
        for (const image of images) {
          const blob = await (await fetch(image.url)).blob();
          const handle = await folder.getFileHandle(image.name, {
            create: true,
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
        }
        setNotice(
          `已将 ${images.length} 张图片保存到所选位置下的「${prefixName}」文件夹。`,
        );
        return;
      } catch (error) {
        // 用户主动取消选择目录时不做任何事
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    // 回退：逐张触发浏览器下载
    for (const image of images) {
      downloadImage(image);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    setNotice("当前浏览器不支持选择文件夹，图片已保存到默认下载目录。");
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>TEXT TO IMAGE</p>
        <h1>长文转图片</h1>
        <p className={styles.lead}>
          粘贴超长文案，一键生成高清 PNG 图片。全部在浏览器本地完成，
          内容不会上传到服务器。
        </p>
      </section>

      <section className={styles.layout}>
        <div className={styles.editor}>
          <label className={styles.fieldLabel} htmlFor="source-text">
            文案内容
          </label>
          <textarea
            id="source-text"
            className={styles.textarea}
            placeholder="粘贴或输入文案，按回车分段……"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <p className={styles.charCount}>
            {text.length} 字 · {paragraphs.length} 段
          </p>

          <div className={styles.controlGroup}>
            <p className={styles.fieldLabel}>主题</p>
            <div className={styles.optionRow}>
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.optionButton} ${
                    theme === option.value ? styles.optionActive : ""
                  }`}
                  onClick={() => setTheme(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <p className={styles.fieldLabel}>字号</p>
            <div className={styles.optionRow}>
              {FONT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.optionButton} ${
                    fontSize === option.value ? styles.optionActive : ""
                  }`}
                  onClick={() => setFontSize(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <p className={styles.fieldLabel}>生成方式</p>
            <div className={styles.optionRow}>
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  title={option.hint}
                  className={`${styles.optionButton} ${
                    mode === option.value ? styles.optionActive : ""
                  }`}
                  onClick={() => setMode(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.fieldLabel} htmlFor="file-prefix">
              文件名前缀
            </label>
            <input
              id="file-prefix"
              className={styles.textInput}
              value={prefix}
              maxLength={40}
              onChange={(event) => setPrefix(event.target.value)}
            />
            <p className={styles.fieldHint}>
              图片命名为「{prefixName}-01.png」起，全部下载时存入同名文件夹
            </p>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <LoaderCircle size={17} className={styles.spinner} />
            ) : (
              <ImagePlus size={17} />
            )}
            {generating ? "正在生成……" : "生成图片"}
          </button>

          {notice ? <p className={styles.notice}>{notice}</p> : null}
        </div>

        <div className={styles.previewPanel}>
          <p className={styles.fieldLabel}>排版预览（{CANVAS_WIDTH}px 宽）</p>
          <div className={styles.previewScroll}>
            <div ref={previewBoxRef} className={styles.previewBox}>
              <div
                className={styles.previewFrame}
                style={{
                  width: CANVAS_WIDTH * previewScale,
                  height:
                    canvasHeight > 0 ? canvasHeight * previewScale : undefined,
                }}
              >
                <div
                  className={styles.previewZoom}
                  style={{ transform: `scale(${previewScale})` }}
                >
                  <div
                    ref={previewRef}
                    className={canvasClassName}
                    style={canvasStyle}
                  >
                    {paragraphs.length > 0 ? (
                      paragraphs.map((paragraph, index) => (
                        <div key={index} className={styles.block}>
                          <p>{paragraph}</p>
                        </div>
                      ))
                    ) : (
                      <p className={styles.placeholder}>
                        <Type size={18} />
                        预览区域：输入文案后这里会显示排版效果
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {images.length > 0 ? (
        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2>生成结果（{images.length} 张）</h2>
            {images.length > 1 ? (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleDownloadAll}
              >
                <Download size={15} />
                全部下载
              </button>
            ) : null}
          </div>
          <div className={styles.resultGrid}>
            {images.map((image) => (
              <figure key={image.name} className={styles.resultCard}>
                <Image
                  src={image.url}
                  alt={image.name}
                  width={image.width}
                  height={image.height}
                  unoptimized
                  className={styles.resultImage}
                />
                <figcaption className={styles.resultMeta}>
                  <span>{image.name}</span>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => downloadImage(image)}
                  >
                    <Download size={14} />
                    下载
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* 离屏测量容器：与预览完全相同的排版参数，用于分页高度测量 */}
      <div className={styles.measureHost} aria-hidden>
        <div ref={measureRef} className={canvasClassName} style={canvasStyle}>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className={styles.block}>
              <p>{paragraph}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
