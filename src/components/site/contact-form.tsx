"use client";

import { useState } from "react";
import Link from "next/link";
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
import { SpotlightCard } from "./spotlight-card";
import { ActionButton } from "./action-button";

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

function readInitialQueryParam(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const val = new URLSearchParams(window.location.search).get(name);
  return val ? val : fallback;
}

/**
 * Formulaire de contact connecté à POST /api/contact, avec pré-remplissage
 * automatique depuis `/simulateur` ou `/realisations`.
 */
export function ContactForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [subject, setSubject] = useState<string>(() =>
    readInitialQueryParam("subject", "")
  );
  const [budget, setBudget] = useState<string>(() =>
    readInitialQueryParam("budget", "unknown")
  );
  const [defaultMessage] = useState<string>(() =>
    readInitialQueryParam("draft", "")
  );
  const [consent, setConsent] = useState(false);

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
          consent,
          website: fd.get("website"),
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
      setConsent(false);
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
    <Reveal delay={0.1}>
      <SpotlightCard className="p-7 sm:p-9">
        <form onSubmit={onSubmit} aria-label="Formulaire de contact">
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
                className="rounded-xl bg-white/[0.025]"
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
                className="rounded-xl bg-white/[0.025]"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              name="company"
              maxLength={100}
              placeholder="Nom de votre structure (optionnel)"
              autoComplete="organization"
              className="rounded-xl bg-white/[0.025]"
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="subject">Votre besoin *</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger id="subject" aria-label="Votre besoin" className="rounded-xl bg-white/[0.025]">
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
                <SelectTrigger id="budget" aria-label="Budget envisagé" className="rounded-xl bg-white/[0.025]">
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
              defaultValue={defaultMessage}
              placeholder="Décrivez votre besoin : activité, objectifs, délais souhaités…"
              className="resize-none rounded-xl bg-white/[0.025]"
            />
          </div>

          {/* Pot de miel anti-bot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            defaultValue=""
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <label
              htmlFor="consent"
              className="text-[13px] leading-relaxed text-muted-foreground"
            >
              J&apos;accepte que les informations transmises soient utilisées pour
              répondre à ma demande.{" "}
              <Link
                href="/confidentialite"
                className="text-foreground underline underline-offset-4 hover:opacity-80"
              >
                Politique de confidentialité
              </Link>
            </label>
          </div>

          <div className="mt-7">
            <ActionButton
              type="submit"
              variant="primary"
              size="lg"
              icon="send"
              loading={pending}
              fullWidth
            >
              {pending ? "Envoi en cours…" : "Envoyer ma demande"}
            </ActionButton>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            Zéro prospection automatisée, zéro revente de données. Réponse humaine sous
            24 h ouvrées.
          </p>
        </form>
      </SpotlightCard>
    </Reveal>
  );
}
