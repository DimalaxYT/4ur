import "server-only";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
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
 * Contenu éditable du site via le Dashboard.
 * Mis en cache mémoire Next.js (`unstable_cache`) pour un rendu instantané (< 1 ms)
 * et invalidé immédiatement à chaque sauvegarde (`revalidateTag` + `revalidatePath`).
 */

export type { ContentBundle, Plan, SecurityOffer, ServiceCard };
export {
  DEFAULT_BUNDLE,
  DEFAULT_PLANS,
  DEFAULT_RECURRING,
  DEFAULT_SECURITY_OFFERS,
  DEFAULT_WEB_OPTIONS,
};

const KEYS = {
  plans: "plans",
  securityOffers: "security_offers",
  webOptions: "web_options",
  recurring: "recurring",
} as const;

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

async function readContentBundleUncached(): Promise<ContentBundle> {
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

const getCachedBundle = unstable_cache(
  readContentBundleUncached,
  ["site-content-bundle"],
  { tags: ["site-content"], revalidate: 300 }
);

/** Lecture rapide mise en cache pour les pages publiques. */
export async function getContentBundle(): Promise<ContentBundle> {
  return getCachedBundle();
}

/** Lecture directe non cachée pour l'éditeur du Dashboard. */
export async function getContentBundleFresh(): Promise<ContentBundle> {
  return readContentBundleUncached();
}

/** Sauvegarde le bundle complet et invalide instantanément le cache des pages publiques. */
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

  revalidateTag("site-content", { expire: 0 });
  revalidatePath("/web");
  revalidatePath("/security");
  revalidatePath("/tarifs");
}
