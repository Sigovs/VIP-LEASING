import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { HeroVideo } from "@/components/home/HeroVideo";
import { FeaturedSpotlight } from "@/components/home/FeaturedSpotlight";
import { FinancingBand } from "@/components/home/FinancingBand";
import { Showcase } from "@/components/home/Showcase";
import { SocialProof } from "@/components/home/SocialProof";
import { SellYourCar } from "@/components/home/SellYourCar";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { CinematicScrim } from "@/components/home/CinematicScrim";
import { RecentlySold } from "@/components/home/RecentlySold";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { getRecentlyAcquired, getSpotlightVehicle } from "@/lib/vehicles";
import { getShowcase } from "@/lib/showcase";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { HAS_ADDRESS, SHOWROOM } from "@/lib/showroom";
import { ShowroomMap } from "@/components/contact/ShowroomMap";

// VIDEO-SWAP: currently a test clip. Replace with the client-supplied final
// hero asset (~15–25s) when ready. Optimize it for the web the same way before
// dropping it in (1080p, audio stripped, faststart for progressive load):
//   ffmpeg -i raw.mp4 -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
//     -crf 28 -preset slow -movflags +faststart public/hero.mp4
//   ffmpeg -ss 1 -i public/hero.mp4 -frames:v 1 -q:v 5 public/hero-poster.jpg
// (raise -crf for a smaller file, lower it for more quality; pick a poster
//  timestamp on a strong full-car frame.)
const HERO_POSTER = "/site/hero-villa.jpg";


// Cinematic positioning images — Lookbook frames of the matte-black Senna,
// art-directed per breakpoint. The wide side profile reads best on desktop; on
// a narrow mobile portrait crop a side profile collapses into an unrecognizable
// sliver, so phones get the symmetric head-on (doors up) shot, which fills a
// tall frame cleanly. Swap freely.
const SIGNATURE_IMAGE = "/site/band-transport.jpg"; // desktop (wide)
const SIGNATURE_IMAGE_MOBILE = "/site/band-transport.jpg"; // mobile

// Showroom facts live in lib/showroom.ts (shared with contact/about/footer).

export default function HomePage() {
  // One hero car gets the spotlight (set via the `isSpotlight` flag in the
  // data); the rest fill the "Available Now" lineup below (most-recently
  // acquired first, spotlight excluded so it never repeats).
  const spotlight = getSpotlightVehicle();
  const recent = getRecentlyAcquired(12)
    .filter((v) => v.slug !== spotlight?.slug)
    .slice(0, 9);
  const showcase = getShowcase();

  return (
    <>
      <HeroVideo poster={HERO_POSTER} />

      {/* Featured — the spotlight car */}
      <Section id="inventory" spacing="tight">
        <Container>
          {spotlight && <FeaturedSpotlight vehicle={spotlight} />}
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
                className="group hidden sm:inline-flex items-center gap-2 pb-1 text-xs font-accent tracking-[0.16em] text-text-2 hover:text-accent transition-colors"
              >
                All Inventory
                <ChevronRight
                  className="h-3.5 w-3.5 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.75}
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-10 md:gap-y-16">
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
      <section className="chrome relative flex min-h-[600px] w-full items-center overflow-hidden bg-chrome-bg md:min-h-[700px] lg:min-h-[760px]">
        <div className="absolute inset-0">
          {/* mobile: symmetric head-on, doors up — fills a portrait frame
              (static; parallax adds little on a tall crop) */}
          <Image
            src={SIGNATURE_IMAGE_MOBILE}
            alt="Matte-black McLaren Senna, front three-quarter view with its dihedral doors raised, against a dark brick wall"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[58%_center] md:hidden"
          />
          {/* desktop: wide side profile with subtle parallax */}
          <ParallaxImage amount={180} className="hidden h-full w-full md:block">
            <Image
              src={SIGNATURE_IMAGE}
              alt="Matte-black McLaren Senna in side profile with its dihedral doors raised, against a dark brick wall"
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

        <Container className="relative w-full">
          {/* Headline → subhead → action, revealed as a slow stagger (one
              motivated motion per element). Gold lives only on the hairline +
              title-mark; the glass CTA stays neutral, per the "gold off the
              over-photo button" rule in DESIGN.md. */}
          <Reveal y={18}>
            <span aria-hidden className="block h-0.5 w-12 bg-mark" />
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
                  <span aria-hidden className="block h-0.5 w-12 bg-mark" />
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
