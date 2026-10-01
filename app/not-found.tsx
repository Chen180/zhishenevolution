import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "页面未找到",
  description: "你要找的页面不存在，或已被移动。",
};

export default function NotFound() {
  return (
    <section className="bg-paper">
      <div className="container-site flex min-h-[72vh] flex-col items-center justify-center py-32 text-center">
        <p className="m-0 text-xs font-bold tracking-[0.2em] text-gold uppercase">
          404 · Page Not Found
        </p>
        <h1 className="m-0 mt-5 font-display text-[clamp(30px,5vw,46px)] leading-[1.3] text-text-dark">
          这一页还没有留下记录
        </h1>
        <p className="m-0 mt-5 max-w-[520px] text-[15px] leading-[1.9] text-muted-dark">
          你要找的页面不存在，或已被移动。信用靠时间与行动留下记录——迷路的时候，不妨从下面两件事重新开始。
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/credit-test"
            className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-gold-light px-6 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-[#f6d48d]"
          >
            完成信用测评
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href="/articles"
            className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-line-light px-6 text-sm font-bold text-green-deep transition hover:border-green-deep"
          >
            阅读时代观察
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
