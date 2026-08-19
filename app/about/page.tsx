import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CinematicScrim } from "@/components/home/CinematicScrim";
import { ButtonLink } from "@/components/ui/Button";
import { SHOWROOM } from "@/lib/showroom";

export const metadata: Metadata = {
  title: "About",
  description:
    `Luxury and exotic cars, leased, financed, and delivered across ${SHOWROOM.market}.`,
};

// Ferrari F50 golden-hour frames — the heritage register for the story page.
// Hero desktop: front three-quarter on an open road; hero mobile: the side
// profile fills a portrait crop against the dusk sky. Band: the backlit rear
// three-quarter — a warmer, moodier counterpoint to the front-lit hero, used
// as the silent cinematic breath before the visit close.
const HERO_IMAGE = "/showcase/ferrari-f50/05.webp";
const HERO_IMAGE_MOBILE = "/showcase/ferrari-f50/35.webp";
const BAND_IMAGE = "/showcase/ferrari-f50/18.webp";

// What the house actually does — acquisition, sales, financing. Sales copy
// stays on the "bought outright / curated" story (never consignment).
const PRACTICE = [
  {
    title: "Acquisition",
    body: "We buy collector and exotic cars outright — sourced through our collector network and the wider market, or straight from an owner ready to part with one.",
    href: "/sell",
    label: "Sell your car",
  },
  {
    title: "Sales",
    body: "A hand-curated floor, not a volume lot. Every car is vetted before it earns showroom space, and private viewings are always by appointment.",
    href: "/inventory",
    label: "See the inventory",
  },
  {
    title: "Financing & Leasing",
    body: "Lease or finance terms arranged through our lending partners, across all makes and models — one conversation, keys in hand.",
    href: "/financing",
    label: "Explore financing",
  },
];

