"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Apparition douce au scroll — utilisée dans toutes les sections.
 * - Élément dans le viewport ou en dessous : révélation à l'entrée dans le champ.
 * - Élément déjà au-dessus du viewport (saut d'ancre, restauration de scroll) :
 *   l'observer le détecte (`bottom < 0`) et l'affiche immédiatement.
 * Aucune section ne reste invisible, quel que soit le parcours.
 */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // intersecting : entre dans le champ ; bottom < 0 : déjà dépassé (au-dessus)
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "-60px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
