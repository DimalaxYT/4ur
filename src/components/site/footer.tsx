"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DevTrigger } from "./dev-panel";

const COLUMNS = [
  {
    title: "Expertises",
    links: [
      { href: "/web", label: "Pôle Ingénierie Web" },
      { href: "/security", label: "Pôle Cybersécurité" },
      { href: "/methode", label: "Méthode by design" },
      { href: "/tarifs", label: "Formules & Tarifs" },
    ],
  },
  {
    title: "Expériences",
    links: [
      { href: "/realisations", label: "Réalisations & Études" },
      { href: "/lab", label: "Le Lab Cyber & Vitesse" },
      { href: "/simulateur", label: "Simulateur de devis" },
    ],
  },
  {
    title: "Le Studio",
    links: [
      { href: "/a-propos", label: "À propos & FAQ" },
      { href: "/contact", label: "Démarrer un projet" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  const [parisTime, setParisTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setParisTime(
        new Date().toLocaleTimeString("fr-FR", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    const timer = setInterval(update, 1000);
    const init = setTimeout(update, 0);
    return () => {
      clearTimeout(init);
      clearInterval(timer);
    };
  }, []);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.08] bg-[#040406] pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_2fr]">
          {/* Signature marque */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/4ur/icon-4ur.png"
                alt="Logo 4ur"
                width={36}
                height={36}
                className="size-9 rounded-full border border-white/15"
              />
              <span className="font-display text-lg font-extrabold tracking-[0.2em]">
                4UR
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-muted-foreground">
              Studio d&apos;ingénierie web et de cybersécurité offensive &amp; défensive.
              Conçu sur mesure, durci dès la première ligne.
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>paris {parisTime ? `· ${parisTime}` : ""} · opérationnel</span>
            </div>
          </div>

          {/* Colonnes de navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-foreground/85">
                  {col.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[13.5px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Barre inférieure discrète + accès furtif propriétaire */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 sm:flex-row">
          <p className="relative select-none font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground/70">
            © {new Date().getFullYear()} 4ur — tous droits réservés
            <DevTrigger />
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">
            for your needs · web &amp; cyber engineering
          </p>
        </div>
      </div>
    </footer>
  );
}
