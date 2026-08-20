"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";

// Featured for the home page. Two-column on desktop — photograph on the left,
// that car's details on the right — so the feature reads without swallowing the
// viewport. Price-free like the rest of the home grid; price and full specs live
// on the detail page behind "View this car".
//
// The filmstrip runs across the FEATURED CARS, not across one car's frames. The
// reference build (gtamotorcarsusa.com) strips one car's eight photographs,
// because its DMS supplies eight per car; this roster carries a single frame
// each, so a per-car strip would have exactly one thumbnail and disappear. Cars
// in the strip is the version that fills with real photography rather than with
// crops of one picture, and it matches the review prototype, where the arrow
// cycled featured cars.
//
// When real per-car sets do arrive, the second axis goes inside the photo: the
// arrows page the active car's frames, and this strip stays on cars.
export function FeaturedSpotlight({ vehicles }: { vehicles: Vehicle[] }) {
  const [active, setActive] = useState(0);
  const count = vehicles.length;
  if (!count) return null;

  const step = (d: number) => setActive((i) => (i + d + count) % count);
  const car = vehicles[active];
  const href = `/inventory/${car.slug}`;
  const nameOf = (v: Vehicle) => `${v.year} ${v.make} ${v.model}`;
  const frameOf = (v: Vehicle) => v.gallery?.[0] ?? v.heroImage;

  return (
    <div>
      {/* Section header — mirrors the Recent header below for a consistent idiom */}
      <div className="mb-8 md:mb-10 border-b border-border pb-5 md:pb-6">
        <h2 className="title-mark font-title text-4xl md:text-6xl font-bold text-text-1 leading-[1.0]">
          Featured
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
        {/* Left — photograph + filmstrip */}
        <div className="lg:col-span-7">
          {/* Every frame is stacked and toggled by opacity, so swapping cars is
              instant instead of showing a gap while the next photograph loads. */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-chrome-surface ring-1 ring-inset ring-white/[0.06]">
            {vehicles.map((v, i) => (
              <Image
                key={v.slug}
                src={frameOf(v)}
                alt={i === active ? nameOf(v) : ""}
                aria-hidden={i !== active}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-out",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              />
            ))}

            {/* Paging inside the photograph, on the Lookbook lightbox's controls
                so both galleries on this page are driven the same way. These
                step; the filmstrip below jumps. The counter is the on-photo
                badge idiom (VehicleCard's SOLD chip) in glass rather than
                signal — signal is reserved for sold. */}
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous featured car"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-pill bg-black/70 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/85 md:left-3"
                >
                  <ChevronLeft size={24} strokeWidth={1.25} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next featured car"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-pill bg-black/70 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/85 md:right-3"
                >
                  <ChevronRight size={24} strokeWidth={1.25} />
                </button>
                <span className="pointer-events-none absolute bottom-3 right-3 rounded-pill bg-black/45 px-3 py-1.5 font-accent text-[0.62rem] uppercase tracking-[0.3em] text-white/85 backdrop-blur-sm">
                  {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </>
            )}
          </div>

          {/* Mobile: fixed-width thumbs that scroll. Desktop: thumbs flex to
              fill the photograph's width so the strip reads as one tidy line. */}
          {count > 1 && (
            <div className="scroll-gallery mt-4 flex gap-2 overflow-x-auto md:gap-3 md:overflow-x-visible">
              {vehicles.map((v, i) => (
                <button
                  key={v.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={nameOf(v)}
                  aria-current={i === active}
                  className={cn(
                    "relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-sm ring-1 ring-inset transition-all duration-300 md:w-auto md:flex-1",
                    i === active
                      ? "opacity-100 ring-accent"
                      : "opacity-75 ring-white/[0.08] hover:opacity-100"
                  )}
                >
                  <Image
                    src={frameOf(v)}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 12vw, 80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — the active car's details */}
        <div className="lg:col-span-5">
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-text-1 md:text-3xl">
            <Link href={href} className="transition-colors hover:text-accent">
              {nameOf(car)}
            </Link>
          </h3>
          {car.trim && (
            <p className="mt-2 text-base text-text-2 md:text-lg">{car.trim}</p>
          )}
          {car.story && (
            <p className="mt-5 leading-relaxed text-text-2">{car.story}</p>
          )}

          <Link
            href={href}
            className="group relative mt-8 inline-flex rounded-pill items-center gap-3 border border-text-1/80 px-9 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-text-1 transition-all duration-300 hover:bg-text-1 hover:text-bg md:px-11 md:py-[1.15rem]"
          >
            View This Car
            <ChevronRight
              className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
              strokeWidth={1.75}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
