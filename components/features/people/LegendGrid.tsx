import { Reveal } from "@/components/ui/Reveal";
import { DIMENSION_LEGENDS } from "./content";
import { DIM_DOT_CLASS, DIM_TEXT_CLASS } from "./styles";

/** 六维信用定义图例 */
export function LegendGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {DIMENSION_LEGENDS.map((legend) => (
        <Reveal key={legend.key}>
          <div className="h-full rounded-brand border border-line-light bg-paper-strong px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_10px_30px_rgba(16,20,17,0.08)]">
            <div aria-hidden className="mb-2 text-[26px]">
              {legend.icon}
            </div>
            <p
              className={`m-0 mb-1.5 flex items-center justify-center gap-1.5 text-[15px] font-bold ${DIM_TEXT_CLASS[legend.key]}`}
            >
              <span
                aria-hidden
                className={`inline-block h-2 w-2 rounded-full ${DIM_DOT_CLASS[legend.key]}`}
              />
              {legend.name}
            </p>
            <p className="m-0 text-[12px] leading-[1.7] text-muted-dark">
              {legend.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
