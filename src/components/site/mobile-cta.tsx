"use client";

import { usePathname } from "next/navigation";
import { ActionButton } from "./action-button";

/**
 * Dock flottant en verre fumé sur mobile (masqué sur /contact et /dashboard).
 */
export function MobileCta() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname.startsWith("/dashboard")) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),0.85rem)] pt-2 lg:hidden"
      role="complementary"
      aria-label="Accès rapide projet"
    >
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border border-white/[0.11] bg-[#0a0a0e]/88 p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
        <ActionButton
          href="/simulateur"
          variant="secondary"
          size="sm"
          icon="none"
          className="flex-1"
        >
          Simuler
        </ActionButton>
        <ActionButton
          href="/contact"
          variant="primary"
          size="sm"
          className="flex-[1.35]"
        >
          Démarrer un projet
        </ActionButton>
      </div>
    </div>
  );
}
