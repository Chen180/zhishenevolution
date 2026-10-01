import { ImageResponse } from "next/og";

export const alt = "智神进化纪 · 六维信用生命树";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og 仅内置 Geist（拉丁字符），中文字形无法渲染，
// 且 standalone Linux 构建环境没有系统中文字体可读取，
// 因此 OG 图统一使用英文排版。
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#101411",
        color: "#f7f4ec",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: "0.5em",
          color: "#c99b43",
          marginBottom: 40,
        }}
      >
        ZHISHEN EVOLUTION
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        Six-Dimensional Credit Life Tree
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#efc66e",
          marginTop: 32,
        }}
      >
        From Being Seen to Being Remembered
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#f7f4ec",
          opacity: 0.6,
          marginTop: 64,
        }}
      >
        He Mingxuan · zhishenevo.com
      </div>
    </div>,
    { ...size },
  );
}
