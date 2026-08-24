import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Armchair, Cog, Gauge, Palette } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { formatMileage, formatPrice } from "@/lib/utils";
import { carfaxReportUrl } from "@/lib/vehicles";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

type Variant = "default" | "feature" | "compact" | "plate" | "lot";

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
  const isLot = variant === "lot";
  const acquired = isCompact ? formatAcquired(vehicle.acquiredDate) : null;

  const fullName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  // Image alt = YEAR MAKE MODEL TRIM — the universal exotic-listing alt pattern
  // (see HANDOFF.md §inventory); strengthens image search + AI legibility.
  const imageAlt = vehicle.trim ? `${fullName} ${vehicle.trim}` : fullName;

  // The catalogue lot — the inventory listing card as of the third round of
  // client notes.
  //
  // Why it exists: the SRP and the VDP were still the reference build almost
  // line for line (29 differing lines in 801, 8 in 255), and the manager's note
  // was that several dealers are now asking for this site — shipping the same
  // dealer-grid to all of them would read as a template.
  //
  // The change is REGISTER, not decoration. Colour and face already differ from
  // the reference; what is recognisable is the shape of the thing — photo on
  // top, title, spec pairs, a price-and-VIEW bar, three across. That is how
  // every dealer site in the trade lays out a floor.
  //
  // This is the auction catalogue instead, which is the house's own dialect and
  // the one the interior pages never got: fewer and larger frames, the name in
  // the display face rather than the UI face, the facts as a plate under it,
  // and no chrome around the edge. No "VIEW" chevron either — a lot in a
  // catalogue does not need a button telling you it can be opened.
  if (isLot) {
    const carfax = carfaxReportUrl(vehicle);
    // Facts as pills rather than one dot-separated line. Pills are this site's
    // control idiom (DESIGN.md §3b — actions are soft), and three separate
    // objects are read as three separate facts, where a run of text joined by
    // interpuncts is read as one sentence and skimmed as one.
    const facts = [
      formatMileage(vehicle.mileage),
      shortDrivetrain(vehicle.drivetrain),
      vehicle.horsepower ? `${vehicle.horsepower} hp` : null,
    ].filter(Boolean) as string[];

    return (
      <article className="group relative">
        {carfax && (
          <a
            href={carfax}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 z-10 block transition-opacity duration-300 hover:opacity-80"
          >
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
          href={`/v4/inventory/${vehicle.slug}`}
          className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          aria-label={`${fullName} — ${formatPrice(vehicle.price)}`}
        >
          {/* The frame. No ring, no rounded well — a plate in a catalogue is a
              picture on a page, and a border around it is the card language
              this is moving away from. */}
          <div className="relative aspect-[3/2] overflow-hidden bg-chrome-bg">
            <Image
              src={vehicle.heroImage}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 46vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
            {vehicle.isSold && (
              <span className="absolute left-4 top-4 rounded-pill bg-signal px-3 py-1.5 font-accent text-[0.75rem] uppercase tracking-[0.24em] text-white">
                Sold
              </span>
            )}
          </div>

          <div className="mt-6">
            {/* Name and price share a baseline. The price never wraps and never
                shrinks — it is the one number on the card a buyer scans for. */}
            <div className="flex items-baseline justify-between gap-6">
              <h3 className="font-title text-[1.6rem] font-bold leading-[1.1] tracking-[-0.015em] text-text-1 transition-colors group-hover:text-accent xl:text-[1.75rem]">
                {fullName}
              </h3>
              <span className="shrink-0 tabular-nums text-lg font-semibold text-text-1 xl:text-xl">
                {formatPrice(vehicle.price)}
              </span>
            </div>

            {vehicle.trim && (
              <p className="mt-1.5 text-sm text-text-2">{vehicle.trim}</p>
            )}

            <ul className="mt-5 flex flex-wrap gap-2">
              {facts.map((f) => (
                <li
                  key={f}
                  className="rounded-pill border border-border px-3.5 py-1.5 font-accent text-[0.75rem] uppercase tracking-[0.14em] text-text-2"
                >
                  {f}
                </li>
              ))}
            </ul>

            {/* The plate. Colours get their own row each — on an exotic the
                colour name is the spec the buyer came for, and it does not fit
                a half column. */}
            <dl className="mt-5 border-t border-border pt-5 text-sm">
              {[
                ["Exterior", vehicle.exteriorColor],
                ["Interior", vehicle.interiorColor],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-5 py-1.5">
                  <dt className="w-24 shrink-0 font-accent text-[0.8125rem] uppercase tracking-[0.14em] text-text-3">
                    {k}
                  </dt>
                  <dd className="min-w-0 text-text-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Link>
      </article>
    );
  }

  // The inventory listing card — a bordered "box" (TBTFW-style) reworked into
  // our dark-luxury theme: a deep chrome-surface well framed by hairlines, with
  // a price / View bar mirrored top and bottom so the box reads as one
  // deliberate frame. Inside: the scannable performance line + a 2×2 icon spec
  // grid (mileage · drivetrain / exterior · interior). No stock#/fee clutter —
  // that lives on the detail page. Gold stays a verb (hover only), per DESIGN.md.
  if (isPlate) {
    const carfax = carfaxReportUrl(vehicle);
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
          {/* The photo count stood here and is gone. Every gallery holds one
              image, so every card in the grid announced "1" — ten cards telling
              a buyer in a row that we have a single photograph of each car.
              Put it back when real galleries arrive; until then it is a
              weakness with a camera icon next to it. */}
          <span className="inline-flex items-center gap-1.5 font-accent text-[0.75rem] uppercase tracking-[0.2em] text-text-3 transition-colors group-hover:text-accent">
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
    // Two short facts share a row; the two colours each get the whole width.
    //
    // They used to be a neat 2x2, and both colours were clipped on every single
    // card — "Bianco Avus with Giallo Modena Stripe" became "Bianco Avus with
    // Gi...", "Nero Alcantara with Yellow Stitching" became "Nero Alcantara
    // with ...". On an exotic the colour name is not a label, it is the spec a
    // buyer came to read, and half a card is not enough room to say one. The
    // grid was tidier; it was also eating the content.
    const specs: {
      icon: typeof Gauge;
      value: string;
      nums?: boolean;
      wide?: boolean;
    }[] = [
      { icon: Gauge, value: formatMileage(vehicle.mileage), nums: true },
      { icon: Cog, value: shortDrivetrain(vehicle.drivetrain) },
      { icon: Palette, value: vehicle.exteriorColor, wide: true },
      { icon: Armchair, value: vehicle.interiorColor, wide: true },
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

                No shadow, and the current mark does not want one: Carfax's
                live logo sits inside its own white rounded plate, so it carries
                its separation with it onto any ground, light or dark. The
                version we had before was the older cut — loose letter boxes
                with a grey X and no plate — which is why it needed help. */}
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
          href={`/v4/inventory/${vehicle.slug}`}
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
              <span className="absolute left-3 top-3 rounded-pill font-accent text-[0.75rem] uppercase tracking-[0.24em] bg-signal text-white px-3 py-1.5">
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
            {/* Two lines, not one. "4.0L Twin-Turbo V8 with Three Electric
                Motors · 986 hp" does not fit a card at a readable size, and the
                horsepower is the half that was being cut. Clamped at two so a
                long engine name cannot push the specs out of line with the
                cards beside it. */}
            <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm leading-[1.25rem] text-text-2">
              {perfLine}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {specs.map(({ icon: Icon, value, nums, wide }, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex min-w-0 items-center gap-2",
                    wide && "col-span-2"
                  )}
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-text-3"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <dd
                    className={cn(
                      "min-w-0 truncate text-sm text-text-1",
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
      href={`/v4/inventory/${vehicle.slug}`}
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
          <span className="absolute top-4 left-4 rounded-pill font-accent text-[0.75rem] uppercase tracking-[0.26em] bg-signal text-white px-3 py-1.5">
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

      {/* Same language as the catalogue lot on /v4/inventory: the name in the
          display face, the facts as pills, and no chevron. The homepage is
          where most people meet a car first, and meeting it in one typography
          and then again in another on the listing page is how a site starts to
          feel assembled rather than designed. */}
      <div className={cn("pt-5", isFeature && "pt-7")}>
        <div className="flex items-baseline justify-between gap-5">
          <h3
            className={cn(
              "min-w-0 truncate font-title font-bold leading-[1.1] tracking-[-0.015em] text-text-1 transition-colors group-hover:text-accent",
              isFeature ? "text-[1.75rem] md:text-[2rem]" : "text-xl md:text-2xl"
            )}
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {showPrice && (
            <span className="shrink-0 tabular-nums text-base font-semibold text-text-1 md:text-lg">
              {formatPrice(vehicle.price)}
            </span>
          )}
        </div>

        {vehicle.trim && (
          <p className="mt-1.5 truncate text-sm text-text-2">{vehicle.trim}</p>
        )}
        {acquired && (
          <p className="mt-2 text-[0.8125rem] text-text-3">Acquired {acquired}</p>
        )}

        <ul className="mt-4 flex flex-wrap gap-2">
          {[
            formatMileage(vehicle.mileage),
            shortDrivetrain(vehicle.drivetrain),
            vehicle.horsepower ? `${vehicle.horsepower} hp` : null,
          ]
            .filter(Boolean)
            .map((f) => (
              <li
                key={f as string}
                className="rounded-pill border border-border px-3 py-1 font-accent text-[0.75rem] uppercase tracking-[0.14em] text-text-2"
              >
                {f}
              </li>
            ))}
        </ul>
      </div>
    </Link>
  );
}
