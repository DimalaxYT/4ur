"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Command as CommandIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "./command-palette";
import { ActionButton } from "./action-button";

const LINKS = [
  { href: "/realisations", label: "Réalisations" },
  { href: "/web", label: "Web" },
  { href: "/security", label: "Sécurité" },
  { href: "/lab", label: "Le Lab" },
  { href: "/methode", label: "Méthode" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
];

export function Navbar() {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 18;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3.5 sm:px-6">
      <nav
        aria-label="Navigation principale"
        className={cn(
          "pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-4 transition-all duration-300",
          scrolled || open || pathname !== "/"
            ? "border border-white/[0.10] bg-[#08080b]/82 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_50px_-14px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
            : "border border-white/[0.06] bg-[#08080b]/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="4ur — retour à l'accueil"
        >
          <Image
            src="/4ur/icon-4ur.png"
            alt="Logo 4ur"
            width={30}
            height={30}
            className="size-7.5 rounded-full border border-white/15 shadow-sm"
            priority
          />
          <span className="font-display text-[15px] font-extrabold tracking-[0.2em] text-foreground">
            4UR
          </span>
        </Link>

        {/* Liens centraux à capsule glissante */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-capsule"
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                    className="pointer-events-none absolute inset-0 rounded-full border border-white/[0.11] bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Actions droites */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Ouvrir la recherche rapide (Cmd+K)"
            title="Recherche rapide (⌘K / Ctrl+K)"
            className="inline-flex h-9 items-center gap-1 rounded-full border border-white/[0.10] bg-white/[0.03] px-3 font-mono text-[11px] text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all hover:border-white/25 hover:bg-white/[0.07] hover:text-foreground"
          >
            <CommandIcon className="size-3" />
            <span>K</span>
          </button>

          <ActionButton href="/contact" size="sm" variant="primary">
            Démarrer
          </ActionButton>
        </div>

        {/* Contrôles mobiles */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Recherche rapide"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            ⌘K
          </button>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground transition-colors hover:bg-white/10"
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Tiroir mobile flottant en verre fumé */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-white/[0.11] bg-[#0a0a0e]/95 p-4 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.95)] backdrop-blur-2xl lg:hidden"
          >
            <div className="grid gap-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.05]",
                  pathname === "/" ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"
                )}
              >
                Accueil
                {pathname === "/" && <span className="size-1.5 rounded-full bg-emerald-400" />}
              </Link>
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.05]",
                    isActive(l.href)
                      ? "bg-white/[0.06] text-foreground"
                      : "text-muted-foreground"
                  )}
                  aria-current={isActive(l.href) ? "page" : undefined}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-white/[0.08] pt-4">
              <ActionButton
                href="/simulateur"
                variant="secondary"
                size="md"
                icon="arrow-right"
                onClick={() => setOpen(false)}
                fullWidth
              >
                Estimer
              </ActionButton>
              <ActionButton
                href="/contact"
                variant="primary"
                size="md"
                onClick={() => setOpen(false)}
                fullWidth
              >
                Contact
              </ActionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
