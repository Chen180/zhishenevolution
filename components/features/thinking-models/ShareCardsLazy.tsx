"use client";

import dynamic from "next/dynamic";
import type { ThinkingModel } from "@/lib/domain/thinking-models";

const ShareCards = dynamic(
  () => import("./ShareCards").then((mod) => mod.ShareCards),
  { ssr: false },
);

export function ShareCardsLazy({ model }: { model: ThinkingModel }) {
  return <ShareCards model={model} />;
}
