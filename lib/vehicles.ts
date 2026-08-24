import vehiclesData from "@/data/vehicles.json";
import type { Vehicle } from "@/types/vehicle";

const vehicles = vehiclesData as Vehicle[];

export function getAllVehicles(): Vehicle[] {
  return vehicles;
}

export function getActiveVehicles(): Vehicle[] {
  return vehicles.filter((v) => !v.isSold);
}

export function getFeaturedVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.isFeatured && !v.isSold);
}

// The single hero car for the home Featured spotlight. Controlled by the
// `isSpotlight` flag on one vehicle; falls back to the first featured car,
// then the first active car, so the spotlight is never empty.
export function getSpotlightVehicle(): Vehicle | undefined {
  return (
    vehicles.find((v) => v.isSpotlight && !v.isSold) ??
    getFeaturedVehicles()[0] ??
    getActiveVehicles()[0]
  );
}

// The Featured carousel's roster: the spotlight car first, then the rest of
// the featured ones. One entry is a valid answer — the component simply drops
// its strip and controls and reads as the single spotlight it used to be.
export function getSpotlightLineup(): Vehicle[] {
  const spotlight = getSpotlightVehicle();
  const rest = getFeaturedVehicles().filter((v) => v.slug !== spotlight?.slug);
  return spotlight ? [spotlight, ...rest] : rest;
}

export function getRecentlyAcquired(limit = 4): Vehicle[] {
  return [...vehicles]
    .filter((v) => !v.isSold)
    .sort(
      (a, b) =>
        new Date(b.acquiredDate).getTime() -
        new Date(a.acquiredDate).getTime()
    )
    .slice(0, limit);
}

export function getSoldVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.isSold);
}

// The Carfax report for a car, or null when it should not be offered.
//
// Derived from the VIN rather than stored, so there is no second copy of the
// same fact to fall out of step with the first — the VIN is already printed on
// the page, and the report is that VIN's history. A dealer who has been given a
// specific report link can override it per car with `carfaxUrl`.
//
// Null for a sold car, because the client asked for the link on active
// inventory only: a history report is something a buyer reads before deciding,
// and there is nothing left to decide on a car that has gone.
//
// ⚠️ The VINs in data/vehicles.json are placeholders — they end in XXX. The
// links this builds are therefore placeholders too, and resolve to Carfax's
// "no report for this VIN" page. They become real the moment real VINs land,
// with no code change. Nothing here is fabricated: the link is a function of
// the data the page already shows.
const CARFAX_REPORT = "https://www.carfax.com/VehicleHistory/p/Report.cfx?vin=";

export function carfaxReportUrl(v: Vehicle): string | null {
  if (v.isSold) return null;
  if (v.carfaxUrl) return v.carfaxUrl;
  if (!v.vin) return null;
  return `${CARFAX_REPORT}${encodeURIComponent(v.vin)}`;
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getSimilarVehicles(slug: string, limit = 3): Vehicle[] {
  const current = getVehicleBySlug(slug);
  if (!current) return [];
  return vehicles
    .filter(
      (v) => v.slug !== slug && !v.isSold && (v.make === current.make || Math.abs(v.price - current.price) < 150_000)
    )
    .slice(0, limit);
}

export function getMakes(): string[] {
  return Array.from(new Set(vehicles.map((v) => v.make))).sort();
}
