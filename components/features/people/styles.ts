import type { DimensionKey, ScoreTone, TableTone, VerdictKind } from "./content";

/** 六维标识点颜色（对应 globals.css 的 dim-* token） */
export const DIM_DOT_CLASS: Record<DimensionKey, string> = {
  label: "bg-dim-label",
  time: "bg-dim-time",
  environment: "bg-dim-env",
  persona: "bg-dim-persona",
  social: "bg-dim-social",
  civilization: "bg-dim-civilization",
};

/** 六维强调文字颜色（图例名称、评分等） */
export const DIM_TEXT_CLASS: Record<DimensionKey, string> = {
  label: "text-dim-label",
  time: "text-dim-time",
  environment: "text-dim-env",
  persona: "text-dim-persona",
  social: "text-dim-social",
  civilization: "text-dim-civilization",
};

/** 判定 badge 四档映射品牌色 */
export const VERDICT_BADGE_CLASS: Record<VerdictKind, string> = {
  complete: "border-green-deep/30 bg-green-deep/10 text-green-deep",
  rebuilding: "border-gold/40 bg-gold/10 text-gold",
  pure: "border-dim-social/40 bg-dim-social/10 text-dim-social",
  broken: "border-dim-env/40 bg-dim-env/10 text-dim-env",
};

/** 人物卡评分色 */
export const SCORE_TEXT_CLASS: Record<ScoreTone, string> = {
  high: "text-green-deep",
  mid: "text-gold",
  low: "text-dim-env",
};

/** 总览对照表 badge 色 */
export const TABLE_BADGE_CLASS: Record<TableTone, string> = {
  high: "bg-green-deep/10 text-green-deep",
  mid: "bg-gold/15 text-gold",
  low: "bg-dim-env/10 text-dim-env",
  mixed: "bg-dim-persona/10 text-dim-persona",
  rebuild: "bg-dim-time/10 text-dim-time",
};
