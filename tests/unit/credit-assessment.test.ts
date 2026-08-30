import { describe, expect, it } from "vitest";
import { assessCredit } from "../../lib/application/assess-credit";
import {
  createCreditAssessment,
  getAssessmentReadiness,
  validateCreditAnswers,
  type CreditAnswers,
} from "../../lib/domain/credit-assessment";
import {
  CREDIT_DIMENSION_ORDER,
  CREDIT_QUESTIONS,
} from "../../lib/domain/credit-questions";

function buildCompleteAnswers(level: "high" | "low"): CreditAnswers {
  return Object.fromEntries(
    CREDIT_QUESTIONS.map((question) => {
      if (question.type === "multi") {
        return [question.id, { selections: level === "high" ? [0, 2, 4] : [] }];
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
          ...(question.followUp && level === "high"
            ? { followUpChoice: question.followUp.options.length - 1 }
            : {}),
        },
      ];
    }),
  );
}

describe("credit assessment", () => {
  it("keeps the frozen 36-question structure and six dimensions", () => {
    expect(CREDIT_QUESTIONS).toHaveLength(36);
    expect(new Set(CREDIT_QUESTIONS.map((question) => question.number)).size).toBe(
      36,
    );
    expect(
      new Set(CREDIT_QUESTIONS.map((question) => question.dimension)),
    ).toEqual(new Set(CREDIT_DIMENSION_ORDER));
  });

  it("produces full scores for consistently strongest answers", () => {
    const result = createCreditAssessment(buildCompleteAnswers("high"));

    expect(result.overallScore).toBe(100);
    expect(result.dimensions.every((dimension) => dimension.score === 100)).toBe(
      true,
    );
    expect(result.confidence).toBe("较为充分");
    expect(result.stage.name).toBe("被铭记");
    expect(result.legacySelections).toEqual(["作品", "方法", "思想"]);
  });

  it("reverses the interruption score for question 11", () => {
    const strongAnswers = buildCompleteAnswers("high");
    const interruptedAnswers = {
      ...strongAnswers,
      q11: { choice: 4 },
    };

    const strongTime = createCreditAssessment(strongAnswers).dimensions.find(
      (dimension) => dimension.id === "time",
    );
    const interruptedTime = createCreditAssessment(
      interruptedAnswers,
    ).dimensions.find((dimension) => dimension.id === "time");

    expect(strongTime?.score).toBe(100);
    expect(interruptedTime?.score).toBe(83);
  });

  it("uses a neutral score when no costly scenario was encountered", () => {
    const answers = buildCompleteAnswers("high");
    answers.q01 = { choice: 0 };
    answers.q03 = { choice: 0 };
    answers.q05 = { choice: 0 };

    const personality = createCreditAssessment(answers).dimensions.find(
      (dimension) => dimension.id === "personality",
    );

    expect(personality?.score).toBe(79);
  });

  it("does not treat a lack of major environmental change as failure", () => {
    const answers = buildCompleteAnswers("high");
    answers.q14 = { choice: 0 };

    const environment = createCreditAssessment(answers).dimensions.find(
      (dimension) => dimension.id === "environment",
    );

    expect(environment?.score).toBe(92);
  });

  it("requires enough evidence in every scored dimension", () => {
    const readiness = getAssessmentReadiness({
      q01: { choice: 0 },
      q02: { choice: 4 },
      q08: { choice: 4 },
      q09: { choice: 4 },
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.missingDimensions).toContain("civilization");
    expect(readiness.message).toContain("至少各回答2题");
  });

  it("reports an unanswered conditional follow-up", () => {
    const issues = validateCreditAnswers({
      q01: { choice: 2 },
    });

    expect(issues).toEqual([
      {
        questionId: "q01",
        message: "请完成这道题的后续选择。",
      },
    ]);
  });

  it("identifies label credit as the first growth stage when it is weak", () => {
    const answers = buildCompleteAnswers("high");
    for (const question of CREDIT_QUESTIONS) {
      if (question.dimension === "label" && question.type === "single") {
        answers[question.id] = { choice: 0 };
      }
    }

    const result = createCreditAssessment(answers);

    expect(result.focusDimension.id).toBe("label");
    expect(result.stage.name).toBe("被看见");
  });

  it("falls back to the deterministic interpretation when AI fails", async () => {
    const report = await assessCredit(buildCompleteAnswers("high"), async () => {
      throw new Error("provider unavailable");
    });

    expect(report.interpretation.source).toBe("rule");
    expect(report.interpretation.actions).toHaveLength(3);
    expect(report.interpretation.focus).toContain("初步判断");
  });

  it("uses a valid model interpretation when the provider succeeds", async () => {
    const report = await assessCredit(buildCompleteAnswers("high"), async () => ({
      summary:
        "你的六维结构整体稳定，长期积累与价值延续已经形成了可以被观察的证据。",
      focus:
        "当前可以继续巩固标签信用，让已有能力与成果被更准确地识别和复用。",
      actions: ["整理一个代表成果", "明确一句专业介绍", "收集三条真实反馈"],
    }));

    expect(report.interpretation.source).toBe("ai");
    expect(report.interpretation.actions[0]).toBe("整理一个代表成果");
  });
});
