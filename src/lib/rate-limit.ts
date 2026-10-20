import "server-only";

/**
 * Limitation de débit en mémoire, partagée par toutes les routes sensibles.
 *
 * Principes :
 * - **Deux seaux** : un par IP (si l'IP est fiable) et un global par scope. Le
 *   seau global encaisse le cas « l'attaquant fait tourner `X-Forwarded-For` »,
 *   ce qui rendait l'ancien limiteur inopérant.
 * - **IP fiable uniquement derrière un proxy de confiance** (`TRUST_PROXY=1`) :
 *   sinon n'importe qui peut forger `X-Forwarded-For` et obtenir un seau neuf.
 * - **Mémoire bornée** : purge des seaux expirés puis, si besoin, des plus
 *   anciens — un flot d'IP forgées ne peut plus faire gonfler la Map sans fin.
 * - **Remboursement** (`release`) : une requête rejetée par la validation ne
 *   doit pas consommer le quota d'un utilisateur légitime qui s'est trompé.
 */

export type Scope = "contact" | "dev-pin" | "dev-content";

interface Policy {
  /** Tentatives autorisées par IP dans la fenêtre. */
  limit: number;
  windowMs: number;
  /** Plafond global (toutes IP confondues) sur la même fenêtre. */
  globalLimit: number;
  /** Plafond utilisé quand l'IP n'est pas fiable (bucket partagé). */
  unknownIpLimit: number;
}

const MINUTE = 60_000;

const POLICIES: Record<Scope, Policy> = {
  // Formulaire de contact : souple par IP, mais borné globalement.
  contact: { limit: 5, windowMs: 10 * MINUTE, unknownIpLimit: 40, globalLimit: 150 },
  // PIN du panneau dev : strict — c'est la seule porte d'entrée de l'admin.
  "dev-pin": { limit: 5, windowMs: 15 * MINUTE, unknownIpLimit: 15, globalLimit: 30 },
  // Écritures de contenu : large, il sert surtout à détecter un abus.
  "dev-content": { limit: 60, windowMs: 10 * MINUTE, unknownIpLimit: 60, globalLimit: 600 },
};

interface Bucket {
  count: number;
  reset: number;
}

const MAX_BUCKETS = 5_000;
const buckets = new Map<string, Bucket>();

/** Les en-têtes de proxy ne sont fiables que si on l'a explicitement activé. */
const TRUST_PROXY = process.env.TRUST_PROXY === "1";

/** IP du client, ou `null` si aucun en-tête de proxy n'est fiable. */
export function clientIp(request: Request): string | null {
  if (!TRUST_PROXY) return null;
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  return real || null;
}

function prune(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.reset <= now) buckets.delete(key);
  }
  if (buckets.size >= MAX_BUCKETS) {
    // Toujours plein : on abandonne les seaux les plus anciens (insertion ordonnée).
    const excess = buckets.size - Math.floor(MAX_BUCKETS / 2);
    let removed = 0;
    for (const key of buckets.keys()) {
      if (removed++ >= excess) break;
      buckets.delete(key);
    }
  }
}

function hit(key: string, limit: number, windowMs: number, now: number): Bucket & { ok: boolean } {
  const existing = buckets.get(key);
  if (!existing || existing.reset <= now) {
    const fresh: Bucket = { count: 1, reset: now + windowMs };
    buckets.set(key, fresh);
    return { ...fresh, ok: limit >= 1 };
  }
  existing.count += 1;
  return { ...existing, ok: existing.count <= limit };
}

export interface LimitResult {
  ok: boolean;
  remaining: number;
  /** Secondes à attendre avant de réessayer (0 si la requête passe). */
  retryAfterSec: number;
}

/** Enregistre une tentative et indique si elle est autorisée. */
export function checkLimit(request: Request, scope: Scope): LimitResult {
  const policy = POLICIES[scope];
  const now = Date.now();
  prune(now);

  const ip = clientIp(request);
  const ipKey = `${scope}:ip:${ip ?? "unknown"}`;
  const ipLimit = ip ? policy.limit : policy.unknownIpLimit;
  const ipResult = hit(ipKey, ipLimit, policy.windowMs, now);
  const globalResult = hit(`${scope}:global`, policy.globalLimit, policy.windowMs, now);

  const ok = ipResult.ok && globalResult.ok;
  const remaining = Math.max(0, Math.min(ipLimit - ipResult.count, policy.globalLimit - globalResult.count));
  const retryAfterSec = ok ? 0 : Math.max(1, Math.ceil((Math.max(ipResult.reset, globalResult.reset) - now) / 1000));

  return { ok, remaining, retryAfterSec };
}

/** Rend le jeton consommé (requête rejetée par la validation, erreur interne…). */
export function release(request: Request, scope: Scope): void {
  const ip = clientIp(request);
  for (const key of [`${scope}:ip:${ip ?? "unknown"}`, `${scope}:global`]) {
    const bucket = buckets.get(key);
    if (bucket && bucket.count > 0) bucket.count -= 1;
  }
}

/** Remet le compteur à zéro (ex. PIN correct). */
export function resetLimit(request: Request, scope: Scope): void {
  const ip = clientIp(request);
  buckets.delete(`${scope}:ip:${ip ?? "unknown"}`);
  buckets.delete(`${scope}:global`);
}
