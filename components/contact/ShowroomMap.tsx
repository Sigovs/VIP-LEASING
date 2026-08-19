import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HAS_ADDRESS, SHOWROOM, DIRECTIONS_URL } from "@/lib/showroom";

// Showroom map tile — Mapbox static when a token is present, keyless Google
// embed fallback otherwise (dark-filtered to match the theme, pointer-events
// off so it reads as a static map and never hijacks page scroll). The whole
// tile links out to Google directions. Shared by the home Visit block and the
// contact page so both always point at the same pin.

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
// Oxblood (--signal), URL-encoded for the Mapbox marker colour. A pin is a
// signal, not decoration — it means "the showroom is here" — so it takes the
// signal colour rather than the platinum used for hovers.
const MAP_PIN_HEX = "96252d";
const MAP_W = 1200;
const MAP_H = 750;
const mapboxStaticUrl = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-l+${MAP_PIN_HEX}(${SHOWROOM.lng},${SHOWROOM.lat})/${SHOWROOM.lng},${SHOWROOM.lat},14,0/${MAP_W}x${MAP_H}@2x?access_token=${MAPBOX_TOKEN}`
  : null;

export function ShowroomMap({
  className = "aspect-[16/10]",
}: {
  className?: string;
}) {
  // No address yet, so there is nothing to pin and nowhere for "Get Directions"
  // to go — the keyless embed queried "TBD, TBD" and drew a blank blue rectangle.
  // A designed empty tile holds the same mass in the composition and tells the
  // client exactly what is outstanding. Deletes itself the moment the address
  // lands in lib/showroom.ts.
  if (!HAS_ADDRESS) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-md border border-border bg-surface ${className}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-10 text-center">
          <span aria-hidden className="block h-px w-12 bg-accent" />
          <p className="font-accent text-[0.8rem] uppercase tracking-[0.2em] text-text-2">
            {SHOWROOM.market}
          </p>
          <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-text-3">
            Showroom address to be confirmed. Viewings are by appointment in the
            meantime.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md bg-surface border border-border ${className}`}
    >
      <a
        href={DIRECTIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get directions to VIP Leasing"
        className="group absolute inset-0 block"
      >
        {mapboxStaticUrl ? (
          <Image
            src={mapboxStaticUrl}
            alt={`Map of ${SHOWROOM.cityStateZip}`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          />
        ) : (
          <iframe
            title={`Map showing ${SHOWROOM.name} in ${SHOWROOM.cityStateZip}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              `${SHOWROOM.street}, ${SHOWROOM.cityStateZip}`
            )}&z=14&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="pointer-events-none absolute inset-0 h-full w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.8)_brightness(0.9)]"
          />
        )}
        <span className="absolute bottom-4 right-4 inline-flex rounded-pill items-center gap-2 border border-border bg-bg/90 px-4 py-2 text-xs font-accent tracking-[0.16em] text-text-1 backdrop-blur-sm transition-colors group-hover:text-accent">
          Get Directions
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
      </a>
    </div>
  );
}
