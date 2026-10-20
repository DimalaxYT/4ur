import Link from "next/link";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { TiltCard } from "./tilt-card";
import { DEFAULT_PLANS, type Plan } from "@/lib/content";

export type { Plan };

interface PricingCardsProps {
  plans?: Plan[];
}

/** Grille des 3 formules — carte « populaire » inversée en blanc, effet 3D au survol. */
export function PricingCards({ plans = DEFAULT_PLANS }: PricingCardsProps) {
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.12} className="h-full">
            <TiltCard intensity={5} className="h-full">
              <article
                className={
                  p.popular
                    ? "relative flex h-full flex-col rounded-lg border border-primary bg-primary text-primary-foreground shadow-2xl shadow-black/40"
                    : "relative flex h-full flex-col rounded-lg border border-white/10 bg-card transition-colors hover:border-white/25"
                }
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-secondary px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-foreground">
                    le plus choisi
                  </span>
                )}
                <div className={p.popular ? "p-7 pt-9" : "p-7"}>
                  <h3 className="font-display text-xl font-extrabold tracking-tight">
                    {p.name}
                  </h3>
                  <p
                    className={
                      p.popular
                        ? "mt-1 text-xs opacity-70"
                        : "mt-1 text-xs text-muted-foreground"
                    }
                  >
                    {p.detail}
                  </p>
                  <p className="mt-6 font-display text-4xl font-black tracking-tight">
                    {p.price}
                  </p>
                  <p
                    className={
                      p.popular
                        ? "mt-2 text-sm opacity-80"
                        : "mt-2 text-sm text-muted-foreground"
                    }
                  >
                    {p.pitch}
                  </p>

                  <ul className="mt-7 flex flex-col gap-3">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-[13px] leading-snug"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto p-7 pt-2">
                  <Link
                    href="/contact"
                    className={
                      p.popular
                        ? "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-foreground text-sm font-semibold text-primary transition-opacity hover:opacity-85"
                        : "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white/20 text-sm font-semibold transition-colors hover:bg-white/5"
                    }
                  >
                    {p.cta}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-8 inline-flex flex-wrap items-center gap-2.5 rounded-md border border-white/10 bg-secondary/50 px-4 py-2.5 text-[13px] text-muted-foreground">
          <ShieldCheck className="size-4 text-foreground" aria-hidden="true" />
          <span>
            Chaque formule inclut la{" "}
            <span className="font-semibold text-foreground">sécurité by design</span> :
            SSL, headers HTTP durcis, anti-spam, dépendances vérifiées et sauvegardes
            configurées.
          </span>
        </p>
      </Reveal>
    </>
  );
}
