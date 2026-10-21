import type { Metadata } from "next";
import { CalendarClock, Calculator, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { ActionButton } from "@/components/site/action-button";

export const metadata: Metadata = {
  title: "Contact — parlons de vos besoins",
  description:
    "Un projet de site, un doute sur votre sécurité ? Racontez-nous : réponse personnelle sous 24 h ouvrées, premier avis honnête et gratuit, partout en France à distance.",
};

const CONTACT_FAQ = [
  {
    question: "En combien de temps répondez-vous ?",
    answer:
      "Sous 24 h ouvrées. Votre message est lu directement par l'ingénieur qui pilotera votre dossier — aucun filtre commercial automatisé.",
  },
  {
    question: "Accompagnez-vous des clients partout en France ?",
    answer:
      "Oui, nous opérons à distance en France comme à l'international avec des points visio structurés et des comptes rendus écrits à chaque jalon.",
  },
  {
    question: "Que se passe-t-il après l'envoi de ce formulaire ?",
    answer:
      "Nous vous répondons sous 24 h pour planifier un échange de cadrage de 25 minutes, suivi d'une proposition chiffrée claire et sans engagement.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        overline="Contact · Démarrer"
        title="Parlons de"
        titleMuted="votre prochain cap."
        intro="Un projet de création, une refonte ou un audit de sécurité ? Écrivez-nous directement : réponse personnelle sous 24 h ouvrées."
        watermark="CONTACT"
      />

      <section className="section-beam border-b border-white/[0.08] py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.2fr]">
          <Reveal className="flex flex-col justify-between gap-8">
            <div>
              <h2 className="font-display text-2xl font-extrabold leading-tight tracking-[-0.025em] sm:text-3xl">
                Un interlocuteur direct,{" "}
                <span className="text-white/42">du premier mot à la mise en ligne.</span>
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-[1.7] text-muted-foreground">
                Précisez simplement votre activité, vos objectifs et votre horizon souhaité.
                Si tout n&apos;est pas encore arrêté, nous cadrons ensemble.
              </p>

              <ul className="mt-9 flex flex-col gap-4">
                <li className="flex items-center gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.035]">
                    <Mail className="size-4.5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      email direct
                    </p>
                    <p className="text-sm font-medium">contact@4ur.fr</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.035]">
                    <MapPin className="size-4.5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      couverture
                    </p>
                    <p className="text-sm font-medium">Paris · France &amp; International</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.035]">
                    <CalendarClock className="size-4.5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      réactivité
                    </p>
                    <p className="text-sm font-medium">Sous 24 h ouvrées</p>
                  </div>
                </li>
              </ul>
            </div>

            <SpotlightCard className="p-6">
              <div className="flex items-start gap-3.5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.04]">
                  <Calculator className="size-4.5 text-emerald-400" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-display text-sm font-bold">
                    Vous souhaitez d&apos;abord estimer l&apos;enveloppe ?
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Simulez vos modules en 30 secondes et revenez ici avec votre brief
                    pré-rempli.
                  </p>
                  <div className="mt-4">
                    <ActionButton
                      href="/simulateur"
                      variant="secondary"
                      size="sm"
                      icon="arrow-right"
                    >
                      Lancer le simulateur
                    </ActionButton>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          <ContactForm />
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-balance font-display text-2xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
              Questions{" "}
              <span className="text-white/42">avant de démarrer.</span>
            </h2>
          </Reveal>
          <div className="mt-10">
            <Faq items={CONTACT_FAQ} />
          </div>
        </div>
      </section>
    </>
  );
}
