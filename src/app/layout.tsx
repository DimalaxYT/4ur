import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MobileCta } from "@/components/site/mobile-cta";
import { DevPanelProvider } from "@/components/site/dev-panel";
import { CommandPaletteProvider } from "@/components/site/command-palette";
import {
  AnalyticsTracker,
  MotionShell,
  PageTransition,
} from "@/components/site/motion-shell";

const montserrat = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-ext-wght-normal.woff2",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

const poppins = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/poppins/files/poppins-latin-300-normal.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://4ur.fr").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "4ur — For Your Needs · Sites web & cybersécurité",
    template: "%s · 4ur",
  },
  description:
    "4ur conçoit des sites web rapides et élégants avec la cybersécurité intégrée dès la conception. Web & Security, pensés pour vos besoins.",
  keywords: [
    "4ur",
    "création site web",
    "cybersécurité",
    "sécurité by design",
    "site vitrine",
    "audit sécurité",
    "PME",
  ],
  authors: [{ name: "4ur" }],
  icons: {
    icon: "/4ur/icon-4ur.png",
    apple: "/4ur/icon-4ur.png",
  },
  openGraph: {
    title: "4ur — For Your Needs",
    description:
      "Sites web sur mesure & cybersécurité intégrée dès la conception. Pour vos besoins. Pas de compromis.",
    siteName: "4ur",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${poppins.variable} ${GeistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <MotionShell>
          <CommandPaletteProvider>
            <DevPanelProvider>
              <AnalyticsTracker />
              <div className="grain relative flex min-h-screen flex-col overflow-x-clip">
                <ScrollProgress />
                <Navbar />
                <main className="flex flex-1 flex-col">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
                <MobileCta />
              </div>
              <Toaster />
            </DevPanelProvider>
          </CommandPaletteProvider>
        </MotionShell>
      </body>
    </html>
  );
}
