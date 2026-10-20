import type { Metadata } from "next";
import {
  DatabaseBackup,
  FileCheck2,
  Fingerprint,
  GraduationCap,
  Radar,
  ServerCog,
} from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/reveal";
import { TiltCard } from "@/components/site/tilt-card";
import { Watermark } from "@/components/site/parallax";
import { getContentBundle } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pôle Sécurité — audit, monitoring & protection",
  description:
    "Audit & pentest, sécurisation de l'existant, monitoring 24/7, sauvegardes, sensibilisation et conformité RGPD : la cybersécurité expliquée en français clair.",
};

const STATS = [
  { value: "48 %", label: "des victimes de ransomware en France sont des PME & ETI" },
  { value: "330 k€", label: "coût moyen d'une cyberattaque réussie pour une PME" },
  { value: "90 %", label: "des intrusions commencent par un simple clic sur un mail de phishing" },
];

const SERVICES = [
  {
    icon: Fingerprint,
    title: "Audit & pentest",
    body: "Nous attaquons votre site avant les attaquants : failles connues, injections, mauvaises configurations, mots de passe faibles. Vous recevez un rapport clair, priorisé par criticité, avec un plan d'action chiffré.",
  },
  {
    icon: ServerCog,
    title: "Sécurisation de l'existant",
    body: "Votre site actuel n'a pas été pensé sécurisé ? Nous durcissons les headers HTTP, corrigeons les dépendances, verrouillons les accès admin et nettoyons les injections — sans reconstruire tout de zéro.",
  },
  {
    icon: Radar,
    title: "Monitoring 24/7",
    body: "Surveillance continue de votre site : indisponibilité, injection suspecte, comportement anormal, expiration de certificat. Vous êtes prévenu avant vos clients, avec un plan d'action déjà rédigé.",
  },
  {
    icon: DatabaseBackup,
    title: "Sauvegardes & continuité",
    body: "Sauvegardes chiffrées, automatiques et testées régulièrement — parce qu'une sauvegarde jamais restaurée est une illusion. Le jour où quelque chose casse, vous repartez en quelques heures.",
  },
  {
    icon: GraduationCap,
    title: "Sensibilisation des équipes",
    body: "90 % des intrusions commencent par un clic. Nous formons vos collaborateurs au phishing, aux mots de passe et aux bons réflexes, en ateliers courts et concrets, sans jargon ni culpabilisation.",
  },
  {
    icon: FileCheck2,
    title: "Conformité & RGPD",
    body: "Cookies, consentement, données personnelles, mentions légales, registre des traitements : nous mettons votre site en règle et documentons tout, pour dormir sur ses deux oreilles.",
  },
];

const TERMINAL_LINES = [
  { status: "ok", text: "headers de sécurité", value: "CSP · HSTS · X-Frame" },
  { status: "ok", text: "certificat SSL/TLS", value: "note A+" },
  { status: "ok", text: "sauvegardes automatiques", value: "quotidiennes · chiffrées" },
  { status: "warn", text: "dépendances obsolètes", value: "2 mises à jour requises" },
  { status: "ok", text: "protection anti-spam", value: "active" },
  { status: "ok", text: "conformité RGPD", value: "bannière + registre" },
];

