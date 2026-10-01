import {
  createCreditAssessment,
  type CreditAnswers,
  type CreditAssessment,
} from "../domain/credit-assessment";
import { CREDIT_DIMENSIONS } from "../domain/credit-questions";

export interface CreditInterpretationContent {
  summary: string;
  focus: string;
  actions: [string, string, string];
}

export interface CreditInterpretation extends CreditInterpretationContent {
  source: "ai" | "rule";
}

export interface CreditAssessmentReport {
  assessment: CreditAssessment;
  interpretation: CreditInterpretation;
}

export type CreditInterpreter = (
  assessment: CreditAssessment,
) => Promise<CreditInterpretationContent>;

export function createRuleBasedInterpretation(
  assessment: CreditAssessment,
): CreditInterpretation {
  const strongest = CREDIT_DIMENSIONS[assessment.strongestDimension.id];
  const focus = CREDIT_DIMENSIONS[assessment.focusDimension.id];
  const secondary = assessment.secondaryFocusDimension
    ? CREDIT_DIMENSIONS[assessment.secondaryFocusDimension.id]
    : null;
  const scoreSpread =
    assessment.strongestDimension.score - assessment.focusDimension.score;
  const strongSentence =
    scoreSpread <= 5
      ? "你的六个维度目前分布较为均衡，没有单一维度显著领先或落后。"
      : assessment.strongestDimension.score >= 60
        ? `你目前更稳定的部分是${strongest.name}：${strongest.description}`
        : "目前六个维度都还处在建立证据的阶段，这更适合作为一次起点记录，而不是固定结论。";
  const secondarySentence = secondary
    ? `同时，${secondary.name}与它接近，适合放在同一阶段一起观察。`
    : "";
  const focusSentence =
    assessment.focusDimension.score >= 75
      ? `六维目前都已进入较稳定区间。${focus.name}是相对适合持续校准的观察点，这不是明显短板，而是让现有积累更清晰、更可验证的抓手。`
      : `下一阶段最值得加强的是${focus.name}。${focus.focusDescription}`;

  return {
    source: "rule",
    summary: `${strongSentence} 你的当前成长阶段更接近“${assessment.stage.name}”，也就是：${assessment.stage.statement}`,
    focus: `初步判断，${focusSentence}${secondarySentence}`,
    actions: [...focus.actions],
  };
}

/**
 * 结果页第一层「一句话画像」：纯本地规则生成，不经过大模型。
 * secondaryFocusDimension 本身已按“与 focus 分差 ≤ 8”判定，存在即追加。
 */
export function createPortraitLine(assessment: CreditAssessment): string {
  const strongest = CREDIT_DIMENSIONS[assessment.strongestDimension.id];
  const focus = CREDIT_DIMENSIONS[assessment.focusDimension.id];
  const scoreSpread =
    assessment.strongestDimension.score - assessment.focusDimension.score;

  if (assessment.focusDimension.score >= 75) {
    return `你的信用结构整体已经成形，相对值得持续校准的是${focus.name}。`;
  }

  if (scoreSpread <= 5) {
    return "你的六个维度分布均衡，信用结构还没有明显的主轴——这通常意味着积累尚浅，或方向仍在探索。";
  }

  if (assessment.strongestDimension.score >= 60) {
    const secondary = assessment.secondaryFocusDimension
      ? `${CREDIT_DIMENSIONS[assessment.secondaryFocusDimension.id].name}也接近同一水平。`
      : "";
    return `你的${strongest.name}已经形成，但${focus.name}尚未转化。${secondary}`;
  }

  return `目前六个维度都还处在建立证据的阶段，最先值得从${focus.name}开始。`;
}

export async function assessCredit(
  answers: CreditAnswers,
  interpreter?: CreditInterpreter,
): Promise<CreditAssessmentReport> {
  const assessment = createCreditAssessment(answers);
  const fallback = createRuleBasedInterpretation(assessment);

  if (!interpreter) {
    return { assessment, interpretation: fallback };
  }

  try {
    const interpretation = await interpreter(assessment);
    return {
      assessment,
      interpretation: {
        ...interpretation,
        source: "ai",
      },
    };
  } catch {
    return { assessment, interpretation: fallback };
  }
}
