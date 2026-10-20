import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { LEGAL, LEGAL_COMPLETE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Quelles données 4ur collecte via le formulaire de contact, pourquoi, combien de temps, et comment exercer vos droits (accès, rectification, effacement).",
  robots: { index: true, follow: true },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="font-display text-lg font-extrabold tracking-tight">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader
        overline="Vos données — 4ur"
        title="Politique de"
        titleMuted="confidentialité."
        intro="Nous collectons le strict nécessaire pour vous répondre, nous le conservons le moins longtemps possible et nous ne revendons rien à personne. Voici le détail, noir sur blanc."
        watermark="RGPD"
      />

      <section className="border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {!LEGAL_COMPLETE && (
            <p className="mb-10 rounded-md border border-amber-500/30 bg-amber-500/5 p-4 font-mono text-[11px] leading-relaxed text-amber-300">
              ⚠️ Renseignez l&apos;identité du responsable de traitement (SIREN, adresse,
              e-mail) dans <code className="text-foreground">src/lib/legal.ts</code> ou par
              variables d&apos;environnement avant la mise en ligne.
            </p>
          )}

          <Reveal y={18}>
            <Section title="Responsable du traitement">
              <p>
                Les données collectées sur ce site sont traitées par{" "}
                <span className="text-foreground">{LEGAL.company}</span>
                {LEGAL.address ? `, ${LEGAL.address}` : ""}
                {LEGAL.siren ? ` — SIREN ${LEGAL.siren}` : ""}.
              </p>
              <p>
                Contact pour toute question relative à vos données :{" "}
                {LEGAL.email ? (
                  <a
                    href={`mailto:${LEGAL.email}`}
                    className="text-foreground underline underline-offset-4"
                  >
                    {LEGAL.email}
                  </a>
                ) : (
                  "adresse e-mail à compléter"
                )}
                {LEGAL.dpo ? ` — DPO : ${LEGAL.dpo}` : ""}.
              </p>
            </Section>

            <Section title="Données collectées et pourquoi">
              <p>
                Le seul formulaire du site recueille : votre nom, votre adresse e-mail,
                le nom de votre entreprise (facultatif), la nature de votre besoin, une
                tranche de budget (facultatif) et votre message.
              </p>
              <p>
                Finalité : répondre à votre demande, établir un devis, assurer le suivi
                commercial et, le cas échéant, la relation contractuelle. Aucune donnée
                n&apos;est utilisée à des fins publicitaires ni cédée à des tiers.
              </p>
              <p>
                Base légale : votre consentement (case à cocher au moment de l&apos;envoi)
                puis, si un projet démarre, l&apos;exécution du contrat et notre intérêt
                légitime à assurer le suivi de la relation commerciale.
              </p>
            </Section>

            <Section title="Durée de conservation">
              <p>
                Les demandes sont conservées {LEGAL.retention}. Au-delà, elles sont
                supprimées. Vous pouvez demander leur effacement anticipé à tout moment.
              </p>
            </Section>

            <Section title="Destinataires et sous-traitants">
              <p>
                Vos données sont accessibles aux seules personnes habilitées de{" "}
                {LEGAL.company}. Selon la configuration technique, elles transitent par :
              </p>
              <ul className="flex list-disc flex-col gap-1.5 pl-5">
                <li>
                  l&apos;hébergeur du site{LEGAL.hostName ? ` (${LEGAL.hostName})` : ""}, qui
                  stocke la base de données ;
                </li>
                <li>
                  un service d&apos;envoi d&apos;e-mails transactionnels, utilisé
                  uniquement pour nous notifier votre message ;
                </li>
                <li>
                  le ou les prestataires techniques intervenant sur le site, dans le cadre
                  strict de leurs missions.
                </li>
              </ul>
              <p>
                Aucune donnée n&apos;est transférée hors de l&apos;Union européenne sans
                garanties appropriées (clauses contractuelles types ou prestataire situé
                dans un pays reconnu comme adéquat).
              </p>
            </Section>

            <Section title="Sécurité">
              <p>
                Le site est servi en HTTPS, le formulaire est validé et protégé contre les
                soumissions automatisées (limitation du nombre d&apos;envois, pot de miel),
                l&apos;accès à l&apos;interface d&apos;administration est protégé par un
                code et une session signée. En cas de violation de données présentant un
                risque, vous et la CNIL seriez notifiés dans les délais réglementaires.
              </p>
            </Section>

            <Section title="Vos droits">
              <p>
                Conformément au RGPD et à la loi Informatique et Libertés, vous disposez
                d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de
                limitation, d&apos;opposition et de portabilité de vos données.
              </p>
              <p>
                Pour exercer ces droits, écrivez-nous à l&apos;adresse indiquée ci-dessus :
                nous répondons sous un mois. Si notre réponse ne vous satisfait pas, vous
                pouvez introduire une réclamation auprès de la CNIL (3 place de Fontenoy,
                TSA 80715, 75334 Paris Cedex 07 — cnil.fr).
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                Aucun cookie publicitaire ni traceur tiers n&apos;est déposé. Le cookie de
                session de l&apos;interface d&apos;administration (
                <code>4ur_dev_session</code>) n&apos;existe que pour les personnes
                autorisées à modifier le contenu du site. Le détail figure sur la page{" "}
                <Link
                  href="/mentions-legales"
                  className="text-foreground underline underline-offset-4"
                >
                  mentions légales
                </Link>
                .
              </p>
            </Section>

            <Section title="Mise à jour">
              <p>
                Cette politique peut évoluer avec le site. La version en vigueur est
                toujours celle publiée sur cette page. Dernière mise à jour : voir la date
                de publication de la page.
              </p>
            </Section>
          </Reveal>
        </div>
      </section>
    </>
  );
}
