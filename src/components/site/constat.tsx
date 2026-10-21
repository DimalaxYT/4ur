import { Globe, ShieldAlert, Crosshair } from "lucide-react";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { CipherText } from "./cipher-text";

const CARDS = [
  {
    icon: Globe,
    num: "01",
    title: "Invisible en ligne",
    body: "Une TPE sur trois n'a toujours pas de site web. Celles qui en ont un se battent avec des templates lents, datés et interchangeables — sans aucune personnalité ni stratégie.",
    tag: "Visibilité",
  },
  {
    icon: Crosshair,
    num: "02",
    title: "Cible n°1 : les PME",
    body: "48 % des victimes de ransomware en France sont des PME et ETI. Coût moyen d'une attaque réussie : environ 330 000 €. Pour beaucoup, c'est la faillite, pas un incident.",
    tag: "Exposition",
  },
  {
    icon: ShieldAlert,
    num: "03",
    title: "La sécurité vendue à part échoue",
    body: "Ajouter un « certificat SSL » après coup, c'est verrouiller une porte dans un mur de papier. La sécurité rétrofitée coûte dix fois plus cher et laisse des trous partout.",
    tag: "Architecture",
  },
];

export function Constat() {
  return (
    <section id="constat" className="relative border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            <CipherText text="Pourquoi 4ur — Le constat" />
          </p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Le web a un problème.{" "}
            <span className="text-muted-foreground">Et il n&apos;est pas graphique.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            La plupart des agences construisent d&apos;abord, sécurisent parfois — et jamais
            vraiment. Nous avons créé 4ur pour inverser cet ordre : le design et la
            protection naissent ensemble, dans la même tête, dès le premier croquis.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1} className="h-full">
              <SpotlightCard className="h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {c.tag}
                  </span>
                  <span className="font-mono text-xs text-white/25">{c.num}</span>
                </div>
                <c.icon
                  className="mt-6 size-7 text-foreground transition-transform duration-300 group-hover:-translate-y-1"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <SpotlightCard className="mt-12 border-l-2 border-l-primary bg-secondary/50 px-7 py-6 sm:px-10">
            <blockquote>
              <p className="text-balance font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                « Un site non sécurisé n&apos;est pas un site. C&apos;est une porte ouverte. »
              </p>
              <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                — l&apos;adn 4ur
              </footer>
            </blockquote>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
