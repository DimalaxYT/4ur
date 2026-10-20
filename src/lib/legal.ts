/**
 * Informations légales de l'entreprise — un seul fichier à compléter.
 *
 * Les valeurs peuvent être surchargées par variables d'environnement (voir
 * `.env.example`) pour ne pas avoir à modifier le code au moment du déploiement.
 * Tant que les champs obligatoires restent vides, les pages légales affichent un
 * bandeau « à compléter ».
 */

const env = (key: string, fallback = ""): string =>
  process.env[key]?.trim() || fallback;

export const LEGAL = {
  company: env("NEXT_PUBLIC_COMPANY_NAME", "4ur"),
  legalForm: env("NEXT_PUBLIC_LEGAL_FORM", "Société par actions simplifiée unipersonnelle (SASU)"),
  capital: env("NEXT_PUBLIC_CAPITAL", ""),
  siren: env("NEXT_PUBLIC_SIREN", ""),
  siret: env("NEXT_PUBLIC_SIRET", ""),
  vat: env("NEXT_PUBLIC_VAT", ""),
  rcs: env("NEXT_PUBLIC_RCS", ""),
  address: env("NEXT_PUBLIC_LEGAL_ADDRESS", ""),
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", ""),
  phone: env("NEXT_PUBLIC_PHONE", ""),
  director: env("NEXT_PUBLIC_DIRECTOR", ""),
  hostName: env("NEXT_PUBLIC_HOST_NAME", ""),
  hostAddress: env("NEXT_PUBLIC_HOST_ADDRESS", ""),
  hostPhone: env("NEXT_PUBLIC_HOST_PHONE", ""),
  /** Délégué à la protection des données (optionnel). */
  dpo: env("NEXT_PUBLIC_DPO", ""),
  /** Durée de conservation des demandes de contact. */
  retention: env("NEXT_PUBLIC_RETENTION", "3 ans à compter du dernier échange"),
} as const;

/** Tant que ces champs sont vides, les mentions légales ne sont pas publiable en l'état. */
export const LEGAL_COMPLETE = Boolean(LEGAL.siren && LEGAL.address && LEGAL.email && LEGAL.hostName);
