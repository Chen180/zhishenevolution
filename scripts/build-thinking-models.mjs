/**
 * 把 Resource 下的思维模型母版 md 解析为 data/thinking-models.json。
 *
 * 用法：npm run build:models
 * 母版不入 Git（见 docs/adr/0004），本脚本在母版变更后手动运行。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODELS_MD = join(root, "Resource", "世界顶尖100个思维模型.md");
const BOOKS_MD = join(root, "Resource", "思维模型_经典书籍映射表.md");
const OUTPUT = join(root, "data", "thinking-models.json");

const LAYERS = [
  { id: "cognition", name: "认知思维层", theme: "如何思考", from: 1, to: 20 },
  { id: "decision", name: "决策思维层", theme: "如何选择", from: 21, to: 35 },
  { id: "growth", name: "学习成长层", theme: "如何进化", from: 36, to: 50 },
  { id: "psychology", name: "心理洞察层", theme: "如何理解人性", from: 51, to: 65 },
  { id: "society", name: "社会系统层", theme: "如何理解世界", from: 66, to: 80 },
  { id: "philosophy", name: "哲学智慧层", theme: "如何理解存在", from: 81, to: 90 },
  { id: "innovation", name: "创新创造层", theme: "如何创造", from: 91, to: 100 },
];

const TEXT_FIELDS = [
  ["definition", "一句话定义"],
  ["principle", "核心原理"],
  ["background", "跨学科背景"],
  ["story", "故事/案例"],
];

const LIST_FIELDS = [
  ["scenarios", "应用场景"],
  ["methods", "落地方法"],
  ["pitfalls", "常见误区"],
];

function fail(message) {
  console.error(`[build:models] ${message}`);
  process.exit(1);
}

function layerOf(id) {
  const layer = LAYERS.find((item) => id >= item.from && id <= item.to);
  if (!layer) fail(`模型 ${id} 不在任何层级区间内`);
  return layer.id;
}

/** 去掉 markdown 加粗标记与首尾空白 */
function clean(text) {
  return text.replace(/\*\*/g, "").trim();
}

function extractField(section, label) {
  const pattern = new RegExp(
    `\\*\\*${label}\\*\\*：([\\s\\S]*?)(?=\\n\\*\\*[^\\n]+\\*\\*：|\\n---|$)`,
  );
  const match = section.match(pattern);
  return match ? match[1].trim() : "";
}

function parseList(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*] /.test(line) || /^\d+[.、] /.test(line))
    .map((line) => clean(line.replace(/^([-*] |\d+[.、] )/, "")));
}

function parseModels(markdown) {
  const heading = /^#{2,3} (\d+)[.、]\s+(.+)$/gm;
  const headings = [...markdown.matchAll(heading)];
  if (headings.length === 0) fail("未在母版中解析到任何模型标题");

  return headings.map((match, index) => {
    const id = Number(match[1]);
    const rawTitle = match[2].trim();
    const section = markdown.slice(
      match.index,
      headings[index + 1]?.index ?? markdown.length,
    );

    const titleMatch = rawTitle.match(/^(.+?)\s+([A-Za-z][\s\S]*)$/);
    const name = titleMatch ? titleMatch[1].trim() : rawTitle;
    const nameEn = titleMatch ? titleMatch[2].trim() : "";

    const model = { id, name, nameEn, layer: layerOf(id) };
    for (const [key, label] of TEXT_FIELDS) {
      model[key] = clean(extractField(section, label));
    }
    for (const [key, label] of LIST_FIELDS) {
      model[key] = parseList(extractField(section, label));
    }
    return model;
  });
}

function parseBooks(markdown) {
  const rows = new Map();
  const rowPattern = /^\|\s*Day\s*(\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/gm;
  for (const match of markdown.matchAll(rowPattern)) {
    rows.set(Number(match[1]), {
      main: match[3].trim(),
      extras: [match[4], match[5]]
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0 && cell !== "-"),
    });
  }
  return rows;
}

const models = parseModels(readFileSync(MODELS_MD, "utf8"));
const books = parseBooks(readFileSync(BOOKS_MD, "utf8"));

for (const model of models) {
  model.books = books.get(model.id) ?? { main: "", extras: [] };
}

// 完整性断言：任何一个不满足都拒绝产出
if (models.length !== 100) fail(`解析出 ${models.length} 个模型，预期 100`);
models.forEach((model, index) => {
  if (model.id !== index + 1) fail(`模型编号不连续：第 ${index + 1} 位为 ${model.id}`);
  for (const [key] of TEXT_FIELDS) {
    if (!model[key]) fail(`模型 ${model.id}（${model.name}）缺少字段 ${key}`);
  }
  for (const [key] of LIST_FIELDS) {
    if (model[key].length === 0) {
      fail(`模型 ${model.id}（${model.name}）列表字段 ${key} 为空`);
    }
  }
  if (!model.books.main) fail(`模型 ${model.id}（${model.name}）缺少书籍映射`);
});

const output = {
  generatedAt: new Date().toISOString(),
  layers: LAYERS.map(({ id, name, theme, from, to }) => ({
    id,
    name,
    theme,
    from,
    to,
  })),
  models,
};

writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`[build:models] 已生成 ${OUTPUT}（${models.length} 个模型）`);
