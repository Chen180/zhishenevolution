"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CASES, type CaseStudy } from "./content";

/**
 * 人物案例段落（id="cases"）：六张人物卡 + 案例详情弹窗。
 */
export function CaseGrid() {
  const [openCase, setOpenCase] = useState<CaseStudy | null>(null);

  // Esc 关闭弹窗，打开时锁定 body 滚动
  useEffect(() => {
    if (!openCase) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenCase(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openCase]);

  return (
    <section id="cases" className="bg-[#e5e9e3] py-[76px] sm:py-[90px] lg:py-28">
      <div className="container-site">
        <div className="mb-[34px] flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Case Library"
            title="把人物放进生命树里"
            description="不急着评价一个人，而是寻找他的行为证据：叶片是否漂亮、年轮是否连续、根是否够深、树冠能否形成真实连接，以及最终有没有结出可以被继承的果实。"
          />
          <Reveal>
            <Link
              href="/people"
              className="inline-flex items-center gap-2 whitespace-nowrap border-b border-current pb-[6px] text-[13px] font-bold text-green-deep"
            >
              查看完整人物对照表
              <ArrowRight size={15} strokeWidth={1.7} aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((item) => (
            <Reveal key={item.id}>
              <article className="flex h-full min-h-[300px] flex-col rounded-brand border border-line-light bg-paper-strong p-[26px] transition duration-160 hover:-translate-y-1 hover:border-[rgba(63,98,73,0.52)] hover:shadow-[0_14px_28px_rgba(16,20,17,0.08)] lg:min-h-[320px]">
                <div className="flex items-center justify-between gap-3 text-[11px] text-muted-dark">
                  <span className="font-bold text-green-deep">
                    {item.category}
                  </span>
                  <span>{item.person}</span>
                </div>
                <h3 className="m-0 mt-7 font-display text-[23px] leading-[1.45]">
                  {item.title}
                </h3>
                <p className="m-0 mt-[14px] text-[13px] leading-[1.8] text-muted-dark">
                  {item.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-[6px]">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[2px] border border-line-light px-2 py-1 text-[10px] text-muted-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenCase(item)}
                  className="group mt-auto inline-flex w-fit items-center gap-2 border-0 bg-transparent p-0 pt-5 text-[13px] font-bold text-text-dark"
                >
                  阅读案例摘要
                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                    aria-hidden
                    className="transition-transform duration-160 group-hover:translate-x-1"
                  />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {openCase ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-[18px]"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[rgba(5,7,6,0.84)] backdrop-blur-[8px]"
            onClick={() => setOpenCase(null)}
          />
          <div className="relative max-h-[calc(100svh-36px)] w-[min(760px,calc(100%-36px))] overflow-auto rounded-brand border border-white/16 bg-ink-soft text-text-light shadow-[0_30px_90px_rgba(0,0,0,0.52)]">
            <div className="sticky top-0 z-2 flex min-h-[60px] items-center justify-between gap-4 border-b border-line-dark bg-ink-soft/96 pl-6 pr-[18px] backdrop-blur-[10px]">
              <span className="text-[11px] font-bold text-gold-light">
                {openCase.label}
              </span>
              <button
                type="button"
                aria-label="关闭案例"
                onClick={() => setOpenCase(null)}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[3px] border border-line-dark bg-transparent text-text-light"
              >
                <X size={17} strokeWidth={1.7} aria-hidden />
              </button>
            </div>
            <div className="px-[22px] pb-[34px] pt-7 sm:p-[36px_36px_42px]">
              <h2
                id="case-dialog-title"
                className="m-0 max-w-[610px] font-display text-[27px] leading-[1.4] sm:text-[34px]"
              >
                {openCase.title}
              </h2>
              <p className="m-0 mt-[18px] text-[15px] leading-[1.9] text-muted-light">
                {openCase.summary}
              </p>
              <div className="mt-[22px] flex flex-wrap gap-[7px]">
                {openCase.dimensions.map((dimension) => (
                  <span
                    key={dimension}
                    className="rounded-[2px] border border-line-dark px-[9px] py-[5px] text-[11px] text-gold-light"
                  >
                    {dimension}
                  </span>
                ))}
              </div>
              <div className="mt-[34px] border-l-[3px] border-gold bg-white/[0.035] p-[18px] font-display text-[17px] leading-[1.75] sm:p-[22px_24px] sm:text-[19px]">
                {openCase.question}
              </div>
              <div className="mt-8">
                <h3 className="m-0 text-xs font-bold text-gold-light">
                  行为证据
                </h3>
                <ul className="m-0 mt-4 grid list-none gap-3 p-0">
                  {openCase.evidence.map((item) => (
                    <li
                      key={item}
                      className="relative pl-5 text-sm leading-[1.8] text-muted-light"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[10px] h-[6px] w-[6px] rounded-full bg-green"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <blockquote className="m-0 mt-8 border-t border-line-dark pt-[26px] font-display text-[17px] leading-[1.8] text-text-light">
                {openCase.quote}
              </blockquote>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
