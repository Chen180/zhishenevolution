import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../app/api/fin-assessment/route";
import type { FinAnswers } from "../../lib/domain/fin-assessment";
import { FIN_QUESTIONS } from "../../lib/domain/fin-questions";

function buildCompleteAnswers(): FinAnswers {
  return Object.fromEntries(
    FIN_QUESTIONS.map((question) => {
      if (question.type === "multi") {
        return [question.id, { selections: [0] }];
      }

      const choice =
        question.scoreDirection === "descending"
          ? 0
          : question.options.length - 1;

      return [
        question.id,
        {
          choice,
          ...(question.followUp && choice >= question.followUp.triggerFromIndex
            ? { followUpChoice: question.followUp.options.length - 1 }
            : {}),
        },
      ];
    }),
  );
}

function createRequest(body: unknown, clientIp = "203.0.113.40") {
  return new Request("http://localhost/api/fin-assessment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": clientIp,
    },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("fin assessment route", () => {
  it("returns a rule-based report for a valid request without credentials", async () => {
    vi.stubEnv("LLM_API_KEY", "");
    vi.stubEnv("LLM_BASE_URL", "");
    vi.stubEnv("LLM_MODEL", "");

    const response = await POST(
      createRequest({ answers: buildCompleteAnswers() }, "203.0.113.41"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data.assessment.grade.name).toBe("Lv.6 判断系统");
    expect(payload.data.interpretation.source).toBe("rule");
  });

  it("falls back to rules after the per-client AI quota is exhausted", async () => {
    vi.stubEnv("LLM_API_KEY", "server-only-secret");
    vi.stubEnv("LLM_BASE_URL", "https://model.example/v1");
    vi.stubEnv("LLM_MODEL", "fin-model");
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
                    "你的六维财商结构整体稳定，认识钱与长期复利已经形成了清晰、可持续观察的习惯。",
                  focus:
                    "当前可以继续校准判断系统，让每一次重要财务决定都经过自己的三问清单。",
                  actions: [
                    "记录一周每一笔支出",
                    "写下你的三问清单",
                    "复盘一次消费决定",
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
    const firstResponse = await POST(
      createRequest({ answers }, "203.0.113.42"),
    );
    const secondResponse = await POST(
      createRequest({ answers }, "203.0.113.42"),
    );
    const firstPayload = await firstResponse.json();
    const secondPayload = await secondResponse.json();

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(firstPayload.data.interpretation.source).toBe("ai");
    expect(secondPayload.data.interpretation.source).toBe("rule");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejects an invalid payload with 400", async () => {
    const response = await POST(
      createRequest({ answers: { f01: { choice: 99 } } }, "203.0.113.43"),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects incomplete answers with 400", async () => {
    const response = await POST(
      createRequest(
        { answers: { f01: { choice: 2 }, f02: { choice: 2 } } },
        "203.0.113.44",
      ),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("INSUFFICIENT_ANSWERS");
  });
});
