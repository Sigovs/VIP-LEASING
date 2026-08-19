import fs from "node:fs";
import path from "node:path";

export type ShowcaseCar = {
  slug: string;
  name: string;
  photos: string[];
};

// Add a car: create /public/showcase/<slug>/ and drop photos in (any
// filenames — they're returned in lexical order, so 01.jpg, 02.jpg, ...
// gives you explicit control). First photo becomes the home-page tile.
// The Carrera GT appears twice on the home page by design: it leads the Featured
// spotlight (eight frames in the filmstrip) and it keeps its Lookbook tile, which
// opens the full forty-frame set. The two do different jobs — Featured says "this
// one is for sale", the Lookbook says "and this is how we photograph a car" — so
// the repeat reads as depth rather than as thin inventory. Drop the slug from
// this list if it ever starts to read as padding.
const CARS: { slug: string; name: string }[] = [
  { slug: "f50-laferrari", name: "Ferrari F50 & LaFerrari" },
  { slug: "ferrari-f50", name: "Ferrari F50" },
  { slug: "porsche-carrera-gt", name: "Porsche Carrera GT" },
  { slug: "mclaren-senna", name: "McLaren Senna" },
];

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

function readPhotos(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "showcase", slug);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.test(f))
      .sort()
      .map((f) => `/showcase/${slug}/${f}`);
  } catch {
    return [];
  }
}

export function getShowcase(): ShowcaseCar[] {
  return CARS.map(({ slug, name }) => ({
    slug,
    name,
    photos: readPhotos(slug),
  })).filter((c) => c.photos.length > 0);
}
