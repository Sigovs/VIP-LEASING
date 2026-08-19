import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CinematicScrim } from "@/components/home/CinematicScrim";
import { SellForm } from "@/components/sell/SellForm";
import { SHOWROOM } from "@/lib/showroom";

export const metadata: Metadata = {
  title: "Sell Your Car",
  description:
    "We buy collector and exotic cars outright — one fair offer, a discreet close, payment direct to you.",
};

// Carrera GT frames, art-directed per role. Hero desktop: rear three-quarter
// against the dark brick wall (a distinct silhouette from the home Sell band's
// side profile 04). Hero mobile: the front head-on fills a portrait crop
// cleanly. Process: the engine bay adds a mechanical counterpoint to the three
// step columns. Detail: the yellow seatbelt — the page's one warm accent, its
// ochre echoing the champagne gold beside the form.
const HERO_IMAGE = "/showcase/porsche-carrera-gt/05.webp";
const HERO_IMAGE_MOBILE = "/showcase/porsche-carrera-gt/35.webp";
const PROCESS_IMAGE = "/showcase/porsche-carrera-gt/22.webp";
const DETAIL_IMAGE = "/showcase/porsche-carrera-gt/30.webp";

const STEPS = [
  {
    title: "Tell us the car",
    body: "Year, miles, condition, and anything we should know — the form below takes two minutes. A VIN helps but isn't required to start.",
  },
  {
    title: "Get a real number",
    body: "We value the car against the live market and come back with one fair offer — usually within a few hours on business days. No lowball to negotiate up from.",
  },
  {
    title: "Paid, done",
    body: "We buy the car ourselves — no listing, no waiting on a buyer. Funds go direct to you or your payoff, and we arrange pickup anywhere in the country.",
  },
];

// Why sell to us — one scannable line each: we buy outright, price to the live
// market, collect the car anywhere, and settle any payoff ourselves.
const REASONS = [
  {
    title: "Bought outright",
    body: "We buy with our own funds — no fee off the top, no waiting on a buyer.",
  },
  {
    title: "One fair number",
    body: "Priced to live-market comps and recent sales. One honest offer, no lowball.",
  },
  {
    title: "Pickup anywhere",
    body: "Enclosed transport nationwide — the car never leaves your driveway until it's sold.",
  },
  {
    title: "Payoff settled",
    body: "Still financing or leasing? We settle the payoff and send you the difference.",
  },
];

// FAQ — objection handling. The four buyers we studied all answer the same
// worries: open loans, timing, transport, what they'll take, honest condition.
const FAQS = [
  {
    q: "Do you buy cars that still have a loan or lease?",
    a: "Yes. We settle the payoff directly with your lender or leasing company and send you whatever equity is left over.",
  },
  {
    q: "How soon do I get paid?",
    a: "Once we've agreed on a number and seen the car and title, funds are typically wired the same or next business day.",
  },
  {
    q: "Do I have to bring the car to you?",
    a: "No. We arrange enclosed transport and collect the car anywhere in the country — it never has to leave your driveway until it's ours.",
  },
  {
    q: "What kind of cars are you looking for?",
    a: "Modern exotics, collector, and performance cars — Porsche, Ferrari, Lamborghini, McLaren, and the like. If it's exceptional, we want to hear about it.",
  },
  {
    q: "What if the car has stories or needs work?",
    a: "Tell us up front and it won't cost you the deal. We'd rather price it honestly than surprise anyone later.",
  },
];

// Shared section header — grotesk title with its oxblood period over a platinum
// hairline. One rule across every beat so the page reads as a set.
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-10 md:mb-14 border-b border-border pb-5 md:pb-6">
      <h2 className="title-mark font-title text-3xl md:text-5xl font-bold text-text-1 leading-[1.0]">
        {title}
      </h2>
    </div>
  );
}

