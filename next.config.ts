import type { NextConfig } from "next";

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 *
 * La CSP reste volontairement prudente : Next a besoin de `unsafe-inline` pour
 * les scripts et les styles en l'absence de nonce. L'étape suivante (recommandée)
 * est une CSP stricte avec nonce généré en middleware — voir le README.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'none'",
  "worker-src 'self'",
  "upgrade-insecure-requests",
];

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    // En développement on autorise l'intégration en iframe (prévisualisation).
    value: [...CSP, isProd ? "frame-ancestors 'none'" : "frame-ancestors *"].join("; "),
  },
  { key: "X-Frame-Options", value: isProd ? "DENY" : "SAMEORIGIN" },
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // Les erreurs de typage doivent casser le build : jamais en production.
    ignoreBuildErrors: false,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
