import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard Administration",
  description:
    "Tableau de bord protégé 4ur : statistiques du site en temps réel, monitoring de disponibilité, Webhook Discord et gestion du contenu.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
