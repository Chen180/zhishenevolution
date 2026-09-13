"use client";

import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { CapturedImages } from "@/components/ui/CapturedImages";
import {
  captureNode,
  saveImages,
  type CapturedImage,
} from "@/components/ui/image-capture";
import { WATERMARK_TEXT, WatermarkLayer } from "@/components/ui/Watermark";
import styles from "./TextToImage.module.css";

type Tone = "light" | "dark";

interface SourceImage {
  id: string;
  url: string;
  fileName: string;
  width: number;
  height: number;
}

/** 输出宽度上限：超过则等比缩小，避免触发浏览器 canvas 尺寸上限 */
const MAX_OUTPUT_WIDTH = 2400;
const MAX_OUTPUT_HEIGHT = 15000;
/** 水印字号参照：720px 宽画布对应 20px（见 globals.css .wm-layer），按输出宽度等比缩放 */
const WM_REF_WIDTH = 720;
const WM_REF_SIZE = 20;
const OUTPUT_SUFFIX = "-水印";
const FOLDER_NAME = "图片加水印";

const TONE_OPTIONS: { value: Tone; label: string; hint: string }[] = [
  { value: "light", label: "浅色底图", hint: "底图偏亮，叠加深色水印" },
  { value: "dark", label: "深色底图", hint: "底图偏暗，叠加浅色水印" },
];

function readImageSize(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("image load failed"));
    img.src = url;
  });
}

function outputName(fileName: string, taken: Set<string>): string {
  const base = fileName.replace(/\.[^.]+$/, "").trim() || "图片";
  let name = `${base}${OUTPUT_SUFFIX}.png`;
  let index = 2;
  while (taken.has(name)) {
    name = `${base}${OUTPUT_SUFFIX}-${index}.png`;
    index += 1;
  }
  taken.add(name);
  return name;
}

