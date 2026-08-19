"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";

// Single-car spotlight for the home page. Two-column on desktop — image (with a
// filmstrip of its gallery shots) on the left, car details on the right — so the
// hero car reads as a feature without swallowing the viewport. Price-free like
// the rest of the home grid; price + full specs live on the detail page (the
// "View this car" CTA). The gallery viewer is the only reason it's a client
// component. Which car appears here is set via the `isSpotlight` data flag.
export function FeaturedSpotlight({ vehicle }: { vehicle: Vehicle }) {
  const images = vehicle.gallery?.length ? vehicle.gallery : [vehicle.heroImage];
  const [active, setActive] = useState(0);
  const href = `/inventory/${vehicle.slug}`;
  const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <div>
      {/* Section header — mirrors the Recent header below for a consistent idiom */}
      <div className="mb-8 md:mb-10 border-b border-border pb-5 md:pb-6">
        <h2 className="title-mark font-title text-4xl md:text-6xl font-bold text-text-1 leading-[1.0]">
          Featured
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
        {/* Left — image + filmstrip */}
        <div className="lg:col-span-7">
          {/* Main image is the gallery viewer; thumbnails below cross-fade it.
              All frames are stacked and toggled by opacity so swaps are instant. */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-chrome-surface ring-1 ring-inset ring-white/[0.06]">
            {images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={
                  i === active
                    ? `${name} — photo ${i + 1} of ${images.length}`
                    : ""
                }
                aria-hidden={i !== active}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-out",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </div>

          {/* Mobile: fixed-width thumbs that scroll. Desktop: thumbs flex to
              fill the image's width so the strip reads as one tidy line. */}
          {images.length > 1 && (
            <div className="scroll-gallery mt-4 flex gap-2 overflow-x-auto md:gap-3 md:overflow-x-visible">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1} of ${images.length}`}
                  aria-current={i === active}
                  className={cn(
                    "relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-sm ring-1 ring-inset transition-all duration-300 md:w-auto md:flex-1",
                    i === active
                      ? "opacity-100 ring-accent"
                      : "opacity-50 ring-white/[0.08] hover:opacity-90"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 110px, 80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — car details */}
        <div className="lg:col-span-5">
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-text-1 md:text-3xl">
            <Link href={href} className="transition-colors hover:text-accent">
              {name}
            </Link>
          </h3>
          {vehicle.trim && (
            <p className="mt-2 text-base text-text-2 md:text-lg">{vehicle.trim}</p>
          )}
          {vehicle.story && (
            <p className="mt-5 leading-relaxed text-text-2">{vehicle.story}</p>
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
