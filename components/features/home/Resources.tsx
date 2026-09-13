import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
          title="继续进入观察系统"
          description="模型解释运行逻辑，人物档案保留长期证据；每一条入口都回到同一个问题：什么能经得起时间、环境与他人的验证？"
          className="mb-9"
        />
        <div className="grid gap-6">
          <Reveal className="border-t border-line-dark">
            {[
              {
                index: "01",
                title: "21 天信用证据建立营",
                description: "不包装人设，在 21 天内为六维信用留下真实、可复盘的行动证据",
                href: "/evidence-camp",
              },
              {
                index: "02",
                title: "时代人物案例对照表",
                description: "于东来、王计兵、李亚鹏、张国伟等人物的六维证据分析",
                href: "/people",
              },
              {
                index: "03",
                title: "世界顶尖 100 个思维模型",
                description: "认知升级完全指南：七个层级、100 个模型的定义、原理与落地方法",
                href: "/models",
              },
              {
                index: "04",
                title: "转图工具",
                description:
                  "文案转高清长图，或为已有图片叠加统一水印，全部本地完成",
                href: "/text-to-image",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="grid min-h-[118px] grid-cols-[42px_1fr] items-center gap-4 border-b border-line-dark py-[22px] transition duration-160 hover:bg-white/[0.025] hover:pl-[10px] sm:grid-cols-[54px_1fr_auto]"
              >
                <span className="font-figure text-[13px] text-gold-light">
                  {item.index}
                </span>
                <span>
                  <span className="block text-[15px] font-bold">
                    {item.title}
                  </span>
                  <span className="mt-[6px] block text-xs text-muted-light">
                    {item.description}
                  </span>
                </span>
                <span className="hidden items-center gap-[7px] text-xs font-bold text-gold-light sm:inline-flex">
                  打开页面
                  <ArrowRight size={15} strokeWidth={1.7} aria-hidden />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
