"use client";

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  LoaderCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FinAssessmentReport } from "@/lib/application/assess-fin";
import {
  getFinAssessmentReadiness,
  type FinAnswer,
  type FinAnswers,
} from "@/lib/domain/fin-assessment";
import {
  FIN_DIMENSIONS,
  FIN_DIMENSION_ORDER,
  FIN_QUESTIONS,
  type FinQuestion,
  type SingleChoiceQuestion,
} from "@/lib/domain/fin-questions";
import { FinResultShare } from "./FinResultShare";
import styles from "./FinTest.module.css";

type Phase = "intro" | "guide" | "quiz" | "generating" | "result";

interface StoredProgress {
  answers: FinAnswers;
  currentIndex: number;
  phase?: "guide" | "quiz" | "result";
  report?: FinAssessmentReport;
}

type ApiResponse =
  | {
      success: true;
      data: FinAssessmentReport;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

const STORAGE_KEY = "fin-assessment-v1";
const WECHAT_ID = "IAMCAT156";
const generatingMessages = [
  "正在查看你认识钱的方式……",
  "正在观察你的资产结构……",
  "正在理解你的财富观……",
  "正在照见你的金钱心理……",
  "正在丈量你的长期复利……",
] as const;

function isStoredReport(value: unknown): value is FinAssessmentReport {
  if (!value || typeof value !== "object") return false;
  const report = value as Partial<FinAssessmentReport>;
  return Boolean(report.assessment && report.interpretation);
}

function readStoredProgress(): StoredProgress | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const value = JSON.parse(raw) as Partial<StoredProgress>;
    if (
      !value.answers ||
      typeof value.answers !== "object" ||
      typeof value.currentIndex !== "number"
    ) {
      return null;
    }

    const phase =
      value.phase === "guide" ||
      value.phase === "quiz" ||
      value.phase === "result"
        ? value.phase
        : undefined;
    const report = isStoredReport(value.report) ? value.report : undefined;

    return {
      answers: value.answers,
      currentIndex: Math.min(
        Math.max(0, value.currentIndex),
        FIN_QUESTIONS.length - 1,
      ),
      phase: phase === "result" && !report ? undefined : phase,
      report,
    };
  } catch {
    return null;
  }
}

function isQuestionComplete(question: FinQuestion, answer?: FinAnswer) {
  if (answer?.skipped) return true;
  if (question.type === "multi") return true;
  if (typeof answer?.choice !== "number") return false;

  return !(
    question.followUp &&
    answer.choice >= question.followUp.triggerFromIndex &&
    typeof answer.followUpChoice !== "number"
  );
}

function getAnsweredQuestionCount(answers: FinAnswers) {
  return FIN_QUESTIONS.filter((question) => {
    const answer = answers[question.id];
    return answer && !answer.skipped && isQuestionComplete(question, answer);
  }).length;
}

function OptionButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.optionIndicator}>
        {selected ? <Check aria-hidden="true" size={16} /> : null}
      </span>
      <span>{label}</span>
    </button>
  );
}

function CopyWeChatButton() {
  const [copied, setCopied] = useState(false);

  async function copyWeChatId() {
    await navigator.clipboard.writeText(WECHAT_ID);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className={styles.primaryButton}
      onClick={() => void copyWeChatId()}
    >
      {copied ? (
        <Check aria-hidden="true" size={17} />
      ) : (
        <Copy aria-hidden="true" size={17} />
      )}
      {copied ? "微信号已复制" : "复制微信号，备注「财商」"}
    </button>
  );
}

