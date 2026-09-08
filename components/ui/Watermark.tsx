/**
 * 版权水印模块：所有对外生成的图片统一使用。
 * 文案沿用信用测评打印报告的既定版本，样式在 globals.css（.wm-*）。
 */

export const WATERMARK_TEXT = "智神进化纪 · 何明轩";
export const COPYRIGHT_LINE =
  "智神进化纪 zhishenevo.com ｜ 何明轩 · 保留所有权利";

/** 斜向平铺水印层，父元素需 position: relative + overflow: hidden */
export function WatermarkLayer({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div
      className={`wm-layer${tone === "dark" ? " wm-layer--dark" : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 15 }, (_, index) => (
        <span key={index}>{WATERMARK_TEXT}</span>
      ))}
    </div>
  );
}

/** 版权行，withDivider=false 时去掉上边框（容器已有分隔线时使用） */
export function CopyrightLine({
  tone = "light",
  withDivider = true,
}: {
  tone?: "light" | "dark";
  withDivider?: boolean;
}) {
  const className = [
    "wm-copyright",
    tone === "dark" ? "wm-copyright--dark" : "",
    withDivider ? "" : "wm-copyright--bare",
  ]
    .filter(Boolean)
    .join(" ");

  return <p className={className}>{COPYRIGHT_LINE}</p>;
}
