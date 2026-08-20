import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CinematicScrim } from "@/components/home/v2/CinematicScrim";

// Sell Your Car — the lower cinematic pillar, and the page's SECOND pinned
// band. It takes the "cars worth owning" positioning band's visual system (gold
// hairline, display headline, glass CTA, scrim recipe) and flips it: text on the
// right, car reading on the left, scrim weighted right.
//
// It also takes that band's temporal idea — the frame is held at 100svh while
// the sentence travels across it. That was deliberately a once-per-page move;
// it is now twice, on Alex's call. The two are kept apart by weight rather than
// by mechanism: the positioning band states the house standard, this one asks
// for the car, and the financing band between them stays an ordinary scrolling
// band so the three do not run as a set.
//
// The shell is 190svh; the frame inside is sticky at 100svh and the copy block
// is pulled back over it with a negative margin, so the copy owns the scroll and
// the picture owns the screen.
//
// Its parallax runs on a small overhang (7% a side, not the default 20%). The
// image covers the overhung inner rather than the frame, so a large overhang
// silently enlarges the car and eats the yard around it; at full viewport height
// that crop was taking about a third of the frame's width.
//
// Art-directed per breakpoint. Desktop: side profile, flipped horizontally so
// the car faces right (into the text) and the dark negative space falls
// upper-right, behind the headline. Mobile: a side profile collapses on a tall
// portrait crop, so phones get a centred crop that fills the frame cleanly.
const SELL_IMAGE = "/site/band-yard.jpg"; // desktop
const SELL_IMAGE_MOBILE = "/site/band-yard.jpg"; // mobile

export function SellYourCar() {
  return (
    <section className="chrome relative w-full bg-chrome-bg">
      {/* The held frame */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {/* mobile: centred crop — fills a portrait frame (static; parallax
              adds little on a tall crop) */}
          <Image
            src={SELL_IMAGE_MOBILE}
            alt="A car on wet ground in an industrial yard at night"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_center] md:hidden"
          />
          {/* desktop: side profile (flipped to face right) with subtle parallax */}
          <ParallaxImage
            amount={110}
            overhang={0.07}
            className="hidden h-full w-full md:block"
          >
            <Image
              src={SELL_IMAGE}
              alt="A car on wet ground in an industrial yard at night"
              fill
              quality={85}
              sizes="100vw"
              className="object-cover object-[50%_52%] [transform:scaleX(-1)]"
            />
          </ParallaxImage>
        </div>

        {/* Cinematic scrim — shared with the positioning band so the two paired
            image bands fade identically. side="right" seats the dark field under
            the right-weighted desktop copy; mobileSide="left" tracks the copy
            back left on phones (where it isn't pushed right), so the headline
            never lands on the bright half of the car. */}
        <CinematicScrim side="right" mobileSide="left" />
      </div>

      {/* The copy rides over the held frame. justify-center puts it mid-block,
          so it enters from below, crosses the picture and leaves at the top —
          one pass, no repeat. */}
      <div className="relative z-10 -mt-[100svh] flex h-[190svh] flex-col justify-center">
        <Container className="relative w-full">
          {/* Statement — pushed right (mirror of the positioning band). */}
          <div className="md:ml-auto md:max-w-[34rem]">
            <Reveal y={18}>
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
      </div>
    </section>
  );
}
