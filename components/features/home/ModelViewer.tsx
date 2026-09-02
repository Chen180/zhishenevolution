"use client";

import { Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MODELS, type ModelId } from "./content";

/**
 * 双模型切换段落（id="models"）：金字塔 / 生命树 tab + 高清大图弹窗。
 */
export function ModelViewer() {
  const [activeId, setActiveId] = useState<ModelId>("pyramid");
  const [zoomed, setZoomed] = useState(false);
  const active = MODELS.find((model) => model.id === activeId) ?? MODELS[0];

  // Esc 关闭弹窗，打开时锁定 body 滚动
  useEffect(() => {
    if (!zoomed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomed]);

  return (
    <section id="models" className="py-[76px] sm:py-[90px] lg:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Two Models"
          title="一套体系，两个观察视角"
          description="金字塔回答“一个人如何成长”，生命树回答“六种信用如何共同生长、循环与传承”。它们不是两套理论，而是同一系统的纵向路径与生命运行。"
          className="mb-9"
        />

        <Reveal className="mb-[22px] flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div
            role="tablist"
            aria-label="切换六维信用模型"
            className="grid min-h-11 w-full grid-cols-2 gap-1 rounded border border-line-light bg-paper-strong p-1 sm:inline-flex sm:w-auto"
          >
            {MODELS.map((model) => (
              <button
                key={model.id}
                id={`model-tab-${model.id}`}
                type="button"
                role="tab"
                aria-selected={model.id === activeId}
                aria-controls="model-viewer"
                onClick={() => setActiveId(model.id)}
                className={`min-w-0 rounded-[2px] px-4 text-[13px] font-bold transition-colors duration-160 sm:min-w-[142px] ${
                  model.id === activeId
                    ? "bg-ink text-text-light"
                    : "bg-transparent text-muted-dark"
                }`}
              >
                {model.tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-dark">点击图片可查看高清原图</span>
        </Reveal>

        <Reveal>
          <div
            id="model-viewer"
            role="tabpanel"
            aria-labelledby={`model-tab-${activeId}`}
            className="grid min-h-[560px] overflow-hidden rounded-brand border border-line-light bg-ink text-text-light lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.65fr)]"
          >
            <button
              type="button"
              aria-label={`查看${active.alt}高清原图`}
              onClick={() => setZoomed(true)}
              className="relative min-w-0 cursor-zoom-in border-0 border-b border-line-dark bg-[#050706] p-0 lg:border-b-0 lg:border-r"
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="h-full min-h-[340px] w-full object-contain sm:min-h-[560px]"
              />
              <span className="absolute bottom-4 right-4 inline-flex min-h-9 items-center gap-[7px] rounded-[3px] border border-line-dark bg-ink/82 px-3 text-xs text-text-light backdrop-blur-[8px]">
                <Maximize2 size={14} strokeWidth={1.7} aria-hidden />
                查看原图
              </span>
            </button>
            <div className="block p-[30px_24px] sm:px-[34px] sm:py-11 lg:flex lg:flex-col lg:justify-center">
              <span className="text-xs font-bold text-gold-light">
                {active.label}
              </span>
              <h3 className="m-0 mt-4 font-display text-[26px] leading-[1.35] lg:text-[30px]">
                {active.title}
              </h3>
              <p className="m-0 mt-5 text-sm leading-[1.85] text-muted-light">
                {active.description}
              </p>
              <div className="mt-[26px] grid border-t border-line-dark lg:mt-7">
                {(
                  [
                    ["回答", active.answer],
                    ["结构", active.structure],
                    ["重点", active.focus],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[66px_1fr] gap-2 border-b border-line-dark py-[15px] text-[13px]"
                  >
                    <span className="text-gold-light">{label}</span>
                    <span className="text-muted-light">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {zoomed ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[rgba(5,7,6,0.84)] backdrop-blur-[8px]"
            onClick={() => setZoomed(false)}
          />
          <div className="relative flex max-h-[calc(100svh-32px)] w-[min(1400px,calc(100%-32px))] flex-col overflow-auto rounded-brand border border-white/16 bg-[#050706] text-text-light shadow-[0_30px_90px_rgba(0,0,0,0.52)]">
            <div className="sticky top-0 z-2 flex min-h-[60px] items-center justify-between gap-4 border-b border-line-dark bg-ink-soft/96 py-0 pl-6 pr-[18px] backdrop-blur-[10px]">
              <span
                id="media-dialog-title"
                className="text-[11px] font-bold text-gold-light"
              >
                {active.alt}
              </span>
              <button
                type="button"
                aria-label="关闭高清图片"
                onClick={() => setZoomed(false)}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[3px] border border-line-dark bg-transparent text-text-light"
              >
                <X size={17} strokeWidth={1.7} aria-hidden />
              </button>
            </div>
            <div className="p-3">
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="100vw"
                className="h-auto max-h-[calc(100svh-116px)] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
