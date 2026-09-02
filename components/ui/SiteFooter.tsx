import { MessageCircle, User, Video } from "lucide-react";
import Link from "next/link";

const CONTACT_CHANNELS = [
  { icon: MessageCircle, label: "公众号「智神进化纪」" },
  { icon: Video, label: "视频号「何明轩在进化」" },
  { icon: User, label: "微信：", highlight: "IAMCAT156" },
];

const FOOTER_NAV = [
  { label: "核心定义", href: "/#definition" },
  { label: "双模型", href: "/#models" },
  { label: "六个维度", href: "/#system" },
  { label: "人物案例", href: "/#cases" },
  { label: "人物档案", href: "/people" },
  { label: "信用测评", href: "/credit-test" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line-dark bg-ink text-text-light">
      <div className="container-site grid grid-cols-[1.4fr_1fr_1fr] gap-10 py-14 max-[820px]:grid-cols-1 max-[820px]:gap-8">
        <div>
          <p className="m-0 max-w-[420px] font-display text-[21px] leading-[1.7]">
            一个人真正的进化，是让根更深、年轮更密、树冠更广，最终结出能够留给世界的果实。
          </p>
          <div className="mt-8 border-t border-line-dark pt-6">
            <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.24em] text-gold uppercase">
              联系何明轩
            </p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[14px] text-muted-light">
              {CONTACT_CHANNELS.map((channel) => (
                <li key={channel.label} className="flex items-center gap-2.5">
                  <channel.icon size={16} aria-hidden className="text-gold" />
                  <span>
                    {channel.label}
                    {"highlight" in channel ? (
                      <strong className="font-semibold text-text-light">
                        {channel.highlight}
                      </strong>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav aria-label="页脚导航">
          <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.24em] text-gold uppercase">
            站内导航
          </p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[14px]">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-light transition-colors hover:text-gold-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col justify-between text-[13px] text-muted-light max-[820px]:gap-6">
          <div>
            <p className="m-0 mb-2 text-[15px] font-semibold text-gold">
              智神进化纪 · 六维信用体系
            </p>
            <p className="m-0 leading-[1.9]">
              金字塔看「怎么长」，生命树看「怎么活」。
              <br />
              从被看见，到被铭记。
            </p>
          </div>
          <p className="m-0">何明轩 © 2026 · Framework 3.0</p>
        </div>
      </div>
    </footer>
  );
}
