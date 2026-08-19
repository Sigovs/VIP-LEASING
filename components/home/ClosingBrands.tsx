"use client";

import { useEffect, useRef } from "react";
import { BRANDS, BRAND_REST, BRAND_LIT, logoSrc } from "@/lib/brands";

// The marques surface under "Find yours" — the last thing on the page before the
// footer, and the closing argument: this is the floor.
//
// The motion is SCROLL-DRIVEN, not a triggered animation, and that distinction is
// the whole effect. A trigger fires once and plays on its own clock, so ten logos
// animate in lockstep and the eye reads a group. Here each mark maps its OWN
// position in the viewport to its own transform: scroll slowly and they rise
// slowly, stop and they stop.
//
// The offsets below are deliberately SHUFFLED rather than sequential. A rising
// stagger down a row reads as a wave — the templated look we are avoiding.
// Scattered, the marks surface as individuals, at unrelated moments, the way
// objects appear out of a fade rather than the way a list animates.
const SCATTER = [40, 260, 120, 300, 30, 200, 90, 280, 150, 60, 240, 110];

const TRAVEL = 70; // px it climbs
const BLUR = 8; // px it surfaces from
const SPAN = 0.5; // fraction of the viewport a mark takes to fully arrive

export function ClosingBrands() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    const settle = () => {
      els.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    let queued = false;
    const update = () => {
      const vh = window.innerHeight;
      els.forEach((el, i) => {
        const stagger = SCATTER[i % SCATTER.length];
        const top = el.getBoundingClientRect().top;
        // How far this mark has travelled into the frame, minus its own offset.
        const raw = (vh - top - stagger) / (vh * SPAN);
        const p = Math.min(1, Math.max(0, raw));
        // Cubic ease-out: quick to appear, slow to settle.
        const e = 1 - Math.pow(1 - p, 3);
        el.style.opacity = e.toFixed(3);
        el.style.transform = `translateY(${((1 - e) * TRAVEL).toFixed(1)}px)`;
        el.style.filter = `blur(${((1 - e) * BLUR).toFixed(2)}px)`;
      });
      queued = false;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* The heading gets a full 144px of air beneath it. The marques are the
          closing argument, not a caption — crowding them under the label would
          make them read as a footer strip. */}
      <div className="mb-24 text-center md:mb-36">
        <span className="block text-xs font-accent tracking-[0.24em] text-chrome-text-2">
          What We Carry
        </span>
        <span aria-hidden className="mx-auto mt-6 block h-0.5 w-12 bg-mark" />
        <h2 className="mt-7 font-title text-3xl font-bold tracking-[-0.02em] text-chrome-text-1 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] md:text-5xl">
          The marques on the floor
        </h2>
      </div>

      {/* Four across, and flex rather than grid so a short final row CENTRES
          instead of hanging off the left edge. 96px of vertical air between rows:
          the marks need room to arrive in, or the scatter has nothing to read
          against. */}
      <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-center gap-x-10 gap-y-16 md:gap-x-8 md:gap-y-24">
        {BRANDS.map((b, i) => (
          <div
            key={b.name}
            ref={(el) => {
              refs.current[i] = el;
            }}
            // Rendered in its resting state and only then hidden by the effect
            // above — fail open, exactly like Reveal. No JS, no animation, but
            // the marks are always there.
            className="group relative flex h-14 w-[calc(50%-1.25rem)] items-center justify-center sm:w-[calc(33.333%-1.75rem)] md:h-[4.5rem] md:w-[calc(25%-1.5rem)]"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {/* base: quiet grey. The scale is optical, not decorative — see the
                note in lib/brands.ts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc(b, BRAND_REST)}
              alt={b.name}
              loading="lazy"
              style={{ transform: `scale(${b.scale ?? 1})` }}
              className="block max-h-full w-auto max-w-full object-contain opacity-70 transition-opacity duration-500 group-hover:opacity-0"
            />
            {/* hover: lights to platinum */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc(b, BRAND_LIT)}
              alt=""
              aria-hidden
              loading="lazy"
              style={{ transform: `scale(${b.scale ?? 1})` }}
              className="absolute inset-0 m-auto block max-h-full w-auto max-w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>

      {/* The hold. After the last mark settles the page does nothing for four
          tenths of a screen — and that silence is what makes the marques land.
          Cut it and the footer treads on the closing line. */}
      <div className="h-[34vh] md:h-[42vh]" />
    </>
  );
}
