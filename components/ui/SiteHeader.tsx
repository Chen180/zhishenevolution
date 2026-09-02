"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "核心定义", href: "/#definition" },
  { label: "双模型", href: "/#models" },
  { label: "六个维度", href: "/#system" },
  { label: "人物案例", href: "/#cases" },
  { label: "人物档案", href: "/people" },
  { label: "信用测评", href: "/credit-test" },
];

const MOBILE_NAV_ITEMS = [...NAV_ITEMS, { label: "关于何明轩", href: "/#about" }];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? "border-line-dark bg-ink/85 backdrop-blur-md"
          : "border-transparent bg-ink/60 backdrop-blur-sm"
      }`}
    >
      <div className="container-site flex h-[68px] items-center justify-between max-[620px]:h-[62px]">
        <Link href="/" className="flex items-center gap-3" aria-label="返回首页">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full border border-gold font-display text-[15px] text-gold"
          >
            六
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[17px] text-text-light">智神进化纪</span>
            <span className="text-[10px] tracking-[0.18em] text-muted-light uppercase max-[620px]:hidden">
              Six-dimensional Credit · Framework 3.0
            </span>
          </span>
        </Link>

        <nav aria-label="主导航" className="flex items-center gap-7 max-[820px]:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-[13px] text-text-light/85 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:text-gold-light hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="hidden text-text-light max-[820px]:block"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          aria-label="移动端导航"
          className="border-t border-line-dark bg-ink/95 backdrop-blur-md"
        >
          <div className="container-site flex flex-col py-3">
            {MOBILE_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line-dark py-3.5 text-[15px] text-text-light last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
