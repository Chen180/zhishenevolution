import { describe, expect, it } from "vitest";
import { assessFin } from "../../lib/application/assess-fin";
import {
  createFinAssessment,
  getFinAssessmentReadiness,
  validateFinAnswers,
  type FinAnswers,
} from "../../lib/domain/fin-assessment";
import {
  FIN_DIMENSION_ORDER,
  FIN_QUESTIONS,
  SCORED_QUESTION_COUNT,
} from "../../lib/domain/fin-questions";

function buildCompleteAnswers(level: "high" | "low"): FinAnswers {
  return Object.fromEntries(
    FIN_QUESTIONS.map((question) => {
      if (question.type === "multi") {
        return [question.id, { selections: level === "high" ? [0, 2] : [] }];
      }

      const choice =
        question.scoreDirection === "descending"
          ? level === "high"
            ? 0
            : question.options.length - 1
          : level === "high"
            ? question.options.length - 1
            : 0;

      return [
        question.id,
        {
          choice,
          ...(question.followUp &&
          level === "high" &&
          choice >= question.followUp.triggerFromIndex
            ? { followUpChoice: question.followUp.options.length - 1 }
            : {}),
        },
      ];
    }),
  );
}

describe("fin assessment", () => {
  it("keeps the 25-question structure across six dimensions", () => {
    expect(FIN_QUESTIONS).toHaveLength(25);
    expect(SCORED_QUESTION_COUNT).toBe(24);
    expect(new Set(FIN_QUESTIONS.map((question) => question.number)).size).toBe(
      25,
    );
    expect(
      new Set(FIN_QUESTIONS.map((question) => question.dimension)),
    ).toEqual(new Set(FIN_DIMENSION_ORDER));
  });

  it("produces full scores and the top grade for consistently strongest answers", () => {
    const result = createFinAssessment(buildCompleteAnswers("high"));

    expect(result.overallScore).toBe(100);
    expect(result.dimensions.every((dimension) => dimension.score === 100)).toBe(
      true,
    );
    expect(result.confidence).toBe("较为充分");
    expect(result.grade.name).toBe("Lv.6 判断系统");
  });

  it("reverses the score for the descending question f16", () => {
    const strongAnswers = buildCompleteAnswers("high");
    const regretfulAnswers = {
      ...strongAnswers,
      f16: { choice: 4 },
    };

    const strongPsychology = createFinAssessment(
      strongAnswers,
    ).dimensions.find((dimension) => dimension.id === "psychology");
    const regretfulPsychology = createFinAssessment(
      regretfulAnswers,
    ).dimensions.find((dimension) => dimension.id === "psychology");

    expect(strongPsychology?.score).toBe(100);
    expect(regretfulPsychology?.score).toBe(75);
  });

  it("uses the neutral score when the f15 follow-up is not triggered", () => {
    const answers = buildCompleteAnswers("high");
    answers.f15 = { choice: 0 };

    const psychology = createFinAssessment(answers).dimensions.find(
      (dimension) => dimension.id === "psychology",
    );

    expect(psychology?.score).toBe(88);
  });

  it("requires enough scored answers in every dimension", () => {
    const readiness = getFinAssessmentReadiness({
      f01: { choice: 3 },
      f02: { choice: 3 },
      f05: { choice: 3 },
      f06: { choice: 3 },
      f09: { choice: 3 },
      f10: { choice: 3 },
      f13: { choice: 3 },
      f14: { choice: 3 },
      f17: { choice: 3 },
      f18: { choice: 3 },
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.answeredCount).toBe(10);
    expect(readiness.missingDimensions).toContain("judgment");
    expect(readiness.message).toContain("至少各回答2题");
  });

  it("rejects an unknown question id during validation", () => {
    const issues = validateFinAnswers({
      f99: { choice: 0 },
    });

    expect(issues).toEqual([
      { questionId: "f99", message: "包含未知题目。" },
    ]);
  });

  it("identifies Lv.1 when money awareness is the first weak dimension", () => {
    const answers = buildCompleteAnswers("low");
    const result = createFinAssessment(answers);

    expect(result.grade.name).toBe("Lv.1 认识钱");
    expect(result.focusDimension.id).toBe("money");
  });

  it("derives focus and strongest dimensions from the ranked scores", () => {
    const answers = buildCompleteAnswers("high");
    for (const question of FIN_QUESTIONS) {
      if (question.dimension === "money" && question.type === "single") {
        answers[question.id] = { choice: 0 };
      }
    }

    const result = createFinAssessment(answers);

    expect(result.focusDimension.id).toBe("money");
    expect(result.strongestDimension.id).toBe("judgment");
    expect(result.grade.name).toBe("Lv.1 认识钱");
  });

  it("uses the rule interpretation when no interpreter is provided", async () => {
    const report = await assessFin(buildCompleteAnswers("high"));

    expect(report.interpretation.source).toBe("rule");
    expect(report.interpretation.actions).toHaveLength(3);
  });

  it("falls back to the rule interpretation when the interpreter fails", async () => {
    const report = await assessFin(buildCompleteAnswers("high"), async () => {
      throw new Error("provider unavailable");
    });

    expect(report.interpretation.source).toBe("rule");
    expect(report.interpretation.focus).toContain("初步判断");
  });

  it("uses a valid model interpretation when the provider succeeds", async () => {
    const report = await assessFin(buildCompleteAnswers("high"), async () => ({
      summary:
        "你的六维财商结构整体稳定，认识钱、理解资产与长期复利已经形成了可以观察的习惯。",
      focus:
        "当前可以继续校准判断系统，把每一次重要财务决定都放回自己的三问清单里。",
      actions: ["记录一周每一笔支出", "写下你的三问清单", "复盘一次消费决定"],
    }));

    expect(report.interpretation.source).toBe("ai");
    expect(report.interpretation.actions[0]).toBe("记录一周每一笔支出");
  });
});
