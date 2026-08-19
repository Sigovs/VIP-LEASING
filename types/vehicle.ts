// 1:1 with the eventual ACF schema on WordPress. Add fields with care —
// every field here implies an ACF field group entry in HANDOFF.md.

export type OptionCategory =
  | "Exterior"
  | "Interior"
  | "Performance"
  | "Technology";

export interface VehicleOptionGroup {
  category: OptionCategory;
  items: string[];
}

export interface VehicleHistoryEvent {
  date: string; // ISO yyyy-mm-dd
  event: string; // short title (mono in UI)
  description: string; // body
}

export interface Vehicle {
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number; // USD
  mileage: number;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  transmission: string;
  drivetrain: string;
  engine: string;
  horsepower: number; // hp
  torque: number; // lb-ft
  zeroToSixty: number; // seconds
  topSpeed: number; // mph
  weight: number; // lb
  options: VehicleOptionGroup[];
  history: VehicleHistoryEvent[];
  story: string; // 2–4 sentence editorial intro
  heroImage: string;
  gallery: string[];
  isSold: boolean;
  isFeatured: boolean;
  isSpotlight?: boolean; // marks the single hero car in the home Featured spotlight
  acquiredDate: string; // ISO yyyy-mm-dd
}
