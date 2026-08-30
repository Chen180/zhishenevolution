import type { Metadata } from "next";
import { CreditTest } from "@/components/features/credit-test/CreditTest";

export const metadata: Metadata = {
  title: "信用生命树测评 | 六维信用",
  description:
    "用36道题观察标签、时间、环境、人格、社会和文明六个信用维度，生成你的信用生命树与初步成长建议。",
};

export default function CreditTestPage() {
  return <CreditTest />;
}