// Shared section header — grotesk title with its oxblood period over a platinum
// hairline, matching the sell/financing pages so the site reads as one set.
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-10 md:mb-14 border-b border-border pb-5 md:pb-6">
      <h2 className="title-mark font-title text-3xl md:text-5xl font-bold text-text-1 leading-[1.0]">
        {title}
      </h2>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Cinematic hero — a golden-hour F50 stands in for the heritage story.
          Copy anchored bottom-left over a left-weighted scrim; the fixed nav
          floats above. Desktop: front three-quarter with subtle parallax;
          mobile: the side profile fills a portrait crop. */}
      <section className="chrome relative flex min-h-[86svh] w-full items-end overflow-hidden bg-chrome-bg md:min-h-[90vh]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_MOBILE}
            alt="A red Ferrari F50 in side profile on an open country road at dusk"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_45%] md:hidden"
          />
          <ParallaxImage amount={150} className="hidden h-full w-full md:block">
            <Image
              src={HERO_IMAGE}
              alt="A red Ferrari F50 in front three-quarter view on a country road at golden hour"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-[52%_58%]"
            />
          </ParallaxImage>
        </div>

        <CinematicScrim side="left" />

        <Container className="relative w-full pb-16 pt-32 md:pb-24 lg:pb-28">
          <div className="max-w-[44rem]">
            <Reveal y={18}>
              <span aria-hidden className="block h-0.5 w-12 bg-mark" />
              <h1 className="title-mark mt-7 font-title text-6xl font-bold leading-[0.98] text-chrome-text-1 md:text-8xl">
                About
              </h1>
            </Reveal>

            <Reveal delay={0.1} y={22}>
              <p className="mt-6 max-w-[46ch] text-pretty text-[1.05rem] leading-relaxed text-white/85 md:text-[1.15rem]">
                One showroom, one standard — luxury and exotic cars in{" "}
                {SHOWROOM.market}.
              </p>
            </Reveal>

            <Reveal delay={0.18} y={22}>
              <Link
                href="/inventory"
                className="group mt-9 inline-flex rounded-pill h-14 w-fit items-center gap-3 border border-accent/50 px-9 font-accent text-[0.75rem] font-medium uppercase tracking-[0.22em] md:text-[0.8rem] text-accent-on-chrome transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-bg"
              >
                See the inventory
                <ChevronRight
                  className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.5}
                />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The story — one editorial statement, no invented history. Heading left,
          the two paragraphs right, a hairline dividing them at lg+. */}
      <Section spacing="tight">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0">
            <Reveal className="lg:col-span-6 lg:pr-16">
              <span aria-hidden className="block h-0.5 w-12 bg-mark mb-7" />
              <h2 className="font-title text-4xl md:text-6xl font-bold text-text-1 leading-[1.08]">
                Built on Referrals,
                <br />
                <span className="title-mark">and Cars Worth Keeping</span>
              </h2>
            </Reveal>
            <Reveal
              delay={0.08}
              className="space-y-6 lg:col-span-6 lg:border-l lg:border-border lg:pl-16"
            >
              {/* PLACEHOLDER COPY. The reference site tells its own origin
                  story here (Toronto, a second showroom). We have none of this
                  client's history yet and will not invent one — this says what
                  the house does until they tell us where it came from. */}
              <p className="text-text-2 leading-relaxed text-[1.05rem] md:text-[1.1rem]">
                Luxury and exotic cars, across {SHOWROOM.market}. No volume targets —
                just the discipline of only taking on cars we&apos;d want to own
                ourselves.
              </p>
              <p className="text-text-2 leading-relaxed text-[1.05rem] md:text-[1.1rem]">
                Lease it, finance it, or buy it outright. The terms are arranged
                around the car and around you, and the conversation stays with
                one person from the first call to the keys.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* What we do — three doors into the rest of the site. Open hairline
          columns (vertical rules between, no boxes), each closing on a gold
          link label pinned to the bottom so the three align. */}
      <Section spacing="tight" className="border-t border-border">
        <Container>
          <SectionHeader title="What We Do" />

          <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-3 lg:gap-x-16">
            {PRACTICE.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.06}
                className="h-full border-t border-border pt-8 first:border-t-0 first:pt-0 md:border-l md:border-t-0 md:pl-12 md:pt-0 md:first:border-l-0 md:first:pl-0 lg:pl-16"
              >
                <Link href={p.href} className="group flex h-full flex-col">
                  <h3 className="text-xl font-semibold tracking-[-0.018em] text-text-1 md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-3.5 max-w-[42ch] text-[0.95rem] leading-relaxed text-text-2">
                    {p.body}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 font-accent text-[0.7rem] uppercase tracking-[0.2em] text-text-3 transition-colors group-hover:text-accent">
                    {p.label}
                    <ChevronRight
                      className="h-3.5 w-3.5 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                      strokeWidth={1.75}
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Cinematic breath — silent backlit F50, the aspirational beat before the
          visit close. Fades top into the What-We-Do ground and bottom into the
          paper slab below. */}
      {/* Taller — 58vh gave the photograph no room to breathe once the fades ate
          both ends of it. A cinematic breath that is mostly gradient is not a
          breath, it is a smudge. */}
      <section
        aria-hidden
        className="chrome relative h-[62vh] min-h-[440px] w-full overflow-hidden bg-chrome-bg md:h-[82vh] md:min-h-[620px]"
      >
        <Image
          src={BAND_IMAGE}
          alt=""
          fill
          quality={85}
          sizes="100vw"
          className="object-cover object-[50%_50%] md:hidden"
        />
        <ParallaxImage amount={180} className="hidden h-full w-full md:block">
          <Image
            src={BAND_IMAGE}
            alt=""
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_44%]"
          />
        </ParallaxImage>
        {/* The melt. These were FIXED at h-24 — 96px — which on a 620px band is a
            hard edge with a smudge laid over it; you can see exactly where the
            fade starts. The home page's bands were fixed weeks ago and this one
            never got the change.

            Proportional now (44% down, 55% up) on the same four-stop ramps as the
            rest of the site: a single from→transparent stretch this long develops
            a visible shoulder, a band where the eye catches the break. The top
            hands off to the body ground above, the base to the paper slab below —
            so the picture gives way to the page at both ends rather than stopping
            against it. */}
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
              "linear-gradient(to top, rgb(9,10,11) 0%, rgba(9,10,11,0.88) 18%, rgba(9,10,11,0.55) 42%, rgba(9,10,11,0.22) 70%, rgba(9,10,11,0) 100%)",
          }}
        />
      </section>

      {/* Come see the floor — the practical close on the deeper slab: the visit
          pitch + booking on the left, the showroom details on the right, and
          the group marks folded in quietly along the bottom. */}
      <Section spacing="tight" className="bg-paper">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <span aria-hidden className="block h-0.5 w-12 bg-mark mb-7" />
              <h2 className="title-mark font-title text-4xl md:text-5xl font-bold text-text-1 leading-[1.05]">
                Come See the Floor
              </h2>
              <p className="mt-6 max-w-[44ch] text-text-2 leading-relaxed text-[1.05rem]">
                Private viewings by appointment. Stop by the showroom, or call
                ahead and we&apos;ll have the car waiting.
              </p>
              <div className="mt-8">
                <ButtonLink
                  href="/contact?intent=viewing"
                  variant="outline"
                  size="lg"
                  withArrow
                >
                  Book a viewing
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7">
              <dl className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
                <div className="space-y-3">
                  <dt className="font-accent text-[0.7rem] uppercase tracking-[0.24em] text-text-3">
                    Showroom
                  </dt>
                  <dd className="font-mono text-[0.95rem] leading-relaxed text-text-1">
                    {SHOWROOM.street}
                    <br />
                    {SHOWROOM.cityStateZip}
                  </dd>
                </div>
                <div className="space-y-3">
                  <dt className="font-accent text-[0.7rem] uppercase tracking-[0.24em] text-text-3">
                    Hours
                  </dt>
                  <dd className="font-mono text-[0.95rem] leading-relaxed">
                    {SHOWROOM.hours.map(([d, h]) => (
                      <div key={d} className="flex justify-between gap-4">
                        <span className="text-text-1">{d}</span>
                        <span className="text-text-2">{h}</span>
                      </div>
                    ))}
                  </dd>
                </div>
                <div className="space-y-3">
                  <dt className="font-accent text-[0.7rem] uppercase tracking-[0.24em] text-text-3">
                    Phone
                  </dt>
                  <dd className="font-mono text-[0.95rem] leading-relaxed text-text-1">
                    <a
                      href={SHOWROOM.phoneHref}
                      className="transition-colors hover:text-accent"
                    >
                      {SHOWROOM.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="space-y-3">
                  <dt className="font-accent text-[0.7rem] uppercase tracking-[0.24em] text-text-3">
                    Email
                  </dt>
                  <dd className="font-mono text-[0.95rem] leading-relaxed text-text-1">
                    <a
                      href={`mailto:${SHOWROOM.email}`}
                      className="transition-colors hover:text-accent"
                    >
                      {SHOWROOM.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