export default async function SecurityPage() {
  const { securityOffers } = await getContentBundle();

  return (
    <>
      <PageHeader
        overline="Pôle sécurité — 4ur security"
        title="La cybersécurité,"
        titleMuted="sans le jargon."
        intro="Vous n'avez pas besoin de devenir un expert en sécurité. Vous avez besoin qu'un expert s'en occupe. Nous protégeons votre site, vos données et votre réputation — et nous vous expliquons tout, en français clair."
        watermark="SECUR"
      />

      {/* Chiffres */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {STATS.map((s) => (
            <div key={s.value} className="flex items-baseline gap-3 py-6 sm:flex-col sm:gap-1 sm:py-8">
              <span className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                {s.value}
              </span>
              <span className="max-w-[30ch] text-xs leading-relaxed text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <p className="border-t border-white/10 py-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          sources : ANSSI · Verizon DBIR — 2025
        </p>
      </section>

      {/* Services */}
      <section className="relative border-b border-white/10 py-24 sm:py-32">
        <Watermark text="PROTEGER" from={60} to={-60} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Six façons de vous rendre{" "}
              <span className="text-muted-foreground">invivable pour les attaquants.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.1} className="h-full">
                <TiltCard intensity={5} className="h-full">
                  <article className="group h-full rounded-lg border border-white/10 bg-card p-6 transition-colors hover:border-white/25">
                    <s.icon
                      className="size-6 text-foreground transition-transform duration-300 group-hover:-translate-y-1"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 font-display text-base font-bold tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal + offres */}
      <section className="border-b border-white/10 bg-[#0d0d0d] py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              À quoi ressemble{" "}
              <span className="text-muted-foreground">un site bien protégé ?</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Après chaque audit, vous recevez ce type de rapport : chaque contrôle est
              expliqué, chaque alerte est priorisée, chaque correction est chiffrée. Pas
              de fichier PDF illisible de 80 pages — du concret, en français.
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Le rapport complet et les correctifs sont livrés sous 72 h après l'audit.
              Si une faille critique est découverte, nous vous appelons directement —
              avant d'écrire le moindre rapport.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-lg border border-white/12 bg-[#050505] shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                </div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
                  4ur@security: ~/scan
                </p>
              </div>
              <div className="p-5 font-mono text-[12px] leading-7 sm:text-[13px]">
                <p className="text-muted-foreground">
                  <span className="text-foreground">$</span> 4ur audit --target votre-site.fr
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {TERMINAL_LINES.map((l) => (
                    <li key={l.text} className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        <span
                          className={l.status === "ok" ? "text-foreground" : "text-muted-foreground"}
                        >
                          [{l.status === "ok" ? "✓" : "!"}]
                        </span>{" "}
                        {l.text}
                      </span>
                      <span
                        className={
                          l.status === "ok"
                            ? "shrink-0 text-foreground"
                            : "shrink-0 underline decoration-dotted underline-offset-4"
                        }
                      >
                        {l.value}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-white/10 pt-3 text-muted-foreground">
                  rapport complet + correctifs —{" "}
                  <span className="text-foreground">livré sous 72 h</span>
                  <span className="animate-caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-foreground" />
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Trois façons de travailler{" "}
              <span className="text-muted-foreground">avec notre pôle sécurité.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {securityOffers.map((o, i) => (
              <Reveal key={o.name} delay={i * 0.1} className="h-full">
                <article
                  className={
                    i === 2
                      ? "flex h-full flex-col rounded-lg border border-primary bg-primary p-7 text-primary-foreground"
                      : "flex h-full flex-col rounded-lg border border-white/10 bg-card p-7"
                  }
                >
                  <p
                    className={
                      i === 2
                        ? "font-mono text-[10px] uppercase tracking-[0.26em] opacity-70"
                        : "font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground"
                    }
                  >
                    offre
                  </p>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                    {o.name}
                  </h3>
                  <p
                    className={
                      i === 2
                        ? "mt-1.5 font-display text-xl font-extrabold tracking-tight"
                        : "mt-1.5 font-display text-xl font-extrabold tracking-tight"
                    }
                  >
                    {o.price}
                  </p>
                  <p
                    className={
                      i === 2
                        ? "mt-2 text-sm opacity-80"
                        : "mt-2 text-sm text-muted-foreground"
                    }
                  >
                    {o.pitch}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug">
                        <span
                          className="mt-[7px] size-1.5 shrink-0 rounded-full bg-current opacity-70"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Un doute sur votre sécurité actuelle ?"
        titleMuted="Vérifions ensemble."
        body="L'audit express de 30 minutes est offert et sans engagement. Au pire, vous repartez avec trois recommandations concrètes. Au mieux, on vous évite 330 000 € de dégâts."
        cta="Réserver mon audit gratuit"
      />
    </>
  );
}
