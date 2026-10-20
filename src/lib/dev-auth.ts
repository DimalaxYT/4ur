import { createHash, createHmac, timingSafeEqual } from "crypto";
import "server-only";

/**
 * Auth du menu « dev » caché.
 * - PIN défini dans .env (DEV_PANEL_PIN). Aucun repli en dur : sans variable
 *   d'environnement, le panneau reste fermé (message explicite dans les logs).
 * - Session : cookie httpOnly signé HMAC (12 h), aucune donnée sensible dedans.
 * - Rate limit via `@/lib/rate-limit` : par IP (si proxy de confiance) + plafond
 *   global, avec délai progressif à chaque échec.
 */

const PIN = process.env.DEV_PANEL_PIN ?? "";
const SECRET = process.env.DEV_PANEL_SECRET ?? "";

export const DEV_COOKIE = "4ur_dev_session";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 h

/** Le panneau est-il configuré (PIN + secret présents) ? */
export function isDevPanelConfigured(): boolean {
  return PIN.length > 0 && SECRET.length > 0;
}

/** Hash SHA-256 (comparaison en timing-safe, longueurs égales garanties). */
function sha256(input: string): Buffer {
  return createHash("sha256").update(input).digest();
}

/** Le PIN saisi correspond-il au PIN attendu ? */
export function verifyPin(candidate: string): boolean {
  if (!isDevPanelConfigured()) return false;
  return timingSafeEqual(sha256(candidate), sha256(PIN));
}

/** Génère un token de session : `<expiration>.<hmac(expiration)>`. */
export function createSessionToken(): string {
  const exp = String(Date.now() + SESSION_TTL_MS);
  const sig = createHmac("sha256", SECRET).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

/** Vérifie le token de session (signature + expiration). */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !isDevPanelConfigured()) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", SECRET).update(exp).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

/** Extrait et valide la session depuis l'en-tête Cookie. */
export function isAuthorized(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${DEV_COOKIE}=`));
  if (!match) return false;
  return verifySessionToken(decodeURIComponent(match.slice(DEV_COOKIE.length + 1)));
}

/**
 * Délai progressif avant de répondre à un PIN erroné : 300 ms × échecs, plafonné
 * à 3 s. Rend le brute-force inutilisable même sous le plafond global.
 */
export function sleepBeforeReject(remaining: number, limit: number): Promise<void> {
  const failures = Math.max(0, limit - remaining);
  const ms = Math.min(3_000, failures * 300);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
