import { NextResponse } from "next/server";
import { z } from "zod";
import {
  assessCredit,
  type CreditInterpreter,
} from "@/lib/application/assess-credit";
import {
  getAssessmentReadiness,
  validateCreditAnswers,
} from "@/lib/domain/credit-assessment";
import { getCreditInterpreter } from "@/lib/infrastructure/credit-llm";

export const runtime = "nodejs";

const requestSchema = z
  .object({
    answers: z
      .record(
        z.string().max(8),
        z
          .object({
            choice: z.number().int().min(0).max(20).optional(),
            followUpChoice: z.number().int().min(0).max(20).optional(),
            selections: z
              .array(z.number().int().min(0).max(20))
              .max(12)
              .optional(),
            skipped: z.boolean().optional(),
          })
          .strict(),
      )
      .refine((answers) => Object.keys(answers).length <= 36, {
        message: "答案数量超出范围。",
      }),
  })
  .strict();

const MAX_BODY_BYTES = 16_384;
const quota = new Map<string, { count: number; resetsAt: number }>();

function readPositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "anonymous";
}

function canUseAi(request: Request) {
  const now = Date.now();
  const windowMs = Math.max(
    60_000,
    readPositiveNumber(process.env.LLM_RATE_LIMIT_WINDOW_MS, 600_000),
  );
  const maximum = Math.max(
    1,
    readPositiveNumber(process.env.LLM_RATE_LIMIT_MAX, 5),
  );
  const key = getClientKey(request);
  const current = quota.get(key);

  if (!current || current.resetsAt <= now) {
    quota.set(key, { count: 1, resetsAt: now + windowMs });
    return true;
  }

  if (current.count >= maximum) {
    return false;
  }

  current.count += 1;

  if (quota.size > 1_000) {
    for (const [storedKey, value] of quota) {
      if (value.resetsAt <= now) quota.delete(storedKey);
    }
  }

  return true;
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status },
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse("PAYLOAD_TOO_LARGE", "提交内容超出允许范围。", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_JSON", "提交内容不是有效的 JSON。", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "答案格式不正确。", 400);
  }

  const validationIssues = validateCreditAnswers(parsed.data.answers);
  if (validationIssues.length > 0) {
    return errorResponse(
      "VALIDATION_ERROR",
      validationIssues[0].message,
      400,
    );
  }

  const readiness = getAssessmentReadiness(parsed.data.answers);
  if (!readiness.ready) {
    return errorResponse(
      "INSUFFICIENT_ANSWERS",
      readiness.message ?? "有效答案不足。",
      400,
    );
  }

  try {
    let interpreter: CreditInterpreter | undefined;
    if (canUseAi(request)) {
      try {
        interpreter = getCreditInterpreter();
      } catch {
        interpreter = undefined;
      }
    }
    const report = await assessCredit(parsed.data.answers, interpreter);

    return NextResponse.json(
      { success: true, data: report },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return errorResponse(
      "ASSESSMENT_ERROR",
      "暂时无法生成结果，请稍后重试。",
      500,
    );
  }
}
