import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CinematicScrim } from "@/components/home/CinematicScrim";
import { SHOWROOM } from "@/lib/showroom";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "Lease or finance any car in the lineup — terms arranged through our lending partners.",
};

// F50 + LaFerrari frames from the Lookbook set — the same shoot the home band
// (02, nose to nose) and closing band (36, doors up) draw from, so the story
// carries across the page without repeating a frame. Hero desktop: the pair
// front three-quarter, filling the frame; hero mobile: the head-on fills a
// portrait crop. Band: doors up, side by side.
const HERO_IMAGE = "/showcase/f50-laferrari/12.webp";
const HERO_IMAGE_MOBILE = "/showcase/f50-laferrari/25.webp";
const BAND_IMAGE = "/showcase/f50-laferrari/36.webp";
const BAND_IMAGE_MOBILE = "/showcase/f50-laferrari/20.webp";

// The partnership split — a dark McLaren Senna carries across both panels so the
// showroom and its financing partner read as one seamless world: the same car,
// two views, on either side of the signature.
const SHOWROOM_IMAGE = "/showcase/mclaren-senna/03.webp";
const PARTNER_IMAGE = "/showcase/mclaren-senna/18.webp";

// No term lengths, APRs, or mileage figures anywhere on this page — the client
// has published none, so we invent none. And nothing here may read as in-house
// lending: they arrange terms, they do not fund them.
const PATHS = [
  {
    title: "Lease",
    body: "Structured for how collectors actually drive — hold the car for the chapter you want it, with flexibility at term end to trade, return, or keep it. Available across all makes and models, including cars most banks won't touch.",
  },
  {
    title: "Finance",
    body: "Straightforward terms toward owning it outright, tailored to the car and to you. One conversation, one set of documents, and the car is yours — not a portal, not a call center.",
  },
];

const STEPS = [
  {
    title: "Pick the car",
    body: "Any car in the showroom qualifies — the lineup, an incoming acquisition, or a car we source for you.",
  },
  {
    title: "We structure the terms",
    body: "One call, and the terms are built around you — arranged with our lending partners, tailored to exactly what you need.",
  },
  {
    title: "Sign and drive",
    body: "Paperwork is handled between us and the lender. You sign, we hand over the keys — or deliver them to your door.",
  },
];

// Shared section header — grotesk title with its oxblood period over a platinum
// hairline, an optional lead line beneath. One rule across every beat, matching
// the Sell page.
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-10 border-b border-border pb-5 md:mb-14 md:pb-6">
      <h2 className="title-mark font-title text-3xl font-bold leading-[1.0] text-text-1 md:text-5xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-relaxed text-text-2">
          {sub}
        </p>
      )}
    </div>
  );
}

