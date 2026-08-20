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
        className={`block max-h-full w-auto max-w-full object-contain transition-opacity duration-500 ${className ?? ""}`}
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
  const rest = BRANDS.filter((b) => !PICTURED.has(b.name));

  return (
    <section className="chrome relative border-t border-border bg-chrome-bg py-24 md:py-32">
      <Container>
        {/* Eyebrow, then the headline carrying the site signature. The eyebrow
            gets no rule of its own — the title-mark below is the rule, and the
            two together is the same piece of furniture twice. */}
        <Reveal className="text-center">
          <span className="block font-accent text-xs tracking-[0.24em] text-chrome-text-2">
            What We Carry
          </span>
          <h2 className="title-mark mt-7 font-title text-4xl font-bold leading-[1.0] tracking-[-0.02em] text-chrome-text-1 md:text-6xl">
            Find yours
          </h2>
        </Reveal>

        {/* The six with a car of their own. The scrim is what the mark is read
            against, and it lifts on hover along with the mark — one gesture,
            the card coming up to meet you rather than two things animating. */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-20 md:gap-6 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.brand} delay={(i % 3) * 0.06}>
              <figure className="group relative aspect-[16/10] overflow-hidden rounded-md ring-1 ring-inset ring-white/[0.08]">
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  quality={78}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/30" />
                <figcaption className="absolute inset-x-0 top-[16%] flex justify-center px-5">
                  <span className="relative flex h-14 w-[min(52vw,190px)] items-center justify-center md:h-16">
                    <Mark brand={byName(c.brand)} className="opacity-90 group-hover:opacity-0" />
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
            className="mx-auto mt-14 grid max-w-[860px] grid-cols-2 items-center gap-x-10 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-4 md:mt-16 md:gap-x-16 md:pt-14"
          >
            {/* Two by two on a phone, one row of four from sm up. Flowing them
                as a wrapping row left the fourth mark alone on a line of its
                own — a widow, and on four items it is the whole bottom half of
                the block. */}
            {rest.map((b) => (
              <span
                key={b.name}
                title={b.name}
                className="group relative flex h-11 items-center justify-center md:h-14"
              >
                <Mark brand={b} className="opacity-60 group-hover:opacity-0" />
              </span>
            ))}
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-16 text-center md:mt-20">
          <Link
            href="/inventory"
            className="group inline-flex rounded-pill items-center gap-3 border border-white/35 px-9 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white hover:text-chrome-bg md:px-11 md:text-[0.8rem]"
          >
            Explore Inventory
            <ChevronRight
              className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
              strokeWidth={1.75}
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
