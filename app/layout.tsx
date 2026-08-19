import type { Metadata } from "next";
import { Archivo, Bodoni_Moda, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { TitleMarks } from "@/components/motion/TitleMarks";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SHOWROOM, SITE_URL } from "@/lib/showroom";

// Three faces, three jobs, and none of them the reference site's.
//
// Archivo carries the voice — body, nav, UI, numerics and every heading below
// display size. A grotesk with a real weight range, worked hard, reads as a
// house style.
const sans = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Bodoni Moda is the display cut and NOTHING ELSE. A didone's hairlines stop
// being drawn below roughly 40px, so it is barred from anything smaller —
// subheads that used to sit on the title face were moved to Archivo for exactly
// this reason. The optical-size axis is what makes it a display face rather
// than a body face enlarged.
const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

// IBM Plex Mono is the data texture: eyebrows, ceremonial labels, phone,
// address, spec keys. It replaces the reference site's condensed caps, which
// were the single most recognisable thing about it.
const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

// One description, one URL, one phone — every consumer of them reads these, so
// none of them can drift out of sync with lib/showroom.ts the way the hardcoded
// "Fort Lauderdale" and the 954 number did.
const SITE_DESCRIPTION = `Porsche, Ferrari, McLaren, Lamborghini. ${SHOWROOM.city}, ${SHOWROOM.region}. By appointment.`;
// schema.org wants a dialable string, which is exactly what the tel: href holds.
const SITE_PHONE = SHOWROOM.phoneHref.replace("tel:", "");

export const metadata: Metadata = {
  // Point at the live deployment so social link previews (og:image, og:url)
  // resolve today. Switch to https://thevipleasing.com once that domain is
  // pointed at this Vercel project.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VIP Leasing | Luxury and Exotic Vehicles | Miami, FL",
    template: "%s · VIP Leasing",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "VIP Leasing",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "VIP Leasing",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: SITE_PHONE,
  email: SHOWROOM.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SHOWROOM.street,
    addressLocality: SHOWROOM.city,
    addressRegion: SHOWROOM.region,
    postalCode: SHOWROOM.postalCode,
    addressCountry: "US",
  },
  areaServed: "United States",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text-1">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-bg focus:px-4 focus:py-2 focus:text-text-1 focus:ring-2 focus:ring-accent"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          <TitleMarks />
          <Header />
          <PageTransition>
            <main id="main" className="flex-1">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
