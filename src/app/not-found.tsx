import { ActionButton, EyebrowPill } from "@/components/site/action-button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[82svh] flex-col items-center justify-center overflow-hidden px-5 pt-24 text-center">
      <div className="grid-bg mask-fade-b pointer-events-none absolute inset-0" />
      <span
        aria-hidden="true"
        className="pointer-events-none select-none font-display text-[30vw] font-black leading-none text-transparent sm:text-[19vw]"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        404
      </span>
      <div className="relative z-10 -mt-8 max-w-lg">
        <EyebrowPill dot="emerald">Erreur 404 · Route introuvable</EyebrowPill>
        <h1 className="text-platinum mt-5 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          Cette page n&apos;existe pas.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Le lien suivi a peut-être été déplacé ou supprimé. Reprenez l&apos;exploration
          depuis l&apos;accueil ou nos réalisations.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ActionButton href="/" variant="primary" size="md">
            Retour à l&apos;accueil
          </ActionButton>
          <ActionButton
            href="/realisations"
            variant="secondary"
            size="md"
            icon="arrow-right"
          >
            Voir les réalisations
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
