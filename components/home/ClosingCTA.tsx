"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ClosingBrands } from "@/components/home/ClosingBrands";
import { asset } from "@/lib/asset";

// Closing crescendo — the page's final beat, and the only pinned moment on it.
//
// The car does not scroll away: it is PINNED, and it DARKENS. "Find yours" holds
// it for a full screen, and then the marques climb over the top of it, surfacing
// out of a car that is dissolving into the ground beneath them. That is the
// difference between a logo strip and a closing argument — a mark laid over lit
// bodywork is a sticker; a mark emerging from black is a marque.
//
// The fade deliberately stops at 82%, not 100%: the car must still be faintly
// there behind the brands, or the section just ends in a black box.
//
// Connection-aware, exactly as HeroVideo is: the poster is always rendered and is
// the only thing a save-data / 2g / reduced-motion visitor gets. The video is
// decoration on top of it and never gates the copy or the CTA.
//
// rgba literals only — a var() inside a gradient is silently dropped by
// Lightning CSS (DESIGN.md §7).

const CLOSING_VIDEO = "/closing.mp4";
const CLOSING_POSTER = "/closing-poster.jpg";

const FADE_MAX = 0.82; // how dark the car gets, at most
const FADE_START = 0.06; // fraction of the band scrolled before it begins to go

// The dissolve is measured in SCREENS, not in fractions of the section. That
// matters: a fraction ties the tempo to the section's length, so any change to
// the closing (a longer hold, one more row of marks) silently re-times the whole
// thing. A first cut did exactly that, and the car went black three times too
// fast — the whole ending felt rushed. Pinned to the viewport, the car always
// takes a screen and a tenth to go, whatever else moves around it.
const FADE_SCREENS = 1.1;

type ConnectionLike = { saveData?: boolean; effectiveType?: string };
type NavigatorWithConnection = Navigator & { connection?: ConnectionLike };

export function ClosingCTA() {
  const [showVideo, setShowVideo] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conn = (navigator as NavigatorWithConnection).connection;
    const slow =
      conn?.saveData ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "slow-2g";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // One-time client capability check on mount — it can't be derived during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!slow && !reduced) setShowVideo(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const fade = fadeRef.current;
    if (!section || !fade) return;

    // Reduced motion: no scrubbing. Seat the car at its darkened end state so the
    // marques still read against black — the effect is the contrast, not the
    // movement, and that part costs nothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fade.style.opacity = String(FADE_MAX);
      return;
    }

    let queued = false;
    const update = () => {
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;
      const scrolled = Math.min(
        total,
        Math.max(0, -section.getBoundingClientRect().top)
      );
      const begins = total * FADE_START;
      const opacity = Math.min(
        FADE_MAX,
        Math.max(0, (scrolled - begins) / (vh * FADE_SCREENS))
      );
      fade.style.opacity = opacity.toFixed(3);
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
    <section
      ref={sectionRef}
      className="chrome relative border-t border-border bg-chrome-bg"
    >
      {/* The car — pinned. It stays while the page keeps moving, and dissolves
          into the ground as it goes. */}
      <div className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden">
        <Image
          src={CLOSING_POSTER}
          alt=""
          fill
          quality={82}
          sizes="100vw"
          className="object-cover object-center"
        />
        {showVideo && (
          // asset(): a raw <video> is not Next markup, so nothing prefixes its
          // src or poster for the subdirectory-hosted preview build.
          <video
            src={asset(CLOSING_VIDEO)}
            poster={asset(CLOSING_POSTER)}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Baseline tint — the footage runs bright and the headline sits on it. */}
        <div aria-hidden className="absolute inset-0 bg-black/40" />
        {/* Pool behind the centred copy. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 82% at 50% 48%, rgba(8,9,10,0.7) 0%, rgba(8,9,10,0.28) 52%, rgba(8,9,10,0) 82%)",
          }}
        />
        {/* Long fade in from the section above — the band has no findable seam. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[52vh]"
          style={{
            background:
              "linear-gradient(to bottom, rgb(12,13,15) 0%, rgba(12,13,15,0.72) 28%, rgba(12,13,15,0) 100%)",
          }}
        />
        {/* The dissolve. Scrubbed to the section's own scroll progress above. */}
        <div
          ref={fadeRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-bg"
          style={{ opacity: 0 }}
        />
      </div>

      {/* "Find yours" — held over the car for a full screen. The negative margin
          pulls it back up over the pinned frame. */}
      <div className="relative z-10 -mt-[100svh]">
        {/* 84svh, not a full screen. The headline still lands on the car's centre
            of mass, but a full-screen block leaves ~45vh of dead air under the
            CTA before the marques get a word in — and that gap, not the spacer
            below it, was what made the ending drag. */}
        <Container className="flex min-h-[84svh] flex-col items-center justify-center py-16 text-center">
          <Reveal>
            <span aria-hidden className="mx-auto block h-0.5 w-12 bg-mark" />
            <h2 className="title-mark mx-auto mt-8 max-w-[14ch] text-balance font-title font-bold text-display-1 leading-[1.0] text-chrome-text-1">
              Find yours
            </h2>
            <Link
              href="/inventory"
              className="group mt-10 inline-flex rounded-pill items-center gap-3 border border-white/35 px-9 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-white transition-colors duration-300 hover:bg-white hover:text-chrome-bg md:px-11"
            >
              View the inventory
              <ChevronRight
                className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </Container>
        {/* A short beat between the headline and the marques — the prototype held
            20vh here and it read as a gap, not a breath. The long silence in this
            section belongs AFTER the marks land (see the hold in ClosingBrands),
            not before they arrive. */}
        <div className="h-[4vh] md:h-[6vh]" />
      </div>

      {/* The marques — climbing over the darkened car, each surfacing on its own
          clock (see ClosingBrands). */}
      <div className="relative z-20 pb-28 md:pb-36">
        <Container>
          <ClosingBrands />
        </Container>
      </div>

      {/* Melt the very base into the paper-toned footer. Sits above the car,
          below the marques. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[34vh]"
        style={{
          background:
            "linear-gradient(to top, rgb(9,10,11) 0%, rgba(9,10,11,0.72) 34%, rgba(9,10,11,0.28) 68%, rgba(9,10,11,0) 100%)",
        }}
      />
    </section>
  );
}
