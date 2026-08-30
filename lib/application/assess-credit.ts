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
