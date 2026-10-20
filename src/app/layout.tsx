import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MobileCta } from "@/components/site/mobile-cta";
import { DevPanelProvider } from "@/components/site/dev-panel";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${montserrat.variable} ${poppins.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <DevPanelProvider>
          <div className="grain relative flex min-h-screen flex-col overflow-x-clip">
            <ScrollProgress />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileCta />
          </div>
          <Toaster />
        </DevPanelProvider>
      </body>
    </html>
  );
}
