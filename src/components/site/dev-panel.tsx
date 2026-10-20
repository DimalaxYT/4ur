"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Lock,
  LogOut,
  RefreshCw,
  RotateCcw,
  Save,
  Terminal,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_BUNDLE, type ContentBundle } from "@/lib/content-defaults";

/**
 * Menu « dev » caché 4ur.
 * Ouverture : 5 clics rapides sur la zone invisible du footer,
 * ou en tapant « 4ur » au clavier (hors champs de saisie).
 * Accès protégé par PIN (session signée 12 h côté serveur).
 */

type Phase = "closed" | "pin" | "panel";
type Tab = "plans" | "security" | "options" | "recurring" | "leads";

const TABS: { id: Tab; label: string }[] = [
  { id: "plans", label: "Formules Web" },
  { id: "security", label: "Offres Sécurité" },
  { id: "options", label: "Options Web" },
  { id: "recurring", label: "Services récurrents" },
  { id: "leads", label: "Demandes" },
];

/** Demande de contact telle que renvoyée par GET /api/dev/requests. */
interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  budget: string | null;
  message: string;
  createdAt: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  web: "Site web",
  security: "Cybersécurité",
  both: "Site + sécurité",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* --------------------------- Import / export --------------------------- */

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

const isServiceCardArray = (v: unknown): boolean =>
  Array.isArray(v) &&
  v.length === 3 &&
  v.every(
    (c) =>
      !!c &&
      typeof c.name === "string" &&
      typeof c.price === "string" &&
      typeof c.body === "string"
  );

/**
 * Validation locale d'un fichier importé — recopiée ici plutôt qu'importée de
 * `content-schema.ts` pour ne pas embarquer Zod dans le bundle navigateur.
 */
function isValidBundle(value: unknown): value is ContentBundle {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, unknown>;

  const plansOk =
    Array.isArray(b.plans) &&
    b.plans.length === 3 &&
    b.plans.every(
      (p) =>
        !!p &&
        typeof p.name === "string" &&
        typeof p.price === "string" &&
        typeof p.detail === "string" &&
        typeof p.pitch === "string" &&
        typeof p.cta === "string" &&
        typeof p.popular === "boolean" &&
        isStringArray(p.features)
    );

  const offersOk =
    Array.isArray(b.securityOffers) &&
    b.securityOffers.length === 3 &&
    b.securityOffers.every(
      (o) =>
        !!o &&
        typeof o.name === "string" &&
        typeof o.price === "string" &&
        typeof o.pitch === "string" &&
        isStringArray(o.features)
    );

  return Boolean(
    plansOk && offersOk && isServiceCardArray(b.webOptions) && isServiceCardArray(b.recurring)
  );
}

interface DevPanelContextValue {
  open: () => void;
}

const DevPanelContext = createContext<DevPanelContextValue | null>(null);

export function useDevPanel(): DevPanelContextValue {
  const ctx = useContext(DevPanelContext);
  if (!ctx) throw new Error("useDevPanel doit être utilisé dans DevPanelProvider");
  return ctx;
}

/** Zone invisible du footer : 5 clics en moins de 3 s ouvrent le menu dev. */
export function DevTrigger() {
  const { open } = useDevPanel();
  const clicks = useRef<number[]>([]);

  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={() => {
        const now = Date.now();
        clicks.current = [...clicks.current.filter((t) => now - t < 3000), now];
        if (clicks.current.length >= 5) {
          clicks.current = [];
          open();
        }
      }}
      className="absolute inset-0 cursor-default opacity-0 outline-none"
      data-dev-trigger
    />
  );
}

/* ------------------------------ Champs ------------------------------ */

function Field({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1.5 h-10 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-white/40",
          mono && "font-mono"
        )}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-y rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-2 text-[13px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-white/40"
      />
    </label>
  );
}

const linesToArray = (s: string): string[] =>
  s.split("\n").map((l) => l.trim()).filter(Boolean);
