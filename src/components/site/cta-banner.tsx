import { Reveal } from "./reveal";
import { Magnetic } from "./magnetic";
import { ActionButton } from "./action-button";

interface CtaBannerProps {
  title: string;
  titleMuted: string;
  body: string;
  cta?: string;
}

/** Bandeau d'appel à l'action minimaliste haute précision. */
export function CtaBanner({
  title,
  titleMuted,
  body,
  cta = "Démarrer un projet",
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.08] py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 58% at 50% 100%, rgba(255,255,255,0.08), transparent 68%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <span className="text-platinum">{title}</span>{" "}
            <span className="text-white/42">{titleMuted}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
            {body}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic strength={0.18}>
              <ActionButton href="/contact" variant="primary" size="lg">
                {cta}
              </ActionButton>
            </Magnetic>
            <Magnetic strength={0.14}>
              <ActionButton
                href="/simulateur"
                variant="secondary"
                size="lg"
                icon="arrow-right"
              >
                Estimer mon budget
              </ActionButton>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
