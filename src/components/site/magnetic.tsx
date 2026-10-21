"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Attraction magnétique tactile sur les boutons d'action principaux (0 reflow au survol).
 */
export function Magnetic({
  children,
  strength = 0.24,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const canHover = useRef(false);

  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 });

  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !reduceMotion;

    const invalidate = () => {
      rectRef.current = null;
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  function onPointerEnter() {
    if (!canHover.current || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!canHover.current || !ref.current) return;
    const cx = e.clientX;
    const cy = e.clientY;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el) return;
      const rect = rectRef.current ?? (rectRef.current = el.getBoundingClientRect());
      const dx = cx - (rect.left + rect.width / 2);
      const dy = cy - (rect.top + rect.height / 2);
      x.set(dx * strength);
      y.set(dy * strength);
    });
  }

  function onPointerLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
