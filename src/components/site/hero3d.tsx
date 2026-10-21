"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FluxLines } from "@/components/site/flux-lines";
import { Magnetic } from "@/components/site/magnetic";
import { ActionButton, EyebrowPill } from "@/components/site/action-button";
import { cn } from "@/lib/utils";

type ShaderPresetKey = "classic" | "glacier" | "filament" | "storm";

const SHADER_PRESETS: Record<
  ShaderPresetKey,
  {
    index: string;
    label: string;
    colors: string[];
    speed: number;
    scale: number;
    turbulence: number;
    rimWidth: number;
    sharpness: number;
    shimmer: number;
    glow: number;
    lineWidth: number;
  }
> = {
  classic: {
    index: "01",
    label: "Platine",
    colors: ["#ffffff", "#d4d4d8", "#ffffff"],
    speed: 0.44,
    scale: 1.62,
    turbulence: 0.92,
    rimWidth: 0.19,
    sharpness: 2.55,
    shimmer: 1.35,
    glow: 2.0,
    lineWidth: 0.95,
  },
  glacier: {
    index: "02",
    label: "Polaire",
    colors: ["#e0f2fe", "#7dd3fc", "#ffffff"],
    speed: 0.48,
    scale: 1.56,
    turbulence: 1.0,
    rimWidth: 0.2,
    sharpness: 2.4,
    shimmer: 1.3,
    glow: 2.2,
    lineWidth: 1.0,
  },
  filament: {
    index: "03",
    label: "Émeraude",
    colors: ["#ffffff", "#d4d4d8", "#6ee7b7"],
    speed: 0.5,
    scale: 1.5,
    turbulence: 0.98,
    rimWidth: 0.14,
    sharpness: 1.75,
    shimmer: 0.7,
    glow: 2.35,
    lineWidth: 1.15,
  },
  storm: {
    index: "04",
    label: " magnétique",
    colors: ["#ffffff", "#c4b5fd", "#ffffff"],
    speed: 0.88,
    scale: 1.46,
    turbulence: 1.55,
    rimWidth: 0.19,
    sharpness: 2.1,
    shimmer: 1.25,
    glow: 2.4,
    lineWidth: 1.05,
  },
};

/**
 * Hero d'accueil minimaliste haute couture :
 * - Champ lumineux WebGL2 React Bits `FluxLines` en arrière-plan
 * - Espace négatif généreux, hiérarchie typographique optique pure
 * - Deux boutons bijoux magnétiques + contrôle d'ambiance discret en pied de scène
 */
export function Hero3D() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [preset, setPreset] = useState<ShaderPresetKey>("classic");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const activeShader = SHADER_PRESETS[preset];

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#060608]"
    >
      {/* Arrière-plan WebGL2 React Bits FluxLines */}
      <motion.div
        style={{ y: bgY }}
        className="will-change-transform pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <FluxLines
          colors={activeShader.colors}
          speed={activeShader.speed}
          scale={activeShader.scale}
          turbulence={activeShader.turbulence}
          fluidity={0.1}
          rimWidth={activeShader.rimWidth}
          sharpness={activeShader.sharpness}
          shimmer={activeShader.shimmer}
          glow={activeShader.glow}
          lineWidth={activeShader.lineWidth}
          flowDirection="down"
          opacity={0.86}
          mouseInteraction
          mouseStrength={1}
          mouseRadius={0.35}
          mouseDampening={0.14}
          clickSwirl
          intro
          transparent
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 56% 52% at 50% 50%, rgba(6,6,8,0.82) 0%, rgba(6,6,8,0.34) 64%, rgba(6,6,8,0.5) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060608]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060608] via-[#060608]/60 to-transparent" />
      </motion.div>

      {/* Espaceur d'équilibre haut */}
      <div className="h-20" aria-hidden="true" />

      {/* Cœur éditorial minimaliste */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="will-change-transform relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <EyebrowPill dot="emerald">Ingénierie Web &amp; Cybersécurité</EyebrowPill>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-balance font-display text-[2.75rem] font-extrabold leading-[1.03] tracking-[-0.04em] sm:text-7xl lg:text-[5.25rem]"
        >
          <span className="text-platinum block">L&apos;excellence web.</span>
          <span className="mt-1 block text-white/42">L&apos;armure en plus.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-balance text-[15px] leading-[1.7] text-muted-foreground sm:text-[16.5px]"
        >
          Nous concevons sur mesure des plateformes rapides et élégantes, où le design et
          la cybersécurité naissent dans la même architecture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-3.5"
        >
          <Magnetic strength={0.18}>
            <ActionButton href="/contact" variant="primary" size="lg">
              Démarrer un projet
            </ActionButton>
          </Magnetic>
          <Magnetic strength={0.15}>
            <ActionButton
              href="/realisations"
              variant="secondary"
              size="lg"
              icon="arrow-right"
            >
              Voir les réalisations
            </ActionButton>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Pied de Hero minimaliste : ambiance WebGL discrète + repère de défilement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.48, duration: 0.5 }}
        className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-8 sm:px-8"
      >
        <div
          className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.025] p-1 backdrop-blur-md"
          role="group"
          aria-label="Variation lumineuse Flux"
        >
          {(Object.keys(SHADER_PRESETS) as ShaderPresetKey[]).map((key) => {
            const active = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                className={cn(
                  "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-all",
                  active
                    ? "bg-white/14 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "text-muted-foreground/70 hover:text-foreground"
                )}
              >
                <span className="sm:hidden">{SHADER_PRESETS[key].index}</span>
                <span className="hidden sm:inline">{SHADER_PRESETS[key].label}</span>
              </button>
            );
          })}
        </div>

        <a
          href="#disciplines"
          className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/75 transition-colors hover:text-foreground sm:inline-flex"
        >
          <span> Explorer</span>
          <span className="inline-block h-3.5 w-px bg-gradient-to-b from-white/60 to-transparent" />
        </a>
      </motion.div>
    </section>
  );
}
