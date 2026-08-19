import type { NextConfig } from "next";

// The GitHub Pages preview is a STATIC EXPORT, and static hosting has two
// constraints the normal build doesn't:
//
//   1. No image optimizer. There is no server to run one, so <Image> has to be
//      told to serve the files as they are (`unoptimized`).
//   2. The site is served from a subdirectory — sigovs.github.io/vip-leasing-preview
//      — not from a domain root, so every asset and link needs that prefix or it
//      404s.
//
// Both are gated behind GITHUB_PAGES so they only apply to the preview build.
// `npm run dev` and any real deployment keep the optimizer and the root path.
// The preview lives in its OWN public repo (vip-leasing-preview) so this one can
// stay private: GitHub Pages on a free plan only serves public repos, and this
// repo carries the working notes and the session transcript. PAGES_BASE lets the
// deploy script point the build at whatever path the preview host serves from.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.PAGES_BASE ?? "/vip-leasing-preview";
// A subpath deploy needs the prefix everywhere; a root deploy (PAGES_BASE="" or
// "/") must have NO prefix — Next errors on an empty basePath, and every asset
// would 404 with a stray one. So the prefix is applied only when repo names a
// real subpath.
const subpath = isPages && repo !== "" && repo !== "/";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export" as const,
        ...(subpath ? { basePath: repo, assetPrefix: repo } : {}),
        // Export writes each route as a directory with an index.html, which is
        // what a plain static host expects to find behind a trailing slash.
        trailingSlash: true,
      }
    : {}),
  // Published to the client bundle so lib/asset.ts and lib/imageLoader.ts can
  // prefix the paths Next does not prefix for us (raw <video>, CSS url(), and
  // <Image> src once the optimizer is off).
  env: {
    NEXT_PUBLIC_BASE_PATH: subpath ? repo : "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults images.qualities to [75]; our <Image> usages request 82
    // and 85 (showcase galleries, closing-bg). List them so they aren't coerced
    // down to 75 and to silence the dev warning.
    qualities: [75, 82, 85],
    // A custom loader, NOT `unoptimized` — see lib/imageLoader.ts for why: it is
    // the only way the photographs keep their basePath on a subdirectory host.
    ...(isPages
      ? { loader: "custom" as const, loaderFile: "./lib/imageLoader.ts" }
      : {}),
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "api.mapbox.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
