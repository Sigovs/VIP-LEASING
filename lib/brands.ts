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
  // The studio light this marque brings into the closing scene, as "r g b".
  // Read by ClosingBrands and painted at a very low alpha — a lamp changing
  // colour behind a car, never a tint laid over the picture. It lives here
  // rather than in the component so a marque carries everything about itself,
  // and so the two presentations can never disagree about one.
  ambient?: string;
};

// Marks rest in quiet grey and light to WHITE on hover. Platinum was the site's
// working metal, but against a photograph at the close it was too near the rest
// state to register as a change — white is the only value that reads as the
// mark switching on.
export const BRAND_REST = "9a9ea4"; // --text-2
export const BRAND_LIT = "ffffff"; // pure white on hover

export const BRANDS: Brand[] = [
  // Crests — ink runs the full height of the canvas, so they scale DOWN to sit
  // at a common 56px.
  { name: "Ferrari", slug: "ferrari", scale: 0.78, ambient: "120 30 26" }, // deep red warmth
  { name: "Porsche", slug: "porsche", scale: 0.78, ambient: "150 166 184" }, // cool silver
  { name: "Lamborghini", slug: "lamborghini", scale: 0.78, ambient: "146 112 44" }, // restrained gold
  { name: "Rolls-Royce", slug: "rollsroyce", scale: 0.78, ambient: "156 134 100" }, // soft champagne
  { name: "Maserati", slug: "maserati", scale: 0.78, ambient: "62 88 126" }, // trident blue-steel
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
    ambient: "124 152 168", // silver, a shade cooler than Porsche's
  },
  // Wide and low — a squat oval. It was set to 1.05 on the reasoning that it is
  // most of the way to a crest, which is true of its SHAPE and wrong about its
  // WEIGHT: the EB is solid fill where the crests are line, so at a matched
  // height it out-weighed everything beside it. Re-checked in the browser at
  // the closing portfolio's size, where the break was impossible to miss.
  { name: "Bugatti", slug: "bugatti", scale: 0.82, ambient: "44 66 116" }, // deep marque blue
  // Wordmarks and wings — a thin strip of ink on a square canvas. They scale UP,
  // hard, to reach the same visual width as each other.
  { name: "McLaren", slug: "mclaren", scale: 2.0, ambient: "150 92 38" }, // graphite, faintest papaya
  { name: "Aston Martin", slug: "astonmartin", scale: 1.9, ambient: "44 82 66" }, // racing green, near grey
  { name: "Bentley", slug: "bentley", scale: 1.7, ambient: "60 78 70" }, // green-grey, quieter still
];

// asset() prefixes the self-hosted marks for the subdirectory-hosted preview
// build (a raw <img> gets no help from Next); it passes the CDN URLs straight
// through.
export function logoSrc(b: Brand, color: string) {
  if (b.src) return asset(color === BRAND_LIT ? b.litSrc ?? b.src : b.src);
  return `https://cdn.simpleicons.org/${b.slug}/${color}`;
}
