import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { ProjectEstimator } from "@/components/site/project-estimator";
import { CtaBanner } from "@/components/site/cta-banner";

export const metadata: Metadata = {
  title: "Simulateur de projet — estimez votre budget & vos délais",
  description:
    "Configurez votre site web ou votre audit de cybersécurité en quelques clics et obtenez immédiatement une fourchette budgétaire et un planning réaliste.",
};

export default function SimulateurPage() {
  return (
    <>
      <PageHeader
        overline="Simulateur · Devis transparent"
        title="Configurez votre besoin."
        titleMuted="Chiffrez-le en direct."
        intro="Sélectionnez la nature de votre projet et vos modules optionnels pour estimer l'investissement et le calendrier avant même notre premier échange."
        watermark="DEVIS"
      />

      <ProjectEstimator />

      <CtaBanner
        title="Un besoin hybride ou spécifique ?"
        titleMuted="Parlons-en directement."
        body="Nous réalisons un atelier de cadrage gratuit et vous remettons un devis ferme sous 24 à 48 heures ouvrées."
        cta="Écrire à l'équipe"
      />
    </>
  );
}
