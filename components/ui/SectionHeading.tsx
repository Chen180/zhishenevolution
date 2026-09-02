import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  /** 模块序号，如 "01" */
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  /** 深色背景上使用浅色文字 */
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={className}>
      {index ? (
        <p
          className={`m-0 mb-3 font-figure text-[13px] tracking-[0.3em] ${
            light ? "text-gold-light" : "text-gold"
          }`}
        >
          {index}
        </p>
      ) : null}
      <p
        className={`m-0 mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase ${
          light ? "text-gold-light" : "text-gold"
        }`}
      >
        <span aria-hidden className="inline-block h-px w-[38px] bg-current" />
        {eyebrow}
      </p>
      <h2
        className={`m-0 font-display text-[clamp(28px,4vw,42px)] leading-[1.2] ${
          light ? "text-text-light" : "text-text-dark"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`m-0 mt-5 max-w-[640px] text-[15px] leading-[1.9] ${
            light ? "text-muted-light" : "text-muted-dark"
          }`}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
