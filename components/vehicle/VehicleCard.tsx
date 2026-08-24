import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Armchair, Camera, Cog, Gauge, Palette } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { formatMileage, formatPrice } from "@/lib/utils";
import { carfaxReportUrl } from "@/lib/vehicles";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

type Variant = "default" | "feature" | "compact" | "plate";

function formatAcquired(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }).replace("/", ".");
}

// Long marketing drivetrain strings → the scannable badge exotic buyers read.
function shortDrivetrain(d: string): string {
  const t = d.toLowerCase();
  if (t.includes("all")) return "AWD";
  if (t.includes("four") || t.includes("4")) return "4WD";
  if (t.includes("rear")) return "RWD";
  if (t.includes("front")) return "FWD";
  return d;
}

export function VehicleCard({
  vehicle,
  variant = "default",
  priority = false,
  showPrice = true,
}: {
  vehicle: Vehicle;
  variant?: Variant;
  priority?: boolean;
  // Home featured grid runs without price for a cleaner, editorial card —
  // price + full specs live on the detail page. Defaults on everywhere else.
  showPrice?: boolean;
}) {
  const isFeature = variant === "feature";
  const isCompact = variant === "compact";
  const isPlate = variant === "plate";
  const acquired = isCompact ? formatAcquired(vehicle.acquiredDate) : null;

  const fullName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  // Image alt = YEAR MAKE MODEL TRIM — the universal exotic-listing alt pattern
  // (see HANDOFF.md §inventory); strengthens image search + AI legibility.
  const imageAlt = vehicle.trim ? `${fullName} ${vehicle.trim}` : fullName;

  // The inventory listing card — a bordered "box" (TBTFW-style) reworked into
  // our dark-luxury theme: a deep chrome-surface well framed by hairlines, with
  // a price / View bar mirrored top and bottom so the box reads as one
  // deliberate frame. Inside: the scannable performance line + a 2×2 icon spec
  // grid (mileage · drivetrain / exterior · interior). No stock#/fee clutter —
  // that lives on the detail page. Gold stays a verb (hover only), per DESIGN.md.
  if (isPlate) {
    const carfax = carfaxReportUrl(vehicle);
    const photoCount = vehicle.gallery?.length ?? 0;
    const perfLine = [vehicle.engine, vehicle.horsepower ? `${vehicle.horsepower} hp` : null]
      .filter(Boolean)
      .join("  ·  ");
    const price = formatPrice(vehicle.price);

    const bar = (position: "top" | "bottom") => (
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-5 py-3.5",
          position === "top"
            ? "border-b border-white/[0.07]"
            : "border-t border-white/[0.07]"
        )}
      >
        <span className="tabular-nums text-sm font-semibold tracking-[-0.005em] text-text-1">
          {price}
        </span>
        <span className="inline-flex items-center gap-3.5">
          {photoCount > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums text-[0.6rem] tracking-[0.06em] text-text-3">
              <Camera className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              {photoCount}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 font-accent text-[0.6rem] uppercase tracking-[0.24em] text-text-3 transition-colors group-hover:text-accent">
            View
            <ChevronRight
              className="h-3 w-3 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
              strokeWidth={1.75}
            />
          </span>
        </span>
      </div>
    );

    // Left column mechanical, right column colorways — mirrors the exotic-listing
    // convention. Icons gold-muted, values sans (tabular for the mileage figure).
    const specs: { icon: typeof Gauge; value: string; nums?: boolean }[] = [
      { icon: Gauge, value: formatMileage(vehicle.mileage), nums: true },
      { icon: Palette, value: vehicle.exteriorColor },
      { icon: Cog, value: shortDrivetrain(vehicle.drivetrain) },
      { icon: Armchair, value: vehicle.interiorColor },
    ];

    return (
      <article className="group relative flex flex-col overflow-hidden rounded-md bg-surface ring-1 ring-inset ring-white/[0.07] transition-colors duration-300 hover:ring-white/[0.16]">
        {/* Carfax sits OUTSIDE the card's link, not inside it. The whole plate
            is one anchor to the vehicle page, and an anchor inside an anchor is
            invalid markup that breaks keyboard order — so this is a sibling,
            lifted over the image by z-index.

            Top right, opposite the SOLD chip, which is the corner dealer
            listings have used for this for twenty years. Only ever present on
            an active car: carfaxReportUrl returns null for a sold one, which is
            what the client asked for. */}
        {carfax && (
          <a
            href={carfax}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 z-10 block transition-opacity duration-300 hover:opacity-80"
          >
            {/* No pill and no arrow. The mark is a known object — people
                recognise it at a glance and do not need it introduced by a
                chip or explained by an icon, and both were only ever there to
                prop up a logo too small to carry itself.

                Sized the way dealer listings actually size it: ~24px of height,
                which is about 101px wide at this artwork's 6:1.

                No shadow, on Alex's call, and checked across all ten cards
                afterwards: it costs nothing here. Every inventory photograph is
                a studio shot on a light sweep, so the top-right corner the mark
                sits in is pale on every one of them and the black boxes have
                plenty to sit against.

                The one condition that would bring the shadow back is a car
                photographed on a dark ground — the wordmark is black boxes with
                white letters, and against black its frame dissolves while only
                the letters survive. If the client ever supplies night or garage
                shots, look here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/brands/carfax.svg")}
              alt="Carfax"
              className="block h-6 w-auto"
            />
            <span className="sr-only">
              vehicle history report for this {fullName} (opens in a new tab)
            </span>
          </a>
        )}
        <Link
          href={`/inventory/${vehicle.slug}`}
          className="flex flex-1 flex-col focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent"
          aria-label={`${fullName} — ${price}`}
        >
          {/* Photo fills the top of the box edge-to-edge — no top bar. Price +
              View live once, in the bottom bar. */}
          <div className="relative aspect-[16/10] overflow-hidden bg-chrome-bg">
            <Image
              src={vehicle.heroImage}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            {vehicle.isSold && (
              <span className="absolute left-3 top-3 rounded-pill font-accent text-[0.62rem] uppercase tracking-[0.3em] bg-signal text-white px-3 py-1.5">
                Sold
              </span>
            )}
            {/* gold hairline wipes along the image's bottom edge on hover */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </div>

          <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
            <h3 className="text-lg font-semibold tracking-[-0.018em] text-text-1 transition-colors group-hover:text-accent truncate">
              {fullName}
            </h3>
            <p className="mt-1 text-[0.8rem] text-text-2 truncate">{perfLine}</p>

            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {specs.map(({ icon: Icon, value, nums }, i) => (
                <div key={i} className="flex items-center gap-2 min-w-0">
                  <Icon
                    className="h-3.5 w-3.5 shrink-0 text-text-3"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <dd
                    className={cn(
                      "min-w-0 truncate text-[0.82rem] text-text-1",
                      nums && "tabular-nums"
                    )}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-auto">{bar("bottom")}</div>
        </Link>
      </article>
    );
  }

  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className="group block focus:outline-none"
      aria-label={`${vehicle.year} ${vehicle.make} ${vehicle.model}${showPrice ? ` — ${formatPrice(vehicle.price)}` : ""}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-chrome-surface ring-1 ring-inset ring-white/[0.06]">
        <Image
          src={vehicle.heroImage}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          sizes={
            isFeature
              ? "(min-width: 1024px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chrome-bg/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {vehicle.isSold && (
          <span className="absolute top-4 left-4 rounded-pill font-accent text-[0.65rem] md:text-xs uppercase tracking-[0.32em] bg-signal text-white px-3 py-1.5">
            Sold
          </span>
        )}
        {/* gold hairline wipes along the bottom edge on hover — same
            gold-on-interaction language as the nav and CTA strip */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      </div>

      <div
        className={cn(
          "pt-5 flex justify-between gap-6",
          showPrice ? "items-baseline" : "items-center",
          isFeature && "pt-7"
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              "font-semibold tracking-[-0.018em] text-text-1 group-hover:text-accent transition-colors truncate",
              isFeature ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
            )}
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-sm text-text-2 mt-1.5 truncate">{vehicle.trim}</p>
          )}
          {acquired && (
            <p className="text-xs text-text-3 mt-2">Acquired {acquired}</p>
          )}
        </div>
        {showPrice ? (
          <div className="text-right shrink-0">
            <p className="tabular-nums text-base md:text-lg font-semibold tracking-[-0.01em] text-text-1">
              {formatPrice(vehicle.price)}
            </p>
            <p className="tabular-nums text-xs text-text-2 mt-1.5">
              {formatMileage(vehicle.mileage)}
            </p>
          </div>
        ) : (
          <ChevronRight
            aria-hidden
            className="h-5 w-5 shrink-0 text-text-3 transition-all duration-300 group-hover:text-mark group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        )}
      </div>
    </Link>
  );
}
