"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { Magnetic } from "./magnetic";
import { ActionButton } from "./action-button";
import { cn } from "@/lib/utils";

interface ProjectType {
  id: string;
  label: string;
  subtitle: string;
  baseMin: number;
  baseMax: number;
  subject: "web" | "security" | "both";
  timeline: string;
  recommendedPlan: string;
  milestones: string[];
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: "vitrine",
    label: "Site Vitrine Haute Couture",
    subtitle: "3 à 5 pages sur mesure & conversion rapide",
    baseMin: 1490,
    baseMax: 2200,
    subject: "both",
    timeline: "2 à 3 semaines",
    recommendedPlan: "Formule Essentiel",
    milestones: [
      "Semaine 1 : Cadrage, architecture UX & maquettes haute fidélité",
      "Semaine 2 : Développement Next.js, animations GPU & SEO",
      "Semaine 3 : Durcissement HTTP, audit pré-prod & mise en ligne",
    ],
  },
  {
    id: "pro",
    label: "Plateforme Corporate / Éditoriale",
    subtitle: "Jusqu'à 10 pages, blog & parcours multiples",
    baseMin: 2990,
    baseMax: 4500,
    subject: "both",
    timeline: "4 à 6 semaines",
    recommendedPlan: "Formule Pro",
    milestones: [
      "Semaine 1–2 : Direction artistique complète & Design System",
      "Semaine 3–4 : Intégration full-stack, espace contenu & performances",
      "Semaine 5–6 : Scan de vulnérabilités, tests de charge & déploiement",
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce ou Portail Métier",
    subtitle: "Boutique en ligne, espace client ou API dédiée",
    baseMin: 5500,
    baseMax: 9500,
    subject: "both",
    timeline: "6 à 10 semaines",
    recommendedPlan: "Formule Entreprise",
    milestones: [
      "Phase 1 : Spécifications fonctionnelles, modélisation des risques & UI",
      "Phase 2 : Développement back-office, tunnel de paiement & connecteurs",
      "Phase 3 : Pentest applicatif, durcissement anti-fraude & SLA",
    ],
  },
  {
    id: "audit",
    label: "Audit Cyber & Durcissement",
    subtitle: "Pentest et sécurisation d'un site déjà en ligne",
    baseMin: 890,
    baseMax: 1990,
    subject: "security",
    timeline: "Livré sous 72 h",
    recommendedPlan: "Intervention Pôle Sécurité",
    milestones: [
      "Jour 1 : Cartographie de surface d'attaque & tests OWASP Top 10",
      "Jour 2 : Analyse de configuration TLS, DNS, headers & dépendances",
      "Jour 3 : Rapport priorisé clair + accompagnement aux correctifs",
    ],
  },
];

interface Addon {
  id: string;
  label: string;
  cost: number;
}

const ADDONS: Addon[] = [
  { id: "seo", label: "SEO avancé & cocons sémantiques", cost: 450 },
  { id: "motion", label: "Scène WebGL / 3D sur mesure", cost: 600 },
  { id: "i18n", label: "Multilingue international (FR / EN)", cost: 500 },
  { id: "pentest", label: "Pentest approfondi + rapport exécutif", cost: 750 },
  { id: "monitoring", label: "Supervision active 24/7 & alertes", cost: 350 },
];

function computeBudgetCode(totalMin: number): string {
  if (totalMin < 3000) return "<3k";
  if (totalMin < 6000) return "3-6k";
  if (totalMin <= 12000) return "6-12k";
  return ">12k";
}

/**
 * Configurateur interactif haute précision reliant l'estimation au formulaire `/contact`.
 */
