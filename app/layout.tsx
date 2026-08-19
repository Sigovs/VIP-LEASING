import type { Metadata } from "next";
import { Inter_Tight, Oswald } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SHOWROOM } from "@/lib/showroom";
import { BASE_PATH } from "@/lib/asset";

// Inter Tight carries the whole voice — display headlines, body, nav, UI and
// numerics. One grotesk, worked hard across the weight range, reads as a house
// style; a stack of four faces reads as a font sampler.
const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

// Oswald — the single condensed voice, ALL-CAPS only: eyebrows, ceremonial
// labels, phone / address, spec keys. It is the site's data texture, and the
// only face allowed to shout.
const condensed = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  // Point at the live deployment so social link previews (og:image, og:url)
  // resolve today. Switch to https://thevipleasing.com once that domain is
  // pointed at this Vercel project.
  metadataBase: new URL("https://thevipleasing.com"),
  title: {
    default: "VIP Leasing — Exotic & Performance Cars, South Florida",
    template: "%s · VIP Leasing",
  },
  description:
    "Porsche, Ferrari, McLaren, Lamborghini. Fort Lauderdale, FL. By appointment.",
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
  description:
    "Porsche, Ferrari, McLaren, Lamborghini. Fort Lauderdale, FL.",
  url: "https://thevipleasing.com",
  telephone: "+1-954-000-0000",
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
      className={`${sans.variable} ${condensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text-1">
        {/* CSS is the one place Next cannot rewrite a path for us, and two logo
            masks in globals.css point at files in /public. When the site is served
            from a subdirectory (the GitHub Pages preview), repoint them. Empty
            string on every normal deployment, so this renders nothing. */}
        {BASE_PATH && (
          <style
            dangerouslySetInnerHTML={{
              __html: `:root{--mask-logo:url("${BASE_PATH}/logo.svg")}`,
            }}
          />
        )}
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