export default function FinancingPage() {
  return (
    <>
      {/* Cinematic hero — the page's focal opening, mirroring the Sell page.
          The F50/LaFerrari pair full-bleed with the copy anchored bottom-left
          over a left-weighted scrim; the fixed nav floats above it. */}
      <section className="chrome relative flex min-h-[86svh] w-full items-end overflow-hidden bg-chrome-bg md:min-h-[90vh]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_MOBILE}
            alt="A Ferrari F50 and LaFerrari facing forward on an open road"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_58%] md:hidden"
          />
          <ParallaxImage amount={150} className="hidden h-full w-full md:block">
            <Image
              src={HERO_IMAGE}
              alt="A Ferrari F50 beside a LaFerrari, front three-quarter, under a dramatic sky"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-[52%_46%]"
            />
          </ParallaxImage>
        </div>

        <CinematicScrim side="left" />

        <Container className="relative w-full pb-16 pt-32 md:pb-24 lg:pb-28">
          <div className="max-w-[44rem]">
            <Reveal y={18}>
              <span aria-hidden className="block h-px w-12 bg-accent" />
              <h1 className="title-mark mt-7 font-title text-6xl font-bold leading-[0.98] text-chrome-text-1 md:text-8xl">
                Financing
              </h1>
            </Reveal>

            <Reveal delay={0.1} y={22}>
              <p className="mt-6 max-w-[48ch] text-pretty text-[1.05rem] leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:text-[1.15rem]">
                Every car in the lineup can be driven home your way — lease or
                finance, arranged through our lending partners.
              </p>
            </Reveal>

            <Reveal delay={0.18} y={22}>
              <Link
                href="/contact?intent=financing"
                className="group mt-9 inline-flex rounded-pill h-14 w-fit items-center gap-3 border border-accent/50 px-9 font-accent text-[0.75rem] font-medium uppercase tracking-[0.22em] md:text-[0.8rem] text-accent-on-chrome transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-bg"
              >
                Start the conversation
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Two ways home — a full 50/50 split: lease on one side, finance on the
          other, each a tall title-led panel. The reference site splits this into
          "the showroom and its financing partner"; this house lends nothing
          itself and has named no partner, so the split is the two routes a buyer
          can actually take. Composition unchanged. */}
      <Section spacing="tight" className="border-t border-border">
        <Container>
          <SectionHead
            title="Two Ways To Drive It Home"
            sub="Exotic and collector cars don't fit the forms at a retail bank. We keep the conversation and the paperwork in one place, and the lending is arranged with partners who work on cars like these."
          />

          <div className="grid grid-cols-1 border border-border lg:grid-cols-2">
            {/* Lease — over the Senna */}
            <Reveal className="relative flex min-h-[460px] flex-col justify-end overflow-hidden p-10 md:min-h-[560px] md:p-14 lg:p-16">
              <Image
                src={SHOWROOM_IMAGE}
                alt="A black McLaren Senna in the showroom"
                fill
                quality={84}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[52%_50%]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15"
              />
              <div className="relative">
                <h3 className="title-mark font-title text-4xl font-bold leading-[1.0] text-white md:text-5xl">
                  Lease
                </h3>
                <p className="mt-6 max-w-[38ch] text-[1.02rem] leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
                  Drive it for a set term, with payments built around the car and
                  the way you use it. Any car in the lineup qualifies — including
                  one we source for you.
                </p>
                <Link
                  href="/inventory"
                  className="group mt-7 inline-flex items-center gap-2 font-accent text-xs tracking-[0.18em] text-white transition-colors hover:text-accent-on-chrome"
                >
                  Browse the lineup
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </Reveal>

            {/* Finance — over the Senna's other side */}
            <Reveal
              delay={0.1}
              className="relative flex min-h-[460px] flex-col justify-end overflow-hidden border-t border-border p-10 md:min-h-[560px] md:p-14 lg:border-l lg:border-t-0 lg:p-16"
            >
              <Image
                src={PARTNER_IMAGE}
                alt="A black McLaren Senna with its doors raised"
                fill
                quality={84}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[50%_50%]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15"
              />
              <div className="relative">
                <h3 className="title-mark font-title text-4xl font-bold leading-[1.0] text-white md:text-5xl">
                  Finance
                </h3>
                <p className="mt-6 max-w-[40ch] text-[1.02rem] leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
                  Own it outright on terms structured for the car rather than for
                  a retail form. Arranged with lending partners who work on cars
                  like these, across all makes and models.
                </p>
                <Link
                  href="/contact?intent=financing"
                  className="group mt-7 inline-flex items-center gap-2 font-accent text-xs tracking-[0.18em] text-white transition-colors hover:text-accent-on-chrome"
                >
                  Start the conversation
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* How it works — the two paths and the process in one beat: the options
          on the left, the three steps ruled out on the right, a hairline
          between. Lease or finance, the path is the same. */}
      <Section spacing="tight" className="border-t border-border">
        <Container>
          <SectionHead
            title="How It Works"
            sub="Lease or finance — either way, it's one conversation and three steps."
          />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* The two ways in */}
            <div className="flex flex-col gap-10 lg:col-span-5">
              {PATHS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <span aria-hidden className="block h-px w-10 bg-accent" />
                  <h3 className="title-mark mt-5 font-title text-2xl font-bold text-text-1 md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-3.5 max-w-[46ch] text-[0.95rem] leading-relaxed text-text-2">
                    {p.body}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* The three steps */}
            <div className="lg:col-span-7 lg:border-l lg:border-border lg:pl-16">
              {STEPS.map((s, i) => (
                <Reveal
                  key={s.title}
                  delay={i * 0.06}
                  className="flex gap-6 border-t border-border py-7 first:border-t-0 first:pt-0 md:gap-10 md:py-8"
                >
                  <span
                    aria-hidden
                    className="title-mark w-9 shrink-0 font-title text-4xl font-bold leading-[0.85] text-text-3 md:w-12 md:text-5xl"
                  >
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <h4 className="text-lg font-semibold tracking-[-0.018em] text-text-1 md:text-xl">
                      {s.title}
                    </h4>
                    <p className="mt-2.5 max-w-[46ch] text-[0.95rem] leading-relaxed text-text-2">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Closing band — doors up, drive it home your way. */}
      <section className="chrome relative flex min-h-[540px] w-full items-center overflow-hidden bg-chrome-bg md:min-h-[640px]">
        <div className="absolute inset-0">
          <Image
            src={BAND_IMAGE_MOBILE}
            alt="A Ferrari F50 and LaFerrari facing forward on an open road"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_62%] md:hidden"
          />
          <ParallaxImage amount={180} className="hidden h-full w-full md:block">
            <Image
              src={BAND_IMAGE}
              alt="A Ferrari F50 beside a LaFerrari with its doors raised, on an open road under a dramatic sky"
              fill
              quality={85}
              sizes="100vw"
              className="object-cover object-[50%_55%]"
            />
          </ParallaxImage>
        </div>
        {/* center-weighted scrim, matching the home financing band recipe —
            rgba literals only (var() in a gradient is dropped by Lightning
            CSS, DESIGN.md §7) */}
        <div aria-hidden className="absolute inset-0 bg-black/25" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 92% at 50% 54%, rgba(8,9,10,0.72) 0%, rgba(8,9,10,0.42) 52%, rgba(8,9,10,0) 84%)",
          }}
        />
        {/* The melt — proportional, four-stop, the same ramps as every other photo
            band on the site. These were fixed at 96px, which on a band this tall
            reads as a hard edge with a smudge on it. */}
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

        <Container className="relative w-full">
          <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
            <Reveal y={18}>
              <span aria-hidden className="mx-auto block h-px w-12 bg-accent" />
              <h2 className="title-mark mt-7 text-balance font-title text-display-2 font-bold leading-[1.03] text-chrome-text-1">
                Drive It Home Your Way
              </h2>
            </Reveal>
            <Reveal delay={0.12} y={22}>
              <div className="mt-9 flex flex-col items-center gap-5 sm:flex-row">
                <Link
                  href="/contact?intent=financing"
                  className="group inline-flex rounded-pill w-fit items-center gap-3.5 border border-white/25 bg-white/[0.06] px-8 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.12]"
                >
                  Start the conversation
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
                <a
                  href={SHOWROOM.phoneHref}
                  className="text-sm font-semibold tracking-[0.02em] text-white/85 transition-colors [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] hover:text-white"
                >
                  or call {SHOWROOM.phoneDisplay}
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
