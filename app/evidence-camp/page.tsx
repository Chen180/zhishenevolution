import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, CheckCircle2, Clock3, Users, type LucideIcon } from "lucide-react";
import { CopyWeChatButton } from "@/components/features/evidence-camp/CopyWeChatButton";

export const metadata: Metadata = {
  title: "21 天信用证据建立营",
  description:
    "不是包装人设，而是在 21 天内为六维信用留下第一批真实、可复盘、可展示的行动证据。",
  alternates: {
    canonical: "/evidence-camp",
  },
};

const STAGES = [
  {
    days: "DAY 01—03",
    title: "看见自己",
    description: "完成六维测评，识别当下最需要补齐的证据，而不是急着追求一个更高的分数。",
    outcome: "生命树起点图",
  },
  {
    days: "DAY 04—08",
    title: "建立根系",
    description: "围绕人格、时间与环境，完成一次承诺、连续记录与压力情境复盘。",
    outcome: "承诺卡、记录表、复盘卡",
  },
  {
    days: "DAY 09—14",
    title: "长出连接",
    description: "把能力转成可理解的身份表达，完成一项作品/案例，并邀请真实关系给出反馈。",
    outcome: "个人介绍、作品与反馈记录",
  },
  {
    days: "DAY 15—19",
    title: "留下种子",
    description: "将经验沉淀成一份可传递的方法、作品或行动总结，让价值不只停留在自己身上。",
    outcome: "可传递的行动作品",
  },
  {
    days: "DAY 20—21",
    title: "形成档案",
    description: "复盘证据之间的联系，制定下一个 90 天的持续行动，让这次开始成为真正的年轮。",
    outcome: "个人证据档案 1.0",
  },
];

const AUDIENCES = [
  "已经有能力和想法，但履历、作品或行动记录尚未形成闭环的人。",
  "正处在职业转型、个人品牌重建、自由职业或创业早期的人。",
  "不想靠包装获得短期关注，而想建立长期可信赖感的人。",
];

const DELIVERY_ITEMS: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  { icon: Clock3, title: "21 张每日行动卡", description: "把抽象维度转为每天可完成的行动。" },
  { icon: Users, title: "3 次同伴互证任务", description: "在真实关系中留下反馈与连接证据。" },
  { icon: CheckCircle2, title: "每周线上复盘", description: "在行动偏离时，重新找回下一步。" },
  { icon: ArrowRight, title: "个人证据档案 1.0", description: "结营时完成一份可持续更新的个人档案。" },
];

