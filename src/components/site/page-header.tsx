import { ParallaxY } from "./parallax";
import { Reveal } from "./reveal";

interface PageHeaderProps {
  overline: string;
  title: string;
  titleMuted?: string;
  intro: string;
  watermark?: string;
}

/**
 * En-tête des pages intérieures : fil de position, titre, intro,
 * grille de fond en parallaxe et filigrane 3D dérivant lentement.
 */
export function PageHeader({
  overline,
  title,
  titleMuted,
  intro,
  watermark,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div className="grid-bg mask-fade-b absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% -10%, rgba(255,255,255,0.07), transparent 65%)",
        }}
      />
      {watermark && (
        <ParallaxY from={40} to={-40} className="absolute inset-0" aria-hidden="true">
          <span
            aria-hidden="true"
            className="pointer-events-none block select-none whitespace-nowrap text-center font-display text-[26vw] font-black leading-[0.8] text-transparent sm:text-[18vw]"
            style={{ WebkitTextStroke: "1px rgba(250,250,249,0.05)" }}
          >
            {watermark}
          </span>
        </ParallaxY>
      )}

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal y={18}>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            {overline}
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            {title}
            {titleMuted && (
              <>
                <br />
                <span className="text-muted-foreground">{titleMuted}</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {intro}
          </p>
        </Reveal>
      </div>
    </header>
  );
}
