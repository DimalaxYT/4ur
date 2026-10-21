"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";

/**
 * Suit les pages vues de manière non bloquante après le rendu initial,
 * sans cookie ni donnée nominative (conforme RGPD).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    const send = () => {
      void fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || "",
          screenWidth: window.innerWidth,
        }),
        keepalive: true,
      }).catch(() => undefined);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(send, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(send, 250);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

/**
 * Enveloppe globale Framer Motion + transition fluide entre les routes App Router.
 */
export function MotionShell({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.88, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