function Intro({
  hasProgress,
  onStart,
}: {
  hasProgress: boolean;
  onStart: () => void;
}) {
  return (
    <section className={styles.intro} aria-labelledby="assessment-title">
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>财商等级测试 · V0.1</p>
        <h1 id="assessment-title">你面对钱时的判断力，到了哪一级？</h1>
        <p className={styles.introLead}>
          不是投资测试：不荐股、不推项目，只帮你看见自己面对钱时的判断力。
        </p>
        <p className={styles.introText}>
          25 道题，从认识钱、理解资产、财富观、金钱心理、长期复利到自己的判断系统，六个维度帮你定位当前的财商等级，并给出下一阶段最值得读的一本书和最该做的三件事。
        </p>
        <button type="button" className={styles.primaryButton} onClick={onStart}>
          {hasProgress ? "继续上次测试" : "开始测试"}
          <ArrowRight aria-hidden="true" size={18} />
        </button>
        <div className={styles.introMeta}>
          <span>
            <Clock3 aria-hidden="true" size={15} />
            约4～6分钟
          </span>
          <span>
            <ShieldCheck aria-hidden="true" size={15} />
            不要求敏感个人信息
          </span>
        </div>
      </div>

      <div className={styles.introVisual} aria-hidden="true">
        <TrendingUp size={112} strokeWidth={1.2} />
        <div>
          <strong>25</strong>
          <span>道观察题</span>
        </div>
        <div>
          <strong>6</strong>
          <span>个财商维度</span>
        </div>
      </div>
    </section>
  );
}

