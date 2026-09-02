import { MessageCircle, Video } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/**
 * 关于提出者段落（id="about"）。
 */
export function About() {
  return (
    <section
      id="about"
      className="bg-paper-strong py-[76px] sm:py-[90px] lg:py-28"
    >
      <div className="container-site grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:gap-[78px]">
        <Reveal>
          <figure className="relative m-0 aspect-[4/4.4] w-full overflow-hidden rounded-brand bg-paper-muted md:aspect-[4/5] lg:max-w-[430px]">
            <Image
              src="/six-credit/assets/portrait.jpg"
              alt="何明轩个人肖像"
              width={939}
              height={940}
              sizes="(max-width: 768px) 100vw, 430px"
              className="h-full w-full object-cover object-[center_30%] [filter:saturate(0.8)_contrast(1.04)]"
            />
            <figcaption className="absolute inset-x-[14px] bottom-[14px] flex min-h-11 items-center justify-between gap-3 rounded-[3px] border border-white/28 bg-ink/78 px-[14px] text-[11px] text-text-light backdrop-blur-[10px]">
              <span>何明轩</span>
              <span>31岁 · 持续验证中</span>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal>
          <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            <span aria-hidden className="inline-block h-px w-[38px] bg-current" />
            The Proposer
          </p>
          <h2 className="m-0 mt-[18px] font-display text-[30px] leading-[1.2] text-balance sm:text-[38px] lg:text-[46px]">
            不是站在终点定义人生，
            <br />
            而是用生命验证模型
          </h2>
          <p className="m-0 mt-4 text-sm font-bold text-green-deep">
            同行者 + 提出者 + 观察者
          </p>
          <p className="m-0 mt-6 max-w-[660px] text-base leading-[1.95] text-muted-dark">
            一个31岁的人，正在用自己的生命验证一套关于“一个人如何从被看见走向被铭记”的模型。六维信用不是用来评价别人的道德标尺，而是帮助普通人在变化时代中，看见自己正在积累什么、还需要证明什么。
          </p>
          <blockquote className="m-0 mt-[34px] max-w-[660px] border-l-[3px] border-gold py-[26px] pl-7 font-display text-lg leading-[1.8] text-text-dark lg:text-xl">
            我们真正应该服务的是：正在成为某种人的人。已经被看见，但还没有被证明；已经有标签，但还没有形成真正属于自己的长期信用资产。
          </blockquote>
          <div aria-label="内容频道" className="mt-[30px] flex flex-wrap gap-[10px]">
            <span className="inline-flex min-h-[38px] items-center gap-2 rounded-[3px] border border-line-light px-[13px] text-xs text-muted-dark">
              <MessageCircle size={16} strokeWidth={1.7} aria-hidden />
              公众号「智神进化纪」
            </span>
            <span className="inline-flex min-h-[38px] items-center gap-2 rounded-[3px] border border-line-light px-[13px] text-xs text-muted-dark">
              <Video size={16} strokeWidth={1.7} aria-hidden />
              视频号「何明轩在进化」
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
