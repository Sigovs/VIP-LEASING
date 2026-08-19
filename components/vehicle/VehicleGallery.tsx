"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Horizontal scroll-snap gallery with varying aspect ratios for cinematic pacing.
//
// Drag to scroll. A horizontal rail that can only be moved with a trackpad gesture
// or a scrollbar is a rail most desktop visitors never move — they see the first
// two frames and leave. Grabbing it is the obvious thing to try, so it should work.
export function VehicleGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const ratios = ["aspect-[4/3]", "aspect-[16/10]", "aspect-[3/2]", "aspect-[2/3]", "aspect-[16/9]", "aspect-[1/1]"];

  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    // Touch already drags natively; hijacking it only breaks momentum scrolling.
    if (e.pointerType === "touch") return;
    const el = rail.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: 0,
    };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
    // Snap fights the drag: the rail keeps yanking itself back to the nearest
    // frame mid-gesture. Off while the hand is down, back on when it lifts — so
    // a flick still settles on a frame, but a drag goes where it is taken.
    if (track.current) track.current.style.scrollSnapType = "none";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = rail.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    el.scrollLeft = d.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent) => {
    const el = rail.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    el.releasePointerCapture?.(e.pointerId);
    el.style.cursor = "";
    if (track.current) track.current.style.scrollSnapType = "";
  };

  // A drag that ends over a frame must not also count as a click on it.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={rail}
      className="scroll-gallery -mx-6 cursor-grab overflow-x-auto select-none md:-mx-12"
      data-lenis-prevent
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
    >
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-4 px-6 md:gap-6 md:px-12"
      >
        {images.map((src, i) => {
          const ratio = ratios[i % ratios.length];
          const isTall = ratio === "aspect-[2/3]";
          return (
            <div
              key={src + i}
              className={cn(
                "relative shrink-0 snap-start bg-paper overflow-hidden",
                ratio,
                isTall ? "h-[70vh] max-h-[760px]" : "h-[60vh] max-h-[640px]"
              )}
              style={{ width: "auto" }}
            >
              <Image
                src={src}
                alt={`${alt} — image ${i + 1}`}
                fill
                sizes="80vw"
                // The browser's native image-drag would start a ghost drag the
                // moment the pointer moves, and the rail would never see it.
                draggable={false}
                className="pointer-events-none object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
