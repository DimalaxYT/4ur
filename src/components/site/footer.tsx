import Image from "next/image";
import Link from "next/link";
import { DevTrigger } from "./dev-panel";

const NAV = [
  { href: "/web", label: "Pôle Web" },
  { href: "/security", label: "Pôle Sécurité" },
  { href: "/methode", label: "Méthode" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#050505] pb-20 lg:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/4ur/icon-4ur.png"
              alt="Logo 4ur"
              width={40}
              height={40}
              className="size-10 rounded-lg"
            />
            <div>
              <p className="font-display text-lg font-extrabold tracking-[0.18em]">4UR</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                for your needs.
              </p>
            </div>
          </div>

          <nav aria-label="Navigation de pied de page">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bandeau signature, clin d'œil à la charte « fin de page » */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
            © {new Date().getFullYear()} 4ur — tous droits réservés
            <DevTrigger />
          </p>
          <p className="order-first font-mono text-[11px] uppercase tracking-[0.34em] text-foreground sm:order-none">
            — for your digital world —
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
            <span>web · security</span>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
