"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Building2,
  Calculator,
  Copy,
  FileCode2,
  FolderKanban,
  Globe,
  Home,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommandPaletteContextValue {
  openPalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  openPalette: () => undefined,
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const openPalette = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const copyEmail = useCallback(() => {
    setOpen(false);
    setQuery("");
    void navigator.clipboard?.writeText("contact@4ur.fr");
    toast({
      title: "Email copié ✓",
      description: "contact@4ur.fr a été copié dans votre presse-papiers.",
    });
  }, [toast]);

  const ctx = useMemo(() => ({ openPalette }), [openPalette]);

  return (
    <CommandPaletteContext.Provider value={ctx}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[220] flex items-start justify-center bg-black/75 px-4 pt-[13vh] backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0b0b0f]/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_30px_80px_-15px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
            >
              <Command label="Navigation rapide 4UR" className="w-full">
                <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <Command.Input
                    autoFocus
                    value={query}
                    onValueChange={(val) => {
                      setQuery(val);
                      if (val.trim().toLowerCase() === "admin4ur") {
                        go("/dashboard");
                      }
                    }}
                    placeholder="Aller vers une page, une étude de cas, le Lab ou le simulateur…"
                    className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                  <kbd className="rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-84 overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center font-mono text-xs text-muted-foreground">
                    Aucun résultat correspondant.
                  </Command.Empty>

                  <Command.Group
                    heading="Expériences interactives"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.22em] [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    <Command.Item
                      onSelect={() => go("/simulateur")}
                      className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[13px] text-foreground aria-selected:bg-white/[0.08]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Calculator className="size-4 text-foreground" />
                        Configurateur &amp; Simulateur de budget interactif
                      </span>
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                    </Command.Item>
                    <Command.Item
                      onSelect={() => go("/lab")}
                      className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[13px] text-foreground aria-selected:bg-white/[0.08]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Activity className="size-4 text-emerald-400" />
                        Le Lab — Simulateur d&apos;attaques WAF &amp; Headers HTTP
                      </span>
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                    </Command.Item>
                    <Command.Item
                      onSelect={() => go("/realisations")}
                      className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[13px] text-foreground aria-selected:bg-white/[0.08]"
                    >
                      <span className="flex items-center gap-2.5">
                        <FolderKanban className="size-4 text-foreground" />
                        Explorer les Réalisations &amp; Études de cas
                      </span>
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                    </Command.Item>
                  </Command.Group>

                  <Command.Group
                    heading="Pages du studio"
                    className="mt-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.22em] [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    {[
                      { href: "/", label: "Accueil", icon: Home },
                      { href: "/web", label: "Pôle Ingénierie Web", icon: Globe },
                      { href: "/security", label: "Pôle Cybersécurité", icon: ShieldCheck },
                      { href: "/methode", label: "La Méthode — Sécurité by design", icon: Sparkles },
                      { href: "/tarifs", label: "Formules & Grille tarifaire", icon: Wallet },
                      { href: "/a-propos", label: "À propos, Stack & FAQ", icon: Building2 },
                      { href: "/contact", label: "Contact — Réponse sous 24 h", icon: Mail },
                    ].map((item) => (
                      <Command.Item
                        key={item.href}
                        onSelect={() => go(item.href)}
                        className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-[13px] text-muted-foreground aria-selected:bg-white/[0.08] aria-selected:text-foreground"
                      >
                        <span className="flex items-center gap-2.5">
                          <item.icon className="size-4" />
                          {item.label}
                        </span>
                        <span className="font-mono text-[10px] opacity-55">
                          {item.href}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group
                    heading="Action directe"
                    className="mt-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.22em] [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    <Command.Item
                      onSelect={copyEmail}
                      className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-[13px] text-muted-foreground aria-selected:bg-white/[0.08] aria-selected:text-foreground"
                    >
                      <span className="flex items-center gap-2.5">
                        <Copy className="size-4" />
                        Copier contact@4ur.fr
                      </span>
                      <FileCode2 className="size-3.5 opacity-60" />
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  );
}
