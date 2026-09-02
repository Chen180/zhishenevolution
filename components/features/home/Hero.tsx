import { ArrowDownRight, ClipboardCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * 首屏 Hero：生命树背景 + 双层渐变遮罩，让 fixed Header 覆盖其上。
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex h-[calc(100svh-30px)] min-h-[670px] items-end overflow-hidden bg-ink text-text-light sm:min-h-[690px] md:h-[calc(100svh-44px)] md:min-h-[670px] md:max-h-[920px] md:items-center"
    >
      <Image
        src="/six-credit/assets/life-tree.png"
        alt=""
        width={1402}
        height={1122}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-[56%_center] opacity-56 md:object-[60%_center] md:opacity-78"
      />
      {/* 左暗 + 底部暗的双层遮罩 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,8,0.94)_0%,rgba(7,10,8,0.72)_58%,rgba(7,10,8,0.44)_100%),linear-gradient(0deg,rgba(7,10,8,0.9)_0%,transparent_58%)] md:bg-[linear-gradient(90deg,rgba(7,10,8,0.96)_0%,rgba(7,10,8,0.86)_28%,rgba(7,10,8,0.28)_64%,rgba(7,10,8,0.5)_100%),linear-gradient(0deg,rgba(7,10,8,0.84)_0%,transparent_45%)]"
      />
      <div className="container-site relative z-2 h-full">
        <div className="flex h-full w-full flex-col justify-end pb-[82px] md:w-[min(710px,66%)] md:justify-center md:pb-[10px] md:pt-[68px]">
          <p className="mb-5 flex items-center gap-[14px] text-[13px] font-semibold text-gold-light md:mb-7">
            <span aria-hidden className="inline-block h-px w-[38px] bg-current" />
            解释时代，理解自己
          </p>
          <h1
            id="hero-title"
            className="m-0 max-w-[470px] font-display text-[44px] font-bold leading-[1.14] text-balance sm:text-[54px] md:max-w-[680px] md:text-[64px] lg:text-[84px] lg:leading-[1.08]"
          >
            六维信用
            <br />
            生命树
          </h1>
          <p className="m-0 mt-[22px] max-w-[610px] text-[15px] leading-[1.8] text-text-light/80 md:mt-[30px] md:text-lg md:leading-[1.9]">
            一个普通人穿越时间、环境与社会的
            <strong className="font-semibold text-text-light">
              信用成长与价值传承模型
            </strong>
            。从被看见，到被铭记；从一枚种子，到一棵树，再到新的种子。
          </p>
          <div className="mt-7 flex flex-wrap gap-3 md:mt-9">
            <Link
              href="/credit-test"
              className="inline-flex min-h-11 items-center justify-center gap-[9px] rounded-[3px] border border-transparent bg-gold-light px-[15px] text-sm font-bold text-ink transition duration-160 hover:-translate-y-0.5 hover:bg-[#f6d48d] md:min-h-[46px] md:px-5"
            >
              开始信用测评
              <ClipboardCheck size={17} strokeWidth={1.7} aria-hidden />
            </Link>
            <Link
              href="#system"
              className="inline-flex min-h-11 items-center justify-center gap-[9px] rounded-[3px] border border-text-light/38 bg-ink/28 px-[15px] text-sm font-bold text-text-light transition duration-160 hover:-translate-y-0.5 hover:border-text-light hover:bg-text-light/8 md:min-h-[46px] md:px-5"
            >
              了解六维体系
              <ArrowDownRight size={17} strokeWidth={1.7} aria-hidden />
            </Link>
          </div>
          <div className="mt-[30px] flex items-center gap-[14px] text-xs text-text-light/62 md:mt-[42px]">
            <strong className="text-sm text-text-light">何明轩</strong>
            <span aria-hidden className="h-7 w-px bg-line-dark" />
            <span>同行者 · 提出者 · 观察者</span>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute bottom-[26px] right-7 z-2 hidden items-center gap-[10px] text-[11px] text-text-light/58 [writing-mode:vertical-rl] md:flex"
      >
        SCROLL
        <span className="h-[46px] w-px bg-text-light/36" />
      </div>
    </section>
  );
}
