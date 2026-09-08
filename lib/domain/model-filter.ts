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

/**
 * 按关键词与层级筛选模型摘要。
 * query 为空（trim 后）且 layer 为 null 时返回全部；
 * query 对 name/nameEn/definition 做大小写不敏感的包含匹配；
 * layer 非 null 时按层级过滤。两个条件同时生效。
 */
export function filterModelSummaries(
  list: ModelSummary[],
  query: string,
  layer: string | null,
): ModelSummary[] {
  const keyword = query.trim().toLowerCase();
  return list.filter((model) => {
    if (layer !== null && model.layer !== layer) return false;
    if (keyword === "") return true;
    return (
      model.name.toLowerCase().includes(keyword) ||
      model.nameEn.toLowerCase().includes(keyword) ||
      model.definition.toLowerCase().includes(keyword)
    );
  });
}
