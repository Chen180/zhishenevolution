import { DIMENSION_LEGENDS, type DimensionKey, type Person } from "./content";
import { DIM_DOT_CLASS, SCORE_TEXT_CLASS, VERDICT_BADGE_CLASS } from "./styles";

const DIM_NAME: Record<DimensionKey, string> = Object.fromEntries(
  DIMENSION_LEGENDS.map((legend) => [legend.key, legend.name]),
) as Record<DimensionKey, string>;

type PersonCardProps = {
  person: Person;
};

/** 单个人物的六维信用档案卡 */
export function PersonCard({ person }: PersonCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-brand border border-line-light bg-paper-strong transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_16px_40px_rgba(16,20,17,0.1)]">
      <header className="flex flex-wrap items-center gap-4 border-b border-line-light bg-gradient-to-br from-gold/8 to-transparent px-6 pt-6 pb-5">
        <span
          aria-hidden
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-gold/50 bg-paper text-[26px]"
        >
          {person.avatar}
        </span>
        <div className="min-w-0">
          <h3 className="m-0 font-display text-[22px] font-bold text-text-dark">
            {person.name}
          </h3>
          <p className="m-0 mt-1 text-[13px] leading-[1.6] text-gold">{person.tag}</p>
        </div>
        <span
          className={`ml-auto rounded-full border px-4 py-1.5 text-[13px] font-bold whitespace-nowrap ${VERDICT_BADGE_CLASS[person.verdictKind]}`}
        >
          {person.verdict}
        </span>
      </header>

      <div className="grow px-6 pt-1 pb-5">
        {person.dimensions.map((dim) => (
          <div
            key={dim.dimension}
            className="grid grid-cols-[96px_1fr] items-start gap-x-3 gap-y-2 border-b border-line-light/60 py-4 last:border-b-0 sm:grid-cols-[110px_1fr_76px]"
          >
            <p className="m-0 flex items-center gap-2 text-[13px] font-semibold text-muted-dark">
              <span
                aria-hidden
                className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${DIM_DOT_CLASS[dim.dimension]}`}
              />
              {DIM_NAME[dim.dimension]}
            </p>
            <div className="text-[13.5px] leading-[1.8] text-text-dark">
              {dim.text}
              <p className="m-0 mt-1.5 text-[12px] leading-[1.7] text-muted-dark">
                {dim.evidence}
              </p>
            </div>
            <p
              className={`m-0 col-span-2 pl-[108px] font-display text-[15px] leading-[1.5] font-bold sm:col-span-1 sm:pl-0 sm:text-center ${SCORE_TEXT_CLASS[dim.tone]}`}
            >
              {dim.stars}
              <br />
              {dim.level}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-6 mb-6 rounded-brand border border-gold/25 bg-gold/6 px-5 py-4">
        <p className="m-0 mb-2 text-[12px] font-bold tracking-[0.25em] text-gold uppercase">
          ▲ 何明轩点评
        </p>
        <p className="m-0 text-[13.5px] leading-[1.9] text-muted-dark">
          {person.comment}
        </p>
      </div>
    </article>
  );
}
