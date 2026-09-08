import data from "@/data/thinking-models.json";
import type { ModelSummary } from "./model-filter";

/**
 * 思维模型库的只读数据访问层。
 * 数据来源：data/thinking-models.json（由 scripts/build-thinking-models.mjs
 * 从 Resource 母版生成，见 docs/adr/0004）。
 */

export interface ThinkingModelLayer {
  id: string;
  name: string;
  /** 层级主题，如「如何思考」 */
  theme: string;
  from: number;
  to: number;
}

export interface ThinkingModelBooks {
  main: string;
  extras: string[];
}

export interface ThinkingModel {
  id: number;
  name: string;
  nameEn: string;
  layer: string;
  /** 一句话定义 */
  definition: string;
  /** 核心原理 */
  principle: string;
  /** 跨学科背景 */
  background: string;
  /** 应用场景 */
  scenarios: string[];
  /** 落地方法 */
  methods: string[];
  /** 故事/案例 */
  story: string;
  /** 常见误区 */
  pitfalls: string[];
  books: ThinkingModelBooks;
}

export const THINKING_MODEL_LAYERS: ThinkingModelLayer[] = data.layers;

const MODELS: ThinkingModel[] = data.models;

export function getAllModels(): ThinkingModel[] {
  return MODELS;
}

export function getModelById(id: number): ThinkingModel | undefined {
  return MODELS.find((model) => model.id === id);
}

export function getModelsByLayer(layerId: string): ThinkingModel[] {
  return MODELS.filter((model) => model.layer === layerId);
}

export function getLayerById(layerId: string): ThinkingModelLayer | undefined {
  return THINKING_MODEL_LAYERS.find((layer) => layer.id === layerId);
}

/** 100 个模型的列表摘要，供索引页搜索/筛选使用。 */
export function listModelSummaries(): ModelSummary[] {
  return MODELS.map(({ id, name, nameEn, layer, definition }) => ({
    id,
    name,
    nameEn,
    layer,
    definition,
  }));
}
