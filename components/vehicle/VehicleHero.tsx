import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/types/vehicle";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { InquireButton } from "@/components/vehicle/InquireButton";
import { SHOWROOM } from "@/lib/showroom";
import { formatMileage, formatPrice } from "@/lib/utils";

// Product top: a large primary image beside a buy-panel (title, price, the key
// specs a buyer scans, and the Inquire/Call CTAs). Exotics-Hunter density at our
// restraint — no floating overlap tile, no duplicated spec snapshot downstream.
export function VehicleHero({ vehicle }: { vehicle: Vehicle }) {
  const specs: [string, string][] = [
    ["Mileage", formatMileage(vehicle.mileage)],
    ["Exterior", vehicle.exteriorColor],
    ["Interior", vehicle.interiorColor],
    ["Transmission", vehicle.transmission],
    ["Drivetrain", vehicle.drivetrain],
    ["VIN", vehicle.vin],
  ];

  return (
    <header className="pt-24 md:pt-32 pb-10 md:pb-14">
      <Container>
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-2 font-accent text-[0.68rem] uppercase tracking-[0.24em] text-text-3"
        >
          <Link href="/inventory" className="hover:text-accent transition-colors">
            Inventory
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate text-text-2">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Primary image — stretches to the panel's height on desktop */}
          <div className="relative aspect-[3/2] min-h-[320px] overflow-hidden rounded-md bg-surface ring-1 ring-inset ring-white/[0.06] lg:col-span-7 lg:aspect-auto">
            <Image
              src={vehicle.heroImage}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            {vehicle.isSold && (
              <span className="absolute left-4 top-4 font-accent text-[0.62rem] uppercase tracking-[0.3em] bg-signal text-white px-3 py-1.5">
                Sold
              </span>
            )}
          </div>

          {/* Buy panel */}
          <aside className="flex flex-col lg:col-span-5">
            <h1 className="text-3xl md:text-4xl font-semibold leading-[1.06] tracking-[-0.02em] text-text-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            {vehicle.trim && (
              <p className="mt-2 text-[0.95rem] text-text-3">{vehicle.trim}</p>
            )}

            {/* The price is NOT coloured. It was oxblood, and the audit forced it
                brighter to be legible — at which point it read as a discount tag.
                A red price on a $1.75m Carrera GT is the wrong signal entirely:
                houses that sell cars like this state the number and stop.
                Size and weight already make it the loudest thing in the column;
                colour would only make it sound anxious. Oxblood stays where it
                means something — SOLD, and the focus ring. */}
            <p className="mt-5 tabular-nums text-3xl font-semibold tracking-[-0.015em] text-text-1">
              {formatPrice(vehicle.price)}
            </p>

            {/* The spec keys were set at 0.6rem — 9.6px — in a CONDENSED face with
                0.22em of tracking. Condensed caps are the narrowest letterforms in
                the system and the least forgiving at small sizes; at 9.6px they
                stopped being text and became texture. These are the six facts a
                buyer actually came to read. 12px now, on the brighter tier, with
                the tracking eased back (wide tracking is what a small label needs
                to breathe, and what a legible one does not). */}
            <dl className="mt-7 border-t border-border">
              {specs.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[118px_1fr] gap-5 border-b border-border py-4"
                >
                  <dt className="font-accent text-[0.75rem] uppercase tracking-[0.14em] text-text-2 pt-px">
                    {k}
                  </dt>
                  <dd className="text-[0.95rem] text-text-1 tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <InquireButton size="lg" className="w-full sm:flex-1" />
              <ButtonLink
                href={SHOWROOM.phoneHref}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Call
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Container>
    </header>
  );
}
