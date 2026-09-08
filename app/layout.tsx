import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SITE } from "@/lib/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "六维信用",
    "信用生命树",
    "思维模型",
    "个人成长",
    "何明轩",
    "智神进化纪",
  ],
  authors: [{ name: SITE.author }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
