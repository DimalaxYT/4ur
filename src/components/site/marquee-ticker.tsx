const ITEMS = [
  "Architecture sur mesure",
  "Next.js & TypeScript",
  "Core Web Vitals 100",
  "Sécurité by design",
  "TLS 1.3 & CSP stricte",
  "Audit & Pentest OWASP",
  "Supervision 24/7",
  "Zéro dette technique",
];

/**
 * Ruban typographique minimaliste à défilement GPU continu, fondu sur les bords.
 */
export function MarqueeTicker() {
  return (
    <div
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#07070a] py-4 select-none"
      aria-hidden="true"
    >
      <div
        className="mx-auto max-w-7xl overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div className="marquee-track flex w-max items-center hover:[animation-play-state:paused]">
          {[0, 1].map((loop) => (
            <ul key={loop} className="flex shrink-0 items-center gap-10 pr-10">
              {ITEMS.map((item) => (
                <li
                  key={`${loop}-${item}`}
                  className="flex items-center gap-10 font-mono text-[10.5px] uppercase tracking-[0.28em] text-muted-foreground/75"
                >
                  <span>{item}</span>
                  <span className="size-1 rounded-full bg-white/25" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
