"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { downloadImage, type CapturedImage } from "./image-capture";
import styles from "./CapturedImages.module.css";

/**
 * 截图结果的统一展示：缩略图网格 + 逐张下载 + 全部下载。
 * 各功能页生成图片后复用本组件，保证交互与视觉一致。
 */
export function CapturedImages({
  images,
  onDownloadAll,
  downloadAllLabel = "全部下载（存入文件夹）",
}: {
  images: CapturedImage[];
  onDownloadAll?: () => void;
  downloadAllLabel?: string;
}) {
  if (images.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {images.map((image) => (
          <figure key={image.name} className={styles.card}>
            <Image
              src={image.url}
              alt={image.name}
              width={image.width}
              height={image.height}
              unoptimized
              className={styles.image}
            />
            <figcaption className={styles.meta}>
              <span>{image.name}</span>
              <button
                type="button"
                className={styles.download}
                onClick={() => downloadImage(image)}
              >
                <Download size={13} />
                下载
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
      {images.length > 1 && onDownloadAll ? (
        <button
          type="button"
          className={styles.downloadAll}
          onClick={onDownloadAll}
        >
          <Download size={15} />
          {downloadAllLabel}
        </button>
      ) : null}
    </div>
  );
}
