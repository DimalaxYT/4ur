"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Barre d'action fixe en bas d'écran, uniquement sur mobile (et hors page Contact)
 * : accès permanent au formulaire, respect des safe areas iOS.
 */
export function MobileCta() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/90 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-md lg:hidden"
      role="complementary"
      aria-label="Accès rapide devis"
    >
      <Link
        href="/contact"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground"
      >
        Devis gratuit — réponse sous 24 h
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
