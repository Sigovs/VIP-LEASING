import { BRANDS, BRAND_REST, BRAND_LIT, logoSrc } from "@/lib/brands";

// Not currently on the home page — the marques moved to the close, where they
// surface out of the footage under "Find yours" (see ClosingBrands). Kept intact
// so the band is one paste away in app/page.tsx if it is wanted back, and reading
// from the same list and the same optical scales, so the two can never disagree.
export function BrandMarquee() {
  const loop = [...BRANDS, ...BRANDS];
  return (
    <div
      aria-label="Brands we carry"
      className="relative overflow-hidden select-none"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      {/* The track pauses on hover (see `.animate-marquee` hover rule in
          globals.css) so a logo can be held under the cursor and light up,
          rather than sliding out from under it. */}
      <div className="flex w-max items-center animate-marquee will-change-transform">
        {loop.map((b, i) => (
          <span
            key={i}
            className="group relative mx-10 inline-flex h-11 shrink-0 items-center md:mx-16 md:h-14"
          >
            {/* base: quiet grey. The scale is optical — see lib/brands.ts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc(b, BRAND_REST)}
              alt={b.name}
              loading="lazy"
              style={{ transform: `scale(${b.scale ?? 1})` }}
              className="block max-h-full w-auto object-contain opacity-60 transition-opacity duration-500 group-hover:opacity-0"
            />
            {/* hover: lights to platinum, cross-faded over the grey */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc(b, BRAND_LIT)}
              alt=""
              aria-hidden
              loading="lazy"
              style={{ transform: `scale(${b.scale ?? 1})` }}
              className="absolute inset-0 m-auto block max-h-full w-auto object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
