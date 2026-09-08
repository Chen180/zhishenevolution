/**
 * 思维模型摘要与筛选的纯逻辑。
 * 独立成文件、不引入 JSON 数据本体，方便客户端组件复用筛选函数
 * 而不把完整模型数据打包进浏览器 bundle。
 */

export interface ModelSummary {
  id: number;
  name: string;
  nameEn: string;
  layer: string;
  /** 一句话定义 */
  definition: string;
}

/** 判断 keyword 的字符是否按顺序依次出现在 text 中（允许中间隔字符）。 */
function isSubsequence(text: string, keyword: string): boolean {
  let index = 0;
  for (const char of text) {
    if (char === keyword[index]) index += 1;
    if (index === keyword.length) return true;
  }
  return index === keyword.length;
}

/**
 * 匹配评分：子串命中优先于模糊（字符顺序）命中，
 * 名称 > 英文名 > 定义。定义不参与模糊匹配，避免长文本造成大量误命中。
 * 返回 0 表示不匹配。
 */
function matchScore(model: ModelSummary, keyword: string): number {
  const name = model.name.toLowerCase();
  const nameEn = model.nameEn.toLowerCase();
  const definition = model.definition.toLowerCase();

  if (name.includes(keyword)) return 40;
  if (nameEn.includes(keyword)) return 30;
  if (definition.includes(keyword)) return 20;
  if (isSubsequence(name, keyword)) return 14;
  if (isSubsequence(nameEn, keyword)) return 12;
  return 0;
}

/**
 * 按关键词与层级筛选模型摘要。
 * query 为空（trim 后）且 layer 为 null 时返回全部（按 id 顺序）；
 * query 大小写不敏感，支持子串与模糊（字符顺序）匹配，结果按相关度排序；
 * layer 非 null 时按层级过滤。两个条件同时生效。
 */
export function filterModelSummaries(
  list: ModelSummary[],
  query: string,
  layer: string | null,
): ModelSummary[] {
  const keyword = query.trim().toLowerCase();
  const inLayer =
    layer === null
      ? list
      : list.filter((model) => model.layer === layer);
  if (keyword === "") return inLayer;

  return inLayer
    .map((model) => ({ model, score: matchScore(model, keyword) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.model.id - b.model.id)
    .map((entry) => entry.model);
}
