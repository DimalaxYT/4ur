import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero3D } from "@/components/site/hero3d";
import { Poles } from "@/components/site/poles";
import { Constat } from "@/components/site/constat";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/reveal";
import { STEPS } from "@/components/site/steps-data";

export default function HomePage() {
  return (
    <>
      <Hero3D />
      <Poles />
      <Constat />

      {/* Aperçu de la méthode — version condensée de la page /methode */}
      <section className="relative border-t border-white/10 bg-[#0d0d0d] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              03 — La méthode
            </p>
            <h2 className="mt-4 max-w-3xl text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Sécurité by design.{" "}
              <span className="text-muted-foreground">Pas by patch.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Quatre temps, aucun angle mort. La protection n'est pas une étape finale
              chez 4ur : c'est le squelette du projet, du premier café à la mise en
              production.
            </p>
          </Reveal>

          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1} className="h-full">
                <li className="group relative h-full rounded-lg border border-white/10 bg-card p-6 transition-colors hover:border-white/25">
                  <span
                    className="font-display text-4xl font-black tracking-tight text-transparent"
                    style={{ WebkitTextStroke: "1.2px rgba(250,250,249,0.35)" }}
                    aria-hidden="true"
                  >
                    {s.num}
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.15}>
            <Link
              href="/methode"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              Découvrir la méthode en détail
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Prêt à exister en ligne —"
        titleMuted="et à dormir tranquille ?"
        body="Racontez-nous votre projet en quelques lignes. Nous revenons vers vous sous 24 h ouvrées avec un premier avis honnête, gratuit et sans engagement."
        cta="Démarrer un projet"
      />
    </>
  );
}
