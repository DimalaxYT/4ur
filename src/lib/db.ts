import "server-only";

import { PrismaClient } from "@prisma/client";

/**
 * Client Prisma — instancié paresseusement.
 *
 * Pourquoi un proxy : `new PrismaClient()` peut lever (client non généré, moteur
 * indisponible…). Fait au chargement du module, ça faisait tomber **toutes** les
 * pages. En le déclenchant au premier accès, l'erreur est récupérable par les
 * appelants (`getContentBundle`, routes API) qui basculent alors sur leurs
 * valeurs de repli au lieu de renvoyer un 500.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
  });
}

function client(): PrismaClient {
  globalForPrisma.prisma ??= createClient();
  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const instance = client();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
