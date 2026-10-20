import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

interface CtaBannerProps {
  title: string;
  titleMuted: string;
  body: string;
  cta?: string;
}

/** Bandeau d'appel à l'action réutilisé en bas de chaque page. */
export function CtaBanner({
  title,
  titleMuted,
  body,
  cta = "Démarrer un projet",
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-20 sm:py-28">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(255,255,255,0.07), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {title} <span className="text-muted-foreground">{titleMuted}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {body}
          </p>
          <Link
            href="/contact"
            className="group mt-9 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
          >
            {cta}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
