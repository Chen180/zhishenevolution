import { NextResponse } from "next/server";
import { z } from "zod";
import {
  assessFin,
  type FinInterpreter,
} from "@/lib/application/assess-fin";
import {
  getFinAssessmentReadiness,
  validateFinAnswers,
} from "@/lib/domain/fin-assessment";
import { getFinInterpreter } from "@/lib/infrastructure/fin-llm";

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
      .refine((answers) => Object.keys(answers).length <= 25, {
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
  // Caddy 会把真实客户端 IP 追加到 X-Forwarded-For 末尾；
  // 头部前面的值可以被请求方伪造，只能取最后一个。
  const forwarded = request.headers.get("x-forwarded-for");
  const realClient = forwarded?.split(",").pop()?.trim();
  return realClient || "anonymous";
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

  const validationIssues = validateFinAnswers(parsed.data.answers);
  if (validationIssues.length > 0) {
    return errorResponse(
      "VALIDATION_ERROR",
      validationIssues[0].message,
      400,
    );
  }

  const readiness = getFinAssessmentReadiness(parsed.data.answers);
  if (!readiness.ready) {
    return errorResponse(
      "INSUFFICIENT_ANSWERS",
      readiness.message ?? "有效答案不足。",
      400,
    );
  }

  try {
    let interpreter: FinInterpreter | undefined;
    if (canUseAi(request)) {
      try {
        interpreter = getFinInterpreter();
      } catch {
        interpreter = undefined;
      }
    }
    const report = await assessFin(parsed.data.answers, interpreter);

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
