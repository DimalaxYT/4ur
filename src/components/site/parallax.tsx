"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxYProps {
  children: React.ReactNode;
  /** Décalage vertical (px) quand le haut de l'élément atteint le bas du viewport */
  from?: number;
  /** Décalage vertical (px) quand le bas de l'élément quitte le haut du viewport */
  to?: number;
  className?: string;
  /** Permet de décaler le wrapper par rapport à la zone mesurée */
  measureClassName?: string;
}

/**
 * Couche parallaxe liée au scroll : l'enfant glisse verticalement (from → to px)
 * au fur et à mesure que l'élément traverse le viewport. Désactivé si
 * prefers-reduced-motion.
 */
export function ParallaxY({
  children,
  from = 60,
  to = -60,
  className,
  measureClassName,
}: ParallaxYProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [from, to]);

  return (
    <div ref={ref} className={cn(measureClassName)}>
      <motion.div style={{ y }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}

interface WatermarkProps {
  text: string;
  className?: string;
  from?: number;
  to?: number;
}

/**
 * Mot en filigrane géant et contour, qui dérive lentement en parallaxe
 * derrière le contenu d'une section.
 */
export function Watermark({ text, className, from = 70, to = -70 }: WatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center overflow-hidden",
        className
      )}
    >
      <ParallaxY from={from} to={to} className="w-full">
        <span
          className="block select-none whitespace-nowrap text-center font-display text-[22vw] font-black leading-none tracking-tight text-transparent sm:text-[16vw]"
          style={{ WebkitTextStroke: "1px rgba(250,250,249,0.06)" }}
        >
          {text}
        </span>
      </ParallaxY>
    </div>
  );
}
