import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/reveal";
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
        overline="La méthode — 4ur"
        title="Sécurité by design."
        titleMuted="Pas by patch."
        intro="Notre différence tient en une phrase : chez 4ur, la protection n'est pas une étape finale — c'est le squelette du projet. Quatre temps, aucun angle mort, et des livrables concrets à chaque étape."
        watermark="DESIGN"
      />

      {/* Étapes détaillées */}
      <section className="border-b border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-6">
            {STEPS_DETAILS.map((s, i) => (
              <Reveal key={s.num} delay={0.05 * i}>
                <article className="relative overflow-hidden rounded-lg border border-white/10 bg-card">
                  <ParallaxY
                    from={26}
                    to={-26}
                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center"
                  >
                    <span
                      aria-hidden="true"
                      className="select-none font-display text-[7rem] font-black leading-none text-transparent sm:text-[9rem]"
                      style={{ WebkitTextStroke: "1.2px rgba(250,250,249,0.10)" }}
                    >
                      {s.num}
                    </span>
                  </ParallaxY>
                  <div className="relative grid gap-6 p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                        étape {s.num}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {s.title}
                      </h2>
                      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-secondary/40 p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                        vous recevez
                      </p>
                      <ul className="mt-3.5 flex flex-col gap-2.5">
                        {s.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-[13px] leading-snug">
                            <Check
                              className="mt-0.5 size-4 shrink-0"
                              strokeWidth={2.5}
                              aria-hidden="true"
                            />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="border-b border-white/10 bg-[#0d0d0d] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Nos engagements,{" "}
              <span className="text-muted-foreground">écrits noir sur blanc.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {ENGAGEMENTS.map((x, i) => (
              <Reveal key={x.k} delay={i * 0.1} className="h-full">
                <div className="h-full rounded-lg border border-white/10 bg-secondary/40 px-6 py-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                    {x.k}
                  </p>
                  <p className="mt-2.5 text-sm font-medium leading-relaxed">{x.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tout projet inclut */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Ce que chaque projet inclut,{" "}
              <span className="text-muted-foreground">quelle que soit la formule.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-12 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-white/5 pb-4 text-sm leading-relaxed"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <blockquote className="mt-16 rounded-lg border-l-2 border-primary bg-secondary/60 px-7 py-6 sm:px-10">
              <p className="text-balance font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                « Un site non sécurisé n'est pas un site. C'est une porte ouverte. »
              </p>
              <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                — l'adn 4ur
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Envie de voir la méthode"
        titleMuted="appliquée à votre projet ?"
        body="L'atelier de cadrage de 2 heures est offert et sans engagement. On cartographie vos besoins et vos risques — ensuite, vous décidez."
        cta="Réserver mon atelier"
      />
    </>
  );
}
