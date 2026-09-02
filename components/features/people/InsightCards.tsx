import { Reveal } from "@/components/ui/Reveal";
import { INSIGHTS } from "./content";

/** 何明轩 · 六维信用核心洞察 */
export function InsightCards() {
  return (
    <div className="flex flex-col gap-5">
      {INSIGHTS.map((insight) => (
        <Reveal key={insight.num}>
          <article className="relative overflow-hidden rounded-brand border border-line-light bg-paper-strong px-7 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_10px_30px_rgba(16,20,17,0.08)] sm:px-8 sm:py-7">
            <span
              aria-hidden
              className="absolute top-4 right-6 font-display text-[38px] leading-none font-bold text-gold/15"
            >
              {insight.num}
            </span>
            <h3 className="m-0 mb-2.5 font-display text-[18px] font-bold text-text-dark">
              {insight.title}
            </h3>
            <p className="m-0 text-[14px] leading-[1.9] text-muted-dark">
              {insight.body}
            </p>
            <span className="mt-3.5 inline-block rounded-brand bg-gold/10 px-3 py-1 text-[12px] tracking-wider text-gold">
              {insight.tag}
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
