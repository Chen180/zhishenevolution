import type { Metadata } from "next";
import { DISCLAIMER_DOCUMENT } from "@/components/features/legal/content";
import { LegalPage } from "@/components/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "免责声明",
  description:
    "本站内容为个人成长观察框架，测评结果为阶段性自我观察记录，不构成任何专业意见、诊断或建议。",
};

export default function DisclaimerPage() {
  return <LegalPage document={DISCLAIMER_DOCUMENT} />;
}