function Guide({ onReady }: { onReady: () => void }) {
  return (
    <section className={styles.guide} aria-labelledby="guide-title">
      <div className={styles.guideIndex}>开始前</div>
      <div>
        <p className={styles.eyebrow}>先记住一件事</p>
        <h1 id="guide-title">这不是一道考试。</h1>
        <div className={styles.guideText}>
          <p>没有标准答案，也没有“优秀答案”。</p>
          <p>
            请尽量根据过去真实发生过的事情回答，而不是根据“我希望自己是什么样的人”。
          </p>
          <p>如果某道题你不愿回答，可以跳过。</p>
          <strong>我们更关心你的真实习惯，而不是一个漂亮的答案。</strong>
        </div>
        <button type="button" className={styles.primaryButton} onClick={onReady}>
          我准备好了
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}

function SingleQuestion({
  question,
  answer,
  onChange,
}: {
  question: SingleChoiceQuestion;
  answer?: FinAnswer;
  onChange: (answer: FinAnswer) => void;
}) {
  const showFollowUp =
    question.followUp &&
    typeof answer?.choice === "number" &&
    answer.choice >= question.followUp.triggerFromIndex;

  return (
    <>
      <div className={styles.options} role="group" aria-label="请选择一项">
        {question.options.map((option, index) => (
          <OptionButton
            key={option}
            label={option}
            selected={!answer?.skipped && answer?.choice === index}
            onClick={() =>
              onChange({
                choice: index,
                ...(question.followUp &&
                index >= question.followUp.triggerFromIndex
                  ? { followUpChoice: answer?.followUpChoice }
                  : {}),
              })
            }
          />
        ))}
      </div>

      {showFollowUp ? (
        <div className={styles.followUp}>
          <h3>{question.followUp?.prompt}</h3>
          <div className={styles.options} role="group" aria-label="后续选择">
            {question.followUp?.options.map((option, index) => (
              <OptionButton
                key={option}
                label={option}
                selected={answer?.followUpChoice === index}
                onClick={() =>
                  onChange({
                    choice: answer?.choice,
                    followUpChoice: index,
                  })
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function QuestionView({
  question,
  answer,
  currentIndex,
  error,
  onAnswer,
  onPrevious,
  onNext,
  onSkip,
}: {
  question: FinQuestion;
  answer?: FinAnswer;
  currentIndex: number;
  error: string | null;
  onAnswer: (answer: FinAnswer) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const dimension = FIN_DIMENSIONS[question.dimension];
  const isLast = currentIndex === FIN_QUESTIONS.length - 1;
  const progress = ((currentIndex + 1) / FIN_QUESTIONS.length) * 100;

  return (
    <section className={styles.quiz} aria-labelledby="question-title">
      <div className={styles.quizHeader}>
        <div>
          <span className={styles.dimensionDot} style={{ background: dimension.color }} />
          财商等级测试 · {dimension.name}
        </div>
        <strong>
          {String(currentIndex + 1).padStart(2, "0")} / 25
        </strong>
      </div>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="测试进度"
        aria-valuemin={1}
        aria-valuemax={25}
        aria-valuenow={currentIndex + 1}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.questionBody}>
        <p className={styles.questionNumber}>问题 {question.number}</p>
        <h1 id="question-title">{question.prompt}</h1>
        <p className={styles.questionHint}>
          {question.helper ?? "请选择最符合你实际情况的一项。"}
        </p>

        {question.type === "single" ? (
          <SingleQuestion
            question={question}
            answer={answer}
            onChange={onAnswer}
          />
        ) : (
          <div className={styles.options} role="group" aria-label="可多选">
            {question.options.map((option, index) => {
              const selections = answer?.selections ?? [];
              const selected = selections.includes(index);
              return (
                <OptionButton
                  key={option}
                  label={option}
                  selected={selected}
                  onClick={() =>
                    onAnswer({
                      selections: selected
                        ? selections.filter((value) => value !== index)
                        : [...selections, index],
                    })
                  }
                />
              );
            })}
          </div>
        )}

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className={styles.quizActions}>
        <button
          type="button"
          className={styles.iconTextButton}
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft aria-hidden="true" size={18} />
          上一题
        </button>
        <button type="button" className={styles.skipButton} onClick={onSkip}>
          跳过
        </button>
        <button type="button" className={styles.primaryButton} onClick={onNext}>
          {isLast ? "生成财商等级" : "下一题"}
          {isLast ? (
            <TrendingUp aria-hidden="true" size={18} />
          ) : (
            <ChevronRight aria-hidden="true" size={18} />
          )}
        </button>
      </div>
    </section>
  );
}

function Generating({ step }: { step: number }) {
  return (
    <section className={styles.generating} aria-live="polite">
      <LoaderCircle
        className={styles.spinner}
        aria-hidden="true"
        size={44}
      />
      <p className={styles.eyebrow}>正在生成</p>
      <h1>你的财商画像正在成形……</h1>
      <p>{generatingMessages[step]}</p>
      <div className={styles.generatingSteps} aria-hidden="true">
        {generatingMessages.map((message, index) => (
          <span
            key={message}
            className={index <= step ? styles.generatingStepActive : ""}
          />
        ))}
      </div>
    </section>
  );
}

function ResultView({
  report,
  onRestart,
}: {
  report: FinAssessmentReport;
  onRestart: () => void;
}) {
  const { assessment, interpretation } = report;
  const focusDefinition = FIN_DIMENSIONS[assessment.focusDimension.id];

  return (
    <main className={styles.result}>
      {/* 打印专用：整页斜向平铺水印，屏幕上不显示 */}
      <div className={styles.printWatermarkLayer} aria-hidden="true">
        {Array.from({ length: 15 }, (_, index) => (
          <span key={index}>智神进化纪 · 何明轩</span>
        ))}
      </div>
      <p className={styles.printBrand}>
        智神进化纪 · 何明轩 · 财商等级测试报告
      </p>
      <header className={styles.resultHeader}>
        <div>
          <p className={styles.eyebrow}>你的财商等级</p>
          <h1>{assessment.grade.name}</h1>
          <p>
            {assessment.grade.statement} 本次共纳入 {assessment.answeredCount}{" "}
            道计分题，结果依据为“{assessment.confidence}”。
          </p>
        </div>
        <div className={styles.overallScore}>
          <strong>{assessment.overallScore}</strong>
          <span>六维均衡值</span>
        </div>
      </header>

      <section className={styles.dimensionSection} aria-labelledby="dimensions-heading">
        <p className={styles.sectionLabel}>01 · 六维画像</p>
        <h2 id="dimensions-heading">六个维度，看见你面对钱的方式</h2>
        <p className={styles.sectionIntro}>
          分数展示的是当前习惯的结构，不是能力评价，也不是一个固定结论。
        </p>
        <div className={styles.dimensionList}>
          {FIN_DIMENSION_ORDER.map((dimensionId) => {
            const dimension = assessment.dimensions.find(
              (item) => item.id === dimensionId,
            );
            if (!dimension) return null;

            return (
              <article className={styles.dimensionRow} key={dimension.id}>
                <span
                  className={styles.dimensionBar}
                  style={{
                    background: FIN_DIMENSIONS[dimension.id].color,
                    width: `${dimension.score}%`,
                  }}
                />
                <div>
                  <span>
                    {dimension.role} · {dimension.metric}
                  </span>
                  <h3>{dimension.name}</h3>
                </div>
                <strong>{dimension.score}</strong>
                <small>{dimension.level}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.interpretationSection}>
        <div className={styles.interpretationHeading}>
          <div>
            <p className={styles.sectionLabel}>02 · 初步判断</p>
            <h2>你的财商结构</h2>
          </div>
          <span className={styles.sourceBadge}>
            <Sparkles aria-hidden="true" size={15} />
            {interpretation.source === "ai" ? "大模型辅助解读" : "规则初步解读"}
          </span>
        </div>
        <p className={styles.summaryText}>{interpretation.summary}</p>
        <div
          className={styles.focusBand}
          style={{ borderLeftColor: focusDefinition.color }}
        >
          <span>
            {assessment.focusDimension.score >= 75 ? "持续巩固" : "优先加强"}
          </span>
          <h3>{assessment.focusDimension.name}</h3>
          <p>{interpretation.focus}</p>
        </div>
      </section>

      <section className={styles.nextSection}>
        <div className={styles.gradePanel}>
          <p className={styles.sectionLabel}>03 · 当前等级</p>
          <span className={styles.gradeNumber}>
            {String(assessment.grade.index).padStart(2, "0")}
          </span>
          <h2>{assessment.grade.name}</h2>
          <p>{assessment.grade.statement}</p>
        </div>
        <div className={styles.actionPanel}>
          <p className={styles.sectionLabel}>04 · 未来30天</p>
          <h2>先做三件具体的事</h2>
          <ol>
            {interpretation.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </div>
      </section>

      {assessment.concernSelections.length > 0 ? (
        <section className={styles.concernBand}>
          <span>你当前最想改善的问题</span>
          <div className={styles.concernTags}>
            {assessment.concernSelections.map((concern) => (
              <span className={styles.concernTag} key={concern}>
                {concern}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.bookSection}>
        <p className={styles.sectionLabel}>05 · 延伸阅读</p>
        <h2>这一级，先读这一本</h2>
        <div
          className={styles.bookCard}
          style={{ borderLeftColor: focusDefinition.color }}
        >
          <span>{assessment.focusDimension.name} · 共读书目</span>
          <h3>《{focusDefinition.book.title}》</h3>
          <em>{focusDefinition.book.author}</em>
          <p>{focusDefinition.book.reason}</p>
        </div>
        <div className={styles.articleLinks}>
          <Link
            href="/articles/20260924_周文强之后，我们还敢谈财商"
            className={styles.articleLink}
          >
            <strong>为什么是这五本书</strong>
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
          <Link
            href="/articles/20260919_我与周文强的梭哈故事"
            className={styles.articleLink}
          >
            <strong>我与周文强的梭哈故事</strong>
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className={styles.wechatCta}>
        <p className={styles.sectionLabel}>06 · 下一步</p>
        <h2>这份结果标出了你的位置，还没写怎么往上走</h2>
        <p>
          加微信 <strong>{WECHAT_ID}</strong>
          ，备注「财商」，发送你的结果截图，领取「{assessment.grade.name}
          」这一级的行动清单——这一级最常见的三个误区，以及未来 30
          天该做的三件具体的事。
        </p>
        <CopyWeChatButton />
        <p className={styles.wechatCtaNote}>
          我们不存储任何测试数据，你的结果只存在你的截图里。
        </p>
      </section>

      <FinResultShare report={report} />

      <footer className={styles.resultFooter}>
        <p>
          本测试不构成任何投资建议，不推荐任何具体产品；它只帮你看见自己面对钱时的判断习惯。
        </p>
        <p className={styles.printWatermark}>
          智神进化纪 zhishenevo.com ｜ 何明轩 · 保留所有权利
        </p>
        <p className={styles.printNote}>
          本报告仅反映本次作答，只代表当前测试结果，仅供参考。
        </p>
        <div>
          <button
            type="button"
            className={styles.iconTextButton}
            onClick={() => window.print()}
          >
            <Printer aria-hidden="true" size={17} />
            打印结果
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onRestart}
          >
            <RotateCcw aria-hidden="true" size={17} />
            重新测试
          </button>
        </div>
      </footer>
    </main>
  );
}

export function FinTest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<FinAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [report, setReport] = useState<FinAssessmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readStoredProgress();
      if (stored) {
        setAnswers(stored.answers);
        setCurrentIndex(stored.currentIndex);
        if (stored.phase === "result" && stored.report) {
          setReport(stored.report);
          setPhase("result");
        } else if (stored.phase === "guide" || stored.phase === "quiz") {
          setPhase(stored.phase);
        }
      }
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageReady || phase === "result") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers,
        currentIndex,
        phase: phase === "generating" ? "quiz" : phase,
      }),
    );
  }, [answers, currentIndex, phase, storageReady]);

  useEffect(() => {
    if (!storageReady || phase !== "result" || !report) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, currentIndex, phase, report }),
    );
  }, [answers, currentIndex, phase, report, storageReady]);

  useEffect(() => {
    if (phase !== "generating") return;

    const timer = window.setInterval(() => {
      setGeneratingStep((step) =>
        Math.min(step + 1, generatingMessages.length - 1),
      );
    }, 720);

    return () => window.clearInterval(timer);
  }, [phase]);

  const currentQuestion = FIN_QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const hasProgress = useMemo(
    () => getAnsweredQuestionCount(answers) > 0,
    [answers],
  );

  function startQuiz() {
    setError(null);
    setPhase(hasProgress ? "quiz" : "guide");
  }

  function updateAnswer(answer: FinAnswer) {
    setError(null);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: answer,
    }));
  }

  function moveToQuestion(index: number) {
    setError(null);
    setCurrentIndex(Math.min(Math.max(index, 0), FIN_QUESTIONS.length - 1));
  }

  async function submitAssessment(nextAnswers = answers) {
    const readiness = getFinAssessmentReadiness(nextAnswers);
    if (!readiness.ready) {
      setError(readiness.message);
      const firstMissing = FIN_QUESTIONS.findIndex(
        (question) =>
          question.type === "single" &&
          (readiness.missingDimensions.includes(question.dimension) ||
            !nextAnswers[question.id] ||
            nextAnswers[question.id].skipped),
      );
      if (firstMissing >= 0) setCurrentIndex(firstMissing);
      return;
    }

    setError(null);
    setGeneratingStep(0);
    setPhase("generating");

    try {
      const requestStartedAt = Date.now();
      const response = await fetch("/api/fin-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const payload = (await response.json()) as ApiResponse;
      const remainingDelay = Math.max(0, 1_100 - (Date.now() - requestStartedAt));
      await new Promise((resolve) => window.setTimeout(resolve, remainingDelay));

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.success ? "暂时无法生成结果。" : payload.error.message,
        );
      }

      setReport(payload.data);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "暂时无法生成结果，请稍后重试。",
      );
      setPhase("quiz");
    }
  }

  function goNext() {
    if (!isQuestionComplete(currentQuestion, currentAnswer)) {
      setError("请选择答案，或使用“跳过”继续。");
      return;
    }

    if (currentIndex === FIN_QUESTIONS.length - 1) {
      void submitAssessment();
      return;
    }

    moveToQuestion(currentIndex + 1);
  }

  function skipQuestion() {
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: { skipped: true },
    };
    setAnswers(nextAnswers);

    if (currentIndex === FIN_QUESTIONS.length - 1) {
      void submitAssessment(nextAnswers);
      return;
    }

    moveToQuestion(currentIndex + 1);
  }

  function restart() {
    window.localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentIndex(0);
    setReport(null);
    setError(null);
    setPhase("guide");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={styles.page}>
      {phase === "intro" ? (
        <Intro hasProgress={hasProgress} onStart={startQuiz} />
      ) : null}
      {phase === "guide" ? (
        <Guide onReady={() => setPhase("quiz")} />
      ) : null}
      {phase === "quiz" ? (
        <QuestionView
          question={currentQuestion}
          answer={currentAnswer}
          currentIndex={currentIndex}
          error={error}
          onAnswer={updateAnswer}
          onPrevious={() => moveToQuestion(currentIndex - 1)}
          onNext={goNext}
          onSkip={skipQuestion}
        />
      ) : null}
      {phase === "generating" ? <Generating step={generatingStep} /> : null}
      {phase === "result" && report ? (
        <ResultView report={report} onRestart={restart} />
      ) : null}
    </div>
  );
}
