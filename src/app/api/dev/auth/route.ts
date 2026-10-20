import { NextResponse } from "next/server";
import {
  DEV_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  isAuthorized,
  isDevPanelConfigured,
  sleepBeforeReject,
  verifyPin,
} from "@/lib/dev-auth";
import { checkLimit, resetLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Plafond de tentatives par IP — doit rester cohérent avec `rate-limit.ts`. */
const PIN_LIMIT = 5;

/**
 * POST /api/dev/auth — vérifie le PIN et ouvre une session dev (cookie signé 12 h).
 * GET  /api/dev/auth  — la session est-elle encore valide ?
 * DELETE /api/dev/auth — ferme la session (supprime le cookie).
 */
export async function POST(request: Request) {
  const limit = checkLimit(request, "dev-pin");

  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Trop d'essais. Réessayez dans 15 minutes.", remaining: 0 },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  try {
    if (!isDevPanelConfigured()) {
      console.error(
        "[/api/dev/auth] panneau dev non configuré : renseignez DEV_PANEL_PIN et DEV_PANEL_SECRET."
      );
      return NextResponse.json(
        { ok: false, error: "Panneau non configuré côté serveur." },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { pin?: unknown };
    const pin = typeof body.pin === "string" ? body.pin : "";

    if (!pin || !verifyPin(pin)) {
      await sleepBeforeReject(limit.remaining, PIN_LIMIT);
      return NextResponse.json(
        { ok: false, error: "Code incorrect.", remaining: limit.remaining },
        { status: 401 }
      );
    }

    resetLimit(request, "dev-pin");

    const res = NextResponse.json({ ok: true });
    res.cookies.set(DEV_COOKIE, createSessionToken(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
    });
    return res;
  } catch (err) {
    console.error("[/api/dev/auth]", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ ok: isAuthorized(request) });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
