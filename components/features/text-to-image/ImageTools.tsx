"use client";

import { useState } from "react";
import { ImageWatermark } from "./ImageWatermark";
import { TextToImage } from "./TextToImage";
import styles from "./TextToImage.module.css";

const TOOL_OPTIONS = [
  { value: "text", label: "长文转图", hint: "粘贴文案生成高清长图" },
  { value: "image", label: "图片加水印", hint: "为已有图片叠加统一水印" },
] as const;

type Tool = (typeof TOOL_OPTIONS)[number]["value"];

/** 转图工具集合：长文转图 + 图片加水印，切换时保留各自编辑状态 */
export function ImageTools() {
  const [tool, setTool] = useState<Tool>("text");

  return (
    <div className={styles.page}>
      <div className={styles.toolTabs} role="tablist" aria-label="转图工具切换">
        {TOOL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={tool === option.value}
            title={option.hint}
            className={`${styles.optionButton} ${
              tool === option.value ? styles.optionActive : ""
            }`}
            onClick={() => setTool(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div hidden={tool !== "text"}>
        <TextToImage />
      </div>
      <div hidden={tool !== "image"}>
        <ImageWatermark />
      </div>
    </div>
  );
}
