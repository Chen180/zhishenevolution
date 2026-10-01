import type { Metadata } from "next";
import { FinTest } from "@/components/features/fin-test/FinTest";

export const metadata: Metadata = {
  title: "财商等级测试",
  description:
    "25 道题，看见你面对钱时的判断力：从认识钱、理解资产、财富观、金钱心理、长期复利，到自己的判断系统。",
  alternates: {
    canonical: "/fin-test",
  },
};

export default function FinTestPage() {
  return <FinTest />;
}
