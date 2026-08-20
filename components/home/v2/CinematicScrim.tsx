// Shared cinematic scrim stack for the paired image bands — the "cars worth
// owning" positioning band and the "Sell Your Car" band. Both fade IDENTICALLY;
// `side` flips the directional wash, the focused text pool, and the vignette so
// the dark field always sits under the text on the correct side.
//
// The text mirrors only at md+: both bands stack copy LEFT on mobile (no
// ml-auto), so a right-anchored desktop band must still darken the LEFT on a
// phone — else the headline lands on the bright half of the car. `mobileSide`
// lets a band flip its phone wash independently of the desktop one (defaults to
// `side`, so the left band needs no override).
//
// rgba literals only — a var() inside a gradient is silently dropped by
// Lightning CSS (see DESIGN.md). Keeping this in one place means the two bands
// can never drift apart.
type Side = "left" | "right";

function washFor(side: Side) {
  return side === "left"
    ? "linear-gradient(to right, rgba(8,9,10,0.9) 0%, rgba(8,9,10,0.68) 30%, rgba(8,9,10,0.32) 55%, rgba(8,9,10,0.04) 80%, rgba(8,9,10,0) 100%)"
    : "linear-gradient(to left, rgba(8,9,10,0.9) 0%, rgba(8,9,10,0.68) 30%, rgba(8,9,10,0.32) 55%, rgba(8,9,10,0.04) 80%, rgba(8,9,10,0) 100%)";
}

// Focused pool anchored behind the text column (mirrored per side).
function poolFor(side: Side) {
  return side === "left"
    ? "radial-gradient(72% 82% at 14% 50%, rgba(8,9,10,0.46) 0%, rgba(8,9,10,0.22) 46%, rgba(8,9,10,0) 78%)"
    : "radial-gradient(72% 82% at 86% 50%, rgba(8,9,10,0.46) 0%, rgba(8,9,10,0.22) 46%, rgba(8,9,10,0) 78%)";
}

// Vignette center nudged slightly toward the car so it still reads clear.
function vignetteFor(side: Side) {
  return side === "left"
    ? "radial-gradient(115% 115% at 48% 36%, rgba(8,9,10,0) 44%, rgba(8,9,10,0.4) 74%, rgba(8,9,10,0.72) 100%)"
    : "radial-gradient(115% 115% at 52% 36%, rgba(8,9,10,0) 44%, rgba(8,9,10,0.4) 74%, rgba(8,9,10,0.72) 100%)";
}

export function CinematicScrim({
  side,
  mobileSide = side,
}: {
  side: Side;
  mobileSide?: Side;
}) {
  const sameSide = mobileSide === side;

  return (
    <>
      {/* narrow mobile crop carries an extra flat tint the wide layout skips */}
      <div aria-hidden className="absolute inset-0 bg-black/25 md:hidden" />

      {/* Directional layers (wash · pool · vignette). When the phone and desktop
          share a side, render once; when they differ, render a mobile set
          (md:hidden) and a desktop set (hidden md:block) so the dark field
          tracks the copy at every breakpoint. */}
      {sameSide ? (
        <DirectionalScrim side={side} />
      ) : (
        <>
          <DirectionalScrim side={mobileSide} className="md:hidden" />
          <DirectionalScrim side={side} className="hidden md:block" />
        </>
      )}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(8,9,10,0.5) 0%, rgba(8,9,10,0) 62%)",
        }}
      />

      {/* The melt. A photo band should have no findable seam with the page around
          it — the ground colour should simply give way to the picture.

          Proportional (%), never fixed (px): a 112px fade on an 800px band reads
          as a hard edge with a smudge on it, and it gets worse the taller the
          band grows. And LONG — 44% down from the top, 55% up from the base,
          which is most of the frame. A short ramp is a visible object; a long one
          is invisible and does the same job. The intermediate stops matter as
          much as the length: a single from→transparent ramp stretched this far
          develops a shoulder, a band where the eye catches the break. Four stops
          keep it smooth the whole way.

          Same numbers as the FinancingBand and the closing band. The photo bands
          have to fade identically or the page reads as separate pictures pasted
          onto it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[44%]"
        style={{
          background:
            "linear-gradient(to bottom, rgb(12,13,15) 0%, rgba(12,13,15,0.85) 16%, rgba(12,13,15,0.5) 40%, rgba(12,13,15,0.18) 70%, rgba(12,13,15,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(to top, rgb(12,13,15) 0%, rgba(12,13,15,0.88) 18%, rgba(12,13,15,0.55) 42%, rgba(12,13,15,0.22) 70%, rgba(12,13,15,0) 100%)",
        }}
      />
    </>
  );
}

// The three side-dependent gradient layers, grouped so they can be toggled
// per breakpoint as a unit.
function DirectionalScrim({
  side,
  className = "",
}: {
  side: Side;
  className?: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="absolute inset-0" style={{ background: washFor(side) }} />
      <div className="absolute inset-0" style={{ background: poolFor(side) }} />
      <div className="absolute inset-0" style={{ background: vignetteFor(side) }} />
    </div>
  );
}
