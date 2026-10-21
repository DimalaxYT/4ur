"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

/**
 * Surface en verre fumé usiné avec double éclairage dynamique suivant le pointeur :
 * 1) Halo ambiant diffus à l'intérieur
 * 2) Liseré spéculaire 1px découpé au masque sur la bordure (style Linear / Raycast)
 * Zéro re-render React : 100 % variables CSS + requestAnimationFrame.
 */
export function SpotlightCard({
  children,
  spotlightColor = "rgba(255, 255, 255, 0.08)",
  className,
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const clear = () => {
      rectRef.current = null;
    };
    window.addEventListener("scroll", clear, { passive: true });
    window.addEventListener("resize", clear, { passive: true });
    return () => {
      window.removeEventListener("scroll", clear);
      window.removeEventListener("resize", clear);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function onPointerEnter() {
    if (!ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-opacity", "1");
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el) return;
      const rect = rectRef.current ?? (rectRef.current = el.getBoundingClientRect());
      el.style.setProperty("--spot-x", `${Math.round(clientX - rect.left)}px`);
      el.style.setProperty("--spot-y", `${Math.round(clientY - rect.top)}px`);
    });
  }

  function onPointerLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    ref.current?.style.setProperty("--spot-opacity", "0");
  }

  return (
    <div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
          "--spot-opacity": "0",
          "--spot-color": spotlightColor,
        } as React.CSSProperties
      }
      className={cn(
        "surface-glass group relative overflow-hidden rounded-2xl border border-white/[0.08] transition-colors duration-300 hover:border-white/[0.16]",
        className
      )}
      {...rest}
    >
      {/* Halo ambiant interne suivant le pointeur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity)",
          background:
            "radial-gradient(440px circle at var(--spot-x) var(--spot-y), var(--spot-color), transparent 68%)",
        }}
      />
      {/* Bordure lumineuse 1px découpée au masque sous le curseur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity)",
          background:
            "radial-gradient(280px circle at var(--spot-x) var(--spot-y), rgba(255,255,255,0.42), transparent 70%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
