import type { Metadata } from "next";
import { CalendarClock, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Contact — parlons de vos besoins",
  description:
    "Un projet de site, un doute sur votre sécurité ? Racontez-nous : réponse personnelle sous 24 h ouvrées, premier avis honnête et gratuit, partout en France à distance.",
};

const CONTACT_FAQ = [
  {
    question: "En combien de temps répondez-vous vraiment ?",
    answer:
      "Sous 24 h ouvrées dans 95 % des cas. C'est une vraie personne qui lit votre message — pas un autoresponder. En période chargée, nous vous prévenons immédiatement si le délai dérape.",
  },
  {
    question: "Travaillez-vous uniquement en France ?",
    answer:
      "Nous travaillons 100 % à distance avec des clients partout en France (et parfois au-delà). Ateliers, points d'avancement et formations se font en visio, avec des comptes rendus écrits après chaque échange.",
  },
  {
    question: "Que se passe-t-il après mon premier message ?",
    answer:
      "Nous vous répondons sous 24 h pour caler un échange de 20 à 30 minutes. Ensuite, vous recevez sous 48 h un premier avis honnête : faisabilité, ordre de grandeur, délais. Le devis détaillé n'arrive qu'ensuite, si vous voulez continuer.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        overline="Contact — 4ur"
        title="Parlons de"
        titleMuted="vos besoins."
        intro="Un projet de site ? Un doute sur votre sécurité actuelle ? Racontez-nous. Nous répondons personnellement sous 24 h ouvrées, avec un premier avis honnête et gratuit."
      />

      <section className="border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
              Le meilleur moyen de démarrer{" "}
              <span className="text-muted-foreground">
                reste encore de nous écrire.
              </span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Plus votre message est concret (activité, objectifs, délais, ce que vous
              avez déjà), plus notre première réponse sera utile. Pas d'inquiétude si
              tout n'est pas encore clair : c'est aussi notre rôle de vous aider à
              cadrer.
            </p>

            <ul className="mt-10 flex flex-col gap-5">
              <li className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg border border-white/10 bg-card">
                  <Mail className="size-4.5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    email
                  </p>
                  <p className="text-sm font-medium">contact@4ur.fr</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg border border-white/10 bg-card">
                  <MapPin className="size-4.5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    zone
                  </p>
                  <p className="text-sm font-medium">France entière — 100 % à distance</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg border border-white/10 bg-card">
                  <CalendarClock
                    className="size-4.5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    délai de réponse
                  </p>
                  <p className="text-sm font-medium">Sous 24 h ouvrées — par un humain</p>
                </div>
              </li>
            </ul>
          </Reveal>

          <ContactForm />
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Avant d'écrire,{" "}
              <span className="text-muted-foreground">vos questions fréquentes.</span>
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
