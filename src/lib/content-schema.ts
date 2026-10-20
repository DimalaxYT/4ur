import { z } from "zod";

/**
 * Schémas du contenu éditable — partagés entre :
 * - `PUT /api/dev/content` (validation à l'écriture)
 * - `getContentBundle()`   (validation à la lecture : une ligne corrompue en base
 *                           ne doit jamais faire tomber les pages publiques)
 *
 * Serveur uniquement : ce module n'est jamais importé par un composant client.
 */

export const serviceCardSchema = z.object({
  name: z.string().trim().min(1).max(80),
  price: z.string().trim().min(1).max(40),
  body: z.string().trim().max(500),
});

export const planSchema = z.object({
  name: z.string().trim().min(1).max(60),
  price: z.string().trim().min(1).max(40),
  detail: z.string().trim().min(1).max(120),
  pitch: z.string().trim().min(1).max(160),
  features: z.array(z.string().trim().min(1).max(140)).min(1).max(12),
  cta: z.string().trim().min(1).max(60),
  popular: z.boolean(),
});

export const securityOfferSchema = z.object({
  name: z.string().trim().min(1).max(60),
  price: z.string().trim().min(1).max(40),
  pitch: z.string().trim().min(1).max(160),
  features: z.array(z.string().trim().min(1).max(140)).min(1).max(12),
});

/** Le bundle complet : 3 items attendus par section. */
export const bundleSchema = z.object({
  plans: z.array(planSchema).length(3),
  securityOffers: z.array(securityOfferSchema).length(3),
  webOptions: z.array(serviceCardSchema).length(3),
  recurring: z.array(serviceCardSchema).length(3),
});

export const BUNDLE_HINT =
  "Contenu invalide : 3 items par section, champs remplis (40 caractères max sur les prix).";
