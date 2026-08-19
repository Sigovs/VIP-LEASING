import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The card is generated once from a file on disk — nothing request-dependent.
// Declaring it static is what lets `output: export` bake it into the build.
export const dynamic = "force-static";

// Branded social share card (link previews on iMessage, Slack, X, Facebook,
// LinkedIn): the wordmark, centered on a clean dark ground. The logo SVG
// ships in near-black, so we recolor its fills to off-white for the dark card
// (satori has no `filter: invert()`). Rendered once at build time.

export const alt = "VIP Leasing — Exotic & Performance Cars, South Florida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let logo = await readFile(join(process.cwd(), "public/logo.svg"), "utf-8");
  logo = logo.replace(/fill="rgb\([^)]*\)"/g, 'fill="#eceef0"');
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString(
    "base64",
  )}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0c0d0f",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={620} height={177} />
      </div>
    ),
    { ...size },
  );
}
