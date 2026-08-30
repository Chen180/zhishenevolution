import {
  CREDIT_DIMENSIONS,
  CREDIT_DIMENSION_ORDER,
  CREDIT_QUESTIONS,
  SCORED_QUESTION_COUNT,
  getCreditQuestion,
  type CreditDimensionId,
  type CreditQuestion,
  type SingleChoiceQuestion,
} from "./credit-questions";

export interface CreditAnswer {
  choice?: number;
  followUpChoice?: number;
  selections?: number[];
  skipped?: boolean;
}

export type CreditAnswers = Record<string, CreditAnswer>;

export type CreditLevel = "萌芽" | "生长" | "稳固" | "繁茂";
export type AssessmentConfidence = "参考有限" | "基本可信" | "较为充分";

export interface DimensionScore {
  id: CreditDimensionId;
  name: string;
  role: string;
  metric: string;
  score: number;
  answered: number;
  total: number;
  level: CreditLevel;
  description: string;
}

export interface CreditStage {
  index: number;
  name: string;
  dimension: CreditDimensionId;
  statement: string;
}

export interface CreditAssessment {
  overallScore: number;
  confidence: AssessmentConfidence;
  completionRate: number;
  answeredCount: number;
  totalCount: number;
  dimensions: DimensionScore[];
  strongestDimension: DimensionScore;
  focusDimension: DimensionScore;
  secondaryFocusDimension: DimensionScore | null;
  stage: CreditStage;
  legacySelections: string[];
}

export interface AssessmentReadiness {
  ready: boolean;
  answeredCount: number;
  missingDimensions: CreditDimensionId[];
  message: string | null;
}

export interface AnswerValidationIssue {
  questionId: string;
  message: string;
}

const MIN_TOTAL_ANSWERS = 18;
const MIN_DIMENSION_ANSWERS = 2;
const STAGE_THRESHOLD = 65;

const CREDIT_STAGES: readonly CreditStage[] = [
  {
    index: 1,
    name: "被看见",
    dimension: "label",
    statement: "我需要建立自己的标签。",
  },
  {
    index: 2,
    name: "被观察",
    dimension: "time",
    statement: "我需要让时间证明我不是偶然。",
  },
  {
    index: 3,
    name: "被验证",
    dimension: "environment",
    statement: "我需要证明换一个环境，我依然成立。",
  },
  {
    index: 4,
    name: "被信任",
    dimension: "personality",
    statement: "我需要成为一个值得托付的人。",
  },
  {
    index: 5,
    name: "被连接",
    dimension: "social",
    statement: "我需要让自己的价值进入更大的关系网络。",
  },
  {
    index: 6,
    name: "被铭记",
    dimension: "civilization",
    statement: "我开始创造能够超越自己的东西。",
  },
] as const;

function isIntegerInRange(value: unknown, maximum: number): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < maximum
  );
}

function isAnswered(question: CreditQuestion, answer?: CreditAnswer) {
  if (!answer || answer.skipped) {
    return false;
  }

  if (question.type === "multi") {
    return true;
  }

  if (!isIntegerInRange(answer.choice, question.options.length)) {
    return false;
  }

  if (
    question.followUp &&
    answer.choice >= question.followUp.triggerFromIndex
  ) {
    return isIntegerInRange(
      answer.followUpChoice,
      question.followUp.options.length,
    );
  }

  return true;
}

function scoreSingleAnswer(
  question: SingleChoiceQuestion,
  answer?: CreditAnswer,
): number | null {
  if (!answer || answer.skipped || !isAnswered(question, answer)) {
    return null;
  }

  if (question.followUp) {
    if ((answer.choice ?? 0) < question.followUp.triggerFromIndex) {
      return question.followUp.neutralScoreWhenHidden;
    }

    return answer.followUpChoice ?? null;
  }

  const choice = answer.choice ?? 0;
  if (question.scores) {
    return question.scores[choice] ?? null;
  }
  return question.scoreDirection === "descending" ? 4 - choice : choice;
}

function getCreditLevel(score: number): CreditLevel {
  if (score >= 80) return "繁茂";
  if (score >= 60) return "稳固";
  if (score >= 40) return "生长";
  return "萌芽";
}

function getConfidence(completionRate: number): AssessmentConfidence {
  if (completionRate >= 0.9) return "较为充分";
  if (completionRate >= 0.7) return "基本可信";
  return "参考有限";
}

function scoreDimensions(answers: CreditAnswers): DimensionScore[] {
  return CREDIT_DIMENSION_ORDER.map((dimensionId) => {
    const questions = CREDIT_QUESTIONS.filter(
      (question): question is SingleChoiceQuestion =>
        question.dimension === dimensionId && question.type === "single",
    );
    const scores = questions
      .map((question) => scoreSingleAnswer(question, answers[question.id]))
      .filter((score): score is number => score !== null);
    const average =
      scores.length === 0
        ? 2
        : scores.reduce((total, score) => total + score, 0) / scores.length;
    const score = Math.round((average / 4) * 100);
    const definition = CREDIT_DIMENSIONS[dimensionId];

    return {
      id: dimensionId,
      name: definition.name,
      role: definition.role,
      metric: definition.metric,
      score,
      answered: scores.length,
      total: questions.length,
      level: getCreditLevel(score),
      description: definition.description,
    };
  });
}

