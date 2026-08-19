import { SITE_URL } from "@/lib/showroom";
import type { MetadataRoute } from "next";

// Constant output — emit it as a file so `output: export` can build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
