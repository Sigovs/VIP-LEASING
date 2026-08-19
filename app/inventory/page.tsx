import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { getActiveVehicles } from "@/lib/vehicles";
import { SHOWROOM, SITE_URL } from "@/lib/showroom";

export const metadata: Metadata = {
  title: "Inventory",
  description:
    `Hand-curated Porsche, Ferrari, McLaren, and Lamborghini in ${SHOWROOM.market}. By appointment.`,
};

// Canonical base — matches app/layout.tsx metadataBase.


export default function InventoryPage() {
  const vehicles = getActiveVehicles();

  // Server-rendered listing structured data. This is the gap on AAN's own
  // reference sites (Chicago Motor Cars, Marshall Goldman, One Exotics): their
  // cards are AJAX-injected, so the inventory page emits NO per-vehicle schema.
  // Here the grid ships an ItemList of fully-described Vehicle + Offer objects
  // in the initial HTML, plus a BreadcrumbList — port this as theme template
  // code on WP (see HANDOFF.md §Inventory listing SEO).
  const listingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Inventory",
        description:
          `Hand-curated Porsche, Ferrari, McLaren, and Lamborghini in ${SHOWROOM.market}. By appointment.`,
        url: `${SITE_URL}/inventory`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Inventory",
            item: `${SITE_URL}/inventory`,
          },
        ],
      },
      {
        "@type": "ItemList",
        numberOfItems: vehicles.length,
        itemListElement: vehicles.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/inventory/${v.slug}`,
          item: {
            "@type": "Car",
            name: `${v.year} ${v.make} ${v.model}`,
            url: `${SITE_URL}/inventory/${v.slug}`,
            brand: { "@type": "Brand", name: v.make },
            model: v.model,
            vehicleModelDate: v.year,
            vehicleIdentificationNumber: v.vin,
            mileageFromOdometer: {
              "@type": "QuantitativeValue",
              value: v.mileage,
              unitCode: "SMI",
            },
            color: v.exteriorColor,
            vehicleTransmission: v.transmission,
            driveWheelConfiguration: v.drivetrain,
            image: `${SITE_URL}${v.heroImage}`,
            offers: {
              "@type": "Offer",
              price: v.price,
              priceCurrency: "USD",
              availability: v.isSold
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
              itemCondition: "https://schema.org/UsedCondition",
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />
      <header className="pt-24 md:pt-32 pb-6 md:pb-8">
        <Container>
          <span aria-hidden className="block h-px w-12 bg-accent mb-5 md:mb-6" />
          {/* Heading uses the shared display/title face (Inter Tight) —
              same idiom as the home section titles ("Featured" / "Available
              Now" / "Lookbook") and the VDP section headings. The car count is
              omitted here: it is already shown in the marque rail ("All 10")
              and the toolbar ("10 of 10"). */}
          <h1 className="title-dot font-title text-5xl md:text-7xl font-bold text-text-1 leading-[1.0]">
            Inventory
          </h1>
        </Container>
      </header>
      {/* InventoryGrid reads useSearchParams() to seed initial filter state,
          which bails out of static prerendering — so it must sit under a
          Suspense boundary (the header above stays prerendered in the initial
          HTML). The fallback mirrors the toolbar + card grid to avoid a layout
          jump when the interactive grid hydrates. */}
      <Suspense fallback={<InventoryGridFallback />}>
        <InventoryGrid vehicles={vehicles} />
      </Suspense>
    </>
  );
}

function InventoryGridFallback() {
  return (
    <>
      <div className="border-y border-border">
        {/* marque rail */}
        <div className="border-b border-border">
          <Container className="flex gap-8 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3.5 w-16 bg-surface" />
            ))}
          </Container>
        </div>
        {/* slim toolbar */}
        <Container className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="h-9 w-full sm:max-w-md bg-surface" />
          <div className="h-9 w-36 shrink-0 self-end bg-surface" />
        </Container>
      </div>
      <Container className="py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex flex-col overflow-hidden bg-surface ring-1 ring-inset ring-white/[0.07]"
            >
              <div className="aspect-[16/10] bg-white/[0.05]" />
              <div className="px-5 pt-5 pb-5 flex flex-col gap-3">
                <div className="h-5 w-44 max-w-[80%] bg-white/[0.06]" />
                <div className="h-3.5 w-36 max-w-[65%] bg-white/[0.06]" />
                <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-1">
                  <div className="h-3.5 w-20 bg-white/[0.06]" />
                  <div className="h-3.5 w-24 bg-white/[0.06]" />
                  <div className="h-3.5 w-16 bg-white/[0.06]" />
                  <div className="h-3.5 w-24 bg-white/[0.06]" />
                </div>
              </div>
              <div className="px-5 py-3.5 border-t border-white/[0.07] flex items-center justify-between">
                <div className="h-3.5 w-24 bg-white/[0.06]" />
                <div className="h-3 w-14 bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
