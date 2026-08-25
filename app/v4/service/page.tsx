import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CinematicScrim } from "@/components/home/v4/CinematicScrim";
import { ContactForm } from "@/components/contact/v4/ContactForm";
import { SHOWROOM } from "@/lib/showroom";

export const metadata: Metadata = {
  title: "Service",
  description:
    "Aftercare for the cars we place — maintenance, detailing, inspection, storage and transport, arranged and accounted for.",
};

// ⚠️ THE OFFERING BELOW IS PROPOSED, NOT CONFIRMED.
//
// This page shipped as shape only, and the reason was good: PLAN.md records the
// open question — "what exactly is Service? detailing, maintenance, transport,
// buying?" — and inventing three plausible services would have read as finished
// while being wrong in a way nobody would catch.
//
// What is written here is not an invention pulled from nowhere. Every one of the
// five is something this business ALREADY implies somewhere else on the site: it
// delivers anywhere in Florida (the home hero says so), it buys cars outright and
// therefore inspects them, and it sells cars that come back for their first
// service. That is a defensible starting point for a conversation with the
// client, not a guess. It still has to survive that conversation. Nothing here
// names a price, a turnaround or a partner, because those are the parts that
// would be wrong.
//
// The photography comes from 360 Auto Care (Alex's own project, same generated
// stock as the rest of public/site). None of the frames carry that shop's
// signage, and the register — dark bay, wet floor, warm task light — is already
// this site's. The transport frame is this site's own.
const HERO_IMAGE = "/site/service-bay.jpg";

const CARE = [
  {
    title: "Scheduled maintenance",
    body: "Factory-interval work booked, tracked and reported back to you. We hold the history so the car's file stays whole — which is what it is worth on the day you sell it.",
    image: "/site/service-maintenance.jpg",
    position: "object-[50%_45%]",
    alt: "Oil draining from a car raised on a lift",
  },
  {
    title: "Detailing and paint protection",
    body: "Correction, ceramic coating and film, specified per car rather than per package. A wrapped nose on a car that never sees a highway is money spent in the wrong place.",
    image: "/site/service-detailing.jpg",
    position: "object-[50%_50%]",
    alt: "A machine polisher working a dark painted panel",
  },
  {
    title: "Pre-purchase inspection",
    body: "Found a car somewhere else? We will look at it the way we look at one we are buying ourselves, and tell you what we find — including when the answer is to walk away.",
    image: "/site/service-inspection.jpg",
    position: "object-[52%_40%]",
    alt: "A diagnostic tablet held against a car's interior",
  },
  {
    title: "Storage",
    body: "Climate-controlled, battery tended, started and moved on a schedule. Collected and returned when you want it, rather than when the unit is open.",
    image: "/site/service-storage.jpg",
    position: "object-[50%_55%]",
    alt: "Lit workshop bays with cars standing inside",
  },
  {
    title: "Transport and delivery",
    body: "Enclosed, insured, and to your door — the same way the cars we sell arrive. Anywhere in Florida as standard, and further when it is worth the trip.",
    image: "/site/band-transport.jpg",
    position: "object-[50%_50%]",
    alt: "A car being loaded into an enclosed transporter",
  },
];

const STEPS = [
  {
    title: "Tell us the car",
    body: "What it is, what it needs, and when you want it back. If it is a car we sold you, we already have the file.",
  },
  {
    title: "We quote it",
    body: "One number, itemised, before anything is touched. If the work turns out to be smaller than the estimate, the invoice is smaller too.",
  },
  {
    title: "You approve",
    body: "Nothing proceeds without a yes. If something else surfaces on the lift, it comes back to you as a separate question — never as a line you find later.",
  },
  {
    title: "Collected and returned",
    body: "We can take the car and bring it back, washed and with the paperwork. You do not have to see the inside of a workshop unless you want to.",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-9 font-title text-2xl font-bold leading-[1.1] tracking-[-0.015em] text-text-1 md:text-3xl">
      {children}
    </h2>
  );
}

