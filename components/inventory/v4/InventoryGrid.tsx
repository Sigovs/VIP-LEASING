"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "@/components/vehicle/v4/VehicleCard";
import { Container } from "@/components/ui/Container";
import { cn, formatNumber } from "@/lib/utils";

type SortKey =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "mileage-asc"
  | "year-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Recently added" },
  { key: "price-asc", label: "Price · Low to high" },
  { key: "price-desc", label: "Price · High to low" },
  { key: "mileage-asc", label: "Lowest mileage" },
  { key: "year-desc", label: "Newest year" },
];

const TRANSMISSIONS = ["Manual", "PDK", "DCT/F1", "Automatic"] as const;
const DRIVETRAINS = ["RWD", "AWD", "4WD"] as const;
type TransmissionBucket = (typeof TRANSMISSIONS)[number];
type DrivetrainBucket = (typeof DRIVETRAINS)[number];

function matchesTransmission(v: Vehicle, bucket: TransmissionBucket): boolean {
  const t = v.transmission.toLowerCase();
  switch (bucket) {
    case "Manual":
      return /manual|6-speed manual|7-speed manual/.test(t) && !t.includes("automatic");
    case "PDK":
      return t.includes("pdk");
    case "DCT/F1":
      return t.includes("dct") || t.includes("f1") || t.includes("dual-clutch") || t.includes("dual clutch");
    case "Automatic":
      return (t.includes("automatic") || t.includes("auto") || t.includes("tiptronic")) && !t.includes("pdk");
  }
}

function matchesDrivetrain(v: Vehicle, bucket: DrivetrainBucket): boolean {
  const d = v.drivetrain.toLowerCase();
  switch (bucket) {
    case "RWD":
      return d.includes("rear");
    case "AWD":
      return d.includes("all");
    case "4WD":
      return d.includes("four") || d.includes("4");
  }
}

type FilterState = {
  q: string;
  makes: string[];
  model: string;
  year: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  maxMileage: number | null;
  transmissions: TransmissionBucket[];
  drivetrains: DrivetrainBucket[];
  sort: SortKey;
};

