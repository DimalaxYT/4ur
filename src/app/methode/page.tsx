import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { ENGAGEMENTS, STEPS_DETAILS } from "@/components/site/steps-data";
import { ParallaxY } from "@/components/site/parallax";

export const metadata: Metadata = {
  title: "La méthode — sécurité by design",
  description:
    "Écoute & audit, conception sécurisée, construction & tests, supervision continue : comment 4ur intègre la cybersécurité dans chaque projet web, du cadrage à la production.",
};

const INCLUDED = [
  "Atelier de cadrage offert (2 h)",
  "Design sur mesure, validé avec vous",
  "Formation à la prise en main (1 h)",
  "Documentation de votre installation",
  "Sauvegardes configurées dès la mise en ligne",
  "Scan de vulnérabilités avant chaque lancement",
  "Accès complets : domaine, hébergement, code",
  "Garantie de correction 30 jours après livraison",
];

export default function MethodePage() {
  return (
    <>
      <PageHeader
        overline="La méthode · 4ur"
        title="Sécurité by design."
        titleMuted="Pas by patch."
        intro="Notre différence tient en une phrase : chez 4ur, la protection n'est pas une étape finale — c'est le squelette du projet. Quatre temps, aucun angle mort, et des livrables concrets à chaque étape."
        watermark="METHODE"
      />

      {/* Étapes détaillées */}
      <section className="section-beam border-b border-white/[0.08] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-6">
            {STEPS_DETAILS.map((s, i) => (
              <Reveal key={s.num} delay={0.05 * i}>
                <SpotlightCard className="p-7 sm:p-10">
                  <ParallaxY
                    from={24}
                    to={-24}
                    className="pointer-events-none absolute inset-y-0 right-6 flex items-center"
                  >
                    <span
                      aria-hidden="true"
                      className="select-none font-display text-[6.5rem] font-black leading-none text-transparent sm:text-[8.5rem]"
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.06)" }}
                    >
                      {s.num}
                    </span>
                  </ParallaxY>
                  <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-emerald-400">
                        étape {s.num}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {s.title}
                      </h2>
                      <p className="mt-4 max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                        livrables remis
                      </p>
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {s.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                            <Check
                              className="mt-0.5 size-4 shrink-0 text-emerald-400"
                              strokeWidth={2.5}
                              aria-hidden="true"
                            />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="section-beam border-b border-white/[0.08] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
              Nos engagements,{" "}
              <span className="text-white/42">écrits noir sur blanc.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {ENGAGEMENTS.map((x, i) => (
              <Reveal key={x.k} delay={i * 0.08} className="h-full">
                <SpotlightCard className="h-full p-7">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-emerald-400">
                    {x.k}
                  </p>
                  <p className="mt-3 text-sm font-medium leading-relaxed">{x.v}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tout projet inclut */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
              Inclus d&apos;office,{" "}
              <span className="text-white/42">quelle que soit la formule.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-12 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-white/[0.06] pb-4 text-sm leading-relaxed"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-emerald-400"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Envie d'appliquer cette rigueur"
        titleMuted="à votre projet ?"
        body="L'atelier de cadrage de 2 heures est offert et sans engagement. On cartographie vos besoins et vos risques — ensuite, vous décidez."
        cta="Réserver mon atelier"
      />
    </>
  );
}
