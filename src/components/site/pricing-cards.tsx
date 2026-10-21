import { Check, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { ActionButton } from "./action-button";
import { DEFAULT_PLANS, type Plan } from "@/lib/content-defaults";

export type { Plan };

interface PricingCardsProps {
  plans?: Plan[];
}

/** Grille des 3 formules haute couture avec boutons bijoux. */
export function PricingCards({ plans = DEFAULT_PLANS }: PricingCardsProps) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08} className="h-full">
            {p.popular ? (
              <SpotlightCard
                spotlightColor="rgba(255, 255, 255, 0.14)"
                className="flex h-full flex-col justify-between border-white/25 bg-gradient-to-b from-white/[0.085] to-white/[0.02] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_30px_80px_-20px_rgba(255,255,255,0.14)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-extrabold tracking-tight text-foreground">
                      {p.name}
                    </h3>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                      Recommandé
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.detail}</p>
                  <p className="text-platinum mt-7 font-display text-4xl font-extrabold tracking-[-0.03em]">
                    {p.price}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {p.pitch}
                  </p>

                  <ul className="mt-7 flex flex-col gap-3 border-t border-white/[0.08] pt-6">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-[13.5px] leading-snug text-foreground/95"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-emerald-400"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-9">
                  <ActionButton
                    href={`/contact?subject=both&draft=${encodeURIComponent(
                      `Bonjour, je souhaite échanger au sujet de la formule ${p.name} (${p.price}).`
                    )}`}
                    variant="primary"
                    size="md"
                    fullWidth
                  >
                    {p.cta}
                  </ActionButton>
                </div>
              </SpotlightCard>
            ) : (
              <SpotlightCard className="flex h-full flex-col justify-between p-8">
                <div>
                  <h3 className="font-display text-xl font-extrabold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.detail}</p>
                  <p className="mt-7 font-display text-4xl font-extrabold tracking-[-0.03em]">
                    {p.price}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {p.pitch}
                  </p>

                  <ul className="mt-7 flex flex-col gap-3 border-t border-white/[0.08] pt-6">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-[13.5px] leading-snug text-foreground/85"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-emerald-400/85"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-9">
                  <ActionButton
                    href={`/contact?subject=both&draft=${encodeURIComponent(
                      `Bonjour, je souhaite échanger au sujet de la formule ${p.name} (${p.price}).`
                    )}`}
                    variant="secondary"
                    size="md"
                    fullWidth
                  >
                    {p.cta}
                  </ActionButton>
                </div>
              </SpotlightCard>
            )}
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-8 inline-flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4.5 py-3 text-[13px] text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-400" aria-hidden="true" />
          <span>
            Chaque formule inclut la{" "}
            <span className="font-semibold text-foreground">sécurité by design</span> :
            SSL A+, en-têtes HTTP durcis, anti-spam, dépendances vérifiées et sauvegardes
            configurées.
          </span>
        </div>
      </Reveal>
    </>
  );
}
