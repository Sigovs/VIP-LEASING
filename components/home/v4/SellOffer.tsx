import Image from "next/image";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { QuickOfferForm } from "@/components/home/v4/QuickOfferForm";
import { SHOWROOM } from "@/lib/showroom";

// Sell Your Car — the section that asks for the car, standing in the room where
// the car gets collected.
//
// In v2 this was deliberately the one mass on the page with no photograph: flat
// paper ground, type and a form, a working surface between two picture masses.
// The picture arrives here because the band that used to carry it was cut, and
// the photograph is better off for the move — a car going into an enclosed
// transporter is this section's own third step, where in the band it was
// illustrating "the cars worth owning", which it never showed.
//
// ── The photograph is GROUND, not subject ────────────────────────────────────
// It sits under a scrim at about half strength and never competes with the
// form. Two reasons, and both are load-bearing:
//
//   · The subject of this section is the transaction. A picture ranked above
//     the thing it introduces is the failure C13 names, and here it would also
//     be literally in the way: this section carries three step paragraphs, four
//     input fields and their labels.
//   · The leasing band directly below is a photograph at full strength. If this
//     one were too, the page would run two picture bands back to back. Held
//     down, the two read as different kinds of mass — a room to work in, then a
//     picture to look at.
//
// ── Where the scrim goes ─────────────────────────────────────────────────────
// The frame has a dark flat trailer flank on the left, the lit trailer opening
// and the car through the middle, and a neon-lit showroom on the right. So the
// scrim is weighted LEFT, under the headline and the steps, and thins across to
// the right where the form card — opaque — covers the busiest part of the
// picture itself. The car stays readable in the gap between the two columns.
//
// ONE dimmer, not two. The first pass held the image at 55% opacity AND put a
// scrim over it; the two multiplied and the scene stopped being a scene — dark
// texture with a car somewhere in it. The image now runs at full strength and
// the scrim alone decides how much of it survives, which is the only way to
// tune the two ends independently.
//
// And the scrim DIPS rather than ramps. A straight left-to-right ramp is
// thinnest at the right edge, which is exactly where the form card sits — the
// one element that most needs a settled field behind it was standing on the
// brightest part of the picture. So the gradient opens at the gutter between
// the two columns, which is where the car is and where the picture is allowed
// to be a picture, then closes again under the card. The photograph gets its
// moment in the one strip of the frame that carries no content.
const SELL_IMAGE = "/site/band-transport.jpg";

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
    <section className="chrome relative overflow-hidden border-t border-border bg-chrome-bg py-20 md:py-32">
      {/* The room */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src={SELL_IMAGE}
          alt=""
          fill
          quality={82}
          sizes="100vw"
          priority={false}
          className="object-cover object-[52%_center] md:object-[38%_center]"
        />
        {/* Desktop: left-weighted scrim — near-solid under the copy, thinning to
            the right so the trailer and the car survive between the two columns.
            The copy sits in one half of the frame, so the dimming can too. */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(100deg, rgba(8,9,10,0.95) 0%, rgba(8,9,10,0.88) 30%, rgba(8,9,10,0.46) 50%, rgba(8,9,10,0.62) 62%, rgba(8,9,10,0.76) 100%)",
          }}
        />
        {/* Mobile: even, and heavier. One column means every line of type
            crosses the whole frame, so a side-weighted scrim leaves the right
            end of every line sitting on the lit half — which is exactly what the
            first pass did. Nothing here is a picture to look at anyway; at this
            width the frame is atmosphere and the type is the section. */}
        <div
          className="absolute inset-0 bg-[rgba(8,9,10,0.88)] md:hidden"
        />
        {/* Top and bottom melts. The leasing band below is chrome too, so the
            seam needs a hairline rather than a fade alone — without it the two
            dark bands read as one long stretch. */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,9,10,0.95) 0%, rgba(8,9,10,0) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(8,9,10,0.95) 0%, rgba(8,9,10,0) 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <Container>
          <Reveal>
            <h2 className="title-mark font-title text-4xl font-bold leading-[1.0] text-chrome-text-1 md:text-6xl">
              Sell Your Car
            </h2>
            <p className="mt-8 max-w-[52ch] text-pretty text-[1.05rem] leading-relaxed text-white/78 md:mt-10 md:text-[1.15rem]">
              We buy collector and exotic cars outright — one fair offer, a
              discreet close, and payment direct to you. No listing, no waiting
              on a buyer.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 items-start gap-14 md:mt-16 lg:grid-cols-12 lg:gap-20">
            {/* The process. Six columns, not seven: the step rules run the full
                width of this column and the copy runs to a 46ch measure, so an
                extra column only lengthens the empty tail past the end of every
                sentence. The column the two blocks no longer share becomes the
                gutter between them — and here it is also the slot the car shows
                through. */}
            <div className="lg:col-span-6">
              <div>
                {STEPS.map((s, i) => (
                  <Reveal
                    key={s.title}
                    delay={i * 0.06}
                    className="flex gap-6 border-t border-white/12 py-7 first:border-t-0 first:pt-0 md:gap-10 md:py-9"
                  >
                    {/* The ordinal carries the accent instead of a title-mark
                        hanging off it — a list ordinal is not a heading, and the
                        signature bar stops being a signature at three a column.
                        At full strength here rather than /50: on a photograph a
                        half-opacity violet disappears. */}
                    <span
                      aria-hidden
                      className="w-10 shrink-0 text-right font-title text-5xl font-bold leading-[0.8] tabular-nums text-mark md:w-14 md:text-6xl"
                    >
                      {i + 1}
                    </span>
                    <div className="pt-0.5">
                      <h3 className="text-xl font-semibold tracking-[-0.018em] text-chrome-text-1 md:text-2xl">
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-white/72">
                        {s.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* The way in. A solid plate on the scene — the one thing here you
                can act on, and the only element allowed to sit fully opaque over
                the picture.

                It has to be LIGHTER than what it sits on, not darker. The first
                pass used chrome-surface at 95%, which is below the photograph's
                mid tones: over the lit half the card read as a hole punched in
                the picture, and over the dark trailer its edges disappeared
                altogether — the same plate failing in two opposite ways in one
                frame. chrome-surface-2 at full opacity sits above the scrimmed
                photograph everywhere, so the edge is an edge wherever it falls.

                The rest is what makes a raised object read as raised: a border
                with enough weight to survive a busy ground, a hairline of light
                along the top where a lit plane would catch it, and a shadow deep
                and wide enough to be a shadow rather than a soft edge. */}
            <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
              <div className="rounded-md border border-white/20 bg-chrome-surface-2 p-7 shadow-[0_2px_0_rgba(255,255,255,0.06)_inset,0_40px_80px_-32px_rgba(0,0,0,0.95),0_8px_24px_-12px_rgba(0,0,0,0.8)] md:p-9">
                <p className="border-b border-white/15 pb-4 font-accent text-[0.72rem] uppercase tracking-[0.3em] text-chrome-text-1">
                  Get an Offer
                </p>
                {/* No line of explanation under the rule. The four labelled
                    fields say what is being asked, and a sentence telling you
                    the form is short is longer than the form. */}
                <div className="mt-8">
                  <QuickOfferForm onChrome />
                </div>
              </div>

              {/* The other way in, centred under the card it belongs to. */}
              <a
                href={SHOWROOM.phoneHref}
                className="group mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.95rem] text-white/70 transition-colors hover:text-white"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Phone
                    className="h-4 w-4 shrink-0 transition-colors group-hover:text-mark"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Speak with a Specialist
                </span>
                <span className="font-mono text-white">
                  {SHOWROOM.phoneDisplay}
                </span>
              </a>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
