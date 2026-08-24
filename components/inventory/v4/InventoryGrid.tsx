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
import { SelectShell } from "@/components/ui/SelectShell";
import { optionCls } from "@/lib/formStyles";
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

// The rail's own select: a box like the keyword field beside it, not the
// underline the page forms use. In a panel this dense a hairline under a value
// reads as a divider rather than as a field.
const railSelectCls =
  "w-full cursor-pointer appearance-none rounded-md border border-white/[0.14] bg-bg/60 px-3.5 py-2.5 pr-9 text-sm text-text-1 transition-colors focus:border-white/40 focus:outline-none";

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
  // The rail was taller than the first two lots put together. Search and marque
  // answer most of it; the rest folds away. Opens by itself when one of the
  // folded filters is already set, so a filter can never be active and hidden
  // at the same time.
  const [moreOpen, setMoreOpen] = useState(
    () => countDrawerFilters(parseParams(new URLSearchParams(searchParams.toString()))) > 0,
  );
  const [sortOpen, setSortOpen] = useState(false);
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
      <div className="flex items-center gap-2.5 rounded-md border border-white/[0.14] bg-bg/60 px-3.5 py-2.5 transition-colors focus-within:border-white/40">
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

          <FilterGroup label="Year">
            <div className="grid grid-cols-2 gap-3">
              <RangeInput
                placeholder="From"
                value={state.minYear}
                onChange={(n) => setState((s) => ({ ...s, minYear: n }))}
              />
              <RangeInput
                placeholder="To"
                value={state.maxYear}
                onChange={(n) => setState((s) => ({ ...s, maxYear: n }))}
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

        {/* Active drawer-filter chips (make is shown in the rail, not here). */}
        {drawerCount > 0 && (
          <Container className="flex flex-wrap items-center gap-2 pb-4">
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
              onClick={() =>
                setState((s) => ({
                  ...EMPTY,
                  q: s.q,
                  makes: s.makes,
                  sort: s.sort,
                }))
              }
              className="ml-1 text-[0.65rem] font-accent uppercase tracking-[0.08em] text-text-3 hover:text-text-1 transition-colors"
            >
              Clear filters
            </button>
          </Container>
        )}
      </div>

      <Container className="py-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* The rail. Everything the toolbar used to shout is here instead,
              open and legible, in the order a buyer narrows: what marque, then
              what it costs, then the rest. Nothing is hidden behind a button. */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="lg:sticky lg:top-28">
              {/* A panel, not a bare column. Contained, it reads as one
                  instrument standing beside the catalogue rather than as loose
                  controls floating next to it.

                  It needs a real value step to be seen. The first pass used
                  --surface on the page ground: #131417 against #0c0d0f, seven
                  units per channel, which on a dark screen is nothing — Alex
                  looked straight at it and asked where the card was. So the
                  panel needed a shade of its own, not a stronger edge.

                  #1e2229 is that shade: 1.22:1 against the page, where --surface
                  managed 1.06 and chrome-surface-2 1.09 — both of which are the
                  same colour as far as an eye is concerned. A literal value and
                  not a token, because the system has no step this size between
                  the page ground and a raised panel; if a second panel ever
                  wants it, it becomes one. */}
              <div className="rounded-md border border-white/[0.10] bg-[#1e2229] p-6 shadow-[0_2px_0_rgba(255,255,255,0.045)_inset,0_28px_60px_-34px_rgba(0,0,0,0.95)]">
              {searchField}

              {/* Year, Make, Model — the three questions a buyer actually
                  arrives with, visible without opening anything. The vertical
                  marque list they replace was six rows tall and answered only
                  one of the three. */}
              <div className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2.5 block font-accent text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mark-soft">
                    Year
                  </span>
                  <SelectShell>
                    <select
                      value={state.year ?? ""}
                      onChange={(e) =>
                        setState((st) => ({
                          ...st,
                          year: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      className={railSelectCls}
                    >
                      <option value="" className={optionCls}>
                        Any year
                      </option>
                      {years.map((y) => (
                        <option key={y} value={y} className={optionCls}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </SelectShell>
                </label>

                <label className="block">
                  <span className="mb-2.5 block font-accent text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mark-soft">
                    Make
                  </span>
                  <SelectShell>
                    <select
                      value={activeMake ?? ""}
                      onChange={(e) => selectMake(e.target.value || null)}
                      className={railSelectCls}
                    >
                      <option value="" className={optionCls}>
                        All makes ({vehicles.length})
                      </option>
                      {marques.map((m) => (
                        <option key={m} value={m} className={optionCls}>
                          {m} ({makeCounts.get(m) ?? 0})
                        </option>
                      ))}
                    </select>
                  </SelectShell>
                </label>

                <label className="block">
                  <span className="mb-2.5 block font-accent text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mark-soft">
                    Model
                  </span>
                  <SelectShell>
                    <select
                      value={state.model}
                      onChange={(e) =>
                        setState((st) => ({ ...st, model: e.target.value }))
                      }
                      className={railSelectCls}
                    >
                      <option value="" className={optionCls}>
                        All models
                      </option>
                      {models.map((m) => (
                        <option key={m} value={m} className={optionCls}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </SelectShell>
                </label>
              </div>

              {moreOpen && (
                <div className="mt-8 space-y-8 border-t border-border pt-8">
                  {filterFields}
                </div>
              )}

              <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  className="group inline-flex items-center gap-2 font-accent text-[0.8125rem] uppercase tracking-[0.14em] text-text-1 transition-colors hover:text-mark-soft"
                >
                  {moreOpen ? "Fewer options" : "More search options"}
                  <ChevronDown
                    size={15}
                    strokeWidth={1.75}
                    className={cn(
                      "transition-transform duration-300",
                      moreOpen && "rotate-180",
                    )}
                  />
                </button>

                {(drawerCount > 0 || activeMake || state.q) && (
                  <button
                    type="button"
                    onClick={reset}
                    className="shrink-0 font-accent text-[0.8125rem] uppercase tracking-[0.14em] text-text-3 transition-colors hover:text-text-1"
                  >
                    Reset
                  </button>
                )}
              </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
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
          // Two across, not three, and the gap is air rather than a gutter
          // between cards. See the "lot" variant in this fork's VehicleCard for
          // why the whole page changed register.
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
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
      className="inline-flex rounded-pill items-center gap-2 text-[0.7rem] font-accent uppercase tracking-[0.08em] text-accent bg-accent-soft border border-accent/40 px-3 py-1.5 hover:bg-accent hover:text-bg transition-colors"
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
      <h4 className="mb-4 font-accent text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mark-soft">
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
