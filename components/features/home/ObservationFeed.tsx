import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { listRecentArticles } from "@/lib/domain/articles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const MAX_OBSERVATIONS = 3;

/** Latest published writing, presented as the site's ongoing observation log. */
export function ObservationFeed() {
  const articles = listRecentArticles(MAX_OBSERVATIONS);

  if (articles.length === 0) return null;

  return (
    <section
      id="observations"
      aria-labelledby="observations-title"
      className="border-b border-line-light bg-paper py-[76px] sm:py-[90px] lg:py-28"
    >
      <div className="container-site">
        <div className="mb-9 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Ongoing Observation"
            title="持续记录，观察并解释现实"
            description="从正在发生的人与事出发，用六维信用寻找行为证据、时间记录与环境压力之间的关系。"
            headingId="observations-title"
          />
          <Reveal>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 whitespace-nowrap border-b border-current pb-[6px] text-[13px] font-bold text-green-deep"
            >
              查看全部观察
              <ArrowRight size={15} strokeWidth={1.7} aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex h-full min-h-[292px] flex-col rounded-brand border border-line-light bg-paper-strong p-6 transition duration-160 hover:-translate-y-1 hover:border-[rgba(63,98,73,0.55)] hover:shadow-[0_16px_32px_rgba(16,20,17,0.08)] sm:p-7"
              >
                <div className="flex items-center justify-between gap-4 text-[11px] font-bold text-muted-dark">
                  <span className="text-green-deep">
                    OBSERVATION / {String(index + 1).padStart(2, "0")}
                  </span>
                  <time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time>
                </div>
                <h3 className="m-0 mt-7 font-display text-[23px] leading-[1.45] text-text-dark">
                  {article.title}
                </h3>
                <p className="m-0 mt-3 line-clamp-3 text-[13px] leading-[1.85] text-muted-dark">
                  {article.excerpt}
                </p>
                {article.tags.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[2px] border border-line-light px-2 py-1 text-[10px] text-muted-dark"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[13px] font-bold text-text-dark">
                  阅读本期观察
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.7}
                    aria-hidden
                    className="transition-transform duration-160 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex justify-center">
          <Link
            href="/evidence-camp"
            className="inline-flex items-center gap-2 border-b border-current pb-1 text-[13px] font-bold text-green-deep transition-colors hover:text-gold"
          >
            准备为自己留下证据？了解 21 天信用证据建立营
            <ArrowRight size={15} strokeWidth={1.7} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
