import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { TiltCard } from "./tilt-card";
import { Watermark } from "./parallax";

const POLES = [
  {
    href: "/web",
    icon: Globe,
    brand: "4UR WEB",
    title: "Des sites qui convertissent.",
    body: "Vitrine, blog, e-commerce ou plateforme : un design 100 % sur mesure, des performances au vert et un SEO propre — sans template générique.",
    bullets: ["Site vitrine & e-commerce", "Performance & Core Web Vitals", "SEO technique inclus"],
  },
  {
    href: "/security",
    icon: ShieldCheck,
    brand: "4UR SECURITY",
    title: "La cybersécurité, sans le jargon.",
    body: "Audit, durcissement, monitoring, sauvegardes : nous protégeons votre site, vos données et votre réputation — et nous vous expliquons tout, clairement.",
    bullets: ["Audit & pentest", "Monitoring 24/7 & sauvegardes", "Conformité RGPD"],
  },
];

/** Les deux pôles de 4ur, présentés en cartes 3D avec filigranes en parallaxe. */
export function Poles() {
  return (
    <section className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            01 — Nos expertises
          </p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Deux expertises.{" "}
            <span className="text-muted-foreground">Un même standard.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Le web sans la sécurité, c'est fragile. La sécurité sans le web, c'est
            abstrait. Chez 4ur, les deux pôles travaillent main dans la main sur chacun
            de vos projets.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {POLES.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.12} className="h-full">
              <TiltCard intensity={6} className="h-full">
                <Link
                  href={p.href}
                  className="group relative block h-full overflow-hidden rounded-lg border border-white/10 bg-card p-8 transition-colors hover:border-white/25 sm:p-10"
                >
                  <Watermark
                    text={p.href === "/web" ? "WEB" : "SECUR"}
                    className="opacity-80"
                    from={50}
                    to={-50}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-lg border border-white/10 bg-secondary">
                        <p.icon
                          className="size-5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                      <p className="font-display text-sm font-bold tracking-[0.24em]">
                        {p.brand}
                      </p>
                    </div>
                    <h3 className="mt-7 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                    <ul className="mt-6 flex flex-col gap-2.5">
                      {p.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-2.5 text-[13px] text-muted-foreground"
                        >
                          <span
                            className="size-1.5 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                      Explorer le pôle
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
