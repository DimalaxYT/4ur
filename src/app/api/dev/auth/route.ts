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

/** Plafond de tentatives par IP — cohérent avec `rate-limit.ts`. */
const PIN_LIMIT = 8;

/**
 * POST   /api/dev/auth — vérifie le mot de passe et ouvre une session signée 12 h.
 * GET    /api/dev/auth — la session est-elle active ?
 * DELETE /api/dev/auth — déconnecte la session.
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
        "[/api/dev/auth] Dashboard non configuré : définissez DASHBOARD_PASSWORD (ou DEV_PANEL_PIN) dans .env."
      );
      return NextResponse.json(
        {
          ok: false,
          error:
            "Mot de passe non configuré côté serveur (définissez DASHBOARD_PASSWORD dans .env).",
        },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      pin?: unknown;
      password?: unknown;
    };
    const raw =
      typeof body.password === "string"
        ? body.password
        : typeof body.pin === "string"
          ? body.pin
          : "";

    if (!raw || !verifyPin(raw)) {
      await sleepBeforeReject(limit.remaining, PIN_LIMIT);
      return NextResponse.json(
        { ok: false, error: "Mot de passe incorrect.", remaining: limit.remaining },
        { status: 401 }
      );
    }

    resetLimit(request, "dev-pin");

    const token = createSessionToken();
    const res = NextResponse.json({ ok: true, token });
    res.cookies.set(DEV_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.ALLOW_PREVIEW_IFRAME !== "1",
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
  return NextResponse.json(
    { ok: isAuthorized(request), configured: isDevPanelConfigured() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
