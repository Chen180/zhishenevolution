import { afterEach, describe, expect, it, vi } from "vitest";
import { createCreditAssessment } from "../../lib/domain/credit-assessment";
import { CREDIT_QUESTIONS } from "../../lib/domain/credit-questions";
import { getCreditInterpreter } from "../../lib/infrastructure/credit-llm";

function buildAssessment() {
  const answers = Object.fromEntries(
    CREDIT_QUESTIONS.map((question) => {
      if (question.type === "multi") {
        return [question.id, { selections: [0, 2] }];
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

  return createCreditAssessment(answers);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("credit LLM adapter", () => {
  it("stays disabled when server credentials are incomplete", () => {
    vi.stubEnv("LLM_API_KEY", "");
    vi.stubEnv("LLM_BASE_URL", "");
    vi.stubEnv("LLM_MODEL", "");

    expect(getCreditInterpreter()).toBeUndefined();
  });

  it("sends only the structured assessment to an OpenAI-compatible API", async () => {
    vi.stubEnv("LLM_API_KEY", "server-only-secret");
    vi.stubEnv("LLM_BASE_URL", "https://model.example/v1");
    vi.stubEnv("LLM_MODEL", "credit-model");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  summary:
                    "你的六维结构较为均衡，长期积累和价值延续已经形成了可以观察的稳定证据。",
                  focus:
                    "当前可继续巩固标签信用，把已经形成的能力和成果整理成外界容易理解、可以验证的表达。",
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

    const interpreter = getCreditInterpreter();
    const result = await interpreter?.(buildAssessment());

    expect(result?.actions).toHaveLength(3);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://model.example/v1/chat/completions");
    expect(options.headers).toMatchObject({
      Authorization: "Bearer server-only-secret",
    });
    expect(String(options.body)).not.toContain("我希望未来留下的是");
  });
});
