import { ParallaxY } from "./parallax";
import { Reveal } from "./reveal";
import { EyebrowPill } from "./action-button";

interface PageHeaderProps {
  overline: string;
  title: string;
  titleMuted?: string;
  intro: string;
  watermark?: string;
}

/**
 * En-tête architectural des pages intérieures : capsule en verre fumé,
 * dégradé platine optique et filigrane monumental dérivant en parallaxe GPU.
 */
export function PageHeader({
  overline,
  title,
  titleMuted,
  intro,
  watermark,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/[0.08] pb-18 pt-36 sm:pb-24 sm:pt-44">
      <div className="grid-bg mask-fade-b absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 48% at 50% -8%, rgba(255,255,255,0.075), transparent 66%)",
        }}
      />
      {watermark && (
        <ParallaxY from={36} to={-36} className="absolute inset-0" aria-hidden="true">
          <span
            aria-hidden="true"
            className="pointer-events-none block select-none whitespace-nowrap text-center font-display text-[24vw] font-black leading-[0.82] text-transparent sm:text-[17vw]"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.035)" }}
          >
            {watermark}
          </span>
        </ParallaxY>
      )}

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal y={14}>
          <EyebrowPill dot="emerald">{overline}</EyebrowPill>
          <h1 className="mt-6 max-w-3xl text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
            <span className="text-platinum">{title}</span>
            {titleMuted && (
              <>
                <br />
                <span className="text-white/42">{titleMuted}</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-muted-foreground sm:text-base">
            {intro}
          </p>
        </Reveal>
      </div>
    </header>
  );
}