export default function ServicePage() {
  return (
    <>
      {/* Cinematic hero, on the pattern the other interior pages use — full
          bleed, copy anchored bottom-left over a left-weighted scrim. */}
      <section className="chrome relative flex min-h-[76svh] w-full items-end overflow-hidden bg-chrome-bg md:min-h-[84vh]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="A car raised on a lift in a dark workshop bay"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[54%_46%] md:hidden"
          />
          <ParallaxImage amount={150} className="hidden h-full w-full md:block">
            <Image
              src={HERO_IMAGE}
              alt="A car raised on a lift in a dark workshop bay"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-[50%_52%]"
            />
          </ParallaxImage>
        </div>

        <CinematicScrim side="left" />

        <Container className="relative w-full pb-16 pt-32 md:pb-24 lg:pb-28">
          <div className="max-w-[44rem]">
            <Reveal y={18}>
              <h1 className="title-mark mt-7 font-title text-6xl font-bold leading-[0.98] text-chrome-text-1 md:text-8xl">
                Service
              </h1>
            </Reveal>
            <Reveal delay={0.1} y={22}>
              <p className="mt-7 max-w-[46ch] text-pretty text-[1.05rem] leading-relaxed text-white/85 md:text-[1.15rem]">
                The car is the start of the relationship, not the end of it. What
                happens after you drive it away is arranged here, and accounted
                for.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The offering. Alternating rather than a row of equal cards: five
          identical tiles would rank nothing and read as a price list, and these
          are not five equivalent products — they are five things the house does,
          each with a photograph that says what it looks like. */}
      <Section className="atmosphere atmosphere-steel pt-20 md:pt-28" spacing="tight">
        <Container>
          <Reveal>
            <SectionTitle>What we look after</SectionTitle>
          </Reveal>

          <div className="space-y-px bg-border">
            {CARE.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.04}>
                <article
                  className={
                    "grid grid-cols-1 items-center gap-0 bg-bg md:grid-cols-12 " +
                    (i % 2 === 1 ? "md:[&>figure]:order-2" : "")
                  }
                >
                  <figure className="relative aspect-[16/10] w-full overflow-hidden md:col-span-5 md:aspect-[4/3]">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      quality={82}
                      sizes="(min-width: 768px) 42vw, 100vw"
                      className={"object-cover " + c.position}
                    />
                  </figure>
                  <div className="md:col-span-7 md:px-12 lg:px-16">
                    <div className="px-6 py-9 md:px-0 md:py-12">
                      <h3 className="font-title text-2xl font-bold leading-[1.1] tracking-[-0.015em] text-text-1 md:text-[1.75rem]">
                        {c.title}
                      </h3>
                      <p className="mt-4 max-w-[52ch] text-[0.98rem] leading-relaxed text-text-2">
                        {c.body}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it runs. The ordinals carry the accent inside the figure — the
          site signature (.title-mark) is a bar drawn under a HEADING, and on a
          numeral in a narrow column it overhangs and runs through the title
          beside it. */}
      <Section spacing="tight">
        <Container>
          <Reveal>
            <SectionTitle>How it runs</SectionTitle>
          </Reveal>

          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {STEPS.map((s, i) => (
                <Reveal
                  key={s.title}
                  delay={i * 0.06}
                  className="flex gap-6 border-t border-border py-7 first:border-t-0 first:pt-0 md:gap-10 md:py-8"
                >
                  <span
                    aria-hidden
                    className="w-9 shrink-0 text-right font-title text-5xl font-bold leading-[0.8] tabular-nums text-mark/50 md:w-12 md:text-6xl"
                  >
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-lg font-semibold tracking-[-0.018em] text-text-1 md:text-xl">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 max-w-[46ch] text-[0.95rem] leading-relaxed text-text-2">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-12 lg:col-span-5 lg:mt-0 lg:self-start lg:sticky lg:top-28">
              <div className="border border-border bg-surface p-8 md:p-10">
                <p className="font-accent text-[0.62rem] uppercase tracking-[0.3em] text-text-3">
                  The workshop
                </p>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-text-2">
                  Work is carried out by marque specialists we place cars with,
                  not in a general bay. We book it, we follow it, and you get one
                  invoice and one point of contact — ours.
                </p>
                <p className="mt-6 text-[0.98rem] leading-relaxed text-text-2">
                  Drop-off is at the showroom, {SHOWROOM.city}, or we collect.
                </p>
                <Link
                  href="/v4/contact"
                  className="group mt-8 inline-flex items-center gap-2 font-accent text-[0.72rem] uppercase tracking-[0.2em] text-text-1 transition-colors hover:text-accent"
                >
                  Talk to us
                  <ChevronRight
                    className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                    strokeWidth={1.75}
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Booking. The form is the one the contact page uses, framed for this
          errand — a second form component for the same four fields would be two
          places to fix the day the transport becomes real. The template in the
          message is what turns "get in touch" into "book something": it asks the
          three things a service desk needs before it can answer. */}
      <Section id="book" spacing="tight" className="atmosphere atmosphere-steel">
        <Container>
          <div className="border border-border bg-surface px-6 py-12 md:px-14 md:py-16">
            <ContactForm
              heading="Book the car in."
              defaultMessage={
                "Car: \nService needed: \nPreferred date: \nDrop-off or collection: "
              }
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
