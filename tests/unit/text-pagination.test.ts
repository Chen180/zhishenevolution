import { describe, expect, it } from "vitest";
import {
  paginateBlocks,
  splitIntoParagraphs,
} from "../../lib/domain/text-pagination";

describe("splitIntoParagraphs", () => {
  it("splits text on newlines and trims whitespace", () => {
    expect(splitIntoParagraphs(" 第一段 \n第二段\n  第三段")).toEqual([
      "第一段",
      "第二段",
      "第三段",
    ]);
  });

  it("drops empty lines", () => {
    expect(splitIntoParagraphs("第一段\n\n   \n第二段")).toEqual([
      "第一段",
      "第二段",
    ]);
  });

  it("returns an empty array for blank input", () => {
    expect(splitIntoParagraphs("")).toEqual([]);
    expect(splitIntoParagraphs("  \n\n ")).toEqual([]);
  });

  it("handles Windows line endings", () => {
    expect(splitIntoParagraphs("第一段\r\n第二段")).toEqual([
      "第一段",
      "第二段",
    ]);
  });
});

describe("paginateBlocks", () => {
  it("packs blocks greedily within the page height", () => {
    const blocks = [
      { text: "a", height: 400 },
      { text: "b", height: 400 },
      { text: "c", height: 400 },
    ];

    expect(paginateBlocks(blocks, 800)).toEqual([
      [blocks[0], blocks[1]],
      [blocks[2]],
    ]);
  });

  it("keeps a block that exactly fills the remaining space", () => {
    const blocks = [
      { text: "a", height: 500 },
      { text: "b", height: 500 },
    ];

    expect(paginateBlocks(blocks, 1000)).toEqual([[blocks[0], blocks[1]]]);
  });

  it("gives an over-height block its own page", () => {
    const blocks = [
      { text: "a", height: 300 },
      { text: "big", height: 2000 },
      { text: "b", height: 300 },
    ];

    expect(paginateBlocks(blocks, 1000)).toEqual([
      [blocks[0]],
      [blocks[1]],
      [blocks[2]],
    ]);
  });

  it("returns an empty array for no blocks", () => {
    expect(paginateBlocks([], 1000)).toEqual([]);
  });

  it("rejects a non-positive page height", () => {
    expect(() => paginateBlocks([{ text: "a", height: 1 }], 0)).toThrow();
  });
});
