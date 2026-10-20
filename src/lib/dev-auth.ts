import { createHash, createHmac, timingSafeEqual } from "crypto";

/**
 * Auth du menu « dev » caché.
 * - PIN défini dans .env (DEV_PANEL_PIN), fallback 4urdev pour le dev local.
 * - Session : cookie httpOnly signé HMAC (12 h), aucune donnée sensible dedans.
 * - Rate limit mémoire sur les tentatives de PIN (5 / 15 min par IP).
 */

const PIN = process.env.DEV_PANEL_PIN ?? "4urdev";
const SECRET =
  process.env.DEV_PANEL_SECRET ?? `4ur-dev-panel::${PIN}::sel-statique-local`;

export const DEV_COOKIE = "4ur_dev_session";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 h

/** Hash SHA-256 (comparaison en timing-safe, longueurs égales garanties). */
function sha256(input: string): Buffer {
  return createHash("sha256").update(input).digest();
}

/** Le PIN saisi correspond-il au PIN attendu ? */
export function verifyPin(candidate: string): boolean {
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
  if (!token) return false;
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

/* ------------------- Rate limit des tentatives PIN ------------------ */

const pinAttempts = new Map<string, { count: number; reset: number }>();
const PIN_WINDOW_MS = 15 * 60 * 1000;
const PIN_MAX_ATTEMPTS = 5;

export function pinRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = pinAttempts.get(ip);
  if (!entry || entry.reset < now) {
    pinAttempts.set(ip, { count: 1, reset: now + PIN_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > PIN_MAX_ATTEMPTS;
}

export function pinAttemptsRemaining(ip: string): number {
  const now = Date.now();
  const entry = pinAttempts.get(ip);
  if (!entry || entry.reset < now) return PIN_MAX_ATTEMPTS;
  return Math.max(0, PIN_MAX_ATTEMPTS - entry.count);
}
