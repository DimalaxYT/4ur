import type { NextConfig } from "next";

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 *
 * En production : verrouillage strict (CSP frame-ancestors 'none', X-Frame-Options DENY,
 * HSTS preload, CORP same-origin).
 * En développement / prévisualisation : autorise l'intégration en iframe cross-origin.
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
  ...(process.env.NODE_ENV === "production" &&
  process.env.ALLOW_PREVIEW_IFRAME !== "1"
    ? ["upgrade-insecure-requests"]
    : []),
];

const isProd =
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_PREVIEW_IFRAME !== "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProd ? [{ key: "Cross-Origin-Opener-Policy", value: "same-origin" }] : []),
  { key: "Cross-Origin-Resource-Policy", value: isProd ? "same-origin" : "cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [...CSP, isProd ? "frame-ancestors 'none'" : "frame-ancestors *"].join("; "),
  },
  ...(isProd
    ? [
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
