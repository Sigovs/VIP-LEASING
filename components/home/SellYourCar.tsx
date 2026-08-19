import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CinematicScrim } from "@/components/home/CinematicScrim";

// Sell Your Car — the lower cinematic pillar, mirroring the "cars worth owning"
// positioning band: same visual system (gold hairline, display headline, glass
// CTA, scrim recipe), but flipped — text on the right, car reading on the left.
//
// Carrera GT, art-directed per breakpoint. Desktop: side profile, flipped
// horizontally so the car faces right (into the text) and the dark brick
// negative space falls upper-right, behind the headline; the right-weighted
// scrim seats the copy. A distinct silhouette from the Senna up top. Mobile: a
// side profile collapses on a tall portrait crop, so phones get the symmetric
// front head-on, which fills the frame cleanly.
const SELL_IMAGE = "/showcase/porsche-carrera-gt/04.webp"; // desktop (side profile)
const SELL_IMAGE_MOBILE = "/showcase/porsche-carrera-gt/01.webp"; // mobile (head-on)

export function SellYourCar() {
  return (
    <section className="chrome relative flex min-h-[600px] w-full items-center overflow-hidden bg-chrome-bg md:min-h-[700px] lg:min-h-[760px]">
      <div className="absolute inset-0">
        {/* mobile: front head-on — fills a portrait frame (static; parallax
            adds little on a tall crop) */}
        <Image
          src={SELL_IMAGE_MOBILE}
          alt="A silver Porsche Carrera GT, front head-on, against a dark brick wall"
          fill
          quality={85}
          sizes="100vw"
          className="object-cover object-[50%_center] md:hidden"
        />
        {/* desktop: side profile (flipped to face right) with subtle parallax */}
        <ParallaxImage amount={180} className="hidden h-full w-full md:block">
          <Image
            src={SELL_IMAGE}
            alt="A silver Porsche Carrera GT in side profile against a dark brick wall"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_52%] [transform:scaleX(-1)]"
          />
        </ParallaxImage>
      </div>

      {/* Cinematic scrim — shared with the positioning band so the two paired
          image bands fade identically. side="right" seats the dark field under
          the right-weighted desktop copy; mobileSide="left" tracks the copy back
          left on phones (where it isn't pushed right), so the headline never
          lands on the bright half of the car. */}
      <CinematicScrim side="right" mobileSide="left" />

      <Container className="relative w-full">
        {/* Statement — pushed right (mirror of the Senna band). */}
        <div className="md:ml-auto md:max-w-[34rem]">
          <Reveal y={18}>
            <span aria-hidden className="block h-0.5 w-12 bg-mark" />
            <h2 className="title-mark mt-7 max-w-[20ch] text-balance font-title font-bold text-display-2 leading-[1.03] text-chrome-text-1">
              Ready to part with yours?
            </h2>
          </Reveal>

          <Reveal delay={0.1} y={22}>
            <p className="mt-6 max-w-[46ch] text-pretty text-[1.05rem] leading-relaxed text-white/85 md:text-[1.15rem]">
              We buy collector and exotic cars outright — one fair offer, a
              discreet close, and payment direct to you.
            </p>
          </Reveal>

          <Reveal delay={0.18} y={22}>
            <Link
              href="/sell"
              className="group mt-9 inline-flex rounded-pill w-fit items-center gap-3.5 border border-white/25 bg-white/[0.06] px-8 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.12]"
            >
              Get an offer
              <ChevronRight
                className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
