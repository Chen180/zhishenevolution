import {
  createFinAssessment,
  type FinAnswers,
  type FinAssessment,
} from "../domain/fin-assessment";
import { FIN_DIMENSIONS } from "../domain/fin-questions";

export interface FinInterpretationContent {
  summary: string;
  focus: string;
  actions: [string, string, string];
}

export interface FinInterpretation extends FinInterpretationContent {
  source: "ai" | "rule";
}

export interface FinAssessmentReport {
  assessment: FinAssessment;
  interpretation: FinInterpretation;
}

export type FinInterpreter = (
  assessment: FinAssessment,
) => Promise<FinInterpretationContent>;

export function createRuleBasedInterpretation(
  assessment: FinAssessment,
): FinInterpretation {
  const strongest = FIN_DIMENSIONS[assessment.strongestDimension.id];
  const focus = FIN_DIMENSIONS[assessment.focusDimension.id];
  const secondary = assessment.secondaryFocusDimension
    ? FIN_DIMENSIONS[assessment.secondaryFocusDimension.id]
    : null;
  const scoreSpread =
    assessment.strongestDimension.score - assessment.focusDimension.score;
  const strongSentence =
    scoreSpread <= 5
      ? "你的六个维度目前分布较为均衡，没有单一维度显著领先或落后。"
      : assessment.strongestDimension.score >= 60
        ? `你目前更稳定的部分是${strongest.name}：${strongest.description}`
        : "目前六个维度都还处在建立基础的阶段，这更适合作为一次起点记录，而不是固定结论。";
  const secondarySentence = secondary
    ? `同时，${secondary.name}与它接近，适合放在同一阶段一起观察。`
    : "";
  const focusSentence =
    assessment.focusDimension.score >= 75
      ? `六个维度目前都已进入较稳定区间。${focus.name}是相对适合持续校准的观察点，这不是明显短板，而是让判断系统更完整的抓手。`
      : `下一阶段最值得加强的是${focus.name}。${focus.focusDescription}`;

  return {
    source: "rule",
    summary: `${strongSentence} 你的财商等级更接近“${assessment.grade.name}”，也就是：${assessment.grade.statement}`,
    focus: `初步判断，${focusSentence}${secondarySentence} 这一维度对应的共读书目是《${focus.book.title}》：${focus.book.reason}`,
    actions: [...focus.actions],
  };
}

export async function assessFin(
  answers: FinAnswers,
  interpreter?: FinInterpreter,
): Promise<FinAssessmentReport> {
  const assessment = createFinAssessment(answers);
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
