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
