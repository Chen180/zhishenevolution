import { describe, expect, it } from "vitest";
import {
  buildExcerpt,
  isHeadingLine,
  isTagLine,
  parseArticle,
  parseArticleFilename,
} from "../../scripts/build-articles.mjs";
import data from "../../data/articles.json";

const META = { slug: "20260707_测试", date: "2026-07-07" };

describe("parseArticleFilename", () => {
  it("解析日期、slug 与标题文件名", () => {
    expect(parseArticleFilename("20260707_注意力.md")).toEqual({
      slug: "20260707_注意力",
      date: "2026-07-07",
    });
    expect(parseArticleFilename("20260725_菲尔兹奖得主王虹_邓煜.md").date).toBe(
      "2026-07-25",
    );
  });

  it("拒绝不符合格式的文件名", () => {
    expect(() => parseArticleFilename("注意力.md")).toThrow();
    expect(() => parseArticleFilename("2026-07-07_注意力.md")).toThrow();
  });
});

describe("isTagLine / isHeadingLine", () => {
  it("识别无空格、行尾带 # 的话题标签行", () => {
    expect(isTagLine("#中公教育#南京路宝宝总#注意力#注意力文明#")).toBe(true);
  });

  it("识别行尾不带 # 的话题标签行", () => {
    expect(isTagLine("#张国伟#直播带货#人性")).toBe(true);
  });

  it("识别空格分隔的话题标签行", () => {
    expect(isTagLine("#时间信用 #王计兵 #低处飞行 #AI时代")).toBe(true);
  });

  it("markdown 标题（井号后紧跟空格）不是标签行", () => {
    expect(isTagLine("# 02 爆红之后的格局")).toBe(false);
    expect(isTagLine("## 01 最不合理的出行")).toBe(false);
  });

  it("识别两种小标题形式", () => {
    expect(isHeadingLine("# 02 爆红之后的格局")).toBe(true);
    expect(isHeadingLine("## 01 最不合理的出行")).toBe(true);
    expect(isHeadingLine("1、真正改变的，不是人性")).toBe(true);
    expect(isHeadingLine("八、未来最大的贫富差距")).toBe(true);
    expect(isHeadingLine("普通的正文段落")).toBe(false);
  });
});

describe("parseArticle", () => {
  it("剥掉标题开头的 # 前缀", () => {
    const article = parseArticle("# 完整标题在这里\n\n第一段正文。", META);
    expect(article.title).toBe("完整标题在这里");
  });

  it("不带 # 前缀的标题原样保留", () => {
    const article = parseArticle("完整标题在这里\n\n第一段正文。", META);
    expect(article.title).toBe("完整标题在这里");
  });

  it("剔除单独一行的「图片」占位符", () => {
    const article = parseArticle(
      "标题\n\n第一段。\n\n图片\n\n第二段。\n图片\n第三段。",
      META,
    );
    const texts = article.blocks.map((block) => block.text);
    expect(texts).toEqual(["第一段。", "第二段。", "第三段。"]);
  });

  it("从 END 行起（含）丢弃公众号固定尾注", () => {
    const article = parseArticle(
      "标题\n\n正文。\n\nEND\n\n作者：智神进化纪\n\n记录一个普通人的观察。",
      META,
    );
    expect(article.blocks).toEqual([{ type: "paragraph", text: "正文。" }]);
  });

  it("没有 END 行时从「作者：」行起丢弃", () => {
    const article = parseArticle(
      "标题\n\n正文。\n\n作者：何明轩\n\n记录一个普通人的观察。",
      META,
    );
    expect(article.blocks).toEqual([{ type: "paragraph", text: "正文。" }]);
  });

  it("提取话题标签并从正文丢弃", () => {
    const article = parseArticle(
      "标题\n\n正文。\n\n#中公教育#注意力#注意力文明#\n\nEND\n作者：智神进化纪",
      META,
    );
    expect(article.tags).toEqual(["中公教育", "注意力", "注意力文明"]);
    expect(article.blocks).toEqual([{ type: "paragraph", text: "正文。" }]);
  });

  it("提取行尾不带 # 与空格分隔的标签行", () => {
    const compact = parseArticle("标题\n\n正文。\n\n#张国伟#直播带货#人性", META);
    expect(compact.tags).toEqual(["张国伟", "直播带货", "人性"]);

    const spaced = parseArticle(
      "标题\n\n正文。\n\n#时间信用 #王计兵 #AI时代",
      META,
    );
    expect(spaced.tags).toEqual(["时间信用", "王计兵", "AI时代"]);
  });

  it("markdown 小标题剥掉井号，编号小标题保留原文，统一为 heading 块", () => {
    const article = parseArticle(
      "标题\n\n开头段落。\n\n# 01 第一节\n\n内容一。\n\n## 第二节\n\n内容二。\n\n1、第三节\n\n内容三。\n\n八、第四节\n\n内容四。",
      META,
    );
    expect(article.blocks).toEqual([
      { type: "paragraph", text: "开头段落。" },
      { type: "heading", text: "01 第一节" },
      { type: "paragraph", text: "内容一。" },
      { type: "heading", text: "第二节" },
      { type: "paragraph", text: "内容二。" },
      { type: "heading", text: "1、第三节" },
      { type: "paragraph", text: "内容三。" },
      { type: "heading", text: "八、第四节" },
      { type: "paragraph", text: "内容四。" },
    ]);
  });
});

describe("buildExcerpt", () => {
  it("取前 1～2 个段落", () => {
    expect(buildExcerpt(["第一段。", "第二段。", "第三段。"])).toBe(
      "第一段。第二段。",
    );
  });

  it("超过约 100 字时截断并加省略号", () => {
    const long = "字".repeat(120);
    const excerpt = buildExcerpt([long]);
    expect(excerpt).toBe(`${"字".repeat(100)}…`);
  });

  it("第一段已超 100 字时不再拼第二段", () => {
    const long = "长".repeat(150);
    expect(buildExcerpt([long, "第二段。"]).startsWith("长".repeat(100))).toBe(
      true,
    );
    expect(buildExcerpt([long, "第二段。"]).includes("第二段")).toBe(false);
  });
});

describe("data/articles.json（真实产物）", () => {
  it("包含 12 篇文章且字段完整", () => {
    expect(data.articles).toHaveLength(12);
    const slugs = new Set<string>();
    for (const article of data.articles) {
      expect(article.title.length).toBeGreaterThan(0);
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article.excerpt.length).toBeGreaterThan(0);
      expect(article.blocks.length).toBeGreaterThan(0);
      expect(slugs.has(article.slug)).toBe(false);
      slugs.add(article.slug);
      for (const block of article.blocks) {
        expect(["heading", "paragraph"]).toContain(block.type);
        expect(block.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("按日期倒序排列", () => {
    const dates = data.articles.map((article) => article.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });
});
