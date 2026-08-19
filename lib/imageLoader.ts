// Custom <Image> loader for the static export.
//
// A static host has no image optimizer, so the obvious move is
// `images.unoptimized`. That is a trap here: `unoptimized` bypasses the loader
// AND leaves the src exactly as authored, which means "/ilusso/cullinan.jpg" —
// with no basePath — and a 404 on every photograph once the site is served from
// a subdirectory. The page loads; the cars simply aren't there.
//
// A custom loader is the fix: it keeps <Image>'s markup and layout behaviour and
// lets us return the real, prefixed path to the original file. The photography is
// already web-sized (2000px WebP / JPEG), so serving it unresized costs bandwidth
// on a preview build and nothing else.
export default function pagesImageLoader({ src }: { src: string }): string {
  if (/^https?:\/\//.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src}`;
}
