import Link from "next/link";
import { ArrowUpRight, Globe, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { EyebrowPill } from "./action-button";

const POLES = [
  {
    href: "/web",
    icon: Globe,
    index: "01",
    label: "Ingénierie Web",
    title: "Des interfaces sculptées pour convertir.",
    body: "Design éditorial 100 % sur mesure, fluidité native et référencement technique irréprochable — sans aucun thème préfabriqué.",
    items: ["Sites vitrines, portails & e-commerce", "LCP < 0.5 s & accessibilité native", "Propriété intégrale du code"],
    glow: "rgba(255, 255, 255, 0.09)",
  },
  {
    href: "/security",
    icon: ShieldCheck,
    index: "02",
    label: "Cybersécurité",
    title: "Une architecture durcie dès l'origine.",
    body: "Audit d'intrusion, durcissement HTTP, filtrage applicatif et supervision active : votre réputation reste hors de portée.",
    items: ["Pentest applicatif & revue de code", "Headers CSP, HSTS & TLS 1.3 A+", "Monitoring continu & sauvegardes chiffrées"],
    glow: "rgba(52, 211, 153, 0.09)",
  },
];

export function Poles() {
  return (
    <section id="disciplines" className="section-beam relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <EyebrowPill dot="white">01 · Disciplines</EyebrowPill>
              <h2 className="mt-5 max-w-2xl text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                Deux expertises.{" "}
                <span className="text-white/42">Une seule exigence.</span>
              </h2>
            </div>
            <p className="max-w-md text-[14.5px] leading-[1.7] text-muted-foreground">
              Plutôt que d&apos;opposer esthétique et sûreté, nous réunissons design,
              développement et sécurité au sein d&apos;un même studio.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {POLES.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.1} className="h-full">
              <SpotlightCard spotlightColor={p.glow} className="h-full">
                <Link
                  href={p.href}
                  className="flex h-full flex-col justify-between p-8 sm:p-10"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:scale-105">
                        <p.icon className="size-5 text-foreground" strokeWidth={1.6} />
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground/70">
                        {p.index} — {p.label.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="mt-8 font-display text-2xl font-bold leading-snug tracking-[-0.025em] sm:text-[1.75rem]">
                      {p.title}
                    </h3>
                    <p className="mt-3.5 text-[14.5px] leading-[1.7] text-muted-foreground">
                      {p.body}
                    </p>

                    <ul className="mt-7 flex flex-col gap-2.5 border-t border-white/[0.07] pt-6">
                      {p.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 text-[13.5px] text-foreground/85"
                        >
                          <span className="size-1 rounded-full bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-9 flex items-center justify-between pt-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                      Découvrir {p.label}
                    </span>
                    <span className="inline-flex size-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] transition-all duration-200 group-hover:border-white/30 group-hover:bg-white/[0.10]">
                      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
