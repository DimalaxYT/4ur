"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Angle maximum en degrés */
  intensity?: number;
  /** Profondeur de perspective en px */
  perspective?: number;
}

/**
 * Carte 3D fluide 60/120 FPS :
 * - Dimensions mises en cache à l'entrée du pointeur (aucun `getBoundingClientRect` synchrone au mouvement)
 * - Coalescence par `requestAnimationFrame`
 * - Désactivé sur écrans tactiles et si `prefers-reduced-motion` est actif
 */
export function TiltCard({
  children,
  className,
  intensity = 6,
  perspective = 950,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const canHover = useRef(false);

  const rotateX = useSpring(0, { stiffness: 240, damping: 26, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 240, damping: 26, mass: 0.5 });

  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !reduceMotion;

    const clearRect = () => {
      rectRef.current = null;
    };
    window.addEventListener("scroll", clearRect, { passive: true });
    window.addEventListener("resize", clearRect, { passive: true });
    return () => {
      window.removeEventListener("scroll", clearRect);
      window.removeEventListener("resize", clearRect);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  function onEnter() {
    if (!canHover.current || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!canHover.current || !ref.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el) return;
      const rect = rectRef.current ?? (rectRef.current = el.getBoundingClientRect());
      if (rect.width <= 0 || rect.height <= 0) return;
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      rotateY.set(px * intensity);
      rotateX.set(-py * intensity);
    });
  }

  function onLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: perspective }}
      className={cn("will-change-transform [transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}
