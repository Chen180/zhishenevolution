import type { Metadata } from "next";
import { PRIVACY_DOCUMENT } from "@/components/features/legal/content";
import { LegalPage } from "@/components/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "隐私说明",
  description:
    "本站不注册、不存储测评答案。如实说明测评数据与访问日志的实际处理方式。",
};

export default function PrivacyPage() {
  return <LegalPage document={PRIVACY_DOCUMENT} />;
}
