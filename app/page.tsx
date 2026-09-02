import { About } from "@/components/features/home/About";
import { CaseGrid } from "@/components/features/home/CaseGrid";
import { DimensionTabs } from "@/components/features/home/DimensionTabs";
import { Hero } from "@/components/features/home/Hero";
import { Manifesto } from "@/components/features/home/Manifesto";
import { ModelViewer } from "@/components/features/home/ModelViewer";
import { Resources } from "@/components/features/home/Resources";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ModelViewer />
      <DimensionTabs />
      <CaseGrid />
      <Resources />
      <About />
    </>
  );
}
