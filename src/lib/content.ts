import { db } from "@/lib/db";

/**
 * Contenu éditable du site via le menu « dev » caché.
 * Persisté en DB (table SiteContent, clé → JSON) avec fallback
 * sur les valeurs par défaut ci-dessous si rien n'est stocké.
 */

export interface Plan {
  name: string;
  price: string;
  detail: string;
  pitch: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface SecurityOffer {
  name: string;
  price: string;
  pitch: string;
  features: string[];
}

export interface ServiceCard {
  name: string;
  price: string;
  body: string;
}

export interface ContentBundle {
  plans: Plan[];
  securityOffers: SecurityOffer[];
  webOptions: ServiceCard[];
  recurring: ServiceCard[];
}

/* ------------------------------------------------------------------ */
/*  Valeurs par défaut (utilisées tant que le dev n'a rien changé)    */
/* ------------------------------------------------------------------ */

export const DEFAULT_PLANS: Plan[] = [
  {
    name: "Essentiel",
    price: "2 490 €",
    detail: "Site vitrine — paiement unique",
    pitch: "Pour exister en ligne proprement, vite et bien.",
    features: [
      "3 à 5 pages (accueil, services, à propos, contact)",
      "Design 100 % sur mesure — aucun template générique",
      "Responsive mobile / tablette / desktop",
      "Certificat SSL + headers de sécurité",
      "Formulaire de contact protégé anti-spam",
      "Livraison en 2 à 3 semaines",
    ],
    cta: "Choisir Essentiel",
    popular: false,
  },
  {
    name: "Pro",
    price: "4 990 €",
    detail: "Site business — paiement unique",
    pitch: "Pour transformer votre site en machine à prospects.",
    features: [
      "Jusqu'à 10 pages + blog / actualités",
      "Design 100 % sur mesure — aucun template générique",
      "Responsive mobile / tablette / desktop",
      "Performance optimisée (Core Web Vitals au vert)",
      "SEO renforcé + Google Analytics / Search Console",
      "Scan de vulnérabilités avant mise en ligne",
      "Maintenance & mises à jour : 1 mois offert",
      "Livraison en 4 à 6 semaines",
    ],
    cta: "Choisir Pro",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    detail: "E-commerce, portails, plateformes",
    pitch: "Pour les projets qui ont des exigences spécifiques.",
    features: [
      "E-commerce ou portail client sur mesure",
      "Intégrations métier (CRM, paiement, API)",
      "Audit de sécurité complet + pentest léger",
      "Plan de continuité : sauvegardes & reprise",
      "Contrat de maintenance annuel & SLA",
    ],
    cta: "Demander un devis",
    popular: false,
  },
];

export const DEFAULT_SECURITY_OFFERS: SecurityOffer[] = [
  {
    name: "Audit express",
    price: "Offert — 30 min",
    pitch: "Le premier diagnostic, sans engagement.",
    features: [
      "Visio avec un expert sécurité",
      "Premier scan automatisé de votre site",
      "3 priorités à traiter, noir sur blanc",
    ],
  },
  {
    name: "Audit complet",
    price: "dès 990 €",
    pitch: "L'état des lieux exhaustif de votre exposition.",
    features: [
      "Pentest web manuel + automatisé",
      "Rapport priorisé par criticité",
      "Correctifs appliqués ou accompagnés",
      "Restitution à vos équipes",
    ],
  },
  {
    name: "Sérénité",
    price: "dès 79 €/mois",
    pitch: "On surveille, vous dormez.",
    features: [
      "Monitoring 24/7 & alertes qualifiées",
      "Sauvegardes chiffrées testées",
      "Mises à jour de sécurité appliquées",
      "Petits correctifs inclus",
    ],
  },
];

export const DEFAULT_WEB_OPTIONS: ServiceCard[] = [
  {
    name: "Veille & maintenance",
    price: "dès 49 €/mois",
    body: "Mises à jour, sauvegardes testées, monitoring de disponibilité et petits correctifs inclus. Votre site reste propre, mois après mois.",
  },
  {
    name: "Pack contenu",
    price: "sur devis",
    body: "Rédaction de pages, photo, pictos, mise en forme : nous alimentons votre site pour qu'il vive, pendant que vous courez votre business.",
  },
  {
    name: "Migration & reprise",
    price: "dès 390 €",
    body: "Votre site actuel est lent, vulnérable ou mal référencé ? Nous le migrons proprement vers une base saine, sans perte de SEO.",
  },
];

export const DEFAULT_RECURRING: ServiceCard[] = [
  {
    name: "Veille & maintenance",
    price: "dès 49 €/mois",
    body: "Mises à jour, sauvegardes testées, monitoring de disponibilité, petits correctifs. Résiliable chaque mois.",
  },
  {
    name: "Sérénité sécurité",
    price: "dès 79 €/mois",
    body: "Monitoring 24/7, alertes qualifiées, mises à jour de sécurité appliquées, plan de réponse à incident.",
  },
  {
    name: "SLA Entreprise",
    price: "sur devis",
    body: "Engagement de temps de réponse contractuel, astreinte prioritaire, reporting mensuel de sécurité.",
  },
];

export const DEFAULT_BUNDLE: ContentBundle = {
  plans: DEFAULT_PLANS,
  securityOffers: DEFAULT_SECURITY_OFFERS,
  webOptions: DEFAULT_WEB_OPTIONS,
  recurring: DEFAULT_RECURRING,
};

/* ------------------------------------------------------------------ */
/*  Lecture / écriture                                                 */
/* ------------------------------------------------------------------ */

/** Clés de section stockées en DB. */
const KEYS = {
  plans: "plans",
  securityOffers: "security_offers",
  webOptions: "web_options",
  recurring: "recurring",
} as const;

/** Lit le bundle depuis la DB — fallback silencieux sur les défauts. */
export async function getContentBundle(): Promise<ContentBundle> {
  try {
    const rows = await db.siteContent.findMany({
      where: { key: { in: Object.values(KEYS) } },
    });
    const byKey = new Map(rows.map((r) => [r.key, r.value]));
    const parse = <T>(key: string, fallback: T): T => {
      const raw = byKey.get(key);
      if (!raw) return fallback;
      try {
        const parsed = JSON.parse(raw) as T;
        return parsed ?? fallback;
      } catch {
        return fallback;
      }
    };
    return {
      plans: parse(KEYS.plans, DEFAULT_PLANS),
      securityOffers: parse(KEYS.securityOffers, DEFAULT_SECURITY_OFFERS),
      webOptions: parse(KEYS.webOptions, DEFAULT_WEB_OPTIONS),
      recurring: parse(KEYS.recurring, DEFAULT_RECURRING),
    };
  } catch (err) {
    console.error("[content] lecture impossible, valeurs par défaut:", err);
    return DEFAULT_BUNDLE;
  }
}

/** Sauvegarde le bundle complet (upsert par clé). */
export async function saveContentBundle(bundle: ContentBundle): Promise<void> {
  const entries: [string, unknown][] = [
    [KEYS.plans, bundle.plans],
    [KEYS.securityOffers, bundle.securityOffers],
    [KEYS.webOptions, bundle.webOptions],
    [KEYS.recurring, bundle.recurring],
  ];
  for (const [key, value] of entries) {
    await db.siteContent.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }
}
