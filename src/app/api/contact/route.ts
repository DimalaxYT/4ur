import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

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
});

// Anti-spam mémoire : max 3 soumissions / 10 min par IP
const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.reset < now) {
    attempts.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Trop de demandes envoyées. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Formulaire invalide." },
        { status: 400 }
      );
    }

    const { name, email, company, subject, budget, message } = parsed.data;

    await db.contactRequest.create({
      data: {
        name,
        email,
        company: company || null,
        subject,
        budget: budget || null,
        message,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}
