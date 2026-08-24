import type { Vehicle } from "@/types/vehicle";
import { ChevronDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";

// Every row keeps room for two lines, whether it needs them or not.
//
// Values here run from "2.5 s" to "4.0L Twin-Turbo V8 with Three Electric
// Motors", so some wrapped and some did not — and the two columns beside each
// other stopped lining up row for row. A table whose rows are a different
// height on the left and the right is not two columns, it is two lists that
// happen to be adjacent.
//
// A floor rather than a fixed height: a value that genuinely needs three lines
// still gets them, it just cannot make the row shorter than two.
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_1.2fr] gap-6 border-b border-border py-5">
      <dt className="font-accent text-[0.8125rem] uppercase tracking-[0.16em] text-text-2">
        {label}
      </dt>
      <dd className="min-h-[3rem] text-base leading-[1.5rem] tabular-nums text-text-1">
        {value}
      </dd>
    </div>
  );
}

// Grouped and folded, the way Prestige and Vegas set out a spec sheet.
//
// It was one flat table of ten rows in two columns. Ten facts of equal weight
// with no order to them is a list somebody has to read all of to find the one
// they came for; grouped, a buyer opens the group they care about. Performance
// is open by default because it is what an exotic is bought on.
function Group({
  label,
  children,
  open = false,
}: {
  label: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details
      name="vdp-spec"
      open={open}
      className="group overflow-hidden rounded-md border border-border bg-surface transition-colors duration-300 open:border-accent/35"
    >
      {/* Three things had to be true at once and none of them were.
      
          THE OPEN ONE IS TONED DOWN. It was a solid platinum block — a bright
          bar across a dark page, shouting where it only needed to say. Now it
          is the same platinum at a tenth of its strength, with the title in the
          accent itself. Colour, not a floodlight.

          THE CLOSED ONES LOOK OPENABLE. They read as flat cards before: no
          ground of their own, a chevron at the contrast of a hairline. Each one
          now sits on a surface, and the chevron sits in its own round well —
          which is what a control looks like on this site.

          THEY ARE SEPARATED. The open body used to run into the row beneath it.
          Every group is its own block with air around it and a rule between
          header and body, so a shut group reads as a shut door rather than as
          the next line of a list. */}
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.04] group-open:bg-accent/10 md:px-6 md:py-5">
        <span className="font-title text-xl font-bold tracking-[-0.01em] text-text-1 transition-colors group-open:text-accent md:text-2xl">
          {label}
        </span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill border border-border text-text-2 transition-colors duration-200 group-hover:border-white/30 group-hover:text-text-1 group-open:border-accent/40 group-open:text-accent">
          <ChevronDown
            className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
      </summary>
      <dl className="grid grid-cols-1 gap-x-14 border-t border-border px-5 pb-1 pt-1 md:grid-cols-2 md:px-6 [&>*:nth-last-child(-n+2)]:border-b-0">
        {children}
      </dl>
    </details>
  );
}

export function SpecTable({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="space-y-4">
      <Group label="Performance" open>
        <Row label="Engine" value={vehicle.engine} />
        <Row label="Horsepower" value={`${formatNumber(vehicle.horsepower)} hp`} />
        <Row label="Torque" value={`${formatNumber(vehicle.torque)} lb-ft`} />
        <Row label="0–60 mph" value={`${vehicle.zeroToSixty.toFixed(1)} s`} />
        <Row label="Top Speed" value={`${formatNumber(vehicle.topSpeed)} mph`} />
        <Row label="Curb Weight" value={`${formatNumber(vehicle.weight)} lb`} />
      </Group>

      <Group label="Drivetrain">
        <Row label="Transmission" value={vehicle.transmission} />
        <Row label="Drivetrain" value={vehicle.drivetrain} />
      </Group>

      <Group label="Design & Finish">
        <Row label="Exterior" value={vehicle.exteriorColor} />
        <Row label="Interior" value={vehicle.interiorColor} />
      </Group>

      <Group label="Identification">
        <Row label="VIN" value={vehicle.vin} />
        <Row label="Year" value={String(vehicle.year)} />
      </Group>
    </div>
  );
}
