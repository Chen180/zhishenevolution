import { describe, expect, it } from "vitest";
import { filterModelSummaries } from "../../lib/domain/model-filter";
import { listModelSummaries } from "../../lib/domain/thinking-models";

const summaries = listModelSummaries();

describe("listModelSummaries", () => {
  it("returns one summary per model with the expected fields", () => {
    expect(summaries).toHaveLength(100);
    expect(summaries[0]).toEqual({
      id: 1,
      name: "第一性原理",
      nameEn: "First Principles",
      layer: "cognition",
      definition: expect.any(String),
    });
  });
});

describe("filterModelSummaries", () => {
  it("returns all 100 summaries when query is empty and layer is null", () => {
    expect(filterModelSummaries(summaries, "", null)).toHaveLength(100);
    expect(filterModelSummaries(summaries, "   ", null)).toHaveLength(100);
  });

  it("matches by Chinese name", () => {
    const result = filterModelSummaries(summaries, "第一性原理", null);

    // 名称或定义中含「第一性原理」的模型（1 / 41 / 92）都会被命中
    expect(result.map((model) => model.id)).toEqual([1, 41, 92]);
    expect(result[0].name).toBe("第一性原理");
  });

  it("matches English name case-insensitively", () => {
    const lower = filterModelSummaries(summaries, "first principles", null);
    const upper = filterModelSummaries(summaries, "FIRST PRINCIPLES", null);

    expect(lower.map((model) => model.id)).toContain(1);
    expect(upper).toEqual(lower);
  });

  it("matches keywords inside the definition", () => {
    const result = filterModelSummaries(summaries, "不可再分的真理", null);

    expect(result.map((model) => model.id)).toContain(1);
  });

  it("filters by layer", () => {
    const result = filterModelSummaries(summaries, "", "cognition");

    expect(result).toHaveLength(20);
    expect(result.every((model) => model.layer === "cognition")).toBe(true);
    expect(result[0].id).toBe(1);
    expect(result.at(-1)?.id).toBe(20);
  });

  it("applies query and layer together", () => {
    const hit = filterModelSummaries(summaries, "第一性原理", "cognition");
    expect(hit.map((model) => model.id)).toEqual([1]);

    const miss = filterModelSummaries(summaries, "第一性原理", "decision");
    expect(miss).toEqual([]);
  });

  it("fuzzy-matches Chinese names by character order", () => {
    // 「第一原理」不是「第一性原理」的子串，但字符按顺序出现
    const result = filterModelSummaries(summaries, "第一原理", null);

    expect(result.map((model) => model.id)).toContain(1);
  });

  it("fuzzy-matches English names by character order", () => {
    const result = filterModelSummaries(summaries, "fisp", null);

    expect(result.map((model) => model.id)).toContain(1);
  });

  it("ranks name matches above definition matches", () => {
    const result = filterModelSummaries(summaries, "第一性原理", null);

    expect(result[0].id).toBe(1);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterModelSummaries(summaries, "不存在的模型xyz", null)).toEqual(
      [],
    );
  });
});
