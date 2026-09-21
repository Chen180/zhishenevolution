import { MessageCircle, Video } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/**
 * 关于提出者段落（id="about"）：肖像 + 品牌引导语 + 微信名片。
 */
export function About() {
  return (
    <section
      id="about"
      className="bg-paper-strong py-[76px] sm:py-[90px] lg:py-28"
    >
      <div className="container-site grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[minmax(260px,0.62fr)_minmax(0,1.18fr)_minmax(230px,0.5fr)] lg:gap-[64px]">
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
          <p className="m-0 mt-[18px] font-display text-[19px] leading-[1.6] text-text-dark sm:text-[21px]">
            hi，你好，我是何明轩。
          </p>
          <p className="m-0 mt-2 text-sm font-bold text-green-deep">
            「六维信用体系」构建者 · 「信用生命树」提出者
          </p>
          <h2 className="m-0 mt-[22px] font-display text-[28px] leading-[1.3] text-balance sm:text-[34px] lg:text-[40px]">
            在这个越来越不确定的时代，
            <br />
            一个普通人，怎样活出值得被相信的一生？
          </h2>
          <p className="m-0 mt-6 max-w-[660px] text-base leading-[1.95] text-muted-dark">
            我想和你一起研究这个普通人都绕不开的问题。所以，我用现实中的人和事，观察信用如何积累、被验证，也如何失去。
          </p>
          <blockquote className="m-0 mt-[30px] max-w-[660px] border-l-[3px] border-gold py-[22px] pl-7 font-display text-lg leading-[1.8] text-text-dark lg:text-xl">
            热点只是入口，规律才是内容；
            <br />
            理解时代，也是理解自己。
          </blockquote>
          <div aria-label="内容频道" className="mt-[28px] flex flex-wrap gap-[10px]">
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
        <Reveal className="md:col-span-2 lg:col-span-1">
          <figure className="m-0 mx-auto w-full max-w-[280px] rounded-brand border border-line-dark bg-ink p-[14px] pb-3 lg:max-w-none">
            <Image
              src="/six-credit/assets/wechat-qr.jpg"
              alt="何明轩的微信二维码名片"
              width={928}
              height={1380}
              sizes="(max-width: 1024px) 280px, 240px"
              className="w-full rounded-[3px]"
            />
            <figcaption className="flex min-h-9 items-center justify-between gap-3 px-1 text-[11px] tracking-[0.1em] text-text-light/70">
              <span>微信扫码</span>
              <span className="text-gold-light/80">注明来意</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
