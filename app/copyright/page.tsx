import type { Metadata } from "next";
import { COPYRIGHT_DOCUMENT } from "@/components/features/legal/content";
import { LegalPage } from "@/components/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "版权声明",
  description:
    "六维信用体系及其全部内容为何明轩原创作品，受著作权法保护。本站内容的使用许可与授权说明。",
};

export default function CopyrightPage() {
  return <LegalPage document={COPYRIGHT_DOCUMENT} />;
}
