// The option lists behind every vehicle field on the site.
//
// One source, because the same four questions are asked in three places — the
// homepage starter, the full form on /sell, and anywhere else a car has to be
// described. Three copies of a year list is three chances for them to disagree.
//
// Why these are selects and not text: a make typed by hand arrives as
// "Mercedes", "Mercedes-Benz", "MB" and "mercedes benz", and every one of them
// has to be read by a person before it is worth anything. A mileage band is
// also the honest question — nobody knows the odometer to the mile when they
// are filling in a form on a phone, and asking for a number implies a precision
// the answer will not have.

import { BRANDS } from "@/lib/brands";

/** The newest year offered. Baked at build time — a static export freezes it,
 *  and each deploy moves it on. */
const NEWEST = new Date().getFullYear() + 1;
const OLDEST_LISTED = 1996;

export const YEARS: string[] = [
  ...Array.from({ length: NEWEST - OLDEST_LISTED + 1 }, (_, i) =>
    String(NEWEST - i),
  ),
  `${OLDEST_LISTED - 1} or older`,
];

/** The marques the showroom carries, first, because they are the specialty. */
export const MAKES_HOUSE: string[] = BRANDS.map((b) => b.name);

/** Everything else worth naming. Kept to performance, luxury and collector
 *  marques: the section above this form says the house buys collector and
 *  exotic cars, and a list running to family saloons would say otherwise. */
export const MAKES_OTHER: string[] = [
  "Alfa Romeo",
  "Audi",
  "BMW",
  "Chevrolet",
  "Dodge",
  "Ford",
  "Jaguar",
  "Koenigsegg",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Lucid",
  "Nissan",
  "Pagani",
  "Rimac",
  "Tesla",
];

export const MAKE_FALLBACK = "Other / not listed";

/** Bands, not a number. See the note at the top. */
export const MILEAGE_BANDS: string[] = [
  "Under 5,000",
  "5,000 – 15,000",
  "15,000 – 30,000",
  "30,000 – 50,000",
  "50,000 – 80,000",
  "Over 80,000",
];

export const CONDITIONS: string[] = [
  "Excellent",
  "Very good",
  "Good",
  "Fair",
  "Project",
];
