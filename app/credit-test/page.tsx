import type { Metadata } from "next";
import { CreditTest } from "@/components/features/credit-test/CreditTest";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "信用生命树测评 | 六维信用",
  description:
    "用36道题观察标签、时间、环境、人格、社会和文明六个信用维度，生成你的信用生命树与初步成长建议。",
  alternates: {
    canonical: "/credit-test",
  },
  openGraph: {
    title: "信用生命树测评 | 六维信用",
    description:
      "用36道题观察标签、时间、环境、人格、社会和文明六个信用维度，生成你的信用生命树与初步成长建议。",
    url: "/credit-test",
  },
};

export default function CreditTestPage() {
  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "信用生命树测评",
    description:
      "用36道题观察标签、时间、环境、人格、社会和文明六个信用维度，生成你的信用生命树与初步成长建议。",
    about: "六维信用体系",
    educationalLevel: "自我观察",
    inLanguage: "zh-CN",
    url: `${SITE.url}/credit-test`,
    author: {
      "@type": "Person",
      name: SITE.author,
      url: SITE.url,
    },
  };

  return (
    <>
      <JsonLd data={quizJsonLd} />
      <CreditTest />
    </>
  );
}
