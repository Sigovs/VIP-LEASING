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

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { HeroVideo } from "@/components/home/v4/HeroVideo";
import { FeaturedSpotlight } from "@/components/home/v4/FeaturedSpotlight";
import { FinancingBand } from "@/components/home/v4/FinancingBand";
import { SocialProof } from "@/components/home/v4/SocialProof";
import { SellOffer } from "@/components/home/v4/SellOffer";
import { ClosingMarques } from "@/components/home/v4/ClosingMarques";
import { RecentlySold } from "@/components/home/v4/RecentlySold";
import { InstagramFeed } from "@/components/home/v4/InstagramFeed";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { getRecentlyAcquired, getSpotlightLineup } from "@/lib/vehicles";
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


// Showroom facts live in lib/showroom.ts (shared with contact/about/footer).

export default function HomeV4Page() {
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

  return (
    <>
      <HeroVideo poster={HERO_POSTER} />

      {/* Featured — the spotlight car */}
      <Section id="inventory" spacing="tight">
        <Container>
          <FeaturedSpotlight vehicles={lineup} />
        </Container>
      </Section>

      {/* Sell Your Car. Owns its own section now — it carries the photograph
          the cut band left behind, so the ground, the scrim and the seams
          belong to the component rather than to a wrapper here. */}
      <SellOffer />

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

      {/* "The cars worth owning, in one showroom" stood here — a pinned band,
          1710px, the last held frame on the page. Removed at the client's
          request: of everything left it was the most recognisably the
          reference site's gesture, so cutting it is what moves this homepage
          furthest towards being the client's own.

          Its photograph did not leave with it. /site/band-transport.jpg is now
          the ground under Sell Your Car, where a car going into an enclosed
          transporter is the section's own third step rather than an
          illustration of "cars worth owning", which it never was.

          Two things to know. The page now has NO pinned or scroll-linked
          moment at all — the close went static first, this was the last one.
          That is consistent with where the client keeps steering, not an
          oversight. And Available Now now runs straight into Recently Sold:
          two grids of the same VehicleCard separated only by a tone step,
          where 1710px of held photography used to sit between them. Flagged,
          not fixed — see the note in the report.

          app/v2/page.tsx still carries the band verbatim. */}

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

      {/* "Ready to part with yours?" stood here — a pinned cinematic band,
          1733px, the second of two on the page. Removed at the client's
          request; the offer it made now opens the page instead (see the
          SellOffer section above the leasing band).

          Two things came back with it. The positioning band up the page is
          once again the page's only held frame, which is what made that device
          worth using in the first place. And the run from the reviews to the
          footer lost its heaviest mass, so the close arrives sooner.

          components/home/v2/SellYourCar.tsx is untouched — restore this line
          and its import to put the band back. */}

      {/* The Lookbook stood here — four photo sets, 1302px, opening a lightbox.
          Removed at the client's request.

          Worth knowing what left with it: it was the only mass on this page
          that sold nothing. It said how the house photographs rather than what
          is for sale, and it was the one pause between offers. The page is now
          a continuous run of propositions from the hero to the footer, and the
          Instagram strip below is what is left carrying any atmosphere at all.

          To restore: put back this section, the Showcase import, and the
          getShowcase() call at the top. components/home/v2/Showcase.tsx and the
          photo sets under public/showcase are untouched. */}

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

      {/* The close. Was a 4321px pinned scene — statement rising into a fixed
          title, six marques each with their own car, then the whole floor.
          Made static at the client's request; see ClosingMarques.tsx for what
          survived and what did not. components/home/v2/ClosingCTA.tsx and
          ClosingBrands.tsx are untouched if the scene is ever wanted back. */}
      <ClosingMarques />
    </>
  );
}
