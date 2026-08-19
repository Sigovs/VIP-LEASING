"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ShimmerWordmark } from "@/components/ui/ShimmerWordmark";
import { asset } from "@/lib/asset";
import { BRAND } from "@/lib/showroom";

// The reference build carries three actions here; "Get Financing" is dropped at
// the client's request, so this hero runs two. Financing is still reachable from
// the nav, the mid-page band and the footer.
const HERO_CTAS: { label: string; href: string }[] = [
  { label: "View Inventory", href: "/inventory" },
  { label: "Sell Your Car", href: "/sell" },
];

// Glass button over photographic ground — the shared idiom (DESIGN.md §6).
const HERO_BUTTON =
  "group relative inline-flex items-center justify-center gap-3 border border-white/25 bg-white/[0.06] px-8 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-all duration-300 hover:border-white/55 hover:bg-white/[0.12] md:px-10 md:py-[1.15rem] md:text-[0.8rem]";

// Hero video. Connection-aware: skips video on save-data / 2g and on
// prefers-reduced-motion. Poster image is the visible LCP element while video
// buffers. Accepts a single src + poster — swap to client-supplied assets
// without modifying any other code.
type ConnectionLike = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithConnection = Navigator & { connection?: ConnectionLike };

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorWithConnection;
    const conn = nav.connection;
    const slow =
      conn?.saveData ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "slow-2g";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // One-time client capability check on mount — it can't be derived during SSR,
    // so a single setState here is intentional (not a cascading-render concern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!slow && !reduced) setShowVideo(true);
  }, []);

  return (
    <section className="chrome relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-chrome-bg">
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {showVideo && (
        // asset(): a raw <video> is not Next markup, so nothing prefixes its src
        // or poster for the subdirectory-hosted preview build.
        <video
          ref={ref}
          src={asset(src)}
          poster={asset(poster)}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Layered overlays for legibility + cinematic depth.
          0) Flat baseline tint — anchors the dark mood and keeps text legible
             over bright (daytime) footage, not just dark clips.
          1) Center radial vignette darkens the middle behind the logo.
          2) Top scrim deepens behind the nav; bottom letterbox deepens the base.
          3) Bottom fade melts the hero into the body ground.

          The scrims are LONG on purpose. A short scrim announces itself — you
          can see where it starts, and the eye reads a grey bar laid over a
          photograph. A long one is invisible and does the same work: the top
          runs a third of the way down behind the nav, and the base is a
          proportional letterbox that hands off to the page instead of stopping
          at a line. */}
      <div className="absolute inset-0 bg-black/[0.15]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[32%] bg-gradient-to-b from-black/65 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-chrome-bg via-chrome-bg/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-bg/60 to-bg pointer-events-none" />

      <Container className="relative h-full flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-8 md:gap-10">
          {/* Shimmer wordmark: the logo silhouette masks a soft silver base
              with a highlight that loops across (see .shimmer-wordmark in
              globals.css). Replaces the flat inverted-white logo. */}
          <ShimmerWordmark className="w-[clamp(320px,52vw,720px)]" />

          {/* The line under the mark. The reference build sets its partner name
              in this slot; this house has its own line already written, so the
              slot keeps its job — one quiet, widely-tracked strapline holding
              the space between the mark and the actions. */}
          <p className="-mt-2 font-accent text-[0.85rem] uppercase tracking-[0.34em] text-white/75 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] md:text-[0.95rem]">
            {BRAND.tagline}
          </p>

          {/* Three actions, in the hero itself — matching the live reference,
              which carries them here rather than in a strip below. */}
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-5">
            {HERO_CTAS.map((c) => (
              <Link key={c.label} href={c.href} className={HERO_BUTTON}>
                {c.label}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
