import { describe, expect, it } from "vitest";
import { listArticles, listRecentArticles } from "@/lib/domain/articles";

describe("listRecentArticles", () => {
  it("returns the latest summaries in the existing descending order", () => {
    expect(listRecentArticles(1)).toEqual(listArticles().slice(0, 1));
    expect(listRecentArticles(3)).toEqual(listArticles().slice(0, 3));
  });

  it("returns no summaries for a non-positive limit", () => {
    expect(listRecentArticles(0)).toEqual([]);
    expect(listRecentArticles(-1)).toEqual([]);
  });
});
