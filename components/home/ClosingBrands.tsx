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
// ── The arrangement ──────────────────────────────────────────────────────────
// It used to be four across in even rows. That is a logo wall, it is what the
// reference site does, and it fought the motion: marks sharing a row share an
// arrival, so ten individual reveals still read as three grouped ones.
//
// They are placed as a CONSTELLATION instead — every mark on its own x and its
// own y, no two sharing either, drifting loosely from upper-left to lower-right
// so the field has a direction rather than being noise. Because each one sits at
// a different height, each one crosses the viewport threshold at a different
// moment on its own: the scatter is now in the layout, not bolted on afterwards.
//
// Sizes vary with it. A field where everything is the same size is a grid with
// the alignment taken away; varying the weight is what makes it read as objects
// at different distances.
//
// ── Why the field is so tall ─────────────────────────────────────────────────
// One-by-one is a question of DISTANCE, not of easing. Ten marks inside a
// 1180px field sit within a single 900px viewport, so they all cross their
// threshold within a few hundred pixels of scroll and arrive as a block no
// matter how the stagger is tuned. The field is 3000px now and the marks are
// spread across the whole of it — roughly 250px of scroll between one and the
// next, which is what actually makes them arrive one at a time. The sticky
// background underneath is what makes that length feel like an effect rather
// than an empty section.
type Placement = { x: number; y: number; h: number };

// x / y are percentages of the field, positioning each mark by its CENTRE.
// h is the mark's height at md+, in px. Order matches BRANDS.
const FIELD: Placement[] = [
  { x: 18, y: 3, h: 132 }, // Ferrari — opens the field, largest
  { x: 62, y: 11, h: 92 }, // Porsche
  { x: 34, y: 20, h: 108 }, // Lamborghini
  { x: 80, y: 28, h: 88 }, // Rolls-Royce
  { x: 22, y: 37, h: 120 }, // Maserati
  { x: 58, y: 45, h: 84 }, // Mercedes-AMG
  { x: 84, y: 54, h: 100 }, // Bugatti
  { x: 30, y: 63, h: 128 }, // McLaren — wordmark, carries width
  { x: 66, y: 72, h: 96 }, // Aston Martin
  { x: 44, y: 82, h: 112 }, // Bentley
];

// A small residual offset only. The vertical spacing is what sequences them
// now — see the note on the field height below.
const SCATTER = [0, 30, 10, 40, 20, 45, 15, 35, 25, 50];

const TRAVEL = 70; // px it climbs
const BLUR = 8; // px it surfaces from
const SPAN = 0.34; // fraction of the viewport a mark takes to fully arrive

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

      {/* One markup, two arrangements. Below md the marks flow as a staggered
          two-column list — a constellation on a phone is just overlap. From md
          the .brand-field rule takes over and each mark jumps to its own point
          (see globals.css); the positions ride in as custom properties because
          inline styles cannot be made responsive. */}
      <div className="brand-field mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-x-8 gap-y-14">
        {BRANDS.map((b, i) => {
          const p = FIELD[i % FIELD.length];
          return (
            <div
              key={b.name}
              className="brand-mark flex w-[calc(50%-1rem)] items-center justify-center"
              style={
                {
                  "--x": `${p.x}%`,
                  "--y": `${p.y}%`,
                  "--h": `${p.h}px`,
                } as React.CSSProperties
              }
            >
              {/* The positioning lives on the wrapper and the ANIMATION on this
                  node. They cannot share an element: the effect writes
                  `transform` every frame and would wipe the centring translate. */}
              <div
                ref={(el) => {
                  refs.current[i] = el;
                }}
                // Rendered in its resting state and only then hidden by the effect
                // above — fail open, exactly like Reveal. No JS, no animation, but
                // the marks are always there.
                className="group relative flex h-16 w-full items-center justify-center md:h-[var(--h)]"
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
            </div>
          );
        })}
      </div>

      {/* The hold. After the last mark settles the page does nothing for four
          tenths of a screen — and that silence is what makes the marques land.
          Cut it and the footer treads on the closing line. */}
      <div className="h-[34vh] md:h-[42vh]" />
    </>
  );
}
