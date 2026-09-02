"use client";

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TreePine,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CreditAssessmentReport } from "@/lib/application/assess-credit";
import {
  getAssessmentReadiness,
  type CreditAnswer,
  type CreditAnswers,
} from "@/lib/domain/credit-assessment";
import {
  CREDIT_DIMENSIONS,
  CREDIT_DIMENSION_ORDER,
  CREDIT_QUESTIONS,
  type CreditQuestion,
  type SingleChoiceQuestion,
} from "@/lib/domain/credit-questions";
import { CreditTree } from "./CreditTree";
import styles from "./CreditTest.module.css";

type Phase = "intro" | "guide" | "quiz" | "generating" | "result";

interface StoredProgress {
  answers: CreditAnswers;
  currentIndex: number;
  legacyNote: string;
}

type ApiResponse =
  | {
      success: true;
      data: CreditAssessmentReport;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

const STORAGE_KEY = "six-credit-assessment-v1";
const generatingMessages = [
  "正在整理你的时间轨迹……",
  "正在观察你的环境适应……",
  "正在分析你的价值选择……",
  "正在连接你的社会关系……",
  "正在寻找你已经留下的果实……",
] as const;

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

    return {
      answers: value.answers,
      currentIndex: Math.min(
        Math.max(0, value.currentIndex),
        CREDIT_QUESTIONS.length - 1,
      ),
      legacyNote:
        typeof value.legacyNote === "string"
          ? value.legacyNote.slice(0, 160)
          : "",
    };
  } catch {
    return null;
  }
}

function isQuestionComplete(
  question: CreditQuestion,
  answer?: CreditAnswer,
) {
  if (answer?.skipped) return true;
  if (question.type === "multi") return true;
  if (typeof answer?.choice !== "number") return false;

  return !(
    question.followUp &&
    answer.choice >= question.followUp.triggerFromIndex &&
    typeof answer.followUpChoice !== "number"
  );
}

