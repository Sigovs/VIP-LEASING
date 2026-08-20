import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BRANDS, BRAND_REST, BRAND_LIT, logoSrc, type Brand } from "@/lib/brands";

// "Find yours" — the last thing on the page before the footer, and now a
// section rather than a performance.
//
// What it replaces: a pinned stage 4321px tall on which the statement rose into
// a fixed title, six marques took turns underneath it each bringing its own car,
// the whole floor then assembled, and the inventory link closed it. Nearly a
// third of the page, and every pixel of it scroll the reader had to spend to
// reach the one thing the section is for. Made static at the client's request.
//
// The scene is gone; its content is not. The six marque photographs that the
// old sequence cut between are here as cards, and the marques it had no picture
// for follow as marks. Everything that left was the telling, not the thing told.
//
// components/home/v2/ClosingBrands.tsx and ClosingCTA.tsx are untouched —
// restoring that pair puts the whole pinned scene back.
//
// Kept deliberately lean. The cards are 16:9 inside a capped grid rather than
// full-width 16:10, and every interval around them is a step down from the
// page's ordinary rhythm — this is the last thing before the footer, and a
// close that sprawls stops reading as a close.

// ── Why six cards and not nine ───────────────────────────────────────────────
// Because six marque photographs exist. A 3×3 wall would need three more, and
// the only way to fill it would be to put some other marque's car under a badge
// — which is exactly the mistake that once left a Carrera GT's name over a
// photograph that was not it. Three across, two rows; the four marques with no
// campaign shot of their own follow underneath as marks.
type Card = { brand: string; src: string; alt: string };

const CARDS: Card[] = [
  {
    brand: "Ferrari",
    src: "/site/marque-ferrari.jpg",
    alt: "A red Ferrari head-on in a dark hall",
  },
  {
    brand: "Lamborghini",
    src: "/site/marque-lamborghini.jpg",
    alt: "A green Lamborghini head-on in a dark hall",
  },
  {
    brand: "Porsche",
    src: "/site/marque-porsche.jpg",
    alt: "A blue Porsche 911 head-on in a dark hall",
  },
  {
    brand: "McLaren",
    src: "/site/marque-mclaren.jpg",
    alt: "An orange McLaren head-on in a dark hall",
  },
  {
    brand: "Mercedes-AMG",
    src: "/site/marque-mercedes-amg.jpg",
    alt: "A Mercedes-AMG GT head-on in a dark hall",
  },
  {
    brand: "Maserati",
    src: "/site/marque-maserati.jpg",
    alt: "A Maserati GranTurismo head-on in a dark hall",
  },
];

const byName = (name: string): Brand =>
  BRANDS.find((b) => b.name === name) ?? BRANDS[0];

const PICTURED = new Set(CARDS.map((c) => c.brand));

/** A mark that lifts from --text-2 to white. Two stacked copies crossfading, so
 *  it brightens in place rather than swapping. */
function Mark({ brand, className }: { brand: Brand; className?: string }) {
  const style = { transform: `scale(${brand.scale ?? 1})` };
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc(brand, BRAND_REST)}
        alt={brand.name}
        loading="lazy"
        style={style}
        className={`block max-h-full w-auto max-w-full object-contain [filter:drop-shadow(0_0_14px_rgba(0,0,0,0.85))] transition-opacity duration-500 ${className ?? ""}`}
      />
      {/* aria-hidden: the resting mark above already carries the name. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc(brand, BRAND_LIT)}
        alt=""
        aria-hidden
        loading="lazy"
        style={style}
        className="absolute block max-h-full w-auto max-w-full object-contain opacity-0 [filter:drop-shadow(0_0_14px_rgba(0,0,0,0.85))] transition-opacity duration-500 group-hover:opacity-100"
      />
    </>
  );
}

export function ClosingMarques() {
  const rest = BRANDS.filter((b) => !PICTURED.has(b.name));

  return (
    <section className="chrome relative border-t border-border bg-chrome-bg py-16 md:py-20">
      <Container>
        {/* The whole coda runs in a narrow column. It is the last thing
            before the footer and it is secondary — a decorative sign-off, not
            a claim — so it sits well inside the measure the page argues at. */}
        <div className="mx-auto max-w-[860px]">
        {/* Eyebrow, then the headline carrying the site signature. The eyebrow
            gets no rule of its own — the title-mark below is the rule, and the
            two together is the same piece of furniture twice. */}
        <Reveal className="text-center">
          <span className="block font-accent text-[0.68rem] tracking-[0.24em] text-chrome-text-2">
            What We Carry
          </span>
          <h2 className="title-mark mt-5 font-title text-2xl font-bold leading-[1.05] tracking-[-0.02em] text-chrome-text-1 md:text-4xl">
            Find yours
          </h2>
        </Reveal>

        {/* The six with a car of their own.
            Hover is one gesture with three parts moving together: the scrim
            pulls back so the car lights up, the frame pushes in slightly, and
            the mark goes to white. Separately each is too quiet to notice on a
            picture this dark; together the card reads as coming up to meet
            you. The scrim sits deeper at rest than it needs to for exactly
            that reason — the lift has to come from somewhere. */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:gap-4 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.brand} delay={(i % 3) * 0.06}>
              <figure className="group relative aspect-[16/9] overflow-hidden rounded-md ring-1 ring-inset ring-white/[0.08] transition-shadow duration-500 hover:ring-white/25">
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  quality={78}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-black/50 transition-colors duration-500 group-hover:bg-black/15" />
                <figcaption className="absolute inset-x-0 top-[13%] flex justify-center px-3">
                  <span className="relative flex h-11 w-[min(44vw,150px)] items-center justify-center md:h-14">
                    <Mark brand={byName(c.brand)} className="group-hover:opacity-0" />
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* And the rest of the floor. No picture of their own yet, so they are
            marks — which is the honest treatment, not a lesser one: the row
            reads as the wall continuing past the six that were photographed. */}
        {rest.length > 0 && (
          <Reveal
            delay={0.08}
            className="mx-auto mt-9 grid max-w-[600px] grid-cols-4 items-center gap-x-8 gap-y-6 border-t border-white/10 pt-8 md:mt-10 md:gap-x-12 md:pt-9"
          >
            {/* Two by two on a phone, one row of four from sm up. Flowing them
                as a wrapping row left the fourth mark alone on a line of its
                own — a widow, and on four items it is the whole bottom half of
                the block. */}
            {rest.map((b) => (
              <span
                key={b.name}
                title={b.name}
                className="group relative flex h-10 items-center justify-center md:h-12"
              >
                <Mark brand={b} className="opacity-80 group-hover:opacity-0" />
              </span>
            ))}
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-10 text-center md:mt-12">
          <Link
            href="/inventory"
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
