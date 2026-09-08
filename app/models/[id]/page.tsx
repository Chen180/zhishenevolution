import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModelDetail } from "@/components/features/thinking-models/ModelDetail";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE } from "@/lib/config/site";
import {
  getAllModels,
  getModelById,
} from "@/lib/domain/thinking-models";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllModels().map((model) => ({ id: String(model.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = getModelById(Number(id));
  if (!model) return {};

  const title = `${model.name} ${model.nameEn}`.trim();

  return {
    title,
    description: model.definition,
    alternates: {
      canonical: `/models/${model.id}`,
    },
    openGraph: {
      title,
      description: model.definition,
      type: "article",
      url: `/models/${model.id}`,
    },
  };
}

export default async function ThinkingModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = getModelById(Number(id));
  if (!model) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "思维模型",
        item: `${SITE.url}/models`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: model.name,
        item: `${SITE.url}/models/${model.id}`,
      },
    ],
  };

  const definedTermJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: model.name,
    description: model.definition,
    inLanguage: "zh-CN",
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={definedTermJsonLd} />
      <ModelDetail model={model} />
    </>
  );
}
