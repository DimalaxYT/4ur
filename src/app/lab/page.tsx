import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { CyberLab } from "@/components/site/cyber-lab";
import { CtaBanner } from "@/components/site/cta-banner";

export const metadata: Metadata = {
  title: "Le Lab — simulateur cyber & performance temps réel",
  description:
    "Testez notre moteur de défense applicative en direct, inspectez nos en-têtes HTTP de sécurité et vérifiez nos métriques Core Web Vitals.",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        overline="Le Lab · Architecture Active"
        title="La sécurité ne se promet pas."
        titleMuted="Elle se démontre."
        intro="Lancez des vecteurs d'attaque simulés sur notre architecture, inspectez les en-têtes cryptographiques livrés sur chaque projet et comparez nos temps de réponse."
        watermark="LAB"
      />

      <CyberLab />

      <CtaBanner
        title="Prêt à équiper votre site"
        titleMuted="de cette même armure ?"
        body="Chaque site conçu par 4ur intègre nativement ces protections dès le premier déploiement."
        cta="Sécuriser mon projet"
      />
    </>
  );
}
