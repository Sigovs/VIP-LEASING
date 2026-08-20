import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { QuickOfferForm } from "@/components/home/v2/QuickOfferForm";
import { SHOWROOM } from "@/lib/showroom";

// Sell Your Car — moved up here at the client's request, from the pinned
// cinematic band that used to sit near the footer ("Ready to part with
// yours?"). That band is gone; components/home/v2/SellYourCar.tsx still holds
// it if it is ever wanted back.
//
// It is NOT rebuilt as a band. Three things sit in a row here — the featured
// car, this, and the leasing band — and three propositions back to back is how
// a page starts to sound like a sales floor. So each one is a different KIND of
// mass: the featured car is a photograph, the leasing band is cinema, and this
// is a working surface. Flat ground, no photograph, type and a form. The change
// of register is the interval; the extra air around it (the section runs the
// wide spacing, not the tight rhythm its neighbours use) is the rest of it.
//
// Structure follows what a sell-your-car page actually is, checked against four
// of the house's other builds: a promise, a numbered process, and a way in.
// Everything it claims is already claimed on /sell — one story, told twice at
// two lengths, so nothing here can drift from what that page says.
//
// The ordinals repeat the treatment from /sell's "How It Works": the violet
// numeral carries the accent instead of a .title-mark bar hanging off it (a
// list ordinal is not a heading, and the signature bar stops being a signature
// when it appears three times in a column).

const STEPS = [
  {
    title: "Tell us the car",
    body: "Year, miles, condition, and anything we should know. A VIN helps but isn't required to start.",
  },
  {
    title: "Get a real number",
    body: "We value it against the live market and come back with one fair offer — usually within a few hours on business days.",
  },
  {
    title: "Paid, done",
    body: "We buy it ourselves, arrange pickup, and send funds direct to you — or settle your payoff and send the difference.",
  },
];

export function SellOffer() {
  return (
    <Container>
      {/* Heading across the full width, then the two columns under it.
          Stacking the heading on top of the steps instead ran the left column
          some 400px past the bottom of the form, and the hole that opened
          under it was leftover rather than air — a shape nothing had asked
          for. Lifted out, the two columns finish within a line of each other,
          and the space beside the heading reads as the heading's own margin. */}
      <Reveal>
        <h2 className="title-mark font-title text-4xl font-bold leading-[1.0] text-text-1 md:text-6xl">
          Sell Your Car
        </h2>
        <p className="mt-8 max-w-[52ch] text-[1.05rem] leading-relaxed text-text-2 md:mt-10 md:text-[1.15rem]">
          We buy collector and exotic cars outright — one fair offer, a
          discreet close, and payment direct to you. No listing, no waiting on
          a buyer.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 items-start gap-14 md:mt-16 lg:grid-cols-12 lg:gap-20">
        {/* The process. Six columns, not seven: the step rules run the full
            width of this column and the copy runs to a 46ch measure, so an
            extra column only lengthens the empty tail past the end of every
            sentence. The column the two blocks no longer share becomes the
            gutter between them. */}
        <div className="lg:col-span-6">
          <div>
            {STEPS.map((s, i) => (
              <Reveal
                key={s.title}
                delay={i * 0.06}
                className="flex gap-6 border-t border-border py-7 first:border-t-0 first:pt-0 md:gap-10 md:py-9"
              >
                <span
                  aria-hidden
                  className="w-10 shrink-0 text-right font-title text-5xl font-bold leading-[0.8] tabular-nums text-mark/50 md:w-14 md:text-6xl"
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

          <Reveal delay={0.2}>
            <Link
              href="/sell"
              className="group mt-9 inline-flex items-center gap-2 font-accent text-xs uppercase tracking-[0.16em] text-text-1 transition-colors hover:text-mark md:mt-10"
            >
              How selling works
              <ChevronRight
                className="h-3.5 w-3.5 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </div>

        {/* The way in. Raised off the ground on the surface tone so it reads as
            an instrument rather than more page — the one thing in this section
            you can act on. */}
        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <div className="rounded-md border border-border bg-surface p-7 md:p-9">
            <p className="border-b border-border pb-4 font-accent text-[0.72rem] uppercase tracking-[0.3em] text-text-1">
              Start an offer
            </p>
            <p className="mt-5 mb-8 text-[0.95rem] leading-relaxed text-text-2">
              Four details is enough to open the conversation. The rest is on
              the next page.
            </p>
            <QuickOfferForm />
          </div>

          <p className="mt-6 text-[0.95rem] leading-relaxed text-text-3">
            Prefer to talk it through?{" "}
            <a
              href={SHOWROOM.phoneHref}
              className="font-mono text-text-1 transition-colors hover:text-accent"
            >
              {SHOWROOM.phoneDisplay}
            </a>
          </p>
        </Reveal>
      </div>
    </Container>
  );
}
