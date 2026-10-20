import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAuthorized } from "@/lib/dev-auth";

export const runtime = "nodejs";

/**
 * GET    /api/dev/requests — dernières demandes de contact (session requise).
 * DELETE /api/dev/requests — supprime une demande (`?id=…`, session requise).
 */

function guard(request: Request): NextResponse | null {
  if (isAuthorized(request)) return null;
  return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
}

export async function GET(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  try {
    const requests = await db.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        subject: true,
        budget: true,
        message: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ ok: true, requests });
  } catch (err) {
    console.error("[/api/dev/requests]", err);
    return NextResponse.json(
      { ok: false, error: "Lecture impossible (base indisponible ?)." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  try {
    const id = new URL(request.url).searchParams.get("id");
    const parsed = z.string().min(1).max(64).safeParse(id);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Identifiant manquant." }, { status: 400 });
    }
    await db.contactRequest.delete({ where: { id: parsed.data } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/dev/requests]", err);
    return NextResponse.json(
      { ok: false, error: "Suppression impossible." },
      { status: 500 }
    );
  }
}
