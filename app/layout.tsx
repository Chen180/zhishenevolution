import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "六维信用生命树 | 何明轩 · 智神进化纪",
  description:
    "从标签身份到文明价值，用金字塔解释成长，用生命树解释运行。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
