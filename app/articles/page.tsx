import type { Metadata } from "next";
import { ArticlesIndex } from "@/components/features/articles/ArticlesIndex";

export const metadata: Metadata = {
  title: "文章",
  description:
    "公众号「智神进化纪」的长文存档：用现实案例看见时代，用文明智慧理解人生，记录一个普通人在巨变时代的观察与思考。",
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesPage() {
  return <ArticlesIndex />;
}
