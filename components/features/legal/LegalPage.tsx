import { Reveal } from "@/components/ui/Reveal";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

/**
 * 法律声明类页面通用版式：深色页头衔接 fixed 顶栏，正文为分节长文。
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <section className="border-b border-line-dark bg-ink pt-[68px] text-text-light max-[620px]:pt-[62px]">
        <div className="container-site py-14 text-center sm:py-16">
          <Reveal>
            <p className="m-0 mb-5 font-display text-[14px] tracking-[0.5em] text-gold-light/80 uppercase">
              {document.eyebrow}
            </p>
            <h1 className="m-0 font-display text-[clamp(28px,4.5vw,42px)] leading-[1.3] font-bold">
              {document.title}
            </h1>
            <p className="m-0 mt-6 text-[13px] tracking-[0.2em] text-muted-light/70">
              {document.updatedAt}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-site py-14 sm:py-16">
        <div className="mx-auto max-w-[760px]">
          <p className="m-0 mb-10 text-[15px] leading-[2] text-ink/85">
            {document.intro}
          </p>
          {document.sections.map((section, index) => (
            <div key={section.heading} className="mb-10">
              <h2 className="m-0 mb-4 font-display text-[19px] font-bold text-ink">
                <span className="mr-3 text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="m-0 mb-3 text-[14px] leading-[2] text-ink/75"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