function getStage(dimensions: DimensionScore[]): CreditStage {
  for (const stage of CREDIT_STAGES) {
    const score = dimensions.find(
      (dimension) => dimension.id === stage.dimension,
    );

    if (score && score.score < STAGE_THRESHOLD) {
      return stage;
    }
  }

  return CREDIT_STAGES[CREDIT_STAGES.length - 1];
}

export function validateCreditAnswers(
  answers: CreditAnswers,
): AnswerValidationIssue[] {
  const issues: AnswerValidationIssue[] = [];

  for (const questionId of Object.keys(answers)) {
    if (!getCreditQuestion(questionId)) {
      issues.push({ questionId, message: "包含未知题目。" });
    }
  }

  for (const question of CREDIT_QUESTIONS) {
    const answer = answers[question.id];
    if (!answer || answer.skipped) continue;

    if (question.type === "multi") {
      const selections = answer.selections ?? [];
      const validSelections =
        selections.length <= question.options.length &&
        new Set(selections).size === selections.length &&
        selections.every((selection) =>
          isIntegerInRange(selection, question.options.length),
        );

      if (!validSelections) {
        issues.push({
          questionId: question.id,
          message: "多选答案超出允许范围。",
        });
      }
      continue;
    }

    if (!isIntegerInRange(answer.choice, question.options.length)) {
      issues.push({
        questionId: question.id,
        message: "请选择一个有效答案。",
      });
      continue;
    }

    if (
      question.followUp &&
      answer.choice >= question.followUp.triggerFromIndex &&
      !isIntegerInRange(
        answer.followUpChoice,
        question.followUp.options.length,
      )
    ) {
      issues.push({
        questionId: question.id,
        message: "请完成这道题的后续选择。",
      });
    }
  }

  return issues;
}

export function getAssessmentReadiness(
  answers: CreditAnswers,
): AssessmentReadiness {
  const answeredByDimension = new Map<CreditDimensionId, number>(
    CREDIT_DIMENSION_ORDER.map((dimension) => [dimension, 0]),
  );
  let answeredCount = 0;

  for (const question of CREDIT_QUESTIONS) {
    if (question.type !== "single") continue;
    if (scoreSingleAnswer(question, answers[question.id]) === null) continue;

    answeredCount += 1;
    answeredByDimension.set(
      question.dimension,
      (answeredByDimension.get(question.dimension) ?? 0) + 1,
    );
  }

  const missingDimensions = CREDIT_DIMENSION_ORDER.filter(
    (dimension) =>
      (answeredByDimension.get(dimension) ?? 0) < MIN_DIMENSION_ANSWERS,
  );
  const ready =
    answeredCount >= MIN_TOTAL_ANSWERS && missingDimensions.length === 0;

  let message: string | null = null;
  if (missingDimensions.length > 0) {
    const names = missingDimensions
      .map((dimension) => CREDIT_DIMENSIONS[dimension].name)
      .join("、");
    message = `为了让结果具有基本参考性，请在${names}中至少各回答2题。`;
  } else if (answeredCount < MIN_TOTAL_ANSWERS) {
    message = `还需回答至少${MIN_TOTAL_ANSWERS - answeredCount}道计分题，才能生成基本可信的结果。`;
  }

  return { ready, answeredCount, missingDimensions, message };
}

export function createCreditAssessment(
  answers: CreditAnswers,
): CreditAssessment {
  const issues = validateCreditAnswers(answers);
  if (issues.length > 0) {
    throw new Error(issues[0].message);
  }

  const readiness = getAssessmentReadiness(answers);
  if (!readiness.ready) {
    throw new Error(readiness.message ?? "有效答案不足。");
  }

  const dimensions = scoreDimensions(answers);
  const rankedDimensions = [...dimensions].sort((first, second) => {
    if (first.score === second.score) {
      return (
        CREDIT_DIMENSION_ORDER.indexOf(first.id) -
        CREDIT_DIMENSION_ORDER.indexOf(second.id)
      );
    }
    return first.score - second.score;
  });
  const focusDimension = rankedDimensions[0];
  const strongestDimension = rankedDimensions[rankedDimensions.length - 1];
  const secondaryCandidate = rankedDimensions[1];
  const secondaryFocusDimension =
    secondaryCandidate.score - focusDimension.score <= 8
      ? secondaryCandidate
      : null;
  const completionRate = readiness.answeredCount / SCORED_QUESTION_COUNT;
  const overallScore = Math.round(
    dimensions.reduce((total, dimension) => total + dimension.score, 0) /
      dimensions.length,
  );
  const legacyQuestion = CREDIT_QUESTIONS.find(
    (question) => question.id === "q36" && question.type === "multi",
  );
  const legacySelections = legacyQuestion
    ? (answers.q36?.selections ?? [])
        .filter((index) =>
          isIntegerInRange(index, legacyQuestion.options.length),
        )
        .map((index) => legacyQuestion.options[index])
    : [];

  return {
    overallScore,
    confidence: getConfidence(completionRate),
    completionRate,
    answeredCount: readiness.answeredCount,
    totalCount: SCORED_QUESTION_COUNT,
    dimensions,
    strongestDimension,
    focusDimension,
    secondaryFocusDimension,
    stage: getStage(dimensions),
    legacySelections,
  };
}
