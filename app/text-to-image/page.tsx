import type { Metadata } from "next";
import { TextToImage } from "@/components/features/text-to-image/TextToImage";

export const metadata: Metadata = {
  title: "长文转图工具 | 六维信用",
  description:
    "粘贴超长文案，在浏览器本地一键生成高清 PNG 图片，支持单张长图与分页多图，内容不上传服务器。",
};

export default function TextToImagePage() {
  return <TextToImage />;
}