const arrayToLines = (a: string[]): string => a.join("\n");

/* --------------------------- Cartes d'édition ------------------------ */

function PlanEditor({
  index,
  plan,
  onChange,
  onPopular,
}: {
  index: number;
  plan: ContentBundle["plans"][number];
  onChange: (patch: Partial<ContentBundle["plans"][number]>) => void;
  onPopular: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-card/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          formule {index + 1}
        </p>
        <label className="flex cursor-pointer items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            mise en avant
          </span>
          <input
            type="checkbox"
            checked={plan.popular}
            onChange={onPopular}
            className="size-4 accent-[#f2f0e9]"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Nom" value={plan.name} onChange={(v) => onChange({ name: v })} />
        <Field
          label="Prix affiché"
          value={plan.price}
          onChange={(v) => onChange({ price: v })}
          mono
        />
        <Field
          label="Sous-titre (paiement, cible…)"
          value={plan.detail}
          onChange={(v) => onChange({ detail: v })}
        />
        <Field
          label="Accroche (pitch)"
          value={plan.pitch}
          onChange={(v) => onChange({ pitch: v })}
        />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Texte du bouton" value={plan.cta} onChange={(v) => onChange({ cta: v })} />
        <Area
          label="Caractéristiques — une par ligne"
          value={arrayToLines(plan.features)}
          onChange={(v) => onChange({ features: linesToArray(v) })}
          rows={6}
        />
      </div>
    </div>
  );
}

function OfferEditor({
  index,
  offer,
  onChange,
}: {
  index: number;
  offer: ContentBundle["securityOffers"][number];
  onChange: (patch: Partial<ContentBundle["securityOffers"][number]>) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-card/60 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        offre {index + 1}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Nom" value={offer.name} onChange={(v) => onChange({ name: v })} />
        <Field
          label="Prix affiché"
          value={offer.price}
          onChange={(v) => onChange({ price: v })}
          mono
        />
      </div>
      <div className="mt-3 grid gap-3">
        <Field
          label="Accroche (pitch)"
          value={offer.pitch}
          onChange={(v) => onChange({ pitch: v })}
        />
        <Area
          label="Inclus — une ligne par point"
          value={arrayToLines(offer.features)}
          onChange={(v) => onChange({ features: linesToArray(v) })}
          rows={4}
        />
      </div>
    </div>
  );
}

function ServiceEditor({
  index,
  card,
  onChange,
}: {
  index: number;
  card: ContentBundle["webOptions"][number];
  onChange: (patch: Partial<ContentBundle["webOptions"][number]>) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-card/60 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        service {index + 1}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Nom" value={card.name} onChange={(v) => onChange({ name: v })} />
        <Field
          label="Prix affiché"
          value={card.price}
          onChange={(v) => onChange({ price: v })}
          mono
        />
      </div>
      <div className="mt-3">
        <Area
          label="Description"
          value={card.body}
          onChange={(v) => onChange({ body: v })}
          rows={3}
        />
      </div>
    </div>
  );
}

/* ------------------------------- Dialog PIN -------------------------- */

function PinDialog({
  error,
  busy,
  remaining,
  onSubmit,
  onClose,
}: {
  error: string | null;
  busy: boolean;
  remaining: number | null;
  onSubmit: (pin: string) => void;
  onClose: () => void;
}) {
  const [pin, setPin] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-white/12 bg-[#0a0a0a] p-7 shadow-2xl shadow-black/60"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-[#111]">
            <Lock className="size-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-display text-sm font-extrabold tracking-[0.14em]">
              4UR://DEV
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              accès réservé
            </p>
          </div>
        </div>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) onSubmit(pin);
          }}
        >
          <input
            ref={inputRef}
            type="password"
            inputMode="text"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Code d'accès"
            className="h-11 w-full rounded-md border border-white/15 bg-[#0d0d0d] px-3.5 font-mono text-sm tracking-[0.3em] text-foreground outline-none transition-colors placeholder:tracking-normal placeholder:text-muted-foreground/40 focus:border-white/40"
          />
          {error && (
            <p className="mt-2.5 font-mono text-[11px] text-red-400" role="alert">
              <span className="text-red-300">✗</span> {error}
              {remaining !== null && remaining > 0 && (
                <span className="text-muted-foreground"> ({remaining} essai(s) restant(s))</span>
              )}
            </p>
          )}
          <div className="mt-5 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-md border border-white/10 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-10 flex-1 rounded-md bg-primary text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {busy ? "…" : "Déverrouiller"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ Provider ----------------------------- */

