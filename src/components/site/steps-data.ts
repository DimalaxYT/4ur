export interface Step {
  num: string;
  title: string;
  body: string;
}

export const STEPS: Step[] = [
  {
    num: "01",
    title: "Écoute & audit",
    body: "Tout part de vos besoins : objectifs, clients, contraintes, risques. Nous cartographions ce que votre site doit faire — et ce qu'il doit empêcher.",
  },
  {
    num: "02",
    title: "Conception sécurisée",
    body: "Architecture, parcours utilisateurs, gestion des données : le design et le modèle de menace avancent ensemble. Moindre privilège, RGPD dès l'UX.",
  },
  {
    num: "03",
    title: "Construction & tests",
    body: "Code review systématique, dépendances vérifiées, tests d'intrusion internes avant chaque mise en ligne. Ce qui est livré a déjà été attaqué.",
  },
  {
    num: "04",
    title: "Supervision continue",
    body: "Mise en production n'est pas fin du voyage : monitoring, mises à jour, sauvegardes testées et plan de réponse. Votre site reste protégé dans le temps.",
  },
];

export interface StepDetail extends Step {
  deliverables: string[];
}

/** Version étendue des étapes, utilisée sur la page Méthode. */
export const STEPS_DETAILS: StepDetail[] = [
  {
    ...STEPS[0],
    deliverables: [
      "Atelier de cadrage (2 h, offert)",
      "Note de cadrage & objectifs mesurables",
      "Première cartographie des risques",
    ],
  },
  {
    ...STEPS[1],
    deliverables: [
      "Maquettes haute-fidélité (desktop + mobile)",
      "Architecture technique & modèle de menace",
      "Registre RGPD pré-rempli",
    ],
  },
  {
    ...STEPS[2],
    deliverables: [
      "Environnement de préproduction privé",
      "Rapport de tests (intrusion & performance)",
      "Formation à la prise en main (1 h)",
    ],
  },
  {
    ...STEPS[3],
    deliverables: [
      "Dashboard de disponibilité & alertes",
      "Sauvegardes chiffrées testées chaque mois",
      "Plan de réponse à incident documenté",
    ],
  },
];

export const ENGAGEMENTS = [
  { k: "Réponse", v: "sous 24 h ouvrées, humaine — pas de robot" },
  { k: "Devis", v: "gratuit, détaillé, sans engagement" },
  { k: "Livraison", v: "délais contractuels, tenus ou remboursés" },
];
