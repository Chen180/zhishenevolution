import { Reveal } from "@/components/ui/Reveal";
import { DIMENSION_LEGENDS, TABLE_ROWS } from "./content";
import { TABLE_BADGE_CLASS } from "./styles";

/** 六维信用总览对照表（小屏横向滚动） */
export function PeopleTable() {
  return (
    <Reveal>
      <div className="overflow-x-auto rounded-brand border border-line-light bg-paper-strong">
        <table className="w-full min-w-[760px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-gold/10">
              <th className="border border-line-light px-3 py-3.5 text-left font-bold tracking-wider text-gold">
                人物
              </th>
              {DIMENSION_LEGENDS.map((legend) => (
                <th
                  key={legend.key}
                  className="border border-line-light px-3 py-3.5 text-center font-bold tracking-wider text-gold"
                >
                  {legend.name}
                </th>
              ))}
              <th className="border border-line-light px-3 py-3.5 text-center font-bold tracking-wider text-gold">
                综合评级
              </th>
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map((row) => (
              <tr key={row.name} className="transition-colors hover:bg-gold/5">
                <td className="border border-line-light px-3 py-3 font-semibold whitespace-nowrap text-text-dark">
                  {row.name}
                </td>
                {row.cells.map((cell, index) => (
                  <td
                    key={index}
                    className="border border-line-light px-3 py-3 text-center"
                  >
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap ${TABLE_BADGE_CLASS[cell.tone]}`}
                    >
                      {cell.label}
                    </span>
                  </td>
                ))}
                <td className="border border-line-light px-3 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 font-figure text-[12px] font-semibold whitespace-nowrap ${TABLE_BADGE_CLASS[row.overall.tone]}`}
                  >
                    {row.overall.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
