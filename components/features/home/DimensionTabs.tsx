"use client";

import { useState, type CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DIMENSIONS, type DimensionId } from "./content";

type TabStyle = CSSProperties & {
  "--tab-color"?: string;
  "--active-color"?: string;
  "--step-color"?: string;
};

/**
 * 六维信用维度切换段落（id="system"）：深墨底 tab + 详情面板 + 成长路径。
 */
export function DimensionTabs() {
  const [activeId, setActiveId] = useState<DimensionId>("identity");
  const active =
    DIMENSIONS.find((dimension) => dimension.id === activeId) ?? DIMENSIONS[0];

  return (
    <section
      id="system"
      className="bg-ink py-[76px] text-text-light sm:py-[90px] lg:py-28"
    >
      <div className="container-site">
        <SectionHeading
          light
          eyebrow="Six Dimensions"
          title="从被看见，到被铭记"
          description="六个维度不是六张静止的标签，而是一套持续循环的生命系统。选择一个维度，查看它在成长路径与生命树中的位置。"
          className="mb-9"
        />

        <Reveal>
          <div
            role="tablist"
            aria-label="六维信用维度"
            className="mb-[26px] grid grid-cols-2 border-l border-t border-line-dark sm:grid-cols-3 lg:grid-cols-6"
          >
            {DIMENSIONS.map((dimension) => {
              const selected = dimension.id === activeId;
              return (
                <button
                  key={dimension.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="dimension-panel"
                  onClick={() => setActiveId(dimension.id)}
                  style={{ "--tab-color": dimension.color } as TabStyle}
                  className={`relative min-h-[86px] border-0 border-b border-r border-line-dark px-[14px] py-[18px] text-left transition-colors duration-160 lg:min-h-[104px] ${
                    selected
                      ? "bg-white/4 text-text-light"
                      : "bg-transparent text-muted-light hover:bg-white/4 hover:text-text-light"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-px h-[3px] origin-left bg-(--tab-color) transition-transform duration-160 ${
                      selected ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  <span className="block font-figure text-xs text-(--tab-color)">
                    {dimension.number.slice(0, 2)}
                  </span>
                  <span className="mt-[13px] block text-[15px] font-bold">
                    {dimension.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div
            id="dimension-panel"
            role="tabpanel"
            aria-live="polite"
            style={{ "--active-color": active.color } as TabStyle}
            className="grid min-h-[410px] overflow-hidden rounded-brand border border-line-dark bg-ink-soft lg:grid-cols-[0.72fr_1.28fr]"
          >
            <div className="relative flex min-h-[240px] flex-col justify-between overflow-hidden border-b border-line-dark p-[28px_24px] sm:p-10 lg:min-h-[410px] lg:border-b-0 lg:border-r">
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-[54px] -right-5 font-figure text-[200px] leading-none text-white/[0.035] lg:text-[260px]"
              >
                {active.rawNumber}
              </span>
              <div>
                <span className="font-figure text-[17px] text-(--active-color)">
                  {active.number}
                </span>
                <h3 className="relative z-1 m-0 mt-7 font-display text-[34px] leading-[1.2] lg:text-[42px]">
                  {active.name}
                </h3>
                <p className="relative z-1 m-0 mt-2 font-figure text-sm text-muted-light">
                  {active.en}
                </p>
              </div>
              <div className="relative z-1 mt-8 border-t border-line-dark pt-5">
                <span className="text-[11px] text-muted-light">生命树隐喻</span>
                <strong className="mt-[6px] block font-display text-[22px] text-(--active-color)">
                  {active.metaphor}
                </strong>
              </div>
            </div>
            <div className="p-[30px_24px] sm:p-[42px_44px] md:grid md:grid-cols-2 md:content-center md:gap-x-11">
              <div className="mb-[30px] md:col-span-2">
                <span className="text-xs font-bold text-(--active-color)">
                  {active.action}
                </span>
                <h3 className="m-0 mt-[10px] font-display text-[25px] leading-[1.4] lg:text-[30px]">
                  {active.question}
                </h3>
              </div>
              <div>
                <h4 className="m-0 mb-[10px] text-xs font-bold text-text-light">
                  它是什么
                </h4>
                <p className="m-0 text-sm leading-[1.85] text-muted-light">
                  {active.definition}
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <h4 className="m-0 mb-[10px] text-xs font-bold text-text-light">
                  如何留下证据
                </h4>
                <p className="m-0 text-sm leading-[1.85] text-muted-light">
                  {active.proof}
                </p>
              </div>
              <blockquote className="m-0 mt-[26px] border-t border-line-dark pt-[26px] font-display text-[17px] leading-[1.75] text-text-light md:col-span-2 lg:mt-[30px]">
                {active.quote}
              </blockquote>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div
            aria-label="六维信用成长路径"
            className="mt-11 grid grid-cols-2 gap-y-[30px] sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0"
          >
            {DIMENSIONS.map((dimension, index) => (
              <div
                key={dimension.id}
                style={{ "--step-color": dimension.color } as TabStyle}
                className="relative min-w-0 border-t border-line-dark pr-[14px] pt-[22px]"
              >
                <span
                  aria-hidden
                  className="absolute -top-1 left-0 h-[7px] w-[7px] rounded-full bg-(--step-color)"
                />
                {index < DIMENSIONS.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute -top-1 right-3 text-[13px] text-white/38"
                  >
                    →
                  </span>
                ) : null}
                <strong className="block text-[13px] text-text-light">
                  {dimension.stage}
                </strong>
                <span className="mt-[5px] block text-[11px] text-muted-light">
                  {dimension.shortName}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
