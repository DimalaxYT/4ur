import type { Metadata } from "next";
import { Code2, Eye, KeyRound, Shield } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { Faq } from "@/components/site/faq";
import { ActionButton, EyebrowPill } from "@/components/site/action-button";

export const metadata: Metadata = {
  title: "À propos — le studio web & cybersécurité",
  description:
    "Découvrez la philosophie d'ingénierie 4ur : pourquoi nous unissons création web sur mesure et cybersécurité native au sein d'un seul studio indépendant.",
};

const PILLARS = [
  {
    icon: Shield,
    title: "Sécurité native, jamais rapportée",
    body: "La majorité des failles proviennent d'architectures pensées sans modèle de menaces. Chez 4ur, chaque route, formulaire et en-tête HTTP est durci dès l'écriture.",
  },
  {
    icon: Code2,
    title: "Zéro template, zéro plugin fragile",
    body: "Pas d'empilement de dizaines d'extensions tierces qui ralentissent vos pages et ouvrent des brèches chaque semaine. Un code propre, typé et pérenne.",
  },
  {
    icon: KeyRound,
    title: "Souveraineté & propriété totale",
    body: "Dès la livraison, le dépôt Git, le nom de domaine et l'hébergement vous appartiennent à 100 %. Vous restez avec nous par choix, jamais par verrouillage.",
  },
  {
    icon: Eye,
    title: "Clarté radicale sans jargon",
    body: "Pas de discours alarmiste ni de facturation opaque : chaque recommandation technique est traduite en impact concret sur votre activité.",
  },
];

const STACK = [
  { category: "Frontend & Motion", items: ["Next.js 16 App Router", "React 19", "TypeScript Strict", "WebGL2 / GLSL", "Tailwind CSS v4"] },
  { category: "Sécurité & Réseau", items: ["TLS 1.3 A+", "CSP par Nonce", "HSTS Preload", "Rate-Limiting Edge", "Audit OWASP Top 10"] },
  { category: "Données & Observabilité", items: ["Analytics RGPD sans cookie", "Sauvegardes chiffrées", "Monitoring actif 24/7", "Alertes Webhook temps réel"] },
];

const STUDIO_FAQ = [
  {
    question: "Pourquoi réunir création web et cybersécurité dans un même studio ?",
    answer:
      "Parce qu'une agence web classique maîtrise rarement la sécurité offensive, tandis qu'un cabinet de cybersécurité ne conçoit pas d'interfaces. Réunir les deux disciplines élimine les angles morts, divise les délais par deux et garantit un site rapide comme irréprochable.",
  },
  {
    question: "Travaillez-vous avec des TPE/PME ou uniquement des grands comptes ?",
    answer:
      "Nous accompagnons aussi bien des indépendants, cabinets libéraux et PME ambitieuses que des start-ups SaaS en pleine croissance. Nos formules démarrent dès 1 490 € avec le même socle d'exigence.",
  },
  {
    question: "Puis-je faire auditer un site existant sans le refondre ?",
    answer:
      "Absolument. Notre Pôle Sécurité intervient de manière indépendante sur vos plateformes actuelles (WordPress, Shopify, Next.js, Symfony, API) avec un rapport actionnable livré sous 72 heures.",
  },
  {
    question: "Qui pilote mon projet au quotidien ?",
    answer:
      "Un interlocuteur senior unique du premier échange jusqu'à la mise en production — aucun intermédiaire commercial déconnecté de la réalité technique.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        overline="À propos · Le Studio"
        title="For Your Needs."
        titleMuted="L'artisanat du code sûr."
        intro="4ur est né d'un constat simple : le web moderne ne devrait jamais forcer à choisir entre la beauté d'une interface et la solidité de ses fondations."
        watermark="STUDIO"
      />

      {/* Manifeste & Piliers */}
      <section className="section-beam border-b border-white/[0.07] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <EyebrowPill dot="white">01 · Philosophie</EyebrowPill>
            <h2 className="mt-5 max-w-3xl text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              Construire moins de bruit.{" "}
              <span className="text-white/42">Plus de certitude.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="h-full">
                <SpotlightCard className="h-full p-7 sm:p-8">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.04]">
                    <p.icon className="size-5 text-foreground" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-muted-foreground">
                    {p.body}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stack d'ingénierie */}
      <section className="section-beam border-b border-white/[0.07] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <EyebrowPill dot="emerald">02 · Stack Technique</EyebrowPill>
                <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
                  Des fondations éprouvées.
                </h2>
              </div>
              <ActionButton
                href="/lab"
                variant="secondary"
                size="md"
                icon="arrow-right"
              >
                Inspecter dans le Lab
              </ActionButton>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STACK.map((group, i) => (
              <Reveal key={group.category} delay={i * 0.08} className="h-full">
                <SpotlightCard className="h-full p-7">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-emerald-400">
                    {group.category}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-foreground/90"
                      >
                        <span className="size-1 rounded-full bg-white/45" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Studio */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <EyebrowPill dot="white">03 · Questions fréquentes</EyebrowPill>
            <h2 className="mt-5 text-balance font-display text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
              Tout savoir avant{" "}
              <span className="text-white/42">de travailler ensemble.</span>
            </h2>
          </Reveal>
          <div className="mt-10">
            <Faq items={STUDIO_FAQ} />
          </div>
        </div>
      </section>

      <CtaBanner
        title="Faisons connaissance autour"
        titleMuted="de votre prochain projet."
        body="Réponse directe sous 24 h ouvrées par l'ingénieur qui concevra votre plateforme."
        cta="Nous écrire"
      />
    </>
  );
}
