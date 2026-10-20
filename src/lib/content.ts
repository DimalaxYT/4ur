import "server-only";

import { z } from "zod";
import { db } from "@/lib/db";
import { planSchema, securityOfferSchema, serviceCardSchema } from "@/lib/content-schema";
import {
  DEFAULT_BUNDLE,
  DEFAULT_PLANS,
  DEFAULT_RECURRING,
  DEFAULT_SECURITY_OFFERS,
  DEFAULT_WEB_OPTIONS,
} from "@/lib/content-defaults";
import type {
  ContentBundle,
  Plan,
  SecurityOffer,
  ServiceCard,
} from "@/lib/content-defaults";

/**
 * Contenu éditable du site via le menu « dev » caché.
 * Persisté en DB (table SiteContent, clé → JSON) avec fallback
 * sur les valeurs par défaut si rien n'est stocké — ou si la lecture échoue.
 *
 * ⚠️ Serveur uniquement (Prisma). Les valeurs par défaut et les types vivent
 * dans `@/lib/content-defaults`, importable côté client.
 */

export type { ContentBundle, Plan, SecurityOffer, ServiceCard };
export {
  DEFAULT_BUNDLE,
  DEFAULT_PLANS,
  DEFAULT_RECURRING,
  DEFAULT_SECURITY_OFFERS,
  DEFAULT_WEB_OPTIONS,
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

/** Lit une section : JSON stocké → validé par le schéma → sinon valeur par défaut. */
function readSection<S extends z.ZodTypeAny>(
  byKey: Map<string, string>,
  key: string,
  schema: S,
  fallback: z.infer<S>
): z.infer<S> {
  const raw = byKey.get(key);
  if (!raw) return fallback;
  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

/** Lit le bundle depuis la DB — fallback silencieux sur les défauts. */
export async function getContentBundle(): Promise<ContentBundle> {
  try {
    const rows = await db.siteContent.findMany({
      where: { key: { in: Object.values(KEYS) } },
    });
    const byKey = new Map<string, string>(
      rows.map((r): [string, string] => [r.key, r.value])
    );
    return {
      plans: readSection(byKey, KEYS.plans, z.array(planSchema).length(3), DEFAULT_PLANS),
      securityOffers: readSection(
        byKey,
        KEYS.securityOffers,
        z.array(securityOfferSchema).length(3),
        DEFAULT_SECURITY_OFFERS
      ),
      webOptions: readSection(
        byKey,
        KEYS.webOptions,
        z.array(serviceCardSchema).length(3),
        DEFAULT_WEB_OPTIONS
      ),
      recurring: readSection(
        byKey,
        KEYS.recurring,
        z.array(serviceCardSchema).length(3),
        DEFAULT_RECURRING
      ),
    };
  } catch (err) {
    console.error("[content] lecture impossible, valeurs par défaut:", err);
    return DEFAULT_BUNDLE;
  }
}

/** Sauvegarde le bundle complet (upsert par clé, en une transaction). */
export async function saveContentBundle(bundle: ContentBundle): Promise<void> {
  const entries: [string, unknown][] = [
    [KEYS.plans, bundle.plans],
    [KEYS.securityOffers, bundle.securityOffers],
    [KEYS.webOptions, bundle.webOptions],
    [KEYS.recurring, bundle.recurring],
  ];

  await db.$transaction(
    entries.map(([key, value]) =>
      db.siteContent.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      })
    )
  );
}