function getAnsweredQuestionCount(answers: CreditAnswers) {
  return CREDIT_QUESTIONS.filter((question) => {
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
        <p className={styles.eyebrow}>信用生命树测评 · V0.1</p>
        <h1 id="assessment-title">
          如果有一天，失去现在的职位、学历和平台，你还剩下什么？
        </h1>
        <p className={styles.introLead}>
          用5～7分钟，看见你的六维信用生命树。
        </p>
        <p className={styles.introText}>
          当外在标签发生变化，你身上还有什么东西，依然值得别人相信？这次测评从标签、时间、环境、人格、社会和文明六个维度，帮助你观察过去走过的路正在长成一棵什么样的树。
        </p>
        <button type="button" className={styles.primaryButton} onClick={onStart}>
          {hasProgress ? "继续上次测评" : "开始测评"}
          <ArrowRight aria-hidden="true" size={18} />
        </button>
        <div className={styles.introMeta}>
          <span>
            <Clock3 aria-hidden="true" size={15} />
            约5～7分钟
          </span>
          <span>
            <ShieldCheck aria-hidden="true" size={15} />
            不要求敏感个人信息
          </span>
        </div>
      </div>

      <div className={styles.introVisual} aria-hidden="true">
        <TreePine size={112} strokeWidth={1.2} />
        <div>
          <strong>36</strong>
          <span>道观察题</span>
        </div>
        <div>
          <strong>6</strong>
          <span>个信用维度</span>
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
          <strong>我们更关心你的真实人生，而不是一个漂亮的答案。</strong>
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
  answer?: CreditAnswer;
  onChange: (answer: CreditAnswer) => void;
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
  legacyNote,
  onAnswer,
  onLegacyNote,
  onPrevious,
  onNext,
  onSkip,
}: {
  question: CreditQuestion;
  answer?: CreditAnswer;
  currentIndex: number;
  error: string | null;
  legacyNote: string;
  onAnswer: (answer: CreditAnswer) => void;
  onLegacyNote: (note: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const dimension = CREDIT_DIMENSIONS[question.dimension];
  const isLast = currentIndex === CREDIT_QUESTIONS.length - 1;
  const progress = ((currentIndex + 1) / CREDIT_QUESTIONS.length) * 100;

  return (
    <section className={styles.quiz} aria-labelledby="question-title">
      <div className={styles.quizHeader}>
        <div>
          <span className={styles.dimensionDot} style={{ background: dimension.color }} />
          信用生命树 · {dimension.name}
        </div>
        <strong>
          {String(currentIndex + 1).padStart(2, "0")} / 36
        </strong>
      </div>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="测评进度"
        aria-valuemin={1}
        aria-valuemax={36}
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
          <>
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
            <label className={styles.noteField}>
              <span>如果愿意，可以用一句话补充</span>
              <textarea
                value={legacyNote}
                maxLength={160}
                rows={3}
                placeholder="我希望未来留下的是……"
                onChange={(event) => onLegacyNote(event.target.value)}
              />
              <small>
                可选，不影响测评结果；这段文字只保存在当前浏览器，不会提交给大模型。
              </small>
            </label>
          </>
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
          {isLast ? "生成信用树" : "下一题"}
          {isLast ? (
            <TreePine aria-hidden="true" size={18} />
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
      <h1>你的信用生命树正在生长……</h1>
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
  report: CreditAssessmentReport;
  onRestart: () => void;
}) {
  const { assessment, interpretation } = report;
  const focusDefinition = CREDIT_DIMENSIONS[assessment.focusDimension.id];

  return (
    <main className={styles.result}>
      {/* 打印专用：整页斜向平铺水印，屏幕上不显示 */}
      <div className={styles.printWatermarkLayer} aria-hidden="true">
        {Array.from({ length: 15 }, (_, index) => (
          <span key={index}>智神进化纪 · 何明轩</span>
        ))}
      </div>
      <p className={styles.printBrand}>
        智神进化纪 · 何明轩 · 六维信用生命树测评报告
      </p>
      <header className={styles.resultHeader}>
        <div>
          <p className={styles.eyebrow}>你的信用生命树</p>
          <h1>不是评价你，而是看见你。</h1>
          <p>
            本次共纳入 {assessment.answeredCount} 道计分题，结果依据为
            “{assessment.confidence}”。
          </p>
        </div>
        <div className={styles.overallScore}>
          <strong>{assessment.overallScore}</strong>
          <span>六维均衡值</span>
        </div>
      </header>

      <section className={styles.treeSection} aria-labelledby="tree-heading">
        <div>
          <p className={styles.sectionLabel}>01 · 结构画像</p>
          <h2 id="tree-heading">你的树，已经长出自己的轮廓</h2>
          <p className={styles.sectionIntro}>
            图形由六个维度共同生成。它展示的是当前结构，不是一个固定的人生结论。
          </p>
          <CreditTree dimensions={assessment.dimensions} />
        </div>
        <div className={styles.dimensionList}>
          {CREDIT_DIMENSION_ORDER.map((dimensionId) => {
            const dimension = assessment.dimensions.find(
              (item) => item.id === dimensionId,
            );
            if (!dimension) return null;

            return (
              <article className={styles.dimensionRow} key={dimension.id}>
                <span
                  className={styles.dimensionBar}
                  style={{
                    background: CREDIT_DIMENSIONS[dimension.id].color,
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
            <h2>你的信用结构</h2>
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
        <div className={styles.stagePanel}>
          <p className={styles.sectionLabel}>03 · 当前阶段</p>
          <span className={styles.stageNumber}>
            {String(assessment.stage.index).padStart(2, "0")}
          </span>
          <h2>{assessment.stage.name}</h2>
          <p>{assessment.stage.statement}</p>
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

      {assessment.legacySelections.length > 0 ? (
        <section className={styles.legacyBand}>
          <span>你希望留下</span>
          <p>{assessment.legacySelections.join(" · ")}</p>
        </section>
      ) : null}

      <footer className={styles.resultFooter}>
        <p>
          这是一项自我观察工具，不属于社会征信，也不构成心理、医疗、法律或职业诊断。
        </p>
        <p className={styles.printWatermark}>
          智神进化纪 zhishenevo.com ｜ 何明轩 · 保留所有权利
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
            重新测评
          </button>
        </div>
      </footer>
    </main>
  );
}

export function CreditTest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<CreditAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [legacyNote, setLegacyNote] = useState("");
  const [report, setReport] = useState<CreditAssessmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readStoredProgress();
      if (stored) {
        setAnswers(stored.answers);
        setCurrentIndex(stored.currentIndex);
        setLegacyNote(stored.legacyNote);
      }
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageReady || phase === "result") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, currentIndex, legacyNote }),
    );
  }, [answers, currentIndex, legacyNote, phase, storageReady]);

  useEffect(() => {
    if (phase !== "generating") return;

    const timer = window.setInterval(() => {
      setGeneratingStep((step) =>
        Math.min(step + 1, generatingMessages.length - 1),
      );
    }, 720);

    return () => window.clearInterval(timer);
  }, [phase]);

  const currentQuestion = CREDIT_QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const hasProgress = useMemo(
    () => getAnsweredQuestionCount(answers) > 0,
    [answers],
  );

  function startQuiz() {
    setError(null);
    setPhase(hasProgress ? "quiz" : "guide");
  }

  function updateAnswer(answer: CreditAnswer) {
    setError(null);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: answer,
    }));
  }

  function moveToQuestion(index: number) {
    setError(null);
    setCurrentIndex(Math.min(Math.max(index, 0), CREDIT_QUESTIONS.length - 1));
  }

  async function submitAssessment(nextAnswers = answers) {
    const readiness = getAssessmentReadiness(nextAnswers);
    if (!readiness.ready) {
      setError(readiness.message);
      const firstMissing = CREDIT_QUESTIONS.findIndex(
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
      const response = await fetch("/api/credit-assessment", {
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
      window.localStorage.removeItem(STORAGE_KEY);
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

    if (currentIndex === CREDIT_QUESTIONS.length - 1) {
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

    if (currentIndex === CREDIT_QUESTIONS.length - 1) {
      void submitAssessment(nextAnswers);
      return;
    }

    moveToQuestion(currentIndex + 1);
  }

  function restart() {
    window.localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentIndex(0);
    setLegacyNote("");
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
          legacyNote={legacyNote}
          onAnswer={updateAnswer}
          onLegacyNote={setLegacyNote}
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