export function ImageWatermark() {
  const [sources, setSources] = useState<SourceImage[]>([]);
  const [tone, setTone] = useState<Tone>("light");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  // 卸载时释放所有 objectURL
  useEffect(() => {
    const urls = urlsRef.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setNotice(null);
    setImages([]);

    const next: SourceImage[] = [];
    let skipped = 0;
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) {
        skipped += 1;
        continue;
      }
      const url = URL.createObjectURL(file);
      try {
        const { width, height } = await readImageSize(url);
        urlsRef.current.push(url);
        next.push({
          id: `${Date.now()}-${next.length}-${file.name}`,
          url,
          fileName: file.name,
          width,
          height,
        });
      } catch {
        URL.revokeObjectURL(url);
        skipped += 1;
      }
    }

    if (next.length > 0) setSources((prev) => [...prev, ...next]);
    if (skipped > 0) setNotice(`有 ${skipped} 个文件不是可识别的图片，已跳过。`);
  }

  function handleRemove(id: string) {
    setSources((prev) => {
      const target = prev.find((source) => source.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((source) => source.id !== id);
    });
    setImages([]);
  }

  function handleClear() {
    for (const source of sources) URL.revokeObjectURL(source.url);
    setSources([]);
    setImages([]);
    setNotice(null);
  }

  function buildOutputNode(source: SourceImage): HTMLDivElement {
    const widthScale = Math.min(1, MAX_OUTPUT_WIDTH / source.width);
    let outWidth = Math.max(1, Math.round(source.width * widthScale));
    let outHeight = Math.max(1, Math.round(source.height * widthScale));
    if (outHeight > MAX_OUTPUT_HEIGHT) {
      const heightScale = MAX_OUTPUT_HEIGHT / outHeight;
      outWidth = Math.max(1, Math.round(outWidth * heightScale));
      outHeight = MAX_OUTPUT_HEIGHT;
    }

    const node = document.createElement("div");
    node.style.position = "relative";
    node.style.overflow = "hidden";
    node.style.width = `${outWidth}px`;
    node.style.lineHeight = "0";

    const img = document.createElement("img");
    img.src = source.url;
    img.alt = source.fileName;
    img.style.display = "block";
    img.style.width = "100%";
    node.appendChild(img);

    // 与可见预览一致的平铺水印，字号随输出宽度等比缩放
    const fontSize = Math.max(
      14,
      Math.round((outWidth / WM_REF_WIDTH) * WM_REF_SIZE),
    );
    const watermark = document.createElement("div");
    watermark.className = `wm-layer${tone === "dark" ? " wm-layer--dark" : ""}`;
    for (let index = 0; index < 15; index += 1) {
      const span = document.createElement("span");
      span.textContent = WATERMARK_TEXT;
      span.style.fontSize = `${fontSize}px`;
      watermark.appendChild(span);
    }
    node.appendChild(watermark);

    return node;
  }

  async function handleGenerate() {
    if (generating) return;
    if (sources.length === 0) {
      setNotice("请先选择需要加水印的图片。");
      return;
    }

    setGenerating(true);
    setImages([]);
    setNotice(null);

    const host = document.createElement("div");
    host.className = styles.renderHost;
    document.body.appendChild(host);

    try {
      const taken = new Set<string>();
      const result: CapturedImage[] = [];
      for (const source of sources) {
        const node = buildOutputNode(source);
        host.appendChild(node);
        result.push(await captureNode(node, outputName(source.fileName, taken), 1));
        node.remove();
      }
      setImages(result);
    } catch {
      setNotice("生成失败，请减少图片数量或更换浏览器后重试。");
    } finally {
      host.remove();
      setGenerating(false);
    }
  }

  async function handleDownloadAll() {
    const outcome = await saveImages(FOLDER_NAME, images);
    if (outcome === "folder") {
      setNotice(`已将 ${images.length} 张图片保存到「${FOLDER_NAME}」文件夹。`);
    } else if (outcome === "downloads") {
      setNotice("当前浏览器不支持选择文件夹，图片已保存到默认下载目录。");
    }
  }

  return (
    <>
      <section className={styles.header}>
        <p className={styles.eyebrow}>IMAGE TO IMAGE</p>
        <h1>图片加水印</h1>
        <p className={styles.lead}>
          选择本地图片，叠加「{WATERMARK_TEXT}」统一水印后导出高清 PNG。
          全部在浏览器本地完成，图片不会上传到服务器。
        </p>
      </section>

      <section className={styles.layout}>
        <div className={styles.editor}>
          <div className={styles.controlGroup}>
            <p className={styles.fieldLabel}>图片文件</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => {
                void handleFiles(event.target.files);
                event.target.value = "";
              }}
            />
            <div className={styles.uploadRow}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={15} />
                选择图片
              </button>
              {sources.length > 0 ? (
                <>
                  <p className={styles.uploadCount}>已选 {sources.length} 张</p>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleClear}
                  >
                    清空
                  </button>
                </>
              ) : null}
            </div>
            <p className={styles.fieldHint}>
              支持多选，导出尺寸与原图一致（超大图等比缩小到 {MAX_OUTPUT_WIDTH}
              px 宽以内）
            </p>
          </div>

          <div className={styles.controlGroup}>
            <p className={styles.fieldLabel}>水印颜色</p>
            <div className={styles.optionRow}>
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  title={option.hint}
                  className={`${styles.optionButton} ${
                    tone === option.value ? styles.optionActive : ""
                  }`}
                  onClick={() => setTone(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
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
            {generating ? "正在生成……" : "生成带水印图片"}
          </button>

          {notice ? <p className={styles.notice}>{notice}</p> : null}
        </div>

        <div className={styles.previewPanel}>
          <p className={styles.fieldLabel}>水印预览</p>
          <div className={styles.previewScroll}>
            <div className={styles.previewBox}>
              {sources.length > 0 ? (
                <div className={styles.previewGrid}>
                  {sources.map((source) => (
                    <figure key={source.id} className={styles.previewItem}>
                      <div className={styles.previewImageWrap}>
                        <NextImage
                          src={source.url}
                          alt={source.fileName}
                          width={source.width}
                          height={source.height}
                          unoptimized
                          className={styles.previewImage}
                        />
                        <WatermarkLayer tone={tone} />
                        <button
                          type="button"
                          className={styles.removeButton}
                          aria-label={`移除 ${source.fileName}`}
                          onClick={() => handleRemove(source.id)}
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <figcaption className={styles.previewName}>
                        {source.fileName}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <p className={styles.placeholder}>
                  <ImagePlus size={18} />
                  预览区域：选择图片后这里会显示水印效果
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {images.length > 0 ? (
        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2>生成结果（{images.length} 张）</h2>
          </div>
          <CapturedImages images={images} onDownloadAll={handleDownloadAll} />
        </section>
      ) : null}
    </>
  );
}
