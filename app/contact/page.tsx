import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CinematicScrim } from "@/components/home/CinematicScrim";
import { ContactForm } from "@/components/contact/ContactForm";
import { IntentContactForm } from "@/components/contact/IntentContactForm";
import { ShowroomMap } from "@/components/contact/ShowroomMap";
import { InstagramIcon } from "@/components/ui/icons/InstagramIcon";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { SHOWROOM, DIRECTIONS_URL } from "@/lib/showroom";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Visit the VIP Leasing showroom in Miami or get in touch — private viewings by appointment.",
};

// McLaren Senna frames — matte-black carbon reads as discreet and premium, the
// right register for the contact close (distinct from the golden About F50 and
// the silver Carrera GT on Sell). Desktop: side profile against the dark brick
// wall, its shadowed left giving the copy a clean field. Mobile: the doors-up
// front three-quarter fills a dramatic portrait crop.
const HERO_IMAGE = "/site/loft-skyline.jpg";
const HERO_IMAGE_MOBILE = "/site/loft-skyline.jpg";

// The ?intent= presets moved to components/contact/IntentContactForm.tsx, where
// they are read on the client. Reading searchParams here made this page dynamic
// (server-rendered per request), and a static export — which is what the GitHub
// Pages preview is — cannot produce a dynamic page. Nothing about the behaviour
// changed: the deep links still land on a pre-framed form.
export default function ContactPage() {
  return (
    <>
      {/* Cinematic hero — a discreet matte-black Senna. Copy anchored
          bottom-left over a left-weighted scrim; the live direct line (phone ·
          email) sits under the sub-copy as the hero's immediate action. */}
      <section className="chrome relative flex min-h-[86svh] w-full items-end overflow-hidden bg-chrome-bg md:min-h-[90vh]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_MOBILE}
            alt="A car lit in a loft space above a city skyline at night"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_52%] md:hidden"
          />
          <ParallaxImage amount={150} className="hidden h-full w-full md:block">
            <Image
              src={HERO_IMAGE}
              alt="A car lit in a loft space above a city skyline at night"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-[56%_62%]"
            />
          </ParallaxImage>
        </div>

        <CinematicScrim side="left" />

        <Container className="relative w-full pb-16 pt-32 md:pb-24 lg:pb-28">
          <div className="max-w-[44rem]">
            <Reveal y={18}>
              <h1 className="title-mark mt-7 font-title text-6xl font-bold leading-[0.98] text-chrome-text-1 md:text-8xl">
                Contact
              </h1>
            </Reveal>

            <Reveal delay={0.1} y={22}>
              <p className="mt-6 max-w-[46ch] text-pretty text-[1.05rem] leading-relaxed text-white/85 md:text-[1.15rem]">
                Call, write, or stop by the showroom — we&apos;ll have the car
                waiting.
              </p>
            </Reveal>

            <Reveal delay={0.18} y={22}>
              <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.9rem] text-white/80">
                <a
                  href={SHOWROOM.phoneHref}
                  className="transition-colors hover:text-accent-on-chrome"
                >
                  {SHOWROOM.phoneDisplay}
                </a>
                <span aria-hidden className="text-white/30">
                  ·
                </span>
                <a
                  href={`mailto:${SHOWROOM.email}`}
                  className="transition-colors hover:text-accent-on-chrome"
                >
                  {SHOWROOM.email}
                </a>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Get in touch — the form leads (its heading swaps on ?intent), with a
          hairline-divided rail of the reach-us essentials alongside. The street
          address lives with the map below, so nothing repeats here. */}
      <Section spacing="tight">
        <Container>
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-7">
              {/* Suspense is required: IntentContactForm reads useSearchParams,
                  which suspends during prerender. The fallback is the same form
                  with no preset — so a visitor who arrives without ?intent (or
                  before hydration) sees the open-ended form, never a spinner. */}
              <Suspense fallback={<ContactForm />}>
                <IntentContactForm />
              </Suspense>
            </Reveal>

            <Reveal
              delay={0.08}
              className="lg:col-span-5 lg:border-l lg:border-border lg:pl-20"
            >
              <div className="flex flex-col divide-y divide-border">
                <div className="space-y-3 pb-8">
                  <p className="font-accent text-[0.7rem] uppercase tracking-[0.24em] text-text-3">
                    Direct
                  </p>
                  <p className="font-mono text-[0.95rem] leading-relaxed text-text-1">
                    <a
                      href={SHOWROOM.phoneHref}
                      className="transition-colors hover:text-accent"
                    >
                      {SHOWROOM.phoneDisplay}
                    </a>
                    <br />
                    <a
                      href={`mailto:${SHOWROOM.email}`}
                      className="transition-colors hover:text-accent"
                    >
                      {SHOWROOM.email}
                    </a>
                  </p>
                </div>

                <div className="space-y-3 py-8">
                  <p className="font-accent text-[0.7rem] uppercase tracking-[0.24em] text-text-3">
                    Hours
                  </p>
                  <div className="font-mono text-[0.95rem] leading-relaxed">
                    {SHOWROOM.hours.map(([d, h]) => (
                      <div key={d} className="flex justify-between gap-4">
                        <span className="text-text-1">{d}</span>
                        <span className="text-text-2">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-8">
                  <p className="font-accent text-[0.7rem] uppercase tracking-[0.24em] text-text-3">
                    Follow
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit items-center gap-2 font-mono text-[0.95rem] text-text-1 transition-colors hover:text-accent"
                  >
                    <InstagramIcon size={15} strokeWidth={1.5} />@
                    {INSTAGRAM_HANDLE}
                    <ChevronRight className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-mark" strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Visit the showroom — the map gets its own moment on the deeper slab:
          heading + address on the left, the map tile (with its own directions
          overlay) large on the right. */}
      <Section spacing="tight" className="border-t border-border bg-paper">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <h2 className="title-mark font-title text-4xl md:text-5xl font-bold text-text-1 leading-[1.05]">
                Visit the Showroom
              </h2>
              <p className="mt-6 font-mono text-[0.95rem] leading-relaxed text-text-1">
                {SHOWROOM.street}
                <br />
                {SHOWROOM.cityStateZip}
              </p>
              <p className="mt-5 max-w-[38ch] text-[0.95rem] leading-relaxed text-text-2">
                Private viewings by appointment — call ahead and we&apos;ll have
                the car waiting.
              </p>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex items-center gap-2 font-accent text-[0.72rem] uppercase tracking-[0.2em] text-text-1 transition-colors hover:text-accent"
              >
                Get directions
                <ChevronRight
                  className="h-3.5 w-3.5 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.75}
                />
              </a>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-8">
              <ShowroomMap className="aspect-[16/10] lg:aspect-[16/9]" />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
