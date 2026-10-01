import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InsightCards } from "@/components/features/people/InsightCards";
import { LegendGrid } from "@/components/features/people/LegendGrid";
import { PeopleTable } from "@/components/features/people/PeopleTable";
import { PersonCard } from "@/components/features/people/PersonCard";
import { MANIFESTO, PAGE_HEADER, PEOPLE } from "@/components/features/people/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "时代人物对照表",
  description:
    "六维信用体系 · 时代人物对照表：标签、时间、环境、人格、社会、文明，六维信用是唯一无法被批量生成的人格资产负债表。",
  alternates: {
    canonical: "/people",
  },
  openGraph: {
    title: "时代人物对照表",
    description:
      "六维信用体系 · 时代人物对照表：标签、时间、环境、人格、社会、文明，六维信用是唯一无法被批量生成的人格资产负债表。",
    url: "/people",
  },
};

export default function PeoplePage() {
  return (
    <>
      {/* 页头（深色区块，衔接 fixed 顶栏） */}
      <section className="border-b border-line-dark bg-ink pt-[68px] text-text-light max-[620px]:pt-[62px]">
        <div className="container-site py-16 text-center sm:py-20">
          <Reveal>
            <p className="m-0 mb-5 font-display text-[14px] tracking-[0.5em] text-gold-light/80 uppercase">
              {PAGE_HEADER.logo}
            </p>
            <h1 className="m-0 font-display text-[clamp(30px,5vw,48px)] leading-[1.3] font-bold">
              {PAGE_HEADER.title}
              <br />
              <span className="text-gold-light">{PAGE_HEADER.titleHighlight}</span>
            </h1>
            <p className="m-0 mx-auto mt-6 max-w-[700px] text-[15px] leading-[1.9] text-muted-light sm:text-[16px]">
              {PAGE_HEADER.subtitleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="m-0 mt-8 text-[13px] tracking-[0.2em] text-muted-light/70">
              {PAGE_HEADER.meta}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 六维定义图例 */}
      <section className="container-site py-16 sm:py-20">
        <SectionHeading
          index="01"
          eyebrow="Six Dimensions"
          title="六维信用 · 定义"
          description="六维信用，是唯一无法被批量生成的人格资产负债表。"
          className="mb-10"
        />
        <LegendGrid />
        <p className="m-0 mt-10 text-center text-[14px] leading-[1.9] text-muted-dark">
          本页不替任何人打分。我们只整理公开可见的行为证据，判断交给时间，也交给你。
        </p>
      </section>

      {/* 人物档案 */}
      <section className="container-site pb-16 sm:pb-20">
        <SectionHeading
          index="02"
          eyebrow="People Cases"
          title="时代人物 · 六维档案"
          description="八位时代人物，八种信用样本——从长期验证到争议与重建。"
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {PEOPLE.map((person) => (
            <Reveal key={person.name}>
              <PersonCard person={person} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 总览对照表 */}
      <section className="container-site pb-16 sm:pb-20">
        <SectionHeading
          index="03"
          eyebrow="Comparison"
          title="六维信用 · 总览对照表"
          className="mb-10"
        />
        <PeopleTable />
      </section>

      {/* 核心洞察 */}
      <section className="container-site pb-20 sm:pb-24">
        <SectionHeading
          index="04"
          eyebrow="Key Insights"
          title="何明轩 · 六维信用核心洞察"
          className="mb-10"
        />
        <div className="mx-auto max-w-[900px]">
          <InsightCards />
        </div>
      </section>

      {/* 测评引导 */}
      <section className="container-site pb-20 sm:pb-24">
        <Reveal>
          <div className="mx-auto max-w-[900px] rounded-brand border border-line-light border-l-[3px] border-l-gold bg-paper-strong p-7 text-center sm:p-10">
            <p className="m-0 font-display text-[clamp(20px,3vw,26px)] leading-[1.5] text-text-dark">
              你想成为哪种信用样本？
            </p>
            <p className="m-0 mt-3 text-[14px] leading-[1.9] text-muted-dark">
              八种样本是一面镜子。照见别人之后，也该照照自己。
            </p>
            <Link
              href="/credit-test"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-gold-light px-6 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-[#f6d48d]"
            >
              先完成一次六维信用测评
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 结语 */}
      <section className="border-t border-line-light bg-paper-muted/40">
        <div className="container-site py-14 text-center">
          <Reveal>
            <p className="m-0 font-display text-[clamp(20px,3vw,26px)] tracking-[0.1em] text-gold">
              {MANIFESTO}
            </p>
            <p className="m-0 mt-4 text-[13px] tracking-[0.2em] text-muted-dark">
              何明轩 · 智神进化纪 · 2026年9月
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
