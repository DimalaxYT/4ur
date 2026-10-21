import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import "server-only";

/**
 * Authentification du Dashboard protégé par mot de passe (`/dashboard` & API admin).
 * - Mot de passe lu uniquement depuis les variables d'environnement :
 *   `DASHBOARD_PASSWORD` (prioritaire) ou `DEV_PANEL_PIN` (repli compatible).
 * - Session signée HMAC-SHA256 valable 12 h, acceptée à la fois via cookie `httpOnly`
 *   et via en-tête `Authorization: Bearer <token>` (indispensable en iframe cross-site).
 * - Protection brute-force : comparaison timing-safe SHA-256 + rate-limit + délai progressif.
 */

const globalForSecret = globalThis as unknown as { __4urFallbackSecret?: string };
if (!globalForSecret.__4urFallbackSecret) {
  globalForSecret.__4urFallbackSecret = randomBytes(32).toString("hex");
}

function getPassword(): string {
  return (process.env.DASHBOARD_PASSWORD || process.env.DEV_PANEL_PIN || "").trim();
}

function getSecret(): string {
  return (
    process.env.DASHBOARD_SECRET ||
    process.env.DEV_PANEL_SECRET ||
    globalForSecret.__4urFallbackSecret ||
    ""
  ).trim();
}

export const DEV_COOKIE = "4ur_dev_session";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 h

/** Le dashboard est-il configuré (mot de passe défini dans l'environnement) ? */
export function isDevPanelConfigured(): boolean {
  return getPassword().length > 0 && getSecret().length > 0;
}

/** Hash SHA-256 (comparaison en timing-safe, longueurs égales garanties). */
function sha256(input: string): Buffer {
  return createHash("sha256").update(input).digest();
}

/** Le mot de passe saisi correspond-il au mot de passe attendu ? */
export function verifyPin(candidate: string): boolean {
  const expected = getPassword();
  if (!expected) return false;
  return timingSafeEqual(sha256(candidate.trim()), sha256(expected));
}

/** Génère un token de session : `<expiration>.<hmac(expiration)>`. */
export function createSessionToken(): string {
  const exp = String(Date.now() + SESSION_TTL_MS);
  const sig = createHmac("sha256", getSecret()).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

/** Vérifie le token de session (signature + expiration). */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !isDevPanelConfigured()) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", getSecret()).update(exp).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

/** Extrait et valide la session depuis `Authorization: Bearer ...` ou le cookie `httpOnly`. */
export function isAuthorized(request: Request): boolean {
  const bearer = request.headers.get("authorization");
  if (bearer?.toLowerCase().startsWith("bearer ")) {
    const token = bearer.slice(7).trim();
    if (verifySessionToken(token)) return true;
  }

  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${DEV_COOKIE}=`));
  if (!match) return false;
  return verifySessionToken(decodeURIComponent(match.slice(DEV_COOKIE.length + 1)));
}

/**
 * Délai progressif avant de répondre à un mot de passe erroné : 300 ms × échecs,
 * plafonné à 3 s. Rend le brute-force inutilisable même sous le plafond global.
 */
export function sleepBeforeReject(remaining: number, limit: number): Promise<void> {
  const failures = Math.max(0, limit - remaining);
  const ms = Math.min(3_000, failures * 300);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