export function DevPanelProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("closed");
  const [tab, setTab] = useState<Tab>("plans");
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinRemaining, setPinRemaining] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Chargements : déclenchés depuis des gestionnaires d'évènement (ouverture,
     changement d'onglet) et non depuis un effet, pour éviter les rendus en cascade. */
  const loadBundle = useCallback(async () => {
    try {
      const res = await fetch("/api/dev/content", { cache: "no-store" });
      if (res.status === 401) {
        setPhase("pin");
        return;
      }
      const data = (await res.json()) as { ok: boolean; bundle?: ContentBundle };
      if (data.ok && data.bundle) setBundle(data.bundle);
    } catch {
      /* réseau indisponible : le panneau reste ouvert avec le contenu par défaut */
    }
  }, []);

  const loadLeads = useCallback(async () => {
    setLeadsError(null);
    try {
      const res = await fetch("/api/dev/requests", { cache: "no-store" });
      const data = (await res.json()) as {
        ok: boolean;
        requests?: Lead[];
        error?: string;
      };
      if (res.status === 401) {
        setPhase("pin");
        return;
      }
      if (data.ok && data.requests) setLeads(data.requests);
      else setLeadsError(data.error ?? "Lecture impossible.");
    } catch {
      setLeadsError("Erreur réseau.");
    }
  }, []);

  const open = useCallback(async () => {
    try {
      const res = await fetch("/api/dev/auth", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean };
      setPinError(null);
      if (data.ok) {
        setPhase("panel");
        void loadBundle();
      } else {
        setPhase("pin");
      }
    } catch {
      setPhase("pin");
    }
  }, [loadBundle]);

  const close = useCallback(() => {
    setPhase("closed");
    setPinError(null);
  }, []);

  /* Séquence clavier « 4ur » — ignorée dans les champs de saisie */
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable
      )
        return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-3);
      if (buffer === "4ur") {
        buffer = "";
        void open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* Verrouille le scroll quand le panneau est ouvert */
  useEffect(() => {
    if (phase === "closed") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  const deleteLead = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/dev/requests?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (res.ok) setLeads((prev) => (prev ?? []).filter((l) => l.id !== id));
      } catch {
        toast({ title: "Suppression impossible", variant: "destructive" });
      }
    },
    [toast]
  );

  /** Ferme la session côté serveur (le cookie signé est invalidé). */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/dev/auth", { method: "DELETE" });
    } catch {
      /* réseau indisponible : on ferme quand même le panneau */
    }
    setPhase("closed");
    setBundle(null);
    setLeads(null);
    toast({ title: "Session dev fermée" });
  }, [toast]);

  const submitPin = useCallback(
    async (pin: string) => {
      setBusy(true);
      setPinError(null);
      try {
        const res = await fetch("/api/dev/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          error?: string;
          remaining?: number;
        };
        if (data.ok) {
          setPhase("panel");
          void loadBundle();
          toast({ title: "Session dev ouverte", description: "12 h — bon courage." });
        } else {
          setPinError(data.error ?? "Code incorrect.");
          setPinRemaining(data.remaining ?? null);
        }
      } catch {
        setPinError("Erreur réseau. Réessayez.");
      } finally {
        setBusy(false);
      }
    },
    [loadBundle, toast]
  );

  const save = useCallback(async () => {
    if (!bundle) return;
    setBusy(true);
    try {
      const res = await fetch("/api/dev/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bundle),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        toast({ title: "Contenu enregistré ✓", description: "Les pages publiques sont à jour." });
        router.refresh();
      } else {
        toast({
          title: "Enregistrement refusé",
          description: data.error ?? "Vérifiez les champs.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Erreur réseau", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }, [bundle, router, toast]);

  const resetToDefaults = useCallback(() => {
    setBundle(structuredClone(DEFAULT_BUNDLE));
    toast({
      title: "Valeurs par défaut restaurées",
      description: "Pensez à enregistrer pour les publier.",
    });
  }, [toast]);

  /** Télécharge le bundle courant en JSON (sauvegarde / transfert). */
  const exportBundle = useCallback(() => {
    if (!bundle) return;
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `4ur-contenu-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Contenu exporté",
      description: "Fichier JSON téléchargé — conservez-le, il sert de sauvegarde.",
    });
  }, [bundle, toast]);

  /** Recharge un bundle depuis un fichier JSON exporté. */
  const importBundle = useCallback(
    async (file: File) => {
      try {
        const parsed: unknown = JSON.parse(await file.text());
        if (!isValidBundle(parsed)) {
          toast({
            title: "Fichier invalide",
            description:
              "Le JSON ne correspond pas à la structure attendue (4 sections, 3 items chacune).",
            variant: "destructive",
          });
          return;
        }
        setBundle(parsed);
        toast({
          title: "Contenu importé",
          description: "Pensez à enregistrer pour le publier.",
        });
      } catch {
        toast({
          title: "Import impossible",
          description: "Fichier JSON illisible.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const ctx = useMemo(() => ({ open }), [open]);

  /* Helpers de mise à jour immuable */
  const patchPlan = (i: number, patch: Partial<ContentBundle["plans"][number]>) =>
    setBundle((b) =>
      b ? { ...b, plans: b.plans.map((p, j) => (j === i ? { ...p, ...patch } : p)) } : b
    );
  const patchOffer = (i: number, patch: Partial<ContentBundle["securityOffers"][number]>) =>
    setBundle((b) =>
      b
        ? { ...b, securityOffers: b.securityOffers.map((o, j) => (j === i ? { ...o, ...patch } : o)) }
        : b
    );
  const patchService = (key: "webOptions" | "recurring") =>
    (i: number, patch: Partial<ContentBundle["webOptions"][number]>) =>
      setBundle((b) =>
        b
          ? { ...b, [key]: b[key].map((c, j) => (j === i ? { ...c, ...patch } : c)) }
          : b
      );
  const patchWebOption = patchService("webOptions");
  const patchRecurring = patchService("recurring");

  return (
    <DevPanelContext.Provider value={ctx}>
      {children}

      <AnimatePresence>
        {phase === "pin" && (
          <PinDialog
            error={pinError}
            busy={busy}
            remaining={pinRemaining}
            onSubmit={submitPin}
            onClose={close}
          />
        )}

        {phase === "panel" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] overflow-y-auto bg-[#050505]"
          >
            {/* Barre d'en-tête */}
            <header className="sticky top-0 z-10 border-b border-white/10 bg-[#050505]/95 backdrop-blur-md">
              <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
                <div className="flex items-center gap-3">
                  <Terminal className="size-4 text-foreground" strokeWidth={1.75} />
                  <p className="font-mono text-xs tracking-[0.18em] text-foreground">
                    4ur://dev
                  </p>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
                    console d&apos;administration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void importBundle(file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Importer un fichier JSON"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    <Upload className="size-3.5" />
                    <span className="hidden sm:inline">Importer</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportBundle}
                    disabled={!bundle}
                    title="Télécharger le contenu en JSON"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-50"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">Exporter</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetToDefaults}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" />
                    <span className="hidden sm:inline">Défauts</span>
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={busy || !bundle}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
                  >
                    <Save className="size-3.5" />
                    {busy ? "…" : "Enregistrer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    aria-label="Fermer la session dev"
                    title="Fermer la session dev"
                    className="inline-flex size-9 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LogOut className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Fermer le menu dev"
                    className="inline-flex size-9 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Onglets */}
              <div className="mx-auto max-w-5xl px-5">
                <nav className="flex gap-1 overflow-x-auto" aria-label="Sections éditables">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTab(t.id);
                        if (t.id === "leads") void loadLeads();
                      }}
                      className={cn(
                        "relative whitespace-nowrap px-3.5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                        tab === t.id
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t.label}
                      {tab === t.id && (
                        <span className="absolute inset-x-3 bottom-0 h-0.5 bg-foreground" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </header>

            {/* Contenu */}
            <main className="mx-auto max-w-5xl px-5 py-8">
              {!bundle ? (
                <p className="py-24 text-center font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  chargement du contenu…
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {tab === "plans" &&
                    bundle.plans.map((p, i) => (
                      <PlanEditor
                        key={i}
                        index={i}
                        plan={p}
                        onChange={(patch) => patchPlan(i, patch)}
                        onPopular={() =>
                          setBundle((b) =>
                            b
                              ? {
                                  ...b,
                                  plans: b.plans.map((x, j) => ({
                                    ...x,
                                    popular: j === i,
                                  })),
                                }
                              : b
                          )
                        }
                      />
                    ))}

                  {tab === "security" &&
                    bundle.securityOffers.map((o, i) => (
                      <OfferEditor
                        key={i}
                        index={i}
                        offer={o}
                        onChange={(patch) => patchOffer(i, patch)}
                      />
                    ))}

                  {tab === "options" &&
                    bundle.webOptions.map((c, i) => (
                      <ServiceEditor
                        key={i}
                        index={i}
                        card={c}
                        onChange={(patch) => patchWebOption(i, patch)}
                      />
                    ))}

                  {tab === "recurring" &&
                    bundle.recurring.map((c, i) => (
                      <ServiceEditor
                        key={i}
                        index={i}
                        card={c}
                        onChange={(patch) => patchRecurring(i, patch)}
                      />
                    ))}

                  {tab === "leads" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          {leads ? `${leads.length} demande(s)` : "chargement…"}
                        </p>
                        <button
                          type="button"
                          onClick={() => void loadLeads()}
                          className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                          <RefreshCw className="size-3.5" />
                          Actualiser
                        </button>
                      </div>

                      {leadsError && (
                        <p className="rounded-md border border-red-500/30 bg-red-500/5 p-4 font-mono text-[11px] text-red-400">
                          {leadsError}
                        </p>
                      )}

                      {leads?.length === 0 && (
                        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          aucune demande pour le moment
                        </p>
                      )}

                      {leads?.map((lead) => (
                        <article
                          key={lead.id}
                          className="rounded-lg border border-white/10 bg-card/60 p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-sm font-bold tracking-tight">
                                {lead.name}
                                <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                  {SUBJECT_LABELS[lead.subject] ?? lead.subject}
                                </span>
                              </p>
                              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="underline underline-offset-4 hover:text-foreground"
                                >
                                  {lead.email}
                                </a>
                                {lead.company ? ` · ${lead.company}` : ""}
                                {lead.budget ? ` · ${lead.budget}` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                {formatDate(lead.createdAt)}
                              </span>
                              <button
                                type="button"
                                onClick={() => void deleteLead(lead.id)}
                                aria-label={`Supprimer la demande de ${lead.name}`}
                                className="inline-flex size-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">
                            {lead.message}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {bundle && (
                <p className="mt-8 border-t border-white/10 pt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground/70">
                  enregistre = publication immédiate sur le site public · défauts = restaure
                  la grille d&apos;origine (pensez à enregistrer ensuite)
                </p>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </DevPanelContext.Provider>
  );
}
