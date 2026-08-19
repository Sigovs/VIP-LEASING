import { cn } from "@/lib/utils";

// Clean shimmer treatment of the wordmark, after 21st.dev "shimmer-text"
// (tom_ui / spell.sh). The logo SVG silhouette masks a two-layer background:
// a soft silver base plus a brighter highlight band that loops across via an
// animated background-position. Pure CSS; the sweep is gated behind
// prefers-reduced-motion in globals.css (see .shimmer-wordmark).
//
// The OUTER element owns the width (it's the flex item); the INNER element is
// width:100% so its aspect-ratio resolves against a definite width — an empty
// aspect-ratio box sized directly inside a flex column collapses to 0 height,
// so the wrapper is load-bearing.
export function ShimmerWordmark({ className }: { className?: string }) {
  return (
    <div role="img" aria-label="VIP Leasing" className={cn("block", className)}>
      <div className="shimmer-wordmark w-full" />
    </div>
  );
}
