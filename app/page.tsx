import type { Metadata } from "next";
import { About } from "@/components/features/home/About";
import { CaseGrid } from "@/components/features/home/CaseGrid";
import { DimensionTabs } from "@/components/features/home/DimensionTabs";
import { Hero } from "@/components/features/home/Hero";
import { Manifesto } from "@/components/features/home/Manifesto";
import { ModelViewer } from "@/components/features/home/ModelViewer";
import { ObservationFeed } from "@/components/features/home/ObservationFeed";
import { Resources } from "@/components/features/home/Resources";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: "/",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.author,
  url: SITE.url,
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={personJsonLd} />
      <Hero />
      <ObservationFeed />
      <Manifesto />
      <ModelViewer />
      <DimensionTabs />
      <CaseGrid />
      <Resources />
      <About />
    </>
  );
}
