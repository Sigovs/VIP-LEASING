"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// One large frame with a strip of thumbnails under it.
//
// This has been three things. It began as a horizontal drag rail — the main
// evidence about a car behind a gesture most desktop visitors never make. Then
// it became a full-width stack in the reading column, which reached the
// opposite fault: eight enormous frames in a row, each one pushing the specs
// further down the page, none of them chosen.
//
// A main frame with thumbs is what a vehicle page has always wanted. The car is
// large, the rest is available at a glance, and picking one costs a click
// rather than a scroll. The strip scrolls sideways only when it has to.
//
// Empty slots are still slots, not filler: every gallery in the demo data holds
// one image, so the rest say what they are (see the padding note below).

export function VehicleGallery({
  images,
  alt,
  minFrames = 6,
}: {
  images: string[];
  alt: string;
  /** Pad out to this many frames with empty slots. They are EMPTY on purpose —
   *  borrowing another car's photograph to fill a gallery is the fault
   *  DESIGN.md §9b exists to prevent. Disappears on its own once real galleries
   *  arrive. */
  minFrames?: number;
}) {
  const slots: (string | null)[] = [
    ...images,
    ...Array.from({ length: Math.max(0, minFrames - images.length) }, () => null),
  ];
  const [active, setActive] = useState(0);
  const current = slots[active] ?? null;

  const step = (d: number) =>
    setActive((i) => (i + d + slots.length) % slots.length);

  return (
    <div>
      {/* The main frame */}
      <div className="group relative aspect-[3/2] w-full overflow-hidden rounded-md bg-paper">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={`${alt} — image ${active + 1}`}
            fill
            sizes="(min-width: 1024px) 62vw, 100vw"
            priority={active === 0}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center ring-1 ring-inset ring-white/[0.07]">
            <ImageIcon className="h-8 w-8 text-text-3/60" strokeWidth={1.25} aria-hidden />
            <p className="font-accent text-[0.8125rem] uppercase tracking-[0.22em] text-text-3">
              Frame {String(active + 1).padStart(2, "0")}
            </p>
            <p className="max-w-[24ch] text-sm leading-relaxed text-text-3">
              Awaiting photography
            </p>
          </div>
        )}

        {slots.length > 1 && (
          <>
            {/* Arrows appear on hover — on a frame this size the thumbs below
                are the primary control, and two permanent chevrons over the car
                are furniture the photograph does not need. */}
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => step(-1)}
              className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-pill border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 hover:bg-black/70 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => step(1)}
              className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-pill border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 hover:bg-black/70 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <span className="absolute bottom-4 right-4 rounded-pill bg-black/55 px-3 py-1.5 font-accent text-[0.75rem] tabular-nums tracking-[0.14em] text-white backdrop-blur-md">
              {String(active + 1).padStart(2, "0")} / {String(slots.length).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {/* The strip */}
      <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto md:mt-4">
        {slots.map((src, i) => (
          <li key={(src ?? "slot") + i} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative block h-16 w-24 overflow-hidden rounded-md bg-paper transition-[opacity,box-shadow] duration-300 md:h-20 md:w-32",
                i === active
                  ? "opacity-100 ring-2 ring-inset ring-mark-soft"
                  : "opacity-55 ring-1 ring-inset ring-white/[0.10] hover:opacity-90"
              )}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center">
                  <ImageIcon className="h-4 w-4 text-text-3/60" strokeWidth={1.25} aria-hidden />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