export function ProjectEstimator() {
  const [selectedType, setSelectedType] = useState<string>("pro");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["seo"]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const result = useMemo(() => {
    const project =
      PROJECT_TYPES.find((t) => t.id === selectedType) ?? PROJECT_TYPES[1]!;
    const chosenAddons = ADDONS.filter((a) => selectedAddons.includes(a.id));
    const extra = chosenAddons.reduce((acc, a) => acc + a.cost, 0);
    const min = project.baseMin + extra;
    const max = project.baseMax + extra;
    const budgetCode = computeBudgetCode(min);

    const summaryLines = [
      `Configuration simulée : ${project.label} (${project.recommendedPlan})`,
      chosenAddons.length > 0
        ? `Modules retenus : ${chosenAddons.map((a) => a.label).join(", ")}`
        : "Modules retenus : Socle sécurité by design inclus",
      `Estimation indicative : ${min.toLocaleString("fr-FR")} € – ${max.toLocaleString("fr-FR")} € HT (${project.timeline})`,
      "",
      "Bonjour l'équipe 4UR, voici le contexte de mon projet :",
    ].join("\n");

    const href = `/contact?subject=${encodeURIComponent(
      project.subject
    )}&budget=${encodeURIComponent(budgetCode)}&draft=${encodeURIComponent(
      summaryLines
    )}`;

    return { project, min, max, href };
  }, [selectedType, selectedAddons]);

  return (
    <section id="estimateur" className="section-beam relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Colonne gauche : sélection */}
          <Reveal className="flex flex-col gap-6">
            <SpotlightCard className="p-7 sm:p-9">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted-foreground">
                01 · Typologie du projet
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PROJECT_TYPES.map((type) => {
                  const active = type.id === selectedType;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "flex flex-col items-start rounded-2xl border p-4.5 text-left transition-all active:scale-[0.99]",
                        active
                          ? "border-white/30 bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                      )}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="font-display text-sm font-bold text-foreground">
                          {type.label}
                        </span>
                        <span
                          className={cn(
                            "flex size-4.5 shrink-0 items-center justify-center rounded-full border",
                            active
                              ? "border-white bg-white text-[#070709]"
                              : "border-white/20"
                          )}
                        >
                          {active && <Check className="size-2.5" strokeWidth={3} />}
                        </span>
                      </div>
                      <span className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {type.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted-foreground">
                02 · Briques optionnelles
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ADDONS.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all active:scale-[0.98]",
                        checked
                          ? "border-white bg-white text-[#070709] shadow-sm"
                          : "border-white/[0.10] bg-white/[0.025] text-muted-foreground hover:border-white/25 hover:text-foreground"
                      )}
                    >
                      <Check
                        className={cn(
                          "size-3.5 transition-opacity",
                          checked ? "opacity-100" : "opacity-35"
                        )}
                        strokeWidth={2.5}
                      />
                      <span>{addon.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feuille de route prévisionnelle */}
              <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  03 · Cadence prévisionnelle
                </p>
                <ul className="mt-3 space-y-2">
                  {result.project.milestones.map((step) => (
                    <li
                      key={step}
                      className="flex items-start gap-2.5 text-[13px] text-foreground/85"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Colonne droite : synthèse chiffrée */}
          <Reveal delay={0.1}>
            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.12)"
              className="flex h-full flex-col justify-between p-7 sm:p-9"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                  <Sparkles className="size-3 text-emerald-400" />
                  {result.project.recommendedPlan}
                </div>

                <p className="mt-7 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted-foreground">
                  Enveloppe estimée (HT)
                </p>
                <motion.p
                  key={`${result.min}-${result.max}`}
                  initial={{ opacity: 0.55, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-platinum mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl"
                >
                  {result.min.toLocaleString("fr-FR")} €{" "}
                  <span className="font-normal text-white/35">–</span>{" "}
                  {result.max.toLocaleString("fr-FR")} €
                </motion.p>
                <p className="mt-2.5 font-mono text-xs text-muted-foreground">
                  Délai estimé :{" "}
                  <strong className="text-foreground">{result.project.timeline}</strong> ·
                  Règlement 40 / 60 %
                </p>

                <ul className="mt-7 space-y-3 border-t border-white/[0.08] pt-6 text-[13px] text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <span>
                      SSL A+, en-têtes CSP/HSTS, anti-spam &amp; conformité RGPD inclus
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <span>
                      Propriété intégrale du code source, du domaine et des accès
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <span>
                      Devis détaillé ferme envoyé sous 24 h ouvrées, sans engagement
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-9 flex flex-col gap-3">
                <Magnetic className="w-full" strength={0.12}>
                  <ActionButton
                    href={result.href}
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    Transmettre cette configuration
                  </ActionButton>
                </Magnetic>
                <ActionButton
                  href="/tarifs"
                  variant="secondary"
                  size="md"
                  icon="arrow-right"
                  fullWidth
                >
                  Comparer toutes les formules
                </ActionButton>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
