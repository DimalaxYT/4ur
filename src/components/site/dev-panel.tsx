"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

/**
 * Accès furtif propriétaire vers `/dashboard` (zéro bouton visible dans l'UI publique) :
 * - Raccourci clavier `⌘+Shift+D` / `Ctrl+Shift+D`
 * - Séquence secrète « 4ur » au clavier (hors champs de saisie)
 * - 5 clics rapides sur le copyright du footer
 * - Accès direct par l'URL `/dashboard`
 */

interface DevPanelContextValue {
  open: () => void;
}

const DevPanelContext = createContext<DevPanelContextValue | null>(null);

export function useDevPanel(): DevPanelContextValue {
  const ctx = useContext(DevPanelContext);
  if (!ctx) throw new Error("useDevPanel doit être utilisé dans DevPanelProvider");
  return ctx;
}

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

export function DevPanelProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const open = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        open();
        return;
      }

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-3);
      if (buffer === "4ur") {
        buffer = "";
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ctx = useMemo(() => ({ open }), [open]);

  return <DevPanelContext.Provider value={ctx}>{children}</DevPanelContext.Provider>;
}