export default function SellPage() {
  return (
    <>
      {/* Cinematic hero — the page's focal opening. Full-bleed Carrera GT with
          the copy anchored bottom-left over a left-weighted scrim; the fixed nav
          floats above it (its own top scrim keeps the links legible). Desktop:
          rear three-quarter with subtle parallax; mobile: the front head-on
          fills a portrait crop. */}
      <section className="chrome relative flex min-h-[86svh] w-full items-end overflow-hidden bg-chrome-bg md:min-h-[90vh]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_MOBILE}
            alt="A silver Porsche Carrera GT, front head-on, against a dark brick wall"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_62%] md:hidden"
          />
          <ParallaxImage amount={150} className="hidden h-full w-full md:block">
            <Image
              src={HERO_IMAGE}
              alt="A silver Porsche Carrera GT in rear three-quarter view against a dark brick wall"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-[58%_55%]"
            />
          </ParallaxImage>
        </div>

        <CinematicScrim side="left" />

        <Container className="relative w-full pb-16 pt-32 md:pb-24 lg:pb-28">
          <div className="max-w-[44rem]">
            <Reveal y={18}>
              <span aria-hidden className="block h-0.5 w-12 bg-mark" />
              <h1 className="title-mark mt-7 font-title text-6xl font-bold leading-[0.98] text-chrome-text-1 md:text-8xl">
                Sell Your Car
              </h1>
            </Reveal>

            <Reveal delay={0.1} y={22}>
              <p className="mt-6 max-w-[48ch] text-pretty text-[1.05rem] leading-relaxed text-white/85 md:text-[1.15rem]">
                We buy collector and exotic cars outright — one fair offer, a
                discreet close, and payment direct to you.
              </p>
            </Reveal>

            <Reveal delay={0.18} y={22}>
              <a
                href="#offer-form"
                className="group mt-9 inline-flex rounded-pill h-14 w-fit items-center gap-3 border border-accent/50 px-9 font-accent text-[0.75rem] font-medium uppercase tracking-[0.22em] md:text-[0.8rem] text-accent-on-chrome transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-bg"
              >
                Start an offer
                <ChevronRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How it works — first content beat after the hero. An editorial ruled
          list: each step led by a quiet grotesk figure (with the site's oxblood
          period), the engine bay standing tall alongside as an intentional
          counterpoint rather than a peer card. Deliberately unlike the boxed
          grid this used to be, and unlike the open "Why Sell" columns below. */}
      <Section spacing="tight">
        <Container>
          <SectionHeader title="How It Works" />

          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {STEPS.map((s, i) => (
                <Reveal
                  key={s.title}
                  delay={i * 0.06}
                  className="flex gap-6 border-t border-border py-7 first:border-t-0 first:pt-0 md:gap-10 md:py-9"
                >
                  <span
                    aria-hidden
                    className="title-mark w-10 shrink-0 font-title text-4xl font-bold leading-[0.85] text-text-3 md:w-14 md:text-5xl"
                  >
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-xl font-semibold tracking-[-0.018em] text-text-1 md:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-text-2">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal
              delay={0.12}
              className="relative min-h-[300px] overflow-hidden border border-border lg:col-span-5 lg:min-h-0"
            >
              <Image
                src={PROCESS_IMAGE}
                alt="The engine bay of a silver Porsche Carrera GT"
                fill
                quality={82}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* The form — pitch + direct line on the left, details on the right, a
          hairline dividing the two. Anchored so the hero's "Start an offer" CTA
          lands the heading clear of the fixed nav. */}
      <Section
        id="offer-form"
        spacing="tight"
        className="scroll-mt-24 border-t border-border bg-paper md:scroll-mt-28"
      >
        <Container>
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
              <span aria-hidden className="block h-0.5 w-12 bg-mark mb-7" />
              <h2 className="title-mark font-title text-4xl font-bold leading-[1.05] text-text-1 md:text-5xl">
                Start with the Details
              </h2>
              <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-text-2">
                The more we know, the sharper the number. Prefer to talk it
                through first? Call the showroom and ask for acquisitions.
              </p>
              <p className="mt-7 font-mono text-[0.95rem] leading-relaxed">
                <a
                  href={SHOWROOM.phoneHref}
                  className="text-text-1 transition-colors hover:text-accent"
                >
                  {SHOWROOM.phoneDisplay}
                </a>
                <br />
                <a
                  href={`mailto:${SHOWROOM.email}`}
                  className="text-text-1 transition-colors hover:text-accent"
                >
                  {SHOWROOM.email}
                </a>
              </p>
              <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-md border border-border lg:block">
                <Image
                  src={DETAIL_IMAGE}
                  alt="Yellow seatbelt detail inside a Porsche Carrera GT"
                  fill
                  quality={82}
                  sizes="(min-width: 1024px) 38vw, 0px"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal
              delay={0.08}
              className="lg:col-span-7 lg:border-l lg:border-border lg:pl-20"
            >
              <SellForm />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Why sell to us — reinforcement after the form. Open hairline columns,
          deliberately lighter than the boxed "How It Works" grid above so the
          two beats don't read the same. */}
      <Section spacing="tight" className="border-t border-border">
        <Container>
          <SectionHeader title="Why Sell to Us" />

          <div className="grid grid-cols-1 gap-x-14 gap-y-12 sm:grid-cols-2 lg:gap-x-20">
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={(i % 2) * 0.06}>
                <span aria-hidden className="block h-0.5 w-10 bg-mark" />
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.018em] text-text-1 md:text-2xl">
                  {r.title}
                </h3>
                <p className="mt-3.5 max-w-[42ch] text-[0.95rem] leading-relaxed text-text-2">
                  {r.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ — objection handling as an accordion of native <details> drops.
          `name="faq"` makes them mutually exclusive (one open at a time) with
          zero JS, so the WP theme ports it verbatim. The plus rotates to an ×
          on open; each row is a full-width click target. */}
      <Section spacing="tight" className="border-t border-border">
        <Container>
          <SectionHeader title="Common Questions" />

          <div className="border-t border-border">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={(i % 3) * 0.05}>
                <details name="faq" className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 md:py-7 [&::-webkit-details-marker]:hidden">
                    <span className="text-lg font-semibold tracking-[-0.015em] text-text-1">
                      {f.q}
                    </span>
                    <Plus
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-5 shrink-0 text-text-3 transition duration-300 group-hover:text-accent group-open:rotate-45 group-open:text-accent"
                    />
                  </summary>
                  <p className="max-w-[64ch] pb-7 pr-10 text-[0.95rem] leading-relaxed text-text-2 md:pb-8">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
