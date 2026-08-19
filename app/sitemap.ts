import type { MetadataRoute } from "next";
import { getAllVehicles } from "@/lib/vehicles";

// The sitemap is derived from a JSON file at build time — it never varies per
// request. Saying so explicitly is what lets `output: export` (the GitHub Pages
// preview) emit it as a file instead of refusing to build.
export const dynamic = "force-static";

const BASE = "https://thevipleasing.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/inventory",
    "/sold",
    "/sell",
    "/financing",
    "/service",
    "/about",
    "/contact",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const vehicleRoutes = getAllVehicles().map((v) => ({
    url: `${BASE}/inventory/${v.slug}`,
    lastModified: new Date(v.acquiredDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
