import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/types/vehicle";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { InquireButton } from "@/components/vehicle/v4/InquireButton";
import { SHOWROOM } from "@/lib/showroom";
import { carfaxReportUrl } from "@/lib/vehicles";
import { formatMileage, formatPrice } from "@/lib/utils";
import { asset } from "@/lib/asset";

// The buy panel, as a rail that stays with you.
//
// It used to sit beside a hero image at the top of the page and scroll away
// with it — which is why the page also carried a floating Inquire button in the
// corner and a sticky sub-nav of section tabs. Both were patches over the same
// hole: the moment a buyer had read enough to act, the price and the button
// were a screenful behind them.
//
// As a rail it is never behind them, so the patches come out. This is also the
// half of the VDP that made it recognisably the reference build — image left,
// panel right, tabs under it, is the universal exotic-dealer opening.
export function VehicleBuyPanel({ vehicle }: { vehicle: Vehicle }) {
  const carfax = carfaxReportUrl(vehicle);

  const specs: [string, string][] = [
    ["Mileage", formatMileage(vehicle.mileage)],
    ["Exterior", vehicle.exteriorColor],
    ["Interior", vehicle.interiorColor],
    ["Transmission", vehicle.transmission],
    ["Drivetrain", vehicle.drivetrain],
    ["VIN", vehicle.vin],
  ];

  return (
    <div className="lg:sticky lg:top-28">
      <aside className="flex flex-col">
            {/* The display face, like the name on the card that brought you here.
                A car was called one thing in Bodoni on the catalogue and
                another in the UI face on its own page — the two are the same
                object and should be said in the same voice. */}
            <h1 className="font-title text-[2rem] font-bold leading-[1.06] tracking-[-0.02em] text-text-1 md:text-[2.5rem]">
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
                  <dt className="font-accent text-[0.8125rem] uppercase tracking-[0.12em] text-text-2 pt-px">
                    {k}
                  </dt>
                  <dd className="text-[0.95rem] text-text-1 tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Vehicle history. It hangs off the bottom of the spec list
                rather than joining the CTA row, because it is evidence, not an
                action the house is asking for — a buyer reads it on the way to
                deciding, and a third button beside Inquire and Call would rank
                it as a third ask.

                Active cars only (carfaxReportUrl returns null for a sold one),
                and only when there is a report to point at.

                Text, not the Carfax mark: reproducing another company's badge
                without their asset or their permission is not ours to do, and a
                plain line says the same thing. */}
            {carfax && (
              <a
                href={carfax}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 block w-fit transition-opacity duration-300 hover:opacity-80"
              >
                {/* The mark alone, at the size a buy panel gives it — no arrow,
                    no label. It is the most recognised badge in the trade; a
                    chevron beside it explains nothing and a word beside it
                    repeats what the letters already say.

                    No rule under it either. The link is w-fit, so a border on
                    it ran 152px and stopped — a stub under a full-width spec
                    list, which reads as a mistake rather than as a divider.
                    The VIN row above already closes the list. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset("/brands/carfax.svg")}
                  alt="Carfax"
                  className="block h-9 w-auto"
                />
                <span className="sr-only">
                  vehicle history report (opens in a new tab)
                </span>
              </a>
            )}

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
  );
}
