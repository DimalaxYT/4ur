import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PricingCards } from "@/components/site/pricing-cards";
import { CtaBanner } from "@/components/site/cta-banner";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/site/reveal";
import { getContentBundle } from "@/lib/content";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { plans } = await getContentBundle();
  const recap = plans.map((p) => `${p.name} ${p.price}`).join(", ");
  return {
    title: "Tarifs — formules claires, zéro surprise",
    description: `Grille tarifaire transparente : ${recap}. Comparatif détaillé, options de maintenance et questions fréquentes.`,
  };
}

type Cell = string | boolean;

const COMPARISON: { label: string; essential: Cell; pro: Cell; entreprise: Cell }[] = [
  { label: "Pages incluses", essential: "3 à 5 pages", pro: "Jusqu'à 10 pages", entreprise: "Illimité" },
  { label: "Design sur mesure", essential: true, pro: true, entreprise: true },
  { label: "Responsive mobile / tablette", essential: true, pro: true, entreprise: true },
  { label: "Blog / actualités", essential: false, pro: true, entreprise: true },
  { label: "E-commerce / portail client", essential: false, pro: false, entreprise: true },
  { label: "Intégrations métier (CRM, API)", essential: false, pro: false, entreprise: true },
  { label: "SEO technique de base", essential: true, pro: true, entreprise: true },
  { label: "SEO renforcé + Analytics", essential: false, pro: true, entreprise: true },
  { label: "SSL + headers de sécurité", essential: true, pro: true, entreprise: true },
  { label: "Scan de vulnérabilités", essential: false, pro: true, entreprise: true },
  { label: "Audit complet + pentest léger", essential: false, pro: false, entreprise: true },
  { label: "Maintenance incluse", essential: "—", pro: "1 mois offert", entreprise: "Annuelle (SLA)" },
  { label: "Délai de livraison", essential: "2 – 3 semaines", pro: "4 – 6 semaines", entreprise: "Sur planning dédié" },
];

const TARIFS_FAQ = [
  {
    question: "Comment se passe le paiement ?",
    answer:
      "Pour les formules à prix fixe : 40 % à la commande (lancement du projet), 60 % à la livraison. Pour les projets Entreprise, un échéancier est établi au devis, généralement par jalons validés ensemble. Paiement par virement, facture avec TVA.",
  },
  {
    question: "Y a-t-il des frais cachés ou des options obligatoires ?",
    answer:
      "Non. Le devis liste tout : périmètre, délais, prix, ce qui est inclus et ce qui ne l'est pas. Les seuls coûts externes possibles (nom de domaine, hébergement, licences premium éventuelles) sont explicités et restent à votre nom.",
  },
  {
    question: "Que se passe-t-il si je veux modifier le projet en cours de route ?",
    answer:
      "Les petites retouches de contenu sont incluses. Pour une évolution de périmètre, nous chiffrons l'impact en temps et en délai avant de continuer — jamais de surprise sur la facture finale. Tout est validé par écrit avec vous.",
  },
  {
    question: "Pourquoi la formule Entreprise est-elle sur devis ?",
    answer:
      "Parce qu'un e-commerce ou un portail client peut aller du simple au triple selon les intégrations, les volumes et les exigences de disponibilité. Nous préférons un devis précis après un échange de 30 minutes, plutôt qu'un prix au doigt mouillé.",
  },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return <Check className="mx-auto size-4 text-foreground" strokeWidth={2.5} aria-label="Inclus" />;
  if (value === false)
    return <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="Non inclus" />;
  return <span className="text-[13px]">{value}</span>;
}

export default async function TarifsPage() {
  const { plans, recurring } = await getContentBundle();
  const planNames = plans.map((p) => p.name);

  return (
    <>
      <PageHeader
        overline="Tarifs — 4ur"
        title="Des prix clairs."
        titleMuted="Zéro surprise."
        intro="Milieu de gamme assumé : ni tarif bradé au détriment de la sécurité, ni facture d'agence parisienne. Le prix est fixe, le périmètre est écrit, les délais sont contractuels."
        watermark="TARIFS"
      />

      {/* Formules */}
      <section className="border-b border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <PricingCards plans={plans} />
        </div>
      </section>

      {/* Comparatif détaillé */}
      <section className="border-b border-white/10 bg-[#0d0d0d] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Le comparatif{" "}
              <span className="text-muted-foreground">ligne par ligne.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Pas de zone grise : chaque caractéristique est incluse, chiffrée
              séparément, ou simplement absente. Faites glisser le tableau sur mobile.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-x-auto rounded-lg border border-white/10 bg-card">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="w-[40%] py-4 text-muted-foreground">
                      Caractéristique
                    </TableHead>
                    {planNames.map((n) => (
                      <TableHead
                        key={n}
                        className="py-4 text-center font-display font-bold text-foreground"
                      >
                        {n}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARISON.map((row) => (
                    <TableRow key={row.label} className="border-white/10 hover:bg-white/[0.02]">
                      <TableCell className="py-3.5 text-[13px] text-muted-foreground">
                        {row.label}
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <CellValue value={row.essential} />
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <CellValue value={row.pro} />
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <CellValue value={row.entreprise} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services récurrents */}
      <section className="border-b border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Les services{" "}
              <span className="text-muted-foreground">qui tournent chaque mois.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Sans engagement long : chaque abonnement est résiliable à tout moment, avec
              récupération de tous vos accès et données.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {recurring.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1} className="h-full">
                <article className="h-full rounded-lg border border-white/10 bg-secondary/40 p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                    récurrent
                  </p>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                    {r.name}
                  </h3>
                  <p className="mt-1.5 font-display text-xl font-extrabold tracking-tight">
                    {r.price}
                  </p>
                  <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                    {r.body}
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
              Côté facturation,{" "}
              <span className="text-muted-foreground">tout est dit.</span>
            </h2>
          </Reveal>
          <div className="mt-10">
            <Faq items={TARIFS_FAQ} />
          </div>
        </div>
      </section>

      <CtaBanner
        title="Un doute sur la formule"
        titleMuted="qu'il vous faut ?"
        body="Décrivez votre projet : nous vous dirons franchement quelle formule colle — ou s'il en faut une sur mesure. Le devis est gratuit, sans engagement."
        cta="Recevoir mon devis"
      />
    </>
  );
}
