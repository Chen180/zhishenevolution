import type { CreditDimensionId } from "./credit-questions";

/**
 * 测评维度 → 思维模型的推荐映射。
 * 测评报告的「延伸阅读」按优先加强的维度推荐三个模型，链接到
 * /models/[id] 详情页。数据量小且稳定，静态维护；名称与
 * data/thinking-models.json 的一致性由 tests/unit/model-recommendations.test.ts 保证。
 */

export interface ModelRecommendation {
  id: number;
  name: string;
}

export interface DimensionRecommendation {
  /** 针对该维度的一句推荐语 */
  reason: string;
  models: ModelRecommendation[];
}

export const MODEL_RECOMMENDATIONS: Record<
  CreditDimensionId,
  DimensionRecommendation
> = {
  label: {
    reason: "让别人第一次接触就知道你是谁——先把自我表达打磨清晰。",
    models: [
      { id: 20, name: "概念思维" },
      { id: 19, name: "隐喻思维" },
      { id: 56, name: "社会认同" },
    ],
  },
  time: {
    reason: "时间只记录重复的行动，这些模型帮你把积累变成复利。",
    models: [
      { id: 36, name: "复利思维" },
      { id: 37, name: "刻意练习" },
      { id: 47, name: "间隔重复" },
    ],
  },
  environment: {
    reason: "证明自己在任何环境都成立，需要系统视角与反脆弱结构。",
    models: [
      { id: 4, name: "系统思维" },
      { id: 35, name: "反脆弱思维" },
      { id: 49, name: "跨界思维" },
    ],
  },
  personality: {
    reason: "被信任来自稳定的人格内核，先分清什么可控、什么不可控。",
    models: [
      { id: 82, name: "斯多葛控制二分法" },
      { id: 38, name: "成长型思维" },
      { id: 64, name: "自我决定理论" },
    ],
  },
  social: {
    reason: "价值要进入更大的网络，先理解连接与互惠的底层逻辑。",
    models: [
      { id: 59, name: "互惠原理" },
      { id: 26, name: "博弈论思维" },
      { id: 66, name: "网络效应" },
    ],
  },
  civilization: {
    reason: "创造超越自己的东西，需要站到整体与长周期的视角。",
    models: [
      { id: 86, name: "存在主义" },
      { id: 88, name: "整体论" },
      { id: 90, name: "范式转换" },
    ],
  },
};

export function getModelRecommendations(
  dimensionId: CreditDimensionId,
): DimensionRecommendation {
  return MODEL_RECOMMENDATIONS[dimensionId];
}
