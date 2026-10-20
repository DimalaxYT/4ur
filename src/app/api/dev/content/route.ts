import { NextResponse } from "next/server";
import { z } from "zod";
import { getContentBundle, saveContentBundle } from "@/lib/content";
import { isAuthorized } from "@/lib/dev-auth";

/**
 * GET /api/dev/content — bundle actuel (session requise).
 * PUT /api/dev/content — sauvegarde le bundle (session requise).
 */

const serviceCard = z.object({
  name: z.string().trim().min(1).max(80),
  price: z.string().trim().min(1).max(40),
  body: z.string().trim().max(500),
});

const bundleSchema = z.object({
  plans: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(60),
        price: z.string().trim().min(1).max(40),
        detail: z.string().trim().min(1).max(120),
        pitch: z.string().trim().min(1).max(160),
        features: z.array(z.string().trim().min(1).max(140)).min(1).max(12),
        cta: z.string().trim().min(1).max(60),
        popular: z.boolean(),
      })
    )
    .length(3),
  securityOffers: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(60),
        price: z.string().trim().min(1).max(40),
        pitch: z.string().trim().min(1).max(160),
        features: z.array(z.string().trim().min(1).max(140)).min(1).max(12),
      })
    )
    .length(3),
  webOptions: z.array(serviceCard).length(3),
  recurring: z.array(serviceCard).length(3),
});

/** Vérifie la session ; renvoie une réponse 401 si non autorisé, sinon null. */
function guard(request: Request): NextResponse | null {
  if (isAuthorized(request)) return null;
  return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
}

export async function GET(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  const bundle = await getContentBundle();
  return NextResponse.json({ ok: true, bundle });
}

export async function PUT(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = bundleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Contenu invalide : 3 items par section, champs remplis (40 caractères max sur les prix).",
        },
        { status: 400 }
      );
    }
    await saveContentBundle(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/dev/content]", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
