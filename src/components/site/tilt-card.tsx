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
 * Carte 3D : la carte s'incline en perspective vers le curseur.
 * Désactivé sur écrans tactiles et si l'utilisateur préfère réduire les animations.
 */
export function TiltCard({
  children,
  className,
  intensity = 7,
  perspective = 900,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const canHover = useRef(false);

  const rotateX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.6 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.6 });

  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !reduceMotion;
  }, [reduceMotion]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!canHover.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * intensity);
    rotateX.set(-py * intensity);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: perspective }}
      className={cn("will-change-transform [transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}
