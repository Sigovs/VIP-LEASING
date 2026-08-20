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
// The sets are grouped by SETTING rather than by car — after dark, under light,
// on the cyclorama, on location. That is what a lookbook is for: it says how the
// house photographs, not what is in stock, and it means the grouping survives
// the roster changing underneath it.
//
// Frames repeat across the site while this is a mockup. Once the client shoots
// their own, each set gets its own take and the repeats go.
const CARS: { slug: string; name: string }[] = [
  { slug: "after-dark", name: "After Dark" },
  { slug: "under-light", name: "Under Light" },
  { slug: "on-the-cyclorama", name: "On the Cyclorama" },
  { slug: "on-location", name: "On Location" },
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
