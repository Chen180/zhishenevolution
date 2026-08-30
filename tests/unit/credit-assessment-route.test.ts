import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../app/api/credit-assessment/route";
import type { CreditAnswers } from "../../lib/domain/credit-assessment";
import { CREDIT_QUESTIONS } from "../../lib/domain/credit-questions";

function buildCompleteAnswers(): CreditAnswers {
  return Object.fromEntries(
    CREDIT_QUESTIONS.map((question) => {
      if (question.type === "multi") {
        return [question.id, { selections: [0] }];
      }

      return [
        question.id,
        {
          choice:
            question.scoreDirection === "descending"
              ? 0
              : question.options.length - 1,
          ...(question.followUp
            ? { followUpChoice: question.followUp.options.length - 1 }
            : {}),
        },
      ];
    }),
  );
}

function createRequest(answers: CreditAnswers) {
  return new Request("http://localhost/api/credit-assessment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.25",
    },
    body: JSON.stringify({ answers }),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("credit assessment route", () => {
  it("falls back to rules after the per-client AI quota is exhausted", async () => {
    vi.stubEnv("LLM_API_KEY", "server-only-secret");
    vi.stubEnv("LLM_BASE_URL", "https://model.example/v1");
    vi.stubEnv("LLM_MODEL", "credit-model");
    vi.stubEnv("LLM_RATE_LIMIT_MAX", "1");
    vi.stubEnv("LLM_RATE_LIMIT_WINDOW_MS", "600000");

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  summary:
                    "你的六维结构整体稳定，长期积累与价值延续已经形成了清晰、可持续观察的证据。",
                  focus:
                    "当前可以继续巩固标签信用，让已有能力、代表成果和专业方向被外界更准确地识别与复用。",
                  actions: [
                    "整理一个代表成果",
                    "明确一句专业介绍",
                    "收集三条真实反馈",
                  ],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const answers = buildCompleteAnswers();
    const firstResponse = await POST(createRequest(answers));
    const secondResponse = await POST(createRequest(answers));
    const firstPayload = await firstResponse.json();
    const secondPayload = await secondResponse.json();

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(firstPayload.data.interpretation.source).toBe("ai");
    expect(secondPayload.data.interpretation.source).toBe("rule");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
