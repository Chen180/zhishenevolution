import { z } from "zod";
import type {
  CreditInterpretationContent,
  CreditInterpreter,
} from "../application/assess-credit";
import type { CreditAssessment } from "../domain/credit-assessment";

const llmResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string().min(1),
        }),
      }),
    )
    .min(1),
});

const interpretationSchema = z.object({
  summary: z.string().min(30).max(320),
  focus: z.string().min(30).max(320),
  actions: z.tuple([
    z.string().min(4).max(80),
    z.string().min(4).max(80),
    z.string().min(4).max(80),
  ]),
});

interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
}

function getLlmConfig(): LlmConfig | null {
  const apiKey = process.env.LLM_API_KEY?.trim();
  const baseUrl = process.env.LLM_BASE_URL?.trim();
  const model = process.env.LLM_MODEL?.trim();

  if (!apiKey || !baseUrl || !model) {
    return null;
  }

  const parsedUrl = new URL(baseUrl);
  if (
    parsedUrl.protocol !== "https:" &&
    parsedUrl.hostname !== "localhost" &&
    parsedUrl.hostname !== "127.0.0.1"
  ) {
    throw new Error("LLM_BASE_URL must use HTTPS outside localhost.");
  }

  const configuredTimeout = Number(process.env.LLM_TIMEOUT_MS ?? 12_000);
  const timeoutMs = Number.isFinite(configuredTimeout)
    ? Math.min(Math.max(configuredTimeout, 3_000), 30_000)
    : 12_000;

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    model,
    timeoutMs,
  };
}

function extractJson(content: string) {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1] ?? content;
  const objectStart = candidate.indexOf("{");
  const objectEnd = candidate.lastIndexOf("}");

  if (objectStart === -1 || objectEnd <= objectStart) {
    throw new Error("The language model did not return a JSON object.");
  }

  return JSON.parse(candidate.slice(objectStart, objectEnd + 1)) as unknown;
}

function buildPrompt(assessment: CreditAssessment) {
  const dimensionScores = Object.fromEntries(
    assessment.dimensions.map((dimension) => [
      dimension.name,
      {
        score: dimension.score,
        level: dimension.level,
        evidence: `${dimension.answered}/${dimension.total}`,
      },
    ]),
  );

  return JSON.stringify({
    task:
      "根据六维分数写一份克制、具体、非诊断性的中文初步解读。不得虚构经历，不得把分数写成道德评价。",
    framework:
      "标签让人被看见，时间形成积累，环境验证稳定性，人格构成根系，社会形成连接，文明让价值延续。",
    data: {
      overallScore: assessment.overallScore,
      confidence: assessment.confidence,
      dimensions: dimensionScores,
      strongest: assessment.strongestDimension.name,
      focus: assessment.focusDimension.name,
      secondaryFocus: assessment.secondaryFocusDimension?.name ?? null,
      stage: assessment.stage.name,
      stageStatement: assessment.stage.statement,
      legacySelections: assessment.legacySelections,
    },
    output:
      "只返回JSON对象：summary为100至180字的结构观察；focus为80至160字的优先加强判断；actions为3条每条不超过40字、未来30天可执行的行动。字段必须是summary、focus、actions。",
  });
}

async function requestInterpretation(
  assessment: CreditAssessment,
  config: LlmConfig,
): Promise<CreditInterpretationContent> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content:
            "你是六维信用生命树的辅助解读器。你只能依据给定结构化数据解释，不进行心理、医疗、法律或财务诊断。保持尊重，明确结果是阶段性观察。",
        },
        {
          role: "user",
          content: buildPrompt(assessment),
        },
      ],
    }),
    signal: AbortSignal.timeout(config.timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Language model request failed with ${response.status}.`);
  }

  const responseText = await response.text();
  if (responseText.length > 64_000) {
    throw new Error("Language model response exceeded the size limit.");
  }

  const payload = llmResponseSchema.parse(JSON.parse(responseText) as unknown);
  return interpretationSchema.parse(
    extractJson(payload.choices[0].message.content),
  );
}

export function getCreditInterpreter(): CreditInterpreter | undefined {
  const config = getLlmConfig();
  if (!config) return undefined;

  return (assessment) => requestInterpretation(assessment, config);
}
