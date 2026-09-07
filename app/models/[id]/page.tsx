import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModelDetail } from "@/components/features/thinking-models/ModelDetail";
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

  return {
    title: `${model.name} ${model.nameEn}`.trim(),
    description: model.definition,
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

  return <ModelDetail model={model} />;
}
