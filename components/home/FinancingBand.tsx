import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

// Leasing & financing — a cinematic image band that sits mid-inventory, between
// the Featured car and the Available Now grid, so a buyer learns early that any
// car here can be leased or financed. Same full-bleed-photo idiom as the
// positioning / Sell bands, but the statement is CENTERED between the two cars
// (they flank the copy symmetrically), so this band gets its own center-weighted
// scrim rather than the shared side-anchored CinematicScrim.
//
// ⚠️ NOT IN-HOUSE. The client lends nothing themselves — terms are arranged
// through outside lenders — so no wording here may imply otherwise, and no
// partner is named until they name one. (The reference site says "structured
// in-house through our partner"; that sentence is exactly what must not appear.)
// No term lengths / APR / mileage figures either — we have none, so we invent
// none.

// Ferrari F50 + LaFerrari, nose to nose — the "any car in the showroom" promise
// made literal. Their gap sits dead-center, so centered copy lands on the road
// between them and both cars stay clear. Portrait source fills a tall mobile
// frame cleanly too (desktop gets subtle parallax).
const FIN_IMAGE = "/site/band-garage.jpg";

export function FinancingBand() {
  return (
    <section className="chrome relative flex w-full items-center overflow-hidden bg-chrome-bg py-16 md:min-h-[720px] md:py-0 lg:min-h-[800px]">
      <div className="absolute inset-0">
        {/* mobile: static (parallax adds little on a tall crop) */}
        <Image
          src={FIN_IMAGE}
          alt="A dark car parked in a low-lit concrete garage"
          fill
          quality={85}
          sizes="100vw"
          className="object-cover object-[50%_58%] md:hidden"
        />
        {/* Desktop: the strongest parallax on the page, and it can afford to be.
            This is a wide landscape — sky above, open road below — so a long
            vertical drift reads as the camera craning across the scene. The other
            bands are tight crops on a car, where the same travel would just look
            like the photograph sliding in its frame. 300px is close to the
            component's own ceiling (it clamps travel to the image's 20% overhang,
            so the frame's edge can never show through). */}
        <ParallaxImage amount={300} className="hidden h-full w-full md:block">
          <Image
            src={FIN_IMAGE}
            alt="A dark car parked in a low-lit concrete garage"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_60%]"
          />
        </ParallaxImage>
      </div>

      {/* Center-weighted scrim — darkens the middle (where the centered copy sits,
          over the road between the cars) while the LaFerrari and F50 stay bright
          on the flanks. rgba literals only (a var() inside a gradient is dropped
          by Lightning CSS — see DESIGN.md). */}
      <div aria-hidden className="absolute inset-0 bg-black/20" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 92% at 50% 54%, rgba(8,9,10,0.72) 0%, rgba(8,9,10,0.42) 52%, rgba(8,9,10,0) 84%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 40%, rgba(8,9,10,0) 46%, rgba(8,9,10,0.42) 78%, rgba(8,9,10,0.7) 100%)",
        }}
      />
      {/* The melt — long, proportional fades into the body ground above (Featured)
          and below (Available Now), so the band has no findable seam.

          The BOTTOM ramp is deliberately longer than the other bands' (55% vs
          32%): this photograph is a wide landscape with an open road running out
          of the base of the frame, and a short fade cuts that road off at a line.
          Taking the ramp past halfway lets the tarmac dissolve into the page
          instead of ending on one — the picture hands over to the ground colour
          rather than stopping against it. Two intermediate stops carry the ramp
          so a fade this long still has no visible shoulder. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[44%]"
        style={{
          background:
            "linear-gradient(to bottom, rgb(12,13,15) 0%, rgba(12,13,15,0.85) 16%, rgba(12,13,15,0.5) 40%, rgba(12,13,15,0.18) 70%, rgba(12,13,15,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(to top, rgb(12,13,15) 0%, rgba(12,13,15,0.88) 18%, rgba(12,13,15,0.55) 42%, rgba(12,13,15,0.22) 70%, rgba(12,13,15,0) 100%)",
        }}
      />

      <Container className="relative w-full">
        <div className="mx-auto flex max-w-[54rem] flex-col items-center text-center">
          <Reveal y={18}>
            {/* display-2, not display-1: this is a statement band, and it now sits
                on the same step as its two siblings ("The cars worth owning" and
                "Ready to part with yours?"). display-1 is reserved for the closing
                "Find yours" — a page gets one loudest voice, and spending it here,
                mid-scroll, on the financing partner leaves nothing for the ending. */}
            <h2 className="title-mark mt-8 text-balance font-title text-display-2 font-bold leading-[1.0] text-chrome-text-1">
              Lease it or finance it
            </h2>
          </Reveal>

          <Reveal delay={0.1} y={22}>
            <p className="mx-auto mt-7 max-w-[52ch] text-pretty text-[1.1rem] leading-relaxed text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] md:text-[1.25rem]">
              Every car we list can be driven home your way. Lease and finance
              terms are arranged through our lending partners, across all makes
              and models — structured around what you need, not around what is
              easiest to sell you.
            </p>
          </Reveal>

          <Reveal delay={0.18} y={22}>
            <div className="mt-10 flex flex-col items-center">
              <Link
                href="/financing"
                className="group inline-flex rounded-pill w-fit items-center gap-3.5 border border-white/25 bg-white/[0.06] px-8 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.12]"
              >
                Explore financing
                <ChevronRight
                  className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.75}
                />
              </Link>
              {/* The reference site carries a partner lockup here. Removed: the
                  client has not named a lender, and a logo is a claim. */}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
