import { afterEach, describe, expect, it, vi } from "vitest";
import { createFinAssessment } from "../../lib/domain/fin-assessment";
import { FIN_QUESTIONS } from "../../lib/domain/fin-questions";
import { getFinInterpreter } from "../../lib/infrastructure/fin-llm";

function buildAssessment() {
  const answers = Object.fromEntries(
    FIN_QUESTIONS.map((question) => {
      if (question.type === "multi") {
        return [question.id, { selections: [0, 2] }];
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

  return createFinAssessment(answers);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("fin LLM adapter", () => {
  it("stays disabled when server credentials are incomplete", () => {
    vi.stubEnv("LLM_API_KEY", "");
    vi.stubEnv("LLM_BASE_URL", "");
    vi.stubEnv("LLM_MODEL", "");

    expect(getFinInterpreter()).toBeUndefined();
  });

  it("sends only the structured assessment to an OpenAI-compatible API", async () => {
    vi.stubEnv("LLM_API_KEY", "server-only-secret");
    vi.stubEnv("LLM_BASE_URL", "https://model.example/v1");
    vi.stubEnv("LLM_MODEL", "fin-model");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  summary:
                    "你的六维财商结构较为均衡，认识钱与长期复利已经形成了可以观察的稳定习惯。",
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

    const interpreter = getFinInterpreter();
    const result = await interpreter?.(buildAssessment());

    expect(result?.actions).toHaveLength(3);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://model.example/v1/chat/completions");
    expect(options.headers).toMatchObject({
      Authorization: "Bearer server-only-secret",
    });
    expect(String(options.body)).not.toContain("followUpChoice");
    expect(String(options.body)).not.toContain('"answers"');
  });

  it("falls back to the backup provider when the primary fails", async () => {
    vi.stubEnv("LLM_API_KEY", "primary-secret");
    vi.stubEnv("LLM_BASE_URL", "https://primary.example/v1");
    vi.stubEnv("LLM_MODEL", "primary-model");
    vi.stubEnv("LLM_BACKUP_API_KEY", "backup-secret");
    vi.stubEnv("LLM_BACKUP_BASE_URL", "https://backup.example/v1");
    vi.stubEnv("LLM_BACKUP_MODEL", "backup-model");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("primary down", { status: 503 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary:
                      "你的六维财商结构较为均衡，认识钱与长期复利已经形成了可以观察的稳定习惯。",
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

    const interpreter = getFinInterpreter();
    const result = await interpreter?.(buildAssessment());

    expect(result?.actions).toHaveLength(3);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [backupUrl, backupOptions] = fetchMock.mock.calls[1] as [
      string,
      RequestInit,
    ];
    expect(backupUrl).toBe("https://backup.example/v1/chat/completions");
    expect(backupOptions.headers).toMatchObject({
      Authorization: "Bearer backup-secret",
    });
    expect(String(backupOptions.body)).toContain("backup-model");
  });

  it("throws when every provider fails", async () => {
    vi.stubEnv("LLM_API_KEY", "primary-secret");
    vi.stubEnv("LLM_BASE_URL", "https://primary.example/v1");
    vi.stubEnv("LLM_MODEL", "primary-model");
    vi.stubEnv("LLM_BACKUP_API_KEY", "backup-secret");
    vi.stubEnv("LLM_BACKUP_BASE_URL", "https://backup.example/v1");
    vi.stubEnv("LLM_BACKUP_MODEL", "backup-model");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("down", { status: 503 })),
    );

    const interpreter = getFinInterpreter();

    await expect(interpreter?.(buildAssessment())).rejects.toThrow();
  });
});
