import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BRANDS, BRAND_REST, BRAND_LIT, logoSrc, type Brand } from "@/lib/brands";

// "Find yours" — the last thing on the page before the footer.
//
// It was a pinned stage 4321px tall: the statement rose into a fixed title, six
// marques took turns underneath it each bringing its own car, the whole floor
// assembled, then the inventory link. Nearly a third of the page, and all of it
// scroll a reader had to spend to reach the one thing the section is for. Made
// static at the client's request, and then reduced twice more — first to cards,
// then to this.
//
// No photographs. The marks are the content; the cars were the sequence's way
// of cutting between them, and in a static frame they only crowded what they
// were supposed to introduce. What stops the section reading as an empty band
// is the sentence, not a picture: it is the statement the old scene carried
// ("What We Carry", "the marques on the floor"), which came back when the
// photographs went.
//
// Secondary by design. This is a sign-off, not a claim, so it runs in a narrow
// centred column at a rank below every other heading on the page — centred
// because centring is how a page stops.
//
// components/home/v4/ClosingBrands.tsx and ClosingCTA.tsx are untouched;
// restoring that pair puts the whole pinned scene back.

/** A mark that lifts from --text-2 to white. Two stacked copies crossfading, so
 *  it brightens in place rather than swapping. */
function Mark({ brand }: { brand: Brand }) {
  const style = { transform: `scale(${brand.scale ?? 1})` };
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc(brand, BRAND_REST)}
        alt={brand.name}
        loading="lazy"
        style={style}
        className="block max-h-full w-auto max-w-full object-contain opacity-75 transition-opacity duration-500 group-hover:opacity-0"
      />
      {/* aria-hidden: the resting mark above already carries the name. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc(brand, BRAND_LIT)}
        alt=""
        aria-hidden
        loading="lazy"
        style={style}
        className="absolute block max-h-full w-auto max-w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </>
  );
}

export function ClosingMarques() {
  return (
    <section className="chrome relative border-t border-border bg-chrome-bg py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-[980px] text-center">
          <Reveal>
            <span className="block font-accent text-[0.68rem] tracking-[0.24em] text-chrome-text-2">
              What We Carry
            </span>
            {/* The eyebrow gets no rule of its own — the title-mark below is the
                rule, and the two together is the same furniture twice. */}
            <h2 className="title-mark mt-5 font-title text-2xl font-bold leading-[1.05] tracking-[-0.02em] text-chrome-text-1 md:text-4xl">
              Find yours
            </h2>
            <p className="mx-auto mt-7 max-w-[54ch] text-pretty text-[0.98rem] leading-relaxed text-white/70 md:text-[1.05rem]">
              The marques on the floor, from Ferrari to Bentley — sourced
              through our collector network and the wider market. Every one of
              them can be leased, financed, or bought outright.
            </p>
          </Reveal>

          {/* Two rows of five. Two of five on a phone, because ten across three
              columns leaves the tenth mark alone on a line of its own. */}
          <Reveal
            delay={0.08}
            className="mx-auto mt-12 grid max-w-[880px] grid-cols-2 items-center gap-x-10 gap-y-10 sm:grid-cols-5 md:mt-16 md:gap-x-12 md:gap-y-14"
          >
            {BRANDS.map((b) => (
              <span
                key={b.name}
                title={b.name}
                className="group relative flex h-12 items-center justify-center md:h-16"
              >
                <Mark brand={b} />
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.12} className="mt-14 md:mt-16">
            <Link
              href="/v4/inventory"
              className="group inline-flex rounded-pill items-center gap-3 border border-white/30 px-8 py-3.5 font-accent text-[0.7rem] font-medium tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white hover:text-chrome-bg md:px-9 md:text-[0.75rem]"
            >
              Explore Inventory
              <ChevronRight
                className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
