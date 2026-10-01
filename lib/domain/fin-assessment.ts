import {
  FIN_DIMENSIONS,
  FIN_DIMENSION_ORDER,
  FIN_QUESTIONS,
  SCORED_QUESTION_COUNT,
  getFinQuestion,
  type FinDimensionId,
  type FinQuestion,
  type SingleChoiceQuestion,
} from "./fin-questions";

export interface FinAnswer {
  choice?: number;
  followUpChoice?: number;
  selections?: number[];
  skipped?: boolean;
}

export type FinAnswers = Record<string, FinAnswer>;

export type FinLevel = "起步" | "成长" | "稳健" | "成熟";
export type AssessmentConfidence = "参考有限" | "基本可信" | "较为充分";

export interface FinDimensionScore {
  id: FinDimensionId;
  name: string;
  role: string;
  metric: string;
  score: number;
  answered: number;
  total: number;
  level: FinLevel;
  description: string;
}

export interface FinGrade {
  index: number;
  name: string;
  dimension: FinDimensionId;
  statement: string;
}

export interface FinAssessment {
  overallScore: number;
  confidence: AssessmentConfidence;
  completionRate: number;
  answeredCount: number;
  totalCount: number;
  dimensions: FinDimensionScore[];
  strongestDimension: FinDimensionScore;
  focusDimension: FinDimensionScore;
  secondaryFocusDimension: FinDimensionScore | null;
  grade: FinGrade;
  concernSelections: string[];
}

export interface FinAssessmentReadiness {
  ready: boolean;
  answeredCount: number;
  missingDimensions: FinDimensionId[];
  message: string | null;
}

export interface AnswerValidationIssue {
  questionId: string;
  message: string;
}

const MIN_TOTAL_ANSWERS = 12;
const MIN_DIMENSION_ANSWERS = 2;
const GRADE_THRESHOLD = 65;

/** 财商等级：沿五本书路径拾级而上，第一个未达标的维度决定当前等级 */
const FIN_GRADES: readonly FinGrade[] = [
  {
    index: 1,
    name: "Lv.1 认识钱",
    dimension: "money",
    statement: "我需要先知道，我的钱去了哪里。",
  },
  {
    index: 2,
    name: "Lv.2 理解资产",
    dimension: "asset",
    statement: "我需要让赚到的钱，开始变成资产。",
  },
  {
    index: 3,
    name: "Lv.3 理解财富观",
    dimension: "values",
    statement: "我需要想清楚，我为什么赚钱、什么叫足够。",
  },
  {
    index: 4,
    name: "Lv.4 理解人性",
    dimension: "psychology",
    statement: "我需要看清自己的贪婪与恐惧。",
  },
  {
    index: 5,
    name: "Lv.5 长期复利",
    dimension: "compound",
    statement: "我需要把时间，变成我最大的资产。",
  },
  {
    index: 6,
    name: "Lv.6 判断系统",
    dimension: "judgment",
    statement: "我开始建立，属于自己的判断系统。",
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

function isAnswered(question: FinQuestion, answer?: FinAnswer) {
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
  answer?: FinAnswer,
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

function getFinLevel(score: number): FinLevel {
  if (score >= 80) return "成熟";
  if (score >= 60) return "稳健";
  if (score >= 40) return "成长";
  return "起步";
}

function getConfidence(completionRate: number): AssessmentConfidence {
  if (completionRate >= 0.9) return "较为充分";
  if (completionRate >= 0.7) return "基本可信";
  return "参考有限";
}

function scoreDimensions(answers: FinAnswers): FinDimensionScore[] {
  return FIN_DIMENSION_ORDER.map((dimensionId) => {
    const questions = FIN_QUESTIONS.filter(
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
    const definition = FIN_DIMENSIONS[dimensionId];

    return {
      id: dimensionId,
      name: definition.name,
      role: definition.role,
      metric: definition.metric,
      score,
      answered: scores.length,
      total: questions.length,
      level: getFinLevel(score),
      description: definition.description,
    };
  });
}

function getGrade(dimensions: FinDimensionScore[]): FinGrade {
  for (const grade of FIN_GRADES) {
    const score = dimensions.find(
      (dimension) => dimension.id === grade.dimension,
    );

    if (score && score.score < GRADE_THRESHOLD) {
      return grade;
    }
  }

  return FIN_GRADES[FIN_GRADES.length - 1];
}

export function validateFinAnswers(
  answers: FinAnswers,
): AnswerValidationIssue[] {
  const issues: AnswerValidationIssue[] = [];

  for (const questionId of Object.keys(answers)) {
    if (!getFinQuestion(questionId)) {
      issues.push({ questionId, message: "包含未知题目。" });
    }
  }

  for (const question of FIN_QUESTIONS) {
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

export function getFinAssessmentReadiness(
  answers: FinAnswers,
): FinAssessmentReadiness {
  const answeredByDimension = new Map<FinDimensionId, number>(
    FIN_DIMENSION_ORDER.map((dimension) => [dimension, 0]),
  );
  let answeredCount = 0;

  for (const question of FIN_QUESTIONS) {
    if (question.type !== "single") continue;
    if (scoreSingleAnswer(question, answers[question.id]) === null) continue;

    answeredCount += 1;
    answeredByDimension.set(
      question.dimension,
      (answeredByDimension.get(question.dimension) ?? 0) + 1,
    );
  }

  const missingDimensions = FIN_DIMENSION_ORDER.filter(
    (dimension) =>
      (answeredByDimension.get(dimension) ?? 0) < MIN_DIMENSION_ANSWERS,
  );
  const ready =
    answeredCount >= MIN_TOTAL_ANSWERS && missingDimensions.length === 0;

  let message: string | null = null;
  if (missingDimensions.length > 0) {
    const names = missingDimensions
      .map((dimension) => FIN_DIMENSIONS[dimension].name)
      .join("、");
    message = `为了让结果具有基本参考性，请在${names}中至少各回答2题。`;
  } else if (answeredCount < MIN_TOTAL_ANSWERS) {
    message = `还需回答至少${MIN_TOTAL_ANSWERS - answeredCount}道计分题，才能生成基本可信的结果。`;
  }

  return { ready, answeredCount, missingDimensions, message };
}

export function createFinAssessment(answers: FinAnswers): FinAssessment {
  const issues = validateFinAnswers(answers);
  if (issues.length > 0) {
    throw new Error(issues[0].message);
  }

  const readiness = getFinAssessmentReadiness(answers);
  if (!readiness.ready) {
    throw new Error(readiness.message ?? "有效答案不足。");
  }

  const dimensions = scoreDimensions(answers);
  const rankedDimensions = [...dimensions].sort((first, second) => {
    if (first.score === second.score) {
      return (
        FIN_DIMENSION_ORDER.indexOf(first.id) -
        FIN_DIMENSION_ORDER.indexOf(second.id)
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
  const concernQuestion = FIN_QUESTIONS.find(
    (question) => question.id === "f25" && question.type === "multi",
  );
  const concernSelections = concernQuestion
    ? (answers.f25?.selections ?? [])
        .filter((index) =>
          isIntegerInRange(index, concernQuestion.options.length),
        )
        .map((index) => concernQuestion.options[index])
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
    grade: getGrade(dimensions),
    concernSelections,
  };
}
