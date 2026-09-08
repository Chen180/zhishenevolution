import { toPng } from "html-to-image";

/**
 * 浏览器端「DOM 节点 → PNG」截图与下载的共享助手。
 * 长文转图、思维模型分享卡、测评结果分享卡统一使用。
 */

export interface CapturedImage {
  url: string;
  width: number;
  height: number;
  name: string;
}

/** 对单个 DOM 节点截图（pixelRatio 2 输出高清 PNG） */
export async function captureNode(
  node: HTMLElement,
  name: string,
  pixelRatio = 2,
): Promise<CapturedImage> {
  const url = await toPng(node, { pixelRatio });
  return {
    url,
    width: node.offsetWidth * pixelRatio,
    height: node.offsetHeight * pixelRatio,
    name,
  };
}

/** 触发浏览器下载单张图片 */
export function downloadImage(image: CapturedImage) {
  const link = document.createElement("a");
  link.href = image.url;
  link.download = image.name;
  link.click();
}

export type SaveOutcome = "folder" | "downloads" | "cancelled";

/**
 * 批量保存图片：支持 File System Access API 的浏览器写入以 folderName
 * 命名的子文件夹；不支持的回退为逐张下载。用户取消目录选择时返回
 * "cancelled"（不做任何回退动作）。
 */
export async function saveImages(
  folderName: string,
  images: CapturedImage[],
): Promise<SaveOutcome> {
  if (window.showDirectoryPicker) {
    try {
      const root = await window.showDirectoryPicker({ mode: "readwrite" });
      const folder = await root.getDirectoryHandle(folderName, {
        create: true,
      });
      for (const image of images) {
        const blob = await (await fetch(image.url)).blob();
        const handle = await folder.getFileHandle(image.name, {
          create: true,
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      }
      return "folder";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  for (const image of images) {
    downloadImage(image);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return "downloads";
}
