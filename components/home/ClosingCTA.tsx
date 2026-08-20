import { ClosingBrands } from "@/components/home/ClosingBrands";

// Closing crescendo — the page's final beat, and the only pinned moment on it.
//
// This used to own a pinned photograph of a car and a scrubbed dissolve that
// darkened it, with "Find yours" held over it for a screen before the marques
// arrived. None of that is here any more, and the removals are the point:
//
//   · the photograph was a car belonging to none of the marques the section goes
//     on to show, and it was the first and last thing you saw;
//   · with it gone the dissolve had nothing to dissolve;
//   · with the dissolve gone the sticky layer that held them was an empty screen
//     of scroll that a reader had to travel through to reach anything.
//
// So the section is now a frame and nothing else. Everything — the ground, the
// statement, the six marque chapters, the whole floor, the link — lives inside
// ClosingBrands, on one pinned stage that starts at the top of this section.
//
// rgba literals only — a var() inside a gradient is silently dropped by
// Lightning CSS (DESIGN.md §7).
export function ClosingCTA() {
  return (
    <section className="chrome relative border-t border-border bg-chrome-bg">
      {/* Long fade in from the section above — the band has no findable seam.
          It sits over the stage rather than in front of it, which is why it is
          only as tall as the seam it hides. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[24vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgb(12,13,15) 0%, rgba(12,13,15,0.6) 34%, rgba(12,13,15,0) 100%)",
        }}
      />

      {/* The marques — one pinned stage carrying the entire closing. Deliberately
          NOT inside a Container: it is full-bleed, and the statement inside it
          carries its own. */}
      <div className="relative z-20">
        <ClosingBrands />
      </div>

      {/* Melt the very base into the paper-toned footer. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[22vh]"
        style={{
          background:
            "linear-gradient(to top, rgb(9,10,11) 0%, rgba(9,10,11,0.72) 34%, rgba(9,10,11,0.28) 68%, rgba(9,10,11,0) 100%)",
        }}
      />
    </section>
  );
}
