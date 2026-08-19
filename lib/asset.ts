// One source of truth for the asset prefix.
//
// On a normal deployment the site is served from the domain root and this is the
// empty string, so every path below is unchanged. On the GitHub Pages preview the
// site lives at sigovs.github.io/aan_gta_version/, and every file under /public
// has to carry that prefix or it 404s.
//
// Next rewrites <Link href> and its own /_next/* assets for you. It does NOT
// rewrite: raw <video src> / poster attributes, url() in CSS, or <Image> src when
// the optimizer is off. Those are the three places that need this helper — see
// lib/imageLoader.ts, the video components, and the mask variables in layout.tsx.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_PATH}${path}`;
}
