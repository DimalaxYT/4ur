"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Reveal } from "./reveal";

const SUBJECTS = [
  { value: "web", label: "Création de site web" },
  { value: "security", label: "Cybersécurité / audit" },
  { value: "both", label: "Les deux — site + sécurité" },
];

const BUDGETS = [
  { value: "<3k", label: "Moins de 3 000 €" },
  { value: "3-6k", label: "3 000 € – 6 000 €" },
  { value: "6-12k", label: "6 000 € – 12 000 €" },
  { value: ">12k", label: "Plus de 12 000 €" },
  { value: "unknown", label: "Je ne sais pas encore" },
];

/**
 * Formulaire de contact connecté à POST /api/contact (validation Zod côté serveur,
 * anti-spam par IP, enregistrement Prisma). Réutilisé sur la page Contact.
 */
export function ContactForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [subject, setSubject] = useState<string>("");
  const [budget, setBudget] = useState<string>("unknown");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          company: fd.get("company"),
          subject: subject || "both",
          budget,
          message: fd.get("message"),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Une erreur est survenue.");
      }

      toast({
        title: "Message envoyé ✓",
        description: "Merci ! Nous revenons vers vous sous 24 h ouvrées.",
      });
      form.reset();
      setSubject("");
      setBudget("unknown");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Envoi impossible",
        description:
          err instanceof Error ? err.message : "Réessayez dans un instant.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Reveal delay={0.12}>
      <form
        onSubmit={onSubmit}
        className="rounded-lg border border-white/10 bg-card p-6 sm:p-8"
        aria-label="Formulaire de contact"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              name="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Votre nom"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              maxLength={150}
              placeholder="vous@entreprise.fr"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            name="company"
            maxLength={100}
            placeholder="Nom de votre entreprise (optionnel)"
            autoComplete="organization"
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">Votre besoin *</Label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger id="subject" aria-label="Votre besoin">
                <SelectValue placeholder="Sélectionner…" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="budget">Budget envisagé</Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger id="budget" aria-label="Budget envisagé">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUDGETS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Label htmlFor="message">Votre projet *</Label>
          <Textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            placeholder="Décrivez votre besoin : activité, objectifs, délais, ce que vous avez déjà…"
            className="resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Envoi en cours…
            </>
          ) : (
            <>
              Envoyer ma demande
              <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          Vos données ne servent qu'à vous recontacter. Aucun spam, aucune revente —
          promis, c'est nous les paranoïaques de la sécurité.
        </p>
      </form>
    </Reveal>
  );
}
