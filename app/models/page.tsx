import type { Metadata } from "next";
import { ModelsIndex } from "@/components/features/thinking-models/ModelsIndex";

export const metadata: Metadata = {
  title: "世界顶尖100个思维模型 | 智神进化纪",
  description:
    "融合心理学、社会学、哲学、经济学、物理学等多学科智慧的 100 个思维模型详解，帮助你看清世界本质，提升决策质量。",
};

export default function ModelsPage() {
  return <ModelsIndex />;
}
