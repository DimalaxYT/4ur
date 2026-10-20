import type { Metadata } from "next";
import {
  Gauge,
  Layout,
  PenTool,
  Search,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PricingCards } from "@/components/site/pricing-cards";
import { CtaBanner } from "@/components/site/cta-banner";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/site/reveal";
import { TiltCard } from "@/components/site/tilt-card";
import { Watermark } from "@/components/site/parallax";
import { getContentBundle } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pôle Web — création de sites sur mesure",
  description:
    "Sites vitrines, blogs, e-commerce et plateformes : design sur mesure, performance au vert, SEO propre et sécurité by design. Formules Essentiel, Pro et Entreprise.",
};

const CAPABILITIES = [
  {
    icon: PenTool,
    title: "Design sur mesure",
    body: "Chaque écran est dessiné pour votre marque, vos contenus et vos objectifs. Aucun template acheté, aucune esthétique copiée-collée.",
  },
  {
    icon: Gauge,
    title: "Performance au vert",
    body: "Images optimisées, code allégé, hébergement bien réglé : vos pages s'affichent en un éclair, même sur mobile en 4G faiblarde.",
  },
  {
    icon: Search,
    title: "SEO technique",
    body: "Structure sémantique, métadonnées, vitesse, données structurées : tout ce que Google adore est câblé dès la construction.",
  },
  {
    icon: Smartphone,
    title: "Mobile d'abord",
    body: "Plus de 60 % de vos visiteurs sont sur téléphone. Nous concevons pour le mobile, puis enrichissons pour le grand écran.",
  },
  {
    icon: Layout,
    title: "Blog & actualités",
    body: "Publiez vos articles et vos news sans toucher au code. Interface d'administration simple, formation incluse.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    body: "Catalogue, paiement sécurisé, livraison, TVA : nous montons votre boutique avec les intégrations métier qu'il vous faut.",
  },
];

const WEB_FAQ = [
  {
    question: "Combien de temps prend la création d'un site ?",
    answer:
      "Comptez 2 à 3 semaines pour une formule Essentiel, 4 à 6 semaines pour une formule Pro. Un e-commerce ou un portail métier demande généralement 6 à 10 semaines. Les délais exacts sont fixés dans le devis et contractualisés.",
  },
  {
    question: "Puis-je modifier mon site moi-même après la livraison ?",
    answer:
      "Oui. Vous recevez une interface d'administration simple pour vos contenus (articles, produits, photos) et une formation d'une heure incluse. Les modifications structurelles restent possibles via un devis.",
  },
  {
    question: "Le site m'appartient-il vraiment ?",
    answer:
      "Totalement. À la livraison, le code, les contenus et les accès (hébergement, domaine, outils) vous appartiennent. Aucune dépendance piège, aucune redevance cachée : vous pouvez partir avec tout, même si on espère vous garder.",
  },
  {
    question: "Que se passe-t-il si mon site tombe en panne ?",
    answer:
      "Avec l'option Veille & maintenance, vous êtes prévenu avant vos clients : monitoring 24/7, sauvegardes quotidiennes chiffrées et restauration testée. La plupart des incidents sont réglés en quelques heures.",
  },
];

export default async function WebPage() {
  const { plans, webOptions } = await getContentBundle();

  return (
    <>
      <PageHeader
        overline="Pôle web — 4ur web"
        title="Des sites qui convertissent."
        titleMuted="Et qui tiennent debout."
        intro="Vitrine, blog, e-commerce ou plateforme : chaque site est dessiné pour vos objectifs et blindé dès la conception. Une seule grille de prix, zéro surprise — et la cybersécurité toujours incluse dans chaque formule."
        watermark="WEB"
      />

      {/* Capacités */}
      <section className="relative border-b border-white/10 py-24 sm:py-32">
        <Watermark text="SUR MESURE" from={60} to={-60} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Ce que nous mettons{" "}
              <span className="text-muted-foreground">dans chaque projet.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.1} className="h-full">
                <TiltCard intensity={5} className="h-full">
                  <article className="group h-full rounded-lg border border-white/10 bg-card p-6 transition-colors hover:border-white/25">
                    <c.icon
                      className="size-6 text-foreground transition-transform duration-300 group-hover:-translate-y-1"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 font-display text-base font-bold tracking-tight">
                      {c.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {c.body}
                    </p>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Formules */}
      <section
        id="formules"
        className="border-b border-white/10 bg-[#0d0d0d] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Trois formules claires,{" "}
              <span className="text-muted-foreground">un seul standard de sécurité.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Prix fixes, périmètre écrit noir sur blanc, délais contractuels. Vous savez
              exactement ce que vous payez — et ce que vous obtenez.
            </p>
          </Reveal>
          <div className="mt-14">
            <PricingCards plans={plans} />
          </div>
        </div>
      </section>

      {/* Options & maintenance */}
      <section className="border-b border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Après la livraison,{" "}
              <span className="text-muted-foreground">on continue de veiller.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Un site laissé sans entretien devient lent, cassé et vulnérable. Nos
              services récurrents gardent le vôtre au niveau — sans que vous y pensiez.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {webOptions.map((o, i) => (
              <Reveal key={o.name} delay={i * 0.1} className="h-full">
                <article className="h-full rounded-lg border border-white/10 bg-secondary/40 p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                    option
                  </p>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                    {o.name}
                  </h3>
                  <p className="mt-1.5 font-display text-xl font-extrabold tracking-tight">
                    {o.price}
                  </p>
                  <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                    {o.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Les questions{" "}
              <span className="text-muted-foreground">qu'on nous pose toujours.</span>
            </h2>
          </Reveal>
          <div className="mt-10">
            <Faq items={WEB_FAQ} />
          </div>
        </div>
      </section>

      <CtaBanner
        title="Un projet de site ?"
        titleMuted="Parlons-en."
        body="Décrivez votre besoin en quelques lignes : nous vous répondons sous 24 h ouvrées avec un premier avis honnête et un ordre de grandeur réaliste."
        cta="Demander un devis"
      />
    </>
  );
}
