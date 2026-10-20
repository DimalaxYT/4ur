import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { LEGAL, LEGAL_COMPLETE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Éditeur du site, hébergeur, propriété intellectuelle et cookies : les informations légales de 4ur.",
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

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader
        overline="Informations légales — 4ur"
        title="Mentions légales"
        titleMuted="Transparence d'abord."
        intro="Qui édite ce site, qui l'héberge, ce que vous pouvez faire du contenu et comment nous utilisons les cookies. Écrit en français lisible, pas en jargon d'avocat."
        watermark="LEGAL"
      />

      <section className="border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {!LEGAL_COMPLETE && (
            <p className="mb-10 rounded-md border border-amber-500/30 bg-amber-500/5 p-4 font-mono text-[11px] leading-relaxed text-amber-300">
              ⚠️ Ces mentions contiennent encore des valeurs à compléter (SIREN, adresse,
              e-mail de contact, hébergeur). Renseignez-les dans{" "}
              <code className="text-foreground">src/lib/legal.ts</code> ou par variables
              d&apos;environnement avant la mise en ligne.
            </p>
          )}

          <Reveal y={18}>
            <Section title="Éditeur du site">
              <p>
                Le site <span className="text-foreground">4ur</span> est édité par{" "}
                <span className="text-foreground">{LEGAL.company}</span>
                {LEGAL.legalForm ? `, ${LEGAL.legalForm}` : ""}
                {LEGAL.capital ? ` au capital de ${LEGAL.capital}` : ""}.
              </p>
              <ul className="flex flex-col gap-1.5">
                <li>Siège social : {LEGAL.address || "à compléter"}</li>
                <li>SIREN : {LEGAL.siren || "à compléter"}</li>
                {LEGAL.siret && <li>SIRET : {LEGAL.siret}</li>}
                {LEGAL.rcs && <li>RCS : {LEGAL.rcs}</li>}
                {LEGAL.vat && <li>TVA intracommunautaire : {LEGAL.vat}</li>}
                <li>
                  Contact :{" "}
                  {LEGAL.email ? (
                    <a
                      href={`mailto:${LEGAL.email}`}
                      className="text-foreground underline underline-offset-4"
                    >
                      {LEGAL.email}
                    </a>
                  ) : (
                    "à compléter"
                  )}
                </li>
                {LEGAL.phone && <li>Téléphone : {LEGAL.phone}</li>}
              </ul>
            </Section>

            <Section title="Directeur de la publication">
              <p>
                {LEGAL.director || "Le représentant légal de " + LEGAL.company} —{" "}
                {LEGAL.email ? LEGAL.email : "adresse e-mail à compléter"}.
              </p>
            </Section>

            <Section title="Hébergement">
              <p>
                Le site est hébergé par{" "}
                <span className="text-foreground">{LEGAL.hostName || "à compléter"}</span>
                {LEGAL.hostAddress ? `, ${LEGAL.hostAddress}` : ""}
                {LEGAL.hostPhone ? ` — ${LEGAL.hostPhone}` : ""}.
              </p>
            </Section>

            <Section title="Propriété intellectuelle">
              <p>
                L&apos;ensemble des contenus présents sur ce site (textes, visuels,
                identité graphique, éléments d&apos;interface, code) est protégé par le
                droit de la propriété intellectuelle. Sauf mention contraire, ils sont la
                propriété exclusive de {LEGAL.company}. Toute reproduction, représentation
                ou exploitation, totale ou partielle, sans autorisation écrite préalable
                est interdite.
              </p>
              <p>
                Les marques et logos des partenaires ou des technologies citées
                appartiennent à leurs propriétaires respectifs.
              </p>
            </Section>

            <Section title="Cookies et mesure d'audience">
              <p>
                Ce site fonctionne sans cookie publicitaire ni traceur tiers. Seuls des
                cookies strictement nécessaires sont utilisés : le cookie de session du
                panneau d&apos;administration (<code>4ur_dev_session</code>), déposé
                uniquement après saisie du code d&apos;accès, et les préférences
                d&apos;affichage éventuelles. Aucun consentement n&apos;est donc requis
                pour la simple consultation du site.
              </p>
              <p>
                Si une solution de mesure d&apos;audience est ajoutée ultérieurement,
                elle sera configurée en exemption de consentement (ou soumise à votre
                accord explicite) et cette page sera mise à jour.
              </p>
            </Section>

            <Section title="Responsabilité">
              <p>
                Les informations publiées sur ce site sont fournies à titre indicatif et
                peuvent évoluer. {LEGAL.company} ne saurait être tenu responsable des
                dommages résultant d&apos;une intrusion frauduleuse d&apos;un tiers, ni
                de l&apos;utilisation qui serait faite des informations publiées.
              </p>
            </Section>

            <Section title="Droit applicable et médiation">
              <p>
                Les présentes mentions sont soumises au droit français. En cas de litige
                et à défaut de résolution amiable, vous pouvez recourir gratuitement au
                médiateur de la consommation compétent ou saisir la plateforme
                européenne de règlement en ligne des litiges.
              </p>
            </Section>
          </Reveal>
        </div>
      </section>
    </>
  );
}
