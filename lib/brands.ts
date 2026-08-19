import { asset } from "@/lib/asset";

// The marques on the floor. One list, two presentations: the horizontal marquee
// and the grid that surfaces under "Find yours" at the close. They read from the
// same array so the floor can never disagree with itself.

// ── Optical sizing ───────────────────────────────────────────────────────────
// Every mark ships as a SQUARE svg, so `object-contain` gives them all an equal
// BOX — and a wildly unequal presence. Measured, the ink inside those boxes:
//
//   Ferrari / Porsche / Lamborghini / Rolls-Royce / Maserati — fills 100% of the
//   canvas height. McLaren's wordmark fills 15%. Aston's wings, 23%. Bentley, 32%.
//
// In a 72px box that renders Ferrari's horse at 72px tall and McLaren's wordmark
// at ELEVEN. That is the whole reason the row looked ragged.
//
// A crest and a wordmark cannot share a height — one is tall, the other is long.
// What they can share is WEIGHT. So the crests are equalised to a common ink
// height (~56px) and the wordmarks to a common ink width (~145px), and the scale
// below is what each mark needs to get there. Hand-checked in the browser, not
// guessed.
export type Brand = {
  name: string;
  slug?: string;
  src?: string;
  // Lit variant for the hover cross-fade (self-hosted marks only — CDN marks
  // recolor via the URL). Defaults to `src` if omitted.
  litSrc?: string;
  // Optical correction. 1 = the svg's own size. See the note above.
  scale?: number;
};

// Marks rest in quiet grey and light to PLATINUM on hover — the site's working
// metal, the same one the nav, the CTA strip and the cards reach for. (They used
// to warm to champagne gold; that was the old palette, and Mercedes was the last
// logo on the site still doing it.)
export const BRAND_REST = "9a9ea4"; // --text-2
export const BRAND_LIT = "c6ccd2"; // --accent, platinum

export const BRANDS: Brand[] = [
  // Crests — ink runs the full height of the canvas, so they scale DOWN to sit
  // at a common 56px.
  { name: "Ferrari", slug: "ferrari", scale: 0.78 },
  { name: "Porsche", slug: "porsche", scale: 0.78 },
  { name: "Lamborghini", slug: "lamborghini", scale: 0.78 },
  { name: "Rolls-Royce", slug: "rollsroyce", scale: 0.78 },
  { name: "Maserati", slug: "maserati", scale: 0.78 },
  // Round star, ink fills 88% — a touch less shrink than the crests.
  // Simple Icons dropped Mercedes for trademark reasons, so it is self-hosted.
  // Both files are hand-coloured to match the CDN marks exactly: #9a9ea4 at rest,
  // #c6ccd2 lit. (There used to be a mercedes-gold.svg, filled #b08a4a. It is
  // gone.)
  {
    name: "Mercedes-AMG",
    src: "/brands/mercedes.svg",
    litSrc: "/brands/mercedes-lit.svg",
    scale: 0.88,
  },
  // Wide and low — a squat oval, most of the way to a crest.
  { name: "Bugatti", slug: "bugatti", scale: 1.05 },
  // Wordmarks and wings — a thin strip of ink on a square canvas. They scale UP,
  // hard, to reach the same visual width as each other.
  { name: "McLaren", slug: "mclaren", scale: 2.0 },
  { name: "Aston Martin", slug: "astonmartin", scale: 1.9 },
  { name: "Bentley", slug: "bentley", scale: 1.7 },
];

// asset() prefixes the self-hosted marks for the subdirectory-hosted preview
// build (a raw <img> gets no help from Next); it passes the CDN URLs straight
// through.
export function logoSrc(b: Brand, color: string) {
  if (b.src) return asset(color === BRAND_LIT ? b.litSrc ?? b.src : b.src);
  return `https://cdn.simpleicons.org/${b.slug}/${color}`;
}
