import { NextResponse } from "next/server";
import {
  DEV_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  isAuthorized,
  pinAttemptsRemaining,
  pinRateLimited,
  verifyPin,
} from "@/lib/dev-auth";

/**
 * POST /api/dev/auth — vérifie le PIN et ouvre une session dev (cookie signé 12 h).
 * GET  /api/dev/auth  — la session est-elle encore valide ?
 */
export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

    if (pinRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Trop d'essais. Réessayez dans 15 minutes." },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { pin?: unknown };
    const pin = typeof body.pin === "string" ? body.pin : "";

    if (!pin || !verifyPin(pin)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Code incorrect.",
          remaining: pinAttemptsRemaining(ip),
        },
        { status: 401 }
      );
    }

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
    return NextResponse.json(
      { ok: false, error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ ok: isAuthorized(request) });
}
