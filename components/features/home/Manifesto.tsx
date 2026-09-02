import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { value: "6", label: "标签、时间、环境、人格、社会、文明六种信用资产" },
  { value: "2", label: "金字塔解释成长路径，生命树解释运行逻辑" },
  { value: "1", label: "普通人真正能够穿越时代周期的长期资产" },
];

/**
 * 核心母定义段落（id="definition"）。
 */
export function Manifesto() {
  return (
    <section
      id="definition"
      className="border-b border-line-light bg-paper-strong py-[76px] sm:py-[86px] lg:pb-24 lg:pt-[104px]"
    >
      <div className="container-site grid items-start gap-12 lg:grid-cols-[0.85fr_1.5fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-[96px]">
          <p className="m-0 font-figure text-[42px] leading-none text-gold md:text-[52px]">
            01
          </p>
          <h2 className="m-0 mt-[18px] font-display text-[25px] leading-[1.35]">
            信用不是标签，
            <br />
            而是时间留下的确定性
          </h2>
          <p className="m-0 mt-3 text-[13px] text-muted-dark">
            《智神进化纪·六维信用体系》核心母定义
          </p>
        </Reveal>
        <Reveal>
          <p className="m-0 font-display text-[25px] leading-[1.7] sm:text-[29px] lg:text-[34px] lg:leading-[1.65]">
            信用，是一个人的
            <em className="border-b-2 border-gold not-italic text-green-deep">
              价值选择
            </em>
            ，在时间中持续兑现、在环境中反复验证，并最终形成他人对其未来行为的
            <em className="border-b-2 border-gold not-italic text-green-deep">
              稳定预期
            </em>
            。
          </p>
          <div
            aria-label="六维信用体系概览"
            className="mt-12 grid gap-5 border-t border-line-light pt-[30px] sm:grid-cols-3 sm:gap-7"
          >
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="grid grid-cols-[50px_1fr] items-center gap-3 sm:block"
              >
                <strong className="block font-figure text-[30px] leading-none text-green-deep">
                  {stat.value}
                </strong>
                <span className="m-0 block text-[13px] text-muted-dark sm:mt-[10px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
