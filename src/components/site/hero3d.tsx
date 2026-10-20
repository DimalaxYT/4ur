"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Gauge, Lock, ShieldCheck } from "lucide-react";

const STATS = [
  { value: "48 %", label: "des victimes de ransomware en France sont des PME & ETI" },
  { value: "1 / 3", label: "TPE n'a toujours aucun site web pour se faire connaître" },
  { value: "330 k€", label: "coût moyen d'une cyberattaque réussie pour une PME" },
];

const CHIPS = [
  { icon: Lock, label: "SSL / TLS — note A+", className: "-left-44 top-2", z: 34 },
  {
    icon: Gauge,
    label: "Core Web Vitals au vert",
    className: "-right-40 top-[42%]",
    z: 26,
  },
  { icon: ShieldCheck, label: "RGPD by design", className: "-left-32 bottom-0", z: 18 },
];

/**
 * Hero d'accueil : scène 3D pilotée par la souris (inclinaison en perspective),
 * couches de profondeur (chips flottantes) et parallaxe au scroll.
 * Sur tactile / prefers-reduced-motion : la scène reste statique et sereine.
 */
export function Hero3D() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const canHover = useRef(false);

  const rotateX = useSpring(0, { stiffness: 55, damping: 16, mass: 0.8 });
  const rotateY = useSpring(0, { stiffness: 55, damping: 16, mass: 0.8 });

  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !reduceMotion;
  }, [reduceMotion]);

  function onMouseMove(e: React.MouseEvent) {
    if (!canHover.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 9);
    rotateX.set(-py * 6);
  }

  function onMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // Parallaxe au scroll : la grille descend, l'halo remonte, le contenu s'efface
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 150]);
  const orbY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -110]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{ perspective: 1200 }}
    >
      {/* Fond : grille technique en parallaxe + halo + ligne de scan */}
      <motion.div style={{ y: gridY }} className="absolute inset-0" aria-hidden="true">
        <div className="grid-bg mask-fade-b absolute inset-[-10%]" />
      </motion.div>
      <motion.div
        style={{ y: orbY }}
        aria-hidden="true"
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,255,255,0.08), transparent 65%)",
          }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-scan absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-32 text-center sm:px-8"
      >
        {/* Scène 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="[transform-style:preserve-3d]"
        >
          <motion.div
            style={{ rotateX, rotateY, transformPerspective: 1100 }}
            className="flex flex-col items-center [transform-style:preserve-3d]"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5"
              style={{ transform: "translateZ(30px)" }}
            >
              <ShieldCheck className="size-3.5 text-foreground" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                web · security — sécurisé by design
              </span>
            </motion.div>

            {/* Lockup flottant + chips de profondeur */}
            <div className="relative [transform-style:preserve-3d]">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex items-center gap-4"
                style={{ transform: "translateZ(60px)" }}
              >
                <Image
                  src="/4ur/icon-4ur.png"
                  alt="Logo 4ur"
                  width={96}
                  height={96}
                  priority
                  className="size-16 rounded-2xl shadow-2xl shadow-black/70 sm:size-20"
                />
                <span className="font-display text-6xl font-black tracking-[0.02em] sm:text-8xl">
                  4UR
                </span>
              </motion.div>

              {/* Chips de profondeur — visibilité gérée par CSS (md et +) */}
            {CHIPS.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.15, duration: 0.5 }}
                className={`absolute hidden md:block ${chip.className}`}
                style={{ transform: `translateZ(${chip.z}px)` }}
              >
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.8,
                  }}
                  className="flex items-center gap-2 rounded-lg border border-white/12 bg-card/80 px-3 py-2 backdrop-blur-sm"
                >
                  <chip.icon className="size-3.5 text-foreground" aria-hidden="true" />
                  <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {chip.label}
                  </span>
                </motion.div>
              </motion.div>
            ))}
            </div>

            <p
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.5em] text-muted-foreground sm:text-xs"
              style={{ transform: "translateZ(40px)" }}
            >
              for your needs.
            </p>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mt-10 text-balance font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Votre site web.
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(250,250,249,0.85)" }}
          >
            Votre bouclier.
          </span>
          <br />
          <span className="text-muted-foreground">Pensés ensemble.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32 }}
          className="mt-7 max-w-2xl text-balance text-[15px] leading-relaxed text-muted-foreground sm:text-base"
        >
          4ur signifie{" "}
          <span className="font-medium text-foreground">« for your needs »</span> — tout ce
          que nous construisons part de vos besoins. Sites vitrines et e-commerce rapides
          et élégants, avec la cybersécurité intégrée dès la première ligne de code.
          Jamais en option. Jamais après coup.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.44 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="/contact"
            className="group inline-flex h-12 items-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
          >
            Démarrer un projet
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="/web"
            className="inline-flex h-12 items-center gap-2 rounded-md border border-white/15 px-7 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
          >
            Découvrir nos pôles
            <ArrowDown className="size-4" />
          </a>
        </motion.div>
      </motion.div>

      {/* Chiffres clés */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative border-t border-white/10 bg-background/60 backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="flex items-baseline gap-3 py-5 sm:flex-col sm:gap-1 sm:py-6"
            >
              <span className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                {s.value}
              </span>
              <span className="max-w-[26ch] text-xs leading-relaxed text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <p className="pb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          sources : ANSSI · France Num — 2025
        </p>
      </motion.div>
    </section>
  );
}
