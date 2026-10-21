import "server-only";

/**
 * Notification des nouvelles demandes de contact.
 *
 * Deux canaux optionnels (aucune dépendance externe, tout passe par `fetch`) :
 * - email via l'API Resend (RESEND_API_KEY + CONTACT_NOTIFY_EMAIL)
 * - webhook générique (CONTACT_WEBHOOK_URL) : Slack, Discord, Make, n8n…
 *
 * Si rien n'est configuré, la demande reste enregistrée en base et un avertissement
 * est journalisé — le formulaire continue de fonctionner.
 */

export interface LeadNotification {
  name: string;
  email: string;
  company: string | null;
  subject: string;
  budget: string | null;
  message: string;
  createdAt: Date;
}

const SUBJECT_LABELS: Record<string, string> = {
  web: "Création de site web",
  security: "Cybersécurité / audit",
  both: "Site + sécurité",
};

function renderText(lead: LeadNotification): string {
  const receivedAt =
    lead.createdAt instanceof Date ? lead.createdAt : new Date(lead.createdAt ?? Date.now());
  const lines = [
    `Nouvelle demande — ${SUBJECT_LABELS[lead.subject] ?? lead.subject}`,
    "",
    `Nom : ${lead.name}`,
    `Email : ${lead.email}`,
    `Entreprise : ${lead.company ?? "—"}`,
    `Budget : ${lead.budget ?? "—"}`,
    `Reçue le : ${receivedAt.toISOString()}`,
    "",
    "Message :",
    lead.message,
  ];
  return lines.join("\n");
}

export async function notifyLead(lead: LeadNotification): Promise<void> {
  const to = process.env.CONTACT_NOTIFY_EMAIL?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();

  if (!to && !webhook) {
    console.warn(
      "[contact] aucune notification configurée (CONTACT_NOTIFY_EMAIL / RESEND_API_KEY ou CONTACT_WEBHOOK_URL) — la demande est uniquement enregistrée en base."
    );
    return;
  }

  const text = renderText(lead);

  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, text, lead }),
      });
    } catch (err) {
      console.error("[contact] envoi du webhook impossible:", err);
    }
  }

  if (apiKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL?.trim() || "4ur <onboarding@resend.dev>",
          to: [to],
          subject: `[4ur] Nouvelle demande — ${lead.name}`,
          text,
          reply_to: lead.email,
        }),
      });
      if (!res.ok) {
        console.error("[contact] Resend a répondu", res.status, await res.text());
      }
    } catch (err) {
      console.error("[contact] envoi de l'email impossible:", err);
    }
  }
}
