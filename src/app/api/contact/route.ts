import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkLimit, release } from "@/lib/rate-limit";
import { notifyLead } from "@/lib/notify";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court.").max(100),
  email: z.string().trim().email("Email invalide.").max(150),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  subject: z.enum(["web", "security", "both"]),
  budget: z.string().trim().max(50).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message trop court : dites-nous en un peu plus.")
    .max(2000),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Votre accord est nécessaire pour traiter la demande." }),
  /** pot de miel anti-bot : ce champ doit rester vide */
  website: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const limit = checkLimit(request, "contact");

  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Trop de demandes envoyées. Réessayez dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  try {
    const body = await request.json().catch(() => null);

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      // Une erreur de saisie ne doit pas consommer le quota de l'utilisateur.
      release(request, "contact");
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Formulaire invalide." },
        { status: 400 }
      );
    }

    const { name, email, company, subject, budget, message, website } = parsed.data;

    // Pot de miel rempli = bot : on répond « ok » sans rien enregistrer.
    if (website) return NextResponse.json({ ok: true });

    const created = await db.contactRequest.create({
      data: {
        name,
        email,
        company: company || null,
        subject,
        budget: budget || null,
        message,
        consent: true,
      },
    });

    // Notification (email / webhook) — ne doit jamais faire échouer la réponse.
    try {
      await notifyLead({
        name: created.name,
        email: created.email,
        company: created.company,
        subject: created.subject,
        budget: created.budget,
        message: created.message,
        createdAt: created.createdAt,
      });
    } catch (err) {
      console.error("[/api/contact] notification:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    release(request, "contact");
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}
