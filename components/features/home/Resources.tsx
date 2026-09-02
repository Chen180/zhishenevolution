import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const VISUALS = [
  {
    src: "/six-credit/assets/life-tree.png",
    alt: "六维信用生命树视觉图",
    width: 1402,
    height: 1122,
    index: "VISUAL ASSET 01",
    title: "六维信用生命树",
  },
  {
    src: "/six-credit/assets/pyramid.png",
    alt: "六维信用体系金字塔视觉图",
    width: 1536,
    height: 1024,
    index: "VISUAL ASSET 02",
    title: "六维信用金字塔",
  },
];

/**
 * 模型图谱与人物档案段落（id="resources"）。
 */
export function Resources() {
  return (
    <section
      id="resources"
      className="bg-[#161a17] py-[76px] text-text-light sm:py-[90px] lg:py-28"
    >
      <div className="container-site">
        <SectionHeading
          light
          eyebrow="Model & Cases"
          title="模型图谱与人物档案"
          description="两种模型共同描述成长路径与运行逻辑，人物档案则将抽象维度还原为可核验的行为证据。"
          className="mb-9"
        />
        <div className="grid gap-6">
          <Reveal className="grid gap-[14px] sm:grid-cols-2">
            {VISUALS.map((visual) => (
              <figure
                key={visual.src}
                className="relative m-0 block min-h-[230px] overflow-hidden rounded-brand border border-line-dark bg-[#050706] sm:min-h-[260px]"
              >
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  width={visual.width}
                  height={visual.height}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="h-full min-h-[230px] w-full object-cover opacity-78 sm:min-h-[260px]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,6,0.94)_0%,transparent_58%)]"
                />
                <figcaption className="absolute inset-x-5 bottom-[18px] z-1 flex items-end justify-between gap-5">
                  <span>
                    <span className="block text-[10px] font-bold text-gold-light">
                      {visual.index}
                    </span>
                    <strong className="mt-[5px] block font-display text-lg font-bold">
                      {visual.title}
                    </strong>
                  </span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
          <Reveal className="border-t border-line-dark">
            <Link
              href="/people"
              className="grid min-h-[118px] grid-cols-[42px_1fr] items-center gap-4 border-b border-line-dark py-[22px] transition duration-160 hover:bg-white/[0.025] hover:pl-[10px] sm:grid-cols-[54px_1fr_auto]"
            >
              <span className="font-figure text-[13px] text-gold-light">01</span>
              <span>
                <span className="block text-[15px] font-bold">
                  时代人物案例对照表
                </span>
                <span className="mt-[6px] block text-xs text-muted-light">
                  于东来、王计兵、李亚鹏、张国伟等人物的六维证据分析
                </span>
              </span>
              <span className="hidden items-center gap-[7px] text-xs font-bold text-gold-light sm:inline-flex">
                打开页面
                <ArrowRight size={15} strokeWidth={1.7} aria-hidden />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