export default function EvidenceCampPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-[138px] text-text-light sm:pb-24 sm:pt-[160px] lg:pb-32">
        <div aria-hidden className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_68%_26%,rgba(201,155,67,0.22),transparent_26%),radial-gradient(circle_at_74%_70%,rgba(120,149,104,0.22),transparent_24%)]" />
        <div aria-hidden className="absolute -right-24 top-16 h-[430px] w-[430px] rounded-full border border-gold-light/20" />
        <div aria-hidden className="absolute -right-4 top-28 h-[310px] w-[310px] rounded-full border border-gold-light/15" />
        <div className="container-site relative z-1">
          <p className="m-0 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gold-light uppercase">
            <span aria-hidden className="inline-block h-px w-[38px] bg-current" />
            First Cohort · 21 Days
          </p>
          <div className="mt-7 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <h1 className="m-0 max-w-[850px] font-display text-[clamp(44px,7vw,82px)] leading-[1.08] text-balance">
                21 天信用证据
                <br />
                建立营
              </h1>
              <p className="m-0 mt-7 max-w-[690px] text-[17px] leading-[1.9] text-muted-light sm:text-xl">
                不教你包装人设，而是帮你为六维信用留下第一批
                <strong className="font-semibold text-text-light">真实、可复盘、可展示</strong>
                的行动证据。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#apply" className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-gold-light px-5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-[#f6d48d]">
                  查看报名方式
                  <ArrowDownRight size={17} aria-hidden />
                </Link>
                <Link href="/credit-test" className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-line-dark px-5 text-sm font-bold text-text-light transition hover:border-text-light hover:bg-white/5">
                  先完成免费测评
                  <ArrowRight size={17} aria-hidden />
                </Link>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-brand border border-line-dark bg-line-dark">
              {[['21', '天行动周期'], ['299', '元首期共创价'], ['30', '个首期名额']].map(([value, label]) => (
                <div key={label} className="bg-ink-soft px-6 py-5">
                  <strong className="font-figure text-[34px] leading-none text-gold-light">{value}</strong>
                  <span className="ml-3 text-[13px] text-muted-light">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-strong py-[76px] sm:py-[90px] lg:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="m-0 text-xs font-bold tracking-[0.2em] text-gold uppercase">Who this is for</p>
            <h2 className="m-0 mt-4 font-display text-[clamp(30px,4vw,46px)] leading-[1.25]">不是为“变成更厉害的人”，而是为成为更可信赖的人。</h2>
          </div>
          <div className="grid gap-4">
            {AUDIENCES.map((audience, index) => (
              <div key={audience} className="grid grid-cols-[36px_1fr] gap-4 border-t border-line-light pt-5">
                <span className="font-figure text-lg text-gold">0{index + 1}</span>
                <p className="m-0 text-[16px] leading-[1.85] text-muted-dark">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e5e9e3] py-[76px] sm:py-[90px] lg:py-28">
        <div className="container-site">
          <p className="m-0 text-xs font-bold tracking-[0.2em] text-gold uppercase">The 21-day path</p>
          <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <h2 className="m-0 max-w-[700px] font-display text-[clamp(30px,4vw,46px)] leading-[1.25]">不是听完一门课，而是完成一轮证据建设。</h2>
            <span className="text-sm text-muted-dark">每天 20—30 分钟</span>
          </div>
          <div className="mt-10 border-t border-line-light">
            {STAGES.map((stage) => (
              <article key={stage.days} className="grid gap-5 border-b border-line-light py-7 sm:grid-cols-[120px_minmax(160px,0.6fr)_minmax(0,1.4fr)_180px] sm:items-start">
                <span className="text-[11px] font-bold tracking-[0.12em] text-green-deep">{stage.days}</span>
                <h3 className="m-0 font-display text-[24px] leading-[1.3]">{stage.title}</h3>
                <p className="m-0 text-sm leading-[1.85] text-muted-dark">{stage.description}</p>
                <span className="inline-flex items-center gap-2 text-[12px] font-bold text-green-deep"><CheckCircle2 size={15} aria-hidden />{stage.outcome}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-[76px] text-text-light sm:py-[90px] lg:py-28">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="m-0 text-xs font-bold tracking-[0.2em] text-gold-light uppercase">What you receive</p>
            <h2 className="m-0 mt-4 font-display text-[clamp(30px,4vw,46px)] leading-[1.25]">你的生命树，不再只是一张测试结果。</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DELIVERY_ITEMS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="border border-line-dark bg-white/[0.035] p-6">
                <Icon size={20} strokeWidth={1.5} className="text-gold-light" aria-hidden />
                <h3 className="m-0 mt-6 text-[15px] font-bold">{title}</h3>
                <p className="m-0 mt-2 text-[13px] leading-[1.8] text-muted-light">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="bg-paper-strong py-[76px] sm:py-[90px] lg:py-28">
        <div className="container-site grid overflow-hidden rounded-brand border border-line-light bg-paper lg:grid-cols-[1.08fr_0.92fr]">
          <div className="p-7 sm:p-12 lg:p-16">
            <p className="m-0 text-xs font-bold tracking-[0.2em] text-gold uppercase">Apply for the first cohort</p>
            <h2 className="m-0 mt-4 font-display text-[clamp(30px,4vw,46px)] leading-[1.25]">先证明你愿意开始。</h2>
            <p className="m-0 mt-5 max-w-[580px] text-[15px] leading-[1.9] text-muted-dark">首期为 30 人共创营，定价 299 元。暂不在站内收款；复制微信号后添加何明轩，备注「证据」，即可获取开营时间与报名确认。</p>
            <div className="mt-8"><CopyWeChatButton /></div>
            <p className="m-0 mt-5 text-xs leading-[1.75] text-muted-dark">本营不提供人格诊断、征信结论或结果承诺；它只陪你完成一次真实的观察、复盘与行动。</p>
          </div>
          <div className="flex flex-col justify-between bg-[#dfe3dc] p-7 sm:p-12 lg:p-16">
            <span className="font-figure text-[72px] leading-none text-green-deep/20">21</span>
            <div>
              <p className="m-0 text-[13px] font-bold text-green-deep">报名时请备注</p>
              <p className="m-0 mt-3 font-display text-[32px] leading-none text-text-dark">证据</p>
              <div className="mt-8 border-t border-line-light pt-5 text-sm leading-[1.9] text-muted-dark">让你的下一次被看见，不只是一次偶然；而是时间、选择与行动共同留下的记录。</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
