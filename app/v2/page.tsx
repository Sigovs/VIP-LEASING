// ── VARIANT 2 ───────────────────────────────────────────────────────────────
// A full, ISOLATED copy of the homepage, served at /v2.
//
// Why a copy and not a branch: a branch cannot be shown to a client. Both
// versions have to be live at the same URL at the same time so the two can be
// opened side by side and compared.
//
// Why a copy and not shared components with flags: the point of keeping the
// previous version is that it CANNOT move. Every home component this page
// touches has a twin under components/home/v2/, so nothing edited here can
// reach the page at "/". Edits for the client's changes go in this tree only.
//
// The two are identical the moment this is created; every difference after
// that is a deliberate one.

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { HeroVideo } from "@/components/home/v2/HeroVideo";
import { FeaturedSpotlight } from "@/components/home/v2/FeaturedSpotlight";
import { FinancingBand } from "@/components/home/v2/FinancingBand";
import { Showcase } from "@/components/home/v2/Showcase";
import { SocialProof } from "@/components/home/v2/SocialProof";
import { SellYourCar } from "@/components/home/v2/SellYourCar";
import { ClosingCTA } from "@/components/home/v2/ClosingCTA";
import { CinematicScrim } from "@/components/home/v2/CinematicScrim";
import { RecentlySold } from "@/components/home/v2/RecentlySold";
import { InstagramFeed } from "@/components/home/v2/InstagramFeed";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { getRecentlyAcquired, getSpotlightLineup } from "@/lib/vehicles";
import { getShowcase } from "@/lib/showcase";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { HAS_ADDRESS, SHOWROOM } from "@/lib/showroom";
import { ShowroomMap } from "@/components/contact/ShowroomMap";

// The hero is the client's clip and only the clip — video_resize.mp4, wired
// inside HeroVideo. The poster below is not a photograph from the stills library
// any more; it is a frame OF that clip, cut at 1.2s. So there is no second
// composition in the hero, and there is still something composed on screen
// before the film plays — or if it never does.
//
//   ffmpeg -ss 1.2 -i public/video/video_resize.mp4 -frames:v 1 -q:v 4 \
//     public/video/hero-poster.jpg
const HERO_POSTER = "/video/hero-poster.jpg";


// Cinematic positioning images — Lookbook frames of the matte-black Senna,
// art-directed per breakpoint. The wide side profile reads best on desktop; on
// a narrow mobile portrait crop a side profile collapses into an unrecognizable
// sliver, so phones get the symmetric head-on (doors up) shot, which fills a
// tall frame cleanly. Swap freely.
const SIGNATURE_IMAGE = "/site/band-transport.jpg"; // desktop (wide)
const SIGNATURE_IMAGE_MOBILE = "/site/band-transport.jpg"; // mobile

// Showroom facts live in lib/showroom.ts (shared with contact/about/footer).

