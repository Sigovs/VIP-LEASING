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
//
// The two are NOT peers. Both were the same glass pill, which made the hero ask
// two questions at once and answer neither. Browsing the cars is what almost
// everyone arrived to do, so it takes the solid button; selling is the minority
// errand and keeps the glass one. One primary per screen — a second solid
// button would put the hierarchy straight back to flat.
// Secondary first, primary last. The pair sits at the right edge of the hero,
// and the eye travelling left-to-right along the copy arrives at the primary
// last — the end of the sentence, not the middle of it.
const HERO_CTAS: { label: string; href: string; primary?: boolean }[] = [
  { label: "Sell Your Car", href: "/sell" },
  { label: "View Inventory", href: "/inventory", primary: true },
];

const HERO_BUTTON_BASE =
  "group relative inline-flex rounded-pill items-center justify-center gap-3 px-8 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] transition-all duration-300 md:px-10 md:py-[1.15rem] md:text-[0.8rem]";

// PRIMARY — solid --mark blue, the same colour as the title mark, so the one
// filled control on the page belongs to the site's own signature rather than
// borrowing the metal every hairline already uses.
const HERO_BUTTON_PRIMARY =
  `${HERO_BUTTON_BASE} border border-mark bg-mark text-white hover:border-mark-hover hover:bg-mark-hover`;

// SECONDARY — the glass idiom (DESIGN.md §6): visible over photography without
// competing with the primary.
const HERO_BUTTON_SECONDARY =
  `${HERO_BUTTON_BASE} border border-white/25 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md hover:border-white/55 hover:bg-white/[0.12]`;

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
      {/* Reading-zone scrim, bottom-left. The copy now sits in a corner of a
          MOVING picture — the frame under it changes every second, so a scrim
          tuned to the poster would fail on the bright frames. This one is
          anchored to the corner the text lives in and fades out toward the car,
          which keeps the subject lit while the sentence always has a ground. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top right, rgba(8,9,10,0.92) 0%, rgba(8,9,10,0.62) 26%, rgba(8,9,10,0.22) 48%, rgba(8,9,10,0) 68%)",
        }}
      />

      {/* The composition is anchored low and left, not centred: the mark, the
          strapline and the sentence stack against the left edge while the two
          actions sit out at the right, level with the copy. It gives the
          photograph the whole upper frame to be a photograph in, and it puts
          the primary button at the end of the reading line rather than in the
          middle of the screen. */}
      <Container className="relative flex h-full flex-col justify-end pb-20 md:pb-24">
        <div className="flex flex-col items-start gap-5 md:gap-6">
          {/* Shimmer wordmark: the logo silhouette masks a soft silver base
              with a highlight that loops across (see .shimmer-wordmark in
              globals.css). Replaces the flat inverted-white logo. */}
          <ShimmerWordmark className="w-[clamp(260px,38vw,560px)]" />

          {/* The line under the mark, then what the house actually does.
              The strapline is theirs and stays; the sentence beneath it is the
              one place on the first screen that answers "what is this".

              NOT IN-HOUSE: the wording says terms are arranged through lending
              partners, and may never imply the house lends its own money. */}
          <p className="font-accent text-[0.85rem] uppercase tracking-[0.34em] text-white/75 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] md:text-[0.95rem]">
            {BRAND.tagline}
          </p>

          <div className="flex w-full flex-col items-start gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
            <p className="max-w-[46ch] text-[1rem] leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] md:text-[1.1rem]">
              Luxury and exotic cars, delivered anywhere in Florida. Lease or
              finance any of them — terms arranged through our lending partners.
            </p>

            {/* Actions sit level with the copy on desktop and stack under it on
                a phone, where a side-by-side pair would squeeze both labels. */}
            <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
              {HERO_CTAS.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className={c.primary ? HERO_BUTTON_PRIMARY : HERO_BUTTON_SECONDARY}
                >
                  {c.label}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
