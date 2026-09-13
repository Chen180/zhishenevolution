import type { Metadata } from "next";
import { ImageTools } from "@/components/features/text-to-image/ImageTools";

export const metadata: Metadata = {
  title: "转图工具 | 六维信用",
  description:
    "长文转图：粘贴超长文案本地生成高清 PNG 长图；图片加水印：为已有图片叠加统一水印导出，内容不上传服务器。",
};

export default function TextToImagePage() {
  return <ImageTools />;
}