// A list of options inside a dropdown. Year and model were a <select> in here
// at first, which is a dropdown inside a dropdown — two clicks and a native
// menu to answer a question the panel was already open to answer.
function OptionList({
  options,
  value,
  onPick,
  allLabel,
  allCount,
  counts,
}: {
  options: string[];
  value: string;
  onPick: (v: string) => void;
  allLabel: string;
  allCount?: number;
  counts?: Map<string, number>;
}) {
  const row = (label: string, v: string, count?: number) => (
    <li key={v || "__all"}>
      <button
        type="button"
        onClick={(e) => {
          // Close the menu on choosing. It used to stay open, and while it hung
          // there the grid beneath it rebuilt — fewer cards, a shorter page, a
          // sticky bar recalculating under an open panel. That is what read as
          // the dropdown glitching; it was the page moving, not the menu.
          (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
          onPick(v);
        }}
        className={cn(
          "flex w-full items-baseline justify-between gap-4 py-1.5 text-left text-sm transition-colors",
          value === v ? "text-mark-soft" : "text-text-2 hover:text-text-1"
        )}
      >
        <span className="truncate">{label}</span>
        {count != null && (
          <span className="shrink-0 font-accent text-[0.75rem] tabular-nums text-text-3">
            {count}
          </span>
        )}
      </button>
    </li>
  );

  return (
    <ul className="max-h-64 space-y-1 overflow-y-auto">
      {row(allLabel, "", allCount)}
      {options.map((o) => row(o, o, counts?.get(o)))}
    </ul>
  );
}

// One filter, as a dropdown. The pattern Alex already uses on Prestige and
// Vegas: a row of triggers, each opening its own panel, instead of a column
// that grows.
//
// The column was the mistake. Opened, it ran past the fold, so the last filter
// could only be reached by scrolling the page to its end — and capping it with
// an internal scrollbar only moved the problem into the panel. A dropdown is
// never tall, because only one is ever open and it floats over the page rather
// than pushing it.
function FilterDropdown({
  label,
  active,
  children,
  wide = false,
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
  wide?: boolean;
}) {
  // name= makes them exclusive: opening one closes the rest, natively and
  // without a line of state. Click-outside and Escape are handled in the bar —
  // see the effect in InventoryGrid.
  return (
    <details name="srp-filter" className="group relative">
      <summary
        className={cn(
          // One width for every trigger, whatever the word inside it. They are a set of
        // peers and a row of pills that each measure their own label reads as
        // ragged — and it moves when a filter is chosen, which is worse.
        "flex h-11 w-[9.5rem] cursor-pointer list-none items-center justify-between gap-2 rounded-pill border px-4 font-accent text-[0.8125rem] uppercase tracking-[0.12em] transition-colors",
          active
            ? "border-mark-soft/60 bg-mark-soft/10 text-mark-soft"
            : "border-white/[0.14] text-text-2 hover:border-white/30 hover:text-text-1"
        )}
      >
        {label}
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className="shrink-0 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div
        className={cn(
          "absolute left-0 top-[calc(100%+0.6rem)] z-50 rounded-md border border-white/[0.12] bg-[#1e2229] p-5 shadow-[0_28px_60px_-30px_rgba(0,0,0,0.95)]",
          wide ? "w-72" : "w-60"
        )}
      >
        {children}
      </div>
    </details>
  );
}

// Price as bands rather than two empty boxes. Nobody arrives knowing they want
// a car between $312,000 and $588,000 — they want "under three hundred" or
// "over a million", and a range they can click is the question they actually
// have. Bands that hold nothing are not offered, same rule as the year and
// model lists.
const PRICE_BANDS: { label: string; min: number | null; max: number | null }[] = [
  { label: "Under $250K", min: null, max: 250_000 },
  { label: "$250K – $400K", min: 250_000, max: 400_000 },
  { label: "$400K – $600K", min: 400_000, max: 600_000 },
  { label: "$600K – $1M", min: 600_000, max: 1_000_000 },
  { label: "Over $1M", min: 1_000_000, max: null },
];

const EMPTY: FilterState = {
  q: "",
  makes: [],
  model: "",
  year: null,
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  maxMileage: null,
  transmissions: [],
  drivetrains: [],
  sort: "featured",
};

function parseParams(sp: URLSearchParams): FilterState {
  const num = (k: string): number | null => {
    const raw = sp.get(k);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };
  const list = (k: string): string[] =>
    (sp.get(k) ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  const sortRaw = (sp.get("sort") ?? "featured") as SortKey;
  const sort: SortKey = SORTS.some((s) => s.key === sortRaw) ? sortRaw : "featured";

  return {
    q: sp.get("q") ?? "",
    makes: list("make"),
    model: sp.get("model") ?? "",
    year: num("year"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minYear: num("minYear"),
    maxYear: num("maxYear"),
    maxMileage: num("maxMileage"),
    transmissions: list("trans").filter((x): x is TransmissionBucket =>
      (TRANSMISSIONS as readonly string[]).includes(x)
    ),
    drivetrains: list("drive").filter((x): x is DrivetrainBucket =>
      (DRIVETRAINS as readonly string[]).includes(x)
    ),
    sort,
  };
}

function serializeState(s: FilterState): string {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.makes.length) p.set("make", s.makes.join(","));
  if (s.model) p.set("model", s.model);
  if (s.year != null) p.set("year", String(s.year));
  if (s.minPrice != null) p.set("minPrice", String(s.minPrice));
  if (s.maxPrice != null) p.set("maxPrice", String(s.maxPrice));
  if (s.minYear != null) p.set("minYear", String(s.minYear));
  if (s.maxYear != null) p.set("maxYear", String(s.maxYear));
  if (s.maxMileage != null) p.set("maxMileage", String(s.maxMileage));
  if (s.transmissions.length) p.set("trans", s.transmissions.join(","));
  if (s.drivetrains.length) p.set("drive", s.drivetrains.join(","));
  if (s.sort !== "featured") p.set("sort", s.sort);
  return p.toString();
}

// Drawer-only filters. Make lives in the marque rail, not the drawer, so it is
// counted/shown separately from this badge.
function countDrawerFilters(s: FilterState): number {
  return (
    (s.minPrice != null || s.maxPrice != null ? 1 : 0) +
    (s.minYear != null || s.maxYear != null ? 1 : 0) +
    (s.maxMileage != null ? 1 : 0) +
    s.transmissions.length +
    s.drivetrains.length
  );
}

function formatPriceShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}

export function InventoryGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<FilterState>(() =>
    parseParams(new URLSearchParams(searchParams.toString()))
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Dropdowns close themselves. name="srp-filter" already makes them mutually
  // exclusive; this is the other half — a click anywhere else, or Escape,
  // shuts whichever is open. Without it a panel stays up until you click its
  // own trigger again, which is not how anyone expects a menu to behave.
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeAll = () =>
      barRef.current
        ?.querySelectorAll<HTMLDetailsElement>("details[open]")
        .forEach((d) => (d.open = false));
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const sortRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  // URL sync — debounce q, immediate for everything else.
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const qs = serializeState(state);
    const id = window.setTimeout(
      () => {
        router.replace(qs ? `?${qs}` : "?", { scroll: false });
      },
      200
    );
    return () => window.clearTimeout(id);
  }, [state, router]);

  // Sort menu: dismiss on outside click or Escape.
  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sortOpen]);

  // Filters drawer: lock body scroll, close on Escape, move focus into the panel.
  useEffect(() => {
    if (!filtersOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerCloseRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filtersOpen]);

  // Year and model options, from the inventory itself rather than a generic
  // list — a filter offering a year nobody has is a dead end with a number on
  // it. Models narrow to the chosen make, because "296 GTS" under Lamborghini
  // is the same dead end.
  const years = useMemo(
    () => [...new Set(vehicles.map((v) => v.year))].sort((a, b) => b - a),
    [vehicles],
  );
  const yearCounts = useMemo(() => {
    const m = new Map<string, number>();
    vehicles.forEach((v) => m.set(String(v.year), (m.get(String(v.year)) ?? 0) + 1));
    return m;
  }, [vehicles]);
  const priceBands = useMemo(
    () =>
      PRICE_BANDS.map((b) => ({
        ...b,
        count: vehicles.filter(
          (v) =>
            (b.min == null || v.price >= b.min) &&
            (b.max == null || v.price < b.max),
        ).length,
      })).filter((b) => b.count > 0),
    [vehicles],
  );

  const modelCounts = useMemo(() => {
    const m = new Map<string, number>();
    const pool = state.makes.length
      ? vehicles.filter((v) => state.makes.includes(v.make))
      : vehicles;
    pool.forEach((v) => m.set(v.model, (m.get(v.model) ?? 0) + 1));
    return m;
  }, [vehicles, state.makes]);
  const models = useMemo(() => {
    const pool = state.makes.length
      ? vehicles.filter((v) => state.makes.includes(v.make))
      : vehicles;
    return [...new Set(pool.map((v) => v.model))].sort();
  }, [vehicles, state.makes]);

  // Static per-make tallies for the marque rail (whole inventory, not the
  // current result set), ordered by count then name.
  const makeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of vehicles) map.set(v.make, (map.get(v.make) ?? 0) + 1);
    return map;
  }, [vehicles]);

  const marques = useMemo(
    () =>
      Array.from(makeCounts.keys()).sort(
        (a, b) => (makeCounts.get(b)! - makeCounts.get(a)!) || a.localeCompare(b)
      ),
    [makeCounts]
  );

  const filtered = useMemo(() => {
    const tokens = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    let list = vehicles.filter((v) => {
      if (tokens.length) {
        const hay = `${v.year} ${v.make} ${v.model} ${v.trim}`.toLowerCase();
        if (!tokens.every((t) => hay.includes(t))) return false;
      }
      if (state.makes.length && !state.makes.includes(v.make)) return false;
      if (state.model && v.model !== state.model) return false;
      if (state.year != null && v.year !== state.year) return false;
      if (state.minPrice != null && v.price < state.minPrice) return false;
      if (state.maxPrice != null && v.price > state.maxPrice) return false;
      if (state.minYear != null && v.year < state.minYear) return false;
      if (state.maxYear != null && v.year > state.maxYear) return false;
      if (state.maxMileage != null && v.mileage > state.maxMileage) return false;
      if (
        state.transmissions.length &&
        !state.transmissions.some((b) => matchesTransmission(v, b))
      )
        return false;
      if (
        state.drivetrains.length &&
        !state.drivetrains.some((b) => matchesDrivetrain(v, b))
      )
        return false;
      return true;
    });

    switch (state.sort) {
      case "newest":
        list = [...list].sort(
          (a, b) =>
            new Date(b.acquiredDate).getTime() -
            new Date(a.acquiredDate).getTime()
        );
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "mileage-asc":
        list = [...list].sort((a, b) => a.mileage - b.mileage);
        break;
      case "year-desc":
        list = [...list].sort((a, b) => b.year - a.year);
        break;
      default:
        list = [...list].sort((a, b) =>
          a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1
        );
    }
    return list;
  }, [vehicles, state]);

  const drawerCount = countDrawerFilters(state);
  const activeMake = state.makes.length === 1 ? state.makes[0] : null;
  const reset = () => setState(EMPTY);

  // Marque rail is single-select: choosing a brand replaces the make filter;
  // "All" clears it.
  const selectMake = (m: string | null) =>
    setState((s) => ({ ...s, makes: m ? [m] : [] }));

  const toggleTrans = (b: TransmissionBucket) =>
    setState((s) => ({
      ...s,
      transmissions: s.transmissions.includes(b)
        ? s.transmissions.filter((x) => x !== b)
        : [...s.transmissions, b],
    }));
  const toggleDrive = (b: DrivetrainBucket) =>
    setState((s) => ({
      ...s,
      drivetrains: s.drivetrains.includes(b)
        ? s.drivetrains.filter((x) => x !== b)
        : [...s.drivetrains, b],
    }));

  const priceLabel =
    state.minPrice != null && state.maxPrice != null
      ? `${formatPriceShort(state.minPrice)}–${formatPriceShort(state.maxPrice)}`
      : state.minPrice != null
        ? `≥ ${formatPriceShort(state.minPrice)}`
        : state.maxPrice != null
          ? `≤ ${formatPriceShort(state.maxPrice)}`
          : null;

  const yearLabel =
    state.minYear != null && state.maxYear != null
      ? `${state.minYear}–${state.maxYear}`
      : state.minYear != null
        ? `≥ ${state.minYear}`
        : state.maxYear != null
          ? `≤ ${state.maxYear}`
          : null;

  // A field with four sides, not a line under some text. Alex's note: as an
  // underline it read as decoration and nobody could tell it was a place to
  // type. Labelled too — "Search by keyword" above the box says what it does
  // better than grey placeholder text that vanishes the moment you use it.
  const searchField = (
    <div>
      <label
        htmlFor="inventory-search"
        className="mb-3 block font-accent text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mark-soft"
      >
        Search by keyword
      </label>
      <div className="flex h-11 items-center gap-2.5 rounded-md border border-white/[0.14] bg-bg/60 px-3.5 transition-colors focus-within:border-white/40">
        <Search size={15} strokeWidth={1.5} className="shrink-0 text-text-3" />
        <input
          id="inventory-search"
          type="search"
          value={state.q}
          onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
          placeholder="Year, make, model"
          aria-label="Search inventory"
          className="w-full bg-transparent text-sm text-text-1 placeholder:text-text-3 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {state.q && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setState((s) => ({ ...s, q: "" }))}
            className="shrink-0 text-text-3 transition-colors hover:text-text-1"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );

  const sortMenu = (
  <div className="relative" ref={sortRef}>
    <button
      type="button"
      onClick={() => setSortOpen((v) => !v)}
      aria-haspopup="listbox"
      aria-expanded={sortOpen}
      className="inline-flex items-center gap-1.5 text-text-2 hover:text-text-1 transition-colors"
    >
      Sort
      <span className="hidden sm:inline text-text-1">
        · {SORTS.find((s) => s.key === state.sort)?.label}
      </span>
      <ChevronDown
        size={14}
        strokeWidth={1.5}
        className={cn(
          "transition-transform duration-200",
          sortOpen && "rotate-180"
        )}
      />
    </button>
    {sortOpen && (
      <ul
        role="listbox"
        aria-label="Sort inventory"
        className="absolute right-0 top-full mt-2 z-50 min-w-[210px] bg-bg border border-border py-1.5 shadow-2xl"
      >
        {SORTS.map((s) => {
          const active = s.key === state.sort;
          return (
            <li key={s.key} role="option" aria-selected={active}>
              <button
                type="button"
                onClick={() => {
                  setState((prev) => ({ ...prev, sort: s.key }));
                  setSortOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[0.78rem] tracking-[0.02em] transition-colors hover:bg-surface",
                  active ? "text-text-1" : "text-text-2"
                )}
              >
                {s.label}
                {active && (
                  <Check size={14} strokeWidth={2} className="text-accent shrink-0" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    )}
  </div>
  );

  // The filter fields, in one place because they now appear in two: the rail
  // that stands beside the catalogue on desktop, and the drawer that is still
  // the right answer on a phone. Declared inside the component so it closes
  // over state and the toggles rather than taking eleven props.
  // The chosen filters, as removable tags. They used to render only inside the
  // mobile bar, so on a desktop you could set a price and a drivetrain and the
  // page would tell you nothing about what you had set — the trigger lit up,
  // but not with what. Same list in both places now.
  // The chosen filters, as removable tags. They used to render only inside the
  // mobile bar, so on a desktop you could set a price and a drivetrain and the
  // page would tell you nothing about what you had set — the trigger lit up,
  // but not with what. Same list in both places now, and the triggers stay
  // plain: a control says what it asks, a tag says what was answered.
  const activeTags = (
    <>
      {activeMake && (
        <ActiveChip label={activeMake} onRemove={() => selectMake(null)} />
      )}
      {state.model && (
        <ActiveChip
          label={state.model}
          onRemove={() => setState((st) => ({ ...st, model: "" }))}
        />
      )}
      {state.year != null && (
        <ActiveChip
          label={String(state.year)}
          onRemove={() => setState((st) => ({ ...st, year: null }))}
        />
      )}
  <>
                {priceLabel && (
                  <ActiveChip
                    label={priceLabel}
                    onRemove={() =>
                      setState((s) => ({ ...s, minPrice: null, maxPrice: null }))
                    }
                  />
                )}
                {yearLabel && (
                  <ActiveChip
                    label={yearLabel}
                    onRemove={() =>
                      setState((s) => ({ ...s, minYear: null, maxYear: null }))
                    }
                  />
                )}
                {state.maxMileage != null && (
                  <ActiveChip
                    label={`≤ ${formatNumber(state.maxMileage)} mi`}
                    onRemove={() => setState((s) => ({ ...s, maxMileage: null }))}
                  />
                )}
                {state.transmissions.map((t) => (
                  <ActiveChip key={`tr-${t}`} label={t} onRemove={() => toggleTrans(t)} />
                ))}
                {state.drivetrains.map((d) => (
                  <ActiveChip key={`dr-${d}`} label={d} onRemove={() => toggleDrive(d)} />
                ))}
                <button
                  type="button"
                  // Clears everything, including make, model and year — the tags
                  // beside it now cover all of them, so a "clear" that left
                  // three of them standing would be lying about what it did.
                  onClick={() => setState((st) => ({ ...EMPTY, sort: st.sort }))}
                  className="ml-2 inline-flex items-center rounded-pill border border-white/20 px-3.5 py-1.5 font-accent text-[0.75rem] uppercase tracking-[0.12em] text-text-3 transition-colors hover:border-white/45 hover:text-text-1"
                >
                  Clear all
                </button>
              </>
    </>
  );

  const filterFields = (
    <>
          <FilterGroup label="Price">
            <div className="grid grid-cols-2 gap-3">
              <RangeInput
                placeholder="Min"
                prefix="$"
                value={state.minPrice}
                onChange={(n) => setState((s) => ({ ...s, minPrice: n }))}
              />
              <RangeInput
                placeholder="Max"
                prefix="$"
                value={state.maxPrice}
                onChange={(n) => setState((s) => ({ ...s, maxPrice: n }))}
              />
            </div>
          </FilterGroup>

          <FilterGroup label="Mileage">
            <RangeInput
              placeholder="Max mileage"
              suffix="mi"
              value={state.maxMileage}
              onChange={(n) => setState((s) => ({ ...s, maxMileage: n }))}
            />
          </FilterGroup>

          <FilterGroup label="Transmission">
            <ul className="flex flex-wrap gap-2">
              {TRANSMISSIONS.map((t) => (
                <li key={t}>
                  <ChipButton
                    active={state.transmissions.includes(t)}
                    onClick={() => toggleTrans(t)}
                  >
                    {t}
                  </ChipButton>
                </li>
              ))}
            </ul>
          </FilterGroup>

          <FilterGroup label="Drivetrain">
            <ul className="flex flex-wrap gap-2">
              {DRIVETRAINS.map((d) => (
                <li key={d}>
                  <ChipButton
                    active={state.drivetrains.includes(d)}
                    onClick={() => toggleDrive(d)}
                  >
                    {d}
                  </ChipButton>
                </li>
              ))}
            </ul>
          </FilterGroup>
    </>
  );

  return (
    <>
      {/* The control bar, on phones only. On a desktop these live in the rail
          beside the catalogue — a sticky toolbar announcing FILTERS and SORT is
          the dealer-grid idiom this page moved away from, and it is also the
          last thing on the SRP that was still the reference build line for
          line. On a phone there is no room for a rail and a drawer is the right
          answer, so the bar stays there. */}
      <div className="sticky top-16 z-30 border-y border-border bg-bg/85 backdrop-blur-md lg:hidden">
        {/* Marque rail — one-click brand browse with whole-inventory tallies. */}
        <div className="border-b border-border">
          <Container>
            <nav
              aria-label="Filter by make"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3.5"
            >
              <RailItem
                active={activeMake == null}
                onClick={() => selectMake(null)}
                label="All"
                count={vehicles.length}
              />
              {marques.map((m) => (
                <RailItem
                  key={m}
                  active={activeMake === m}
                  onClick={() => selectMake(m)}
                  label={m}
                  count={makeCounts.get(m) ?? 0}
                />
              ))}
            </nav>
          </Container>
        </div>

        {/* Slim toolbar — search left, count + filters + sort right. Stacks on
            mobile so the search field gets a full row instead of being squeezed. */}
        <Container className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {searchField}

          <div className="flex items-center justify-end gap-4 md:gap-5 shrink-0 text-[0.72rem] font-medium font-accent uppercase tracking-[0.07em]">
            <span className="hidden md:inline text-text-3 tabular-nums">
              {filtered.length} of {vehicles.length}
            </span>
            <span aria-hidden className="hidden md:block h-3.5 w-px bg-border" />
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={filtersOpen}
              aria-controls="inventory-filters"
              className="inline-flex items-center gap-2 text-text-1 hover:text-accent transition-colors"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} /> Filters
              {drawerCount > 0 && (
                <span className="ml-0.5 text-accent tabular-nums">· {drawerCount}</span>
              )}
            </button>
            <span aria-hidden className="h-3.5 w-px bg-border" />
            {sortMenu}
          </div>
        </Container>

        {/* Active filter tags — same list the desktop panel shows. */}
        <Container className="empty:hidden [&>*]:flex [&>*]:flex-wrap [&>*]:items-center [&>*]:gap-2 [&>*]:pb-4">
          {activeTags}
        </Container>
      </div>

      <Container className="py-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* The filter bar. One panel, its own shade, laid across the top
              instead of down the side — the row of dropdowns Alex already uses
              on Prestige and Vegas. Nothing in it can grow tall, so nothing
              needs an inner scrollbar and no filter is ever below the fold. */}
          {/* Sticky. On a catalogue this long the filters are the one thing you
              reach for mid-scroll, and having to go back to the top to change a
              make is the same fault as the rail that ran past the fold — just
              in the other direction. It rides under the header, so top-24
              rather than 0.

              No band behind it. The first pass put a blurred full-width strip
              under the sticky wrapper, which is wider than the panel — so the
              moment it stuck, the panel appeared to stretch to the edges of the
              screen. The panel carries its own ground; it needs nothing
              underneath. */}
          <div className="z-40 lg:sticky lg:top-24 lg:col-span-12">
            <div
              ref={barRef}
              className="rounded-md border border-white/[0.10] bg-[#1e2229] p-5 shadow-[0_2px_0_rgba(255,255,255,0.045)_inset,0_28px_60px_-34px_rgba(0,0,0,0.95)]"
            >
              {/* Two labelled groups on one baseline: the labels line up, and so
                  do the controls under them, because both are the same height.
                  Before this the row of pills was centred against the whole
                  search block and sat a few pixels low against nothing. */}
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:gap-8">
                <div className="xl:w-72 xl:shrink-0">{searchField}</div>

                <div className="min-w-0">
                  <p className="mb-3 font-accent text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mark-soft">
                    Find your car
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                  <FilterDropdown
                    label="Year"
                    active={state.year != null}
                  >
                    <OptionList
                      options={years.map(String)}
                      value={state.year ? String(state.year) : ""}
                      onPick={(v) =>
                        setState((st) => ({ ...st, year: v ? Number(v) : null }))
                      }
                      allLabel="Any year"
                      allCount={vehicles.length}
                      counts={yearCounts}
                    />
                  </FilterDropdown>

                  <FilterDropdown label="Make" active={!!activeMake} wide>
                    <ul className="space-y-1">
                      <li>
                        <button
                          type="button"
                          onClick={(e) => {
                            (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
                            selectMake(null);
                          }}
                          className={cn(
                            "flex w-full items-baseline justify-between gap-4 py-1.5 text-left text-sm transition-colors",
                            activeMake == null ? "text-mark-soft" : "text-text-2 hover:text-text-1"
                          )}
                        >
                          <span>All makes</span>
                          <span className="font-accent text-[0.75rem] tabular-nums text-text-3">
                            {vehicles.length}
                          </span>
                        </button>
                      </li>
                      {marques.map((m) => (
                        <li key={m}>
                          <button
                            type="button"
                            onClick={(e) => {
                              (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
                              selectMake(m);
                            }}
                            className={cn(
                              "flex w-full items-baseline justify-between gap-4 py-1.5 text-left text-sm transition-colors",
                              activeMake === m ? "text-mark-soft" : "text-text-2 hover:text-text-1"
                            )}
                          >
                            <span className="truncate">{m}</span>
                            <span className="shrink-0 font-accent text-[0.75rem] tabular-nums text-text-3">
                              {makeCounts.get(m) ?? 0}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </FilterDropdown>

                  <FilterDropdown label="Model" active={!!state.model} wide>
                    <OptionList
                      options={models}
                      value={state.model}
                      onPick={(v) => setState((st) => ({ ...st, model: v }))}
                      allLabel="All models"
                      counts={modelCounts}
                    />
                  </FilterDropdown>

                  <FilterDropdown
                    label="Price"
                    active={state.minPrice != null || state.maxPrice != null}
                    wide
                  >
                    <ul className="space-y-1">
                      {[{ label: "Any price", min: null, max: null, count: vehicles.length }, ...priceBands].map((b) => {
                        const on =
                          state.minPrice === b.min && state.maxPrice === b.max;
                        return (
                          <li key={b.label}>
                            <button
                              type="button"
                              onClick={(e) => {
                                (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
                                setState((st) => ({ ...st, minPrice: b.min, maxPrice: b.max }));
                              }}
                              className={cn(
                                "flex w-full items-baseline justify-between gap-4 py-1.5 text-left text-sm transition-colors",
                                on ? "text-mark-soft" : "text-text-2 hover:text-text-1"
                              )}
                            >
                              <span className="truncate">{b.label}</span>
                              <span className="shrink-0 font-accent text-[0.75rem] tabular-nums text-text-3">
                                {b.count}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </FilterDropdown>

                  <FilterDropdown label="Mileage" active={state.maxMileage != null}>
                    <RangeInput placeholder="Max mileage" suffix="mi" value={state.maxMileage} onChange={(n) => setState((st) => ({ ...st, maxMileage: n }))} />
                  </FilterDropdown>

                  <FilterDropdown label="Transmission" active={state.transmissions.length > 0} wide>
                    <ul className="flex flex-wrap gap-2">
                      {TRANSMISSIONS.map((t) => (
                        <li key={t}>
                          <ChipButton active={state.transmissions.includes(t)} onClick={() => toggleTrans(t)}>
                            {t}
                          </ChipButton>
                        </li>
                      ))}
                    </ul>
                  </FilterDropdown>

                  <FilterDropdown label="Drivetrain" active={state.drivetrains.length > 0} wide>
                    <ul className="flex flex-wrap gap-2">
                      {DRIVETRAINS.map((d) => (
                        <li key={d}>
                          <ChipButton active={state.drivetrains.includes(d)} onClick={() => toggleDrive(d)}>
                            {d}
                          </ChipButton>
                        </li>
                      ))}
                    </ul>
                  </FilterDropdown>

                    {/* No Reset here. There was one in this row and another in
                        the tag row below — two controls doing one job, which
                        TASTE.md's device budget says to solve by strengthening
                        one and deleting the other. The one that survives lives
                        with the tags, because that is where a person looks when
                        they want to undo what they set. */}
                  </div>
                </div>
              </div>

              {(drawerCount > 0 || activeMake || state.model || state.year != null) && (
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
                  {activeTags}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-12">
            {/* One quiet line above the catalogue: how many, and in what order. */}
            <div className="mb-10 hidden items-center justify-between gap-6 border-b border-border pb-4 lg:flex">
              <span className="font-accent text-[0.8125rem] uppercase tracking-[0.16em] text-text-3 tabular-nums">
                {filtered.length} of {vehicles.length}
              </span>
              <div className="flex items-center text-[0.8125rem] font-accent uppercase tracking-[0.12em]">
                {sortMenu}
              </div>
            </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="text-text-2 font-accent uppercase tracking-[0.08em] text-sm">
              No vehicles match these filters.
            </p>
            <button
              type="button"
              onClick={reset}
              className="text-[0.7rem] font-accent uppercase tracking-[0.08em] text-accent hover:text-text-1 transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          // No scroll-reveal here: the inventory grid is the page's primary
          // content and must paint in full on load — no opacity gating that
          // could leave cards blank on a slow/interrupted connection.
          // Three across. It was two while the filters stood in a rail down the
          // side and the catalogue only had nine columns; with the filters in a
          // bar across the top the page gives all twelve back, and three lots
          // at this width are still larger than the four-column grid this
          // replaced.
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {filtered.map((v, i) => (
              <VehicleCard key={v.slug} vehicle={v} variant="lot" priority={i < 2} />
            ))}
          </div>
        )}
          </div>
        </div>
      </Container>

      {filtersOpen && (
        <div
          id="inventory-filters"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-[60] flex"
        >
          <button
            type="button"
            aria-label="Close filters"
            className="flex-1 bg-bg/70 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="w-full max-w-md bg-bg border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <div className="space-y-3">
                <span aria-hidden className="block h-px w-8 bg-accent" />
                <p className="text-xs font-accent uppercase tracking-[0.08em] text-text-3">
                  Filters
                </p>
              </div>
              <button
                ref={drawerCloseRef}
                type="button"
                aria-label="Close"
                onClick={() => setFiltersOpen(false)}
                className="text-text-2 hover:text-text-1 focus:outline-none focus-visible:text-accent"
              >
                <X size={20} strokeWidth={1.25} />
              </button>
            </div>
            <div className="px-8 py-8 space-y-10">
              {filterFields}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={reset}
                  className="text-[0.7rem] font-accent uppercase tracking-[0.08em] text-text-2 hover:text-text-1 transition-colors"
                >
                  Reset all
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="rounded-pill text-[0.7rem] font-accent uppercase tracking-[0.08em] text-bg bg-accent hover:bg-text-1 px-5 py-2.5 transition-colors"
                >
                  View {filtered.length} cars
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RailItem({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // Pill, not a tab. The reference build runs an underlined rail here;
        // a filter is a control you toggle, and in this system controls are
        // round. Selected inverts to the ink-on-light state rather than
        // relying on a hairline, so the current marque is readable at a glance.
        "group/rail relative shrink-0 whitespace-nowrap rounded-pill border px-4 py-2 text-[0.8rem] font-medium font-accent uppercase tracking-[0.05em] transition-colors",
        active
          ? "border-mark bg-mark text-white"
          : "border-border text-text-2 hover:border-text-2 hover:text-text-1"
      )}
    >
      {label}
      <span
        className={cn(
          "ml-1.5 tabular-nums text-[0.72rem] font-medium",
          // The selected pill is now a solid blue, so its tally sits in white
          // at reduced strength rather than in the ground colour.
          active ? "text-white/60" : "text-text-3"
        )}
      >
        {count}
      </span>

    </button>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      // The tag carries the accent because the tag is the state — what the
      // catalogue is currently showing. Reset beside it stays neutral: it is
      // the way out, not the thing to invite. Accent as a setting, not a flood.
      className="group inline-flex items-center gap-2 rounded-pill border border-mark-soft/40 bg-mark-soft/10 px-3.5 py-1.5 font-accent text-[0.75rem] uppercase tracking-[0.12em] text-mark-soft transition-colors hover:border-mark-soft/70 hover:bg-mark-soft/20"
    >
      {label}
      <X size={12} strokeWidth={1.5} />
    </button>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-[0.7rem] font-accent uppercase tracking-[0.08em] border transition-colors",
        active
          ? "bg-accent text-bg border-accent"
          : "border-border text-text-2 hover:border-accent hover:text-accent"
      )}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* In the accent, like every field label on the site — it is the one
          part of a control panel a person scans rather than reads. */}
      <h4 className="mb-3 font-accent text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mark-soft">
        {label}
      </h4>
      {children}
    </div>
  );
}

function RangeInput({
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
}: {
  value: number | null;
  onChange: (n: number | null) => void;
  placeholder: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="flex items-center gap-2 border border-border focus-within:border-accent transition-colors px-3 py-2.5">
      {prefix && (
        <span className="text-[0.7rem] font-accent uppercase tracking-[0.08em] text-text-3">
          {prefix}
        </span>
      )}
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") return onChange(null);
          const n = Number(v);
          onChange(Number.isFinite(n) ? n : null);
        }}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus-visible:outline-none tracking-[0.04em] min-w-0"
      />
      {suffix && (
        <span className="text-[0.65rem] font-accent uppercase tracking-[0.08em] text-text-3">
          {suffix}
        </span>
      )}
    </label>
  );
}