export default function HomeV2Page() {
  // Featured runs a small carousel: the spotlight car (the `isSpotlight` flag
  // in the data) first, then the rest of the featured ones. "Available Now"
  // below is most-recently-acquired first, with the spotlight held out so the
  // page does not open on the same car twice; the other featured cars do
  // appear in both, which is how the reference site reads too.
  const lineup = getSpotlightLineup();
  // ONE ROW, not a 3x3 wall. Nine cards made this the heaviest mass on the page
  // and turned the homepage into a second catalogue — the catalogue is
  // /inventory, and it is one click away. Three is a taste of the floor.
  const recent = getRecentlyAcquired(12)
    .filter((v) => v.slug !== lineup[0]?.slug)
    .slice(0, 3);
  const showcase = getShowcase();

  return (
    <>
      <HeroVideo poster={HERO_POSTER} />

      {/* Featured — the spotlight car */}
      <Section id="inventory" spacing="tight">
        <Container>
          <FeaturedSpotlight vehicles={lineup} />
        </Container>
      </Section>

      {/* Leasing & financing — a mid-inventory statement band so buyers know
          every car can be leased or financed, right as they move from the
          featured car into the full lineup. Not in-house: see FinancingBand. */}
      <FinancingBand />

      {/* Available Now — the lineup, priced-free; price lives on the detail page.
          Trim the top padding on mobile (the financing band above already leaves
          breathing room); desktop keeps the full tight rhythm. */}
      <Section spacing="tight" className="atmosphere pt-8 md:pt-24">
        <Container>
          <div>
            <div className="mb-10 md:mb-14 flex items-end justify-between gap-6 border-b border-border pb-5 md:pb-6">
              <h2 className="title-mark font-title text-4xl md:text-6xl font-bold text-text-1 leading-[1.0]">
                Available Now
              </h2>
              <Link
                href="/inventory"
                className="group hidden sm:inline-flex items-center gap-2 pb-1 font-accent text-xs tracking-[0.16em] text-text-1 transition-colors hover:text-mark"
              >
                All Inventory
                <ChevronRight
                  className="h-3.5 w-3.5 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.75}
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
              {recent.map((v, i) => (
                <Reveal key={v.slug} delay={(i % 3) * 0.05}>
                  <VehicleCard vehicle={v} showPrice={false} />
                </Reveal>
              ))}
            </div>

            {/* Secondary actions after the lineup — the other two sides of the
                business, for buyers who've browsed and want to finance or sell. */}
            <div className="mt-14 border-t border-border pt-10 md:mt-20 md:pt-12">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <ButtonLink
                  href="/financing"
                  variant="outline"
                  size="lg"
                  withArrow
                  className="w-full sm:w-auto"
                >
                  Apply for Financing
                </ButtonLink>
                <ButtonLink
                  href="/sell"
                  variant="outline"
                  size="lg"
                  withArrow
                  className="w-full sm:w-auto"
                >
                  Sell Your Car
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Positioning — cinematic signature band; the UPPER of the two paired
          image pillars (the Sell Your Car band mirrors it lower down). Sits
          between the Available Now grid above and Recently Sold below: a
          matte-black exotic carries the frame while an editorial statement
          reads over a left-weighted scrim (shared CinematicScrim). The image is
          a non-cover Lookbook frame (see SIGNATURE_IMAGE). */}
      {/* A PINNED BAND. The frame is held while the words travel across it.

          Why here: three full-bleed photo bands ran the same treatment, which
          made the middle of the page its flattest stretch. This one carries the
          claim about the house's standard, so it is the first worth stopping on.

          The Sell band now runs the same hold (on Alex's call — it was once per
          page before). The financing band between them stays an ordinary
          scrolling band on purpose, so the three do not read as a set.

          Why it does not repeat the close: the closing pins a frame and
          DISSOLVES it to black while the marques rise out of it. Here nothing
          fades — the picture simply refuses to move while the sentence crosses
          it. One temporal idea each, which is what keeps two pinned moments on
          one page from reading as the same trick twice.

          The shell is 190svh; the frame inside is sticky at 100svh and the copy
          block is pulled back over it with a negative margin, so the copy owns
          the scroll and the picture owns the screen. */}
      <section className="chrome relative w-full bg-chrome-bg">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {/* mobile: symmetric head-on, doors up — fills a portrait frame
              (static; parallax adds little on a tall crop) */}
          <Image
            src={SIGNATURE_IMAGE_MOBILE}
            alt="A car being loaded into an enclosed transporter beside a lit showroom"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[58%_center] md:hidden"
          />
          {/* desktop: wide side profile with subtle parallax */}
          <ParallaxImage amount={180} className="hidden h-full w-full md:block">
            <Image
              src={SIGNATURE_IMAGE}
              alt="A car being loaded into an enclosed transporter beside a lit showroom"
              fill
              quality={85}
              sizes="100vw"
              className="object-cover object-[50%_42%]"
            />
          </ParallaxImage>
        </div>

        {/* Cinematic scrim — shared with the Sell band so the two paired image
            bands fade identically; side="left" seats the dark field under the
            left-weighted text here. */}
        <CinematicScrim side="left" />
        </div>

        {/* The copy rides over the held frame. justify-center puts it mid-block,
            so it enters from below, crosses the picture and leaves at the top —
            one pass, no repeat. */}
        <div className="relative z-10 -mt-[100svh] flex h-[190svh] flex-col justify-center">
        <Container className="relative w-full">
          {/* Headline → subhead → action, revealed as a slow stagger (one
              motivated motion per element). Gold lives only on the hairline +
              title-mark; the glass CTA stays neutral, per the "gold off the
              over-photo button" rule in DESIGN.md. */}
          <Reveal y={18}>
            <h2 className="title-mark mt-7 max-w-[17ch] text-balance font-title font-bold text-display-2 leading-[1.03] text-chrome-text-1">
              The cars worth owning, in one showroom
            </h2>
          </Reveal>

          <Reveal delay={0.1} y={22}>
            <p className="mt-6 max-w-[42ch] text-pretty text-[1.05rem] leading-relaxed text-white/85 md:text-[1.15rem]">
              Sourced through our collector network and the wider market, then
              curated for the showroom floor.
            </p>
          </Reveal>

          <Reveal delay={0.18} y={22}>
            <Link
              href="/inventory"
              className="group mt-9 inline-flex rounded-pill w-fit items-center gap-3.5 border border-white/25 bg-white/[0.06] px-8 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.12]"
            >
              Step inside the showroom
              <ChevronRight
                className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </Container>
        </div>
      </section>

      {/* Recently sold — hidden when no sold vehicles in data */}
      <RecentlySold />

      {/* The brand marquee used to sit here. It moved to the close, where the
          marques surface out of the footage one by one under "Find yours" — the
          last argument the page makes. Running the same ten marks twice on one
          page spends that moment before it arrives, so the mid-page band came
          out. The <BrandMarquee /> component is still in the tree: restore this
          section verbatim if the band is wanted back. */}

      {/* Social proof — positioning + testimonials */}
      <Section spacing="tight" className="atmosphere atmosphere-right">
        <SocialProof />
      </Section>

      {/* Sell Your Car — the lower cinematic pillar; the other half of the
          business (we buy too). Counterweight to the browse CTAs above. */}
      <SellYourCar />

      {/* Selected work — click a car to open the full photo set */}
      {showcase.length > 0 && (
        <Section spacing="tight" className="bg-paper">
          <Container>
            <div className="mb-6 md:mb-8">
              <h2 className="title-mark font-title text-3xl md:text-5xl font-bold text-text-1">
                Lookbook
              </h2>
            </div>
            <Showcase cars={showcase} />
          </Container>
        </Section>
      )}

      {/* Instagram feed — slim follow strip */}
      <Section spacing="tight" className="py-12 md:py-16">
        <InstagramFeed />
      </Section>

      {/* Visit — closing location + contact block */}
      <Section className="border-t border-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-stretch">
            {/* Map */}
            <Reveal className="lg:col-span-7">
              <ShowroomMap />
            </Reveal>

            {/* Details */}
            <Reveal delay={0.08} className="lg:col-span-5 flex">
              <div className="flex flex-col justify-between gap-10 md:gap-12 w-full">
                <div className="space-y-6 md:space-y-8">
                  <h2 className="title-mark font-title text-4xl md:text-6xl font-bold text-text-1 leading-[1.05]">
                    {SHOWROOM.market}
                  </h2>
                  <p className="max-w-[48ch] text-text-2 leading-relaxed text-[1.05rem] md:text-[1.1rem]">
                    Private viewings by appointment. Stop by the showroom, or
                    call ahead and we&apos;ll have the car waiting.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-1.5">
                    <p className="text-xs font-accent tracking-[0.16em] text-text-2 mb-3">
                      Showroom
                    </p>
                    <p className="font-mono text-[0.95rem] text-text-1">{SHOWROOM.name}</p>
                    {HAS_ADDRESS && (
                      <>
                        <p className="font-mono text-[0.95rem] text-text-1">{SHOWROOM.street}</p>
                        <p className="font-mono text-[0.95rem] text-text-1">
                          {SHOWROOM.cityStateZip}
                        </p>
                      </>
                    )}
                    <a
                      href={SHOWROOM.phoneHref}
                      className="mt-3 block w-fit font-mono text-[0.95rem] text-text-1 hover:text-accent transition-colors"
                    >
                      {SHOWROOM.phoneDisplay}
                    </a>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex w-fit items-center gap-2 font-mono text-[0.95rem] text-text-2 hover:text-accent transition-colors"
                    >
                      <InstagramIcon size={15} strokeWidth={1.5} />
                      @{INSTAGRAM_HANDLE}
                    </a>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-accent tracking-[0.16em] text-text-2 mb-3">
                      Hours
                    </p>
                    {SHOWROOM.hours.map(([d, h]) => (
                      <div
                        key={d}
                        className="flex justify-between gap-4 font-mono text-[0.95rem] text-text-2"
                      >
                        <span className="text-text-1">{d}</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href="/contact"
                    className="group relative inline-flex rounded-pill items-center gap-3 px-9 md:px-11 py-4 md:py-[1.15rem] font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-text-1 border border-text-1/80 hover:bg-text-1 hover:text-bg transition-all duration-300"
                  >
                    Book a Viewing
                    <ChevronRight
                      className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                      strokeWidth={1.75}
                    />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Closing crescendo — final beat into the footer */}
      <ClosingCTA />
    </>
  );
}
