"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BRANDS, BRAND_REST, BRAND_LIT, logoSrc, type Brand } from "@/lib/brands";

// The marques under "Find yours" — the last thing on the page before the footer,
// and the closing argument: this is the floor.
//
// ── One scene ────────────────────────────────────────────────────────────────
// A single pinned stage with a fixed camera. The statement arrives centred, rises
// into the title position and STAYS there; underneath it six marques take their
// turn, each bringing its own car; then every marque we carry assembles and the
// inventory link closes it.
//
//   intro → pinned title → six marque/car chapters → the whole floor → inventory
//
// The title not scrolling away is what turns this from a sequence of banners into
// one scene: there is a thing on screen that never moves, so everything that does
// move reads as happening INSIDE something rather than as the next slide.
//
// It was ten marks on one unchanging photograph before, over eight screens. That
// was both too long and too static — by the fourth mark nothing new was being
// said. Six chapters carry more per beat and cost half the scroll.
//
// ── The cadence ──────────────────────────────────────────────────────────────
// Everything is measured in SCREENS (the stage's own height), never in fractions
// of the track, so the tempo is identical on a laptop and a phone and cannot be
// re-timed by an edit to the track's length. u is a chapter's position in slots:
// u = 0 is dead centre, u = -1 one chapter below, u = +1 one above.
//
// Travel is LINEAR in u — scroll slowly and the marque rises slowly, stop and it
// stops. Opacity, blur and scale are what DWELL: they hold flat through the
// middle of the slot, so the marque drifts gently while fully readable and then
// leaves quickly. That is what keeps one mark dominant instead of two half
// visible ones, and it avoids the stop-start of freezing the travel itself.
// The overture and the title's climb share this. "Find yours" holds the first
// stretch of it, the statement takes the rest, and the first marque lands at the
// end — two beats on ONE ground instead of two headlines on two black screens.
const LEAD = 0.72;
const OVERTURE = 0.42; // fraction of LEAD that "Find yours" owns
const OUTRO = 0.85; // screens from the last chapter to the portfolio at rest
const DWELL = 0.3; // |u| inside which a marque is at full strength
const GONE = 0.78; // |u| at which it has completely left
const TRAVEL = 0.28; // screens it drifts across one whole slot
const BLUR = 14; // px it arrives out of and leaves into

// How far out of focus the first chapter is held before the sequence starts.
// It was 48, which on a photograph this dark is indistinguishable from black —
// the opening read as an empty screen rather than as a picture resolving. 26
// still hides the car and lets you see that there IS one.
const OPEN_BLUR = 26;

// Peak defocus at a handover. The section already opens by pulling focus, so
// the marques change the same way rather than cross-dissolving: the world goes
// soft, the car is swapped inside the softness, the world comes back. One
// camera doing one thing, instead of a focus pull at the top and a slideshow
// underneath it. The mark itself stays sharp — it is the subject; the room is
// what refocuses.
const SWAP_BLUR = 18;

// The car dissolves during the handover and holds either side of it, so the
// picture settles for as long as the mark does. Sitting inside the mark's own
// fade is what makes the swap read as one event rather than two.
const CAR_IN = 0.3;
const CAR_OUT = 0.72;

// The marque lamp, and it is OFF. It earned its keep when every chapter shared
// one grey photograph and the colour had to come from somewhere. The supplied
// campaign arrives lit per marque — Ferrari red, Porsche cyan, McLaren amber,
// Maserati navy — so a wash on top only argued with the photography.
//
// Zero rather than deleted: the wiring is a few lines, and the day a marque
// arrives without a colour of its own this is where it comes back.
const AMBIENT = 0;

// The three fixed heights of the scene, as % of the stage. The title holds the
// top, the marque takes the middle, the car owns everything below — and every
// chapter frame is cropped so its roofline falls under MARK_AXIS + the mark's own
// half-height, which is what stops a mark ever landing on bodywork.
// TITLE_AXIS clears the site header — at 15% the eyebrow sat behind it, which
// is the sort of thing only a render tells you. MARK_AXIS is then the largest
// mark that still fits between the title's baseline and the rooflines, and the
// crops above are cut to match: every car's roof falls at ~58%, just under the
// mark's lowest edge.
const TITLE_AXIS = 19;
const MARK_AXIS = 43;

// ── The six chapters ─────────────────────────────────────────────────────────
// Alex supplied these as a set, and they are the reason this section works: one
// hall, one camera, one height, one distance, shot six times with a different
// car and a different colour of light in it. Head-on, car dead centre, wet floor
// throwing the rim light back — nothing here needed cropping into agreement.
//
// That replaced a rescue job. The chapters used to be six unrelated frames from
// the scene library — a loft, an industrial hall, a garage, a service tunnel, a
// bridge at night — hauled towards each other with per-frame zoom, crop, a
// horizontal flip to make one car face the right way, and a per-frame dim to
// stop one tunnel out-glowing the rest. It read as one campaign from a distance
// and never quite up close. zoom and pos are kept because the framing controls
// are worth having, but every chapter now sits at 1 / centre: the photographs
// already agree.
// FRAMING. A chapter is framed as: cover-fit the photograph to a canvas of
// (stage x zoom), then show a stage-sized window of it whose top-left sits at
// (canvas - stage) * pos. In CSS that is a wrapper sized zoom*100% offset by
// -(zoom-1)*pos, holding an object-cover image.
//
// Deliberately NOT `transform: scale()` on the image. scale() magnifies about
// the element's centre, so a pos nudge moves the picture less than it should;
// the offline tool that tuned these crops modelled the window directly and the
// two disagreed, which put every car ~4% of the stage too high on the page.
type Chapter = {
  brand: string;
  src: string;
  alt: string;
  // The magnification, and which point of the magnified frame the stage
  // shows — both as fractions. See FRAMING below for why it is not a scale().
  zoom: number;
  pos: [number, number];
  flip?: boolean;
  dim?: number;
};

const CHAPTERS: Chapter[] = [
  {
    brand: "Ferrari",
    src: "/site/marque-ferrari.jpg",
    alt: "A red Ferrari head-on in a dark hall",
    zoom: 1,
    pos: [0.5, 0.5],
  },
  {
    brand: "Lamborghini",
    src: "/site/marque-lamborghini.jpg",
    alt: "A green Lamborghini head-on in a dark hall",
    zoom: 1,
    pos: [0.5, 0.5],
  },
  {
    brand: "Porsche",
    src: "/site/marque-porsche.jpg",
    alt: "A blue Porsche 911 head-on in a dark hall",
    zoom: 1,
    pos: [0.5, 0.5],
  },
  {
    brand: "McLaren",
    src: "/site/marque-mclaren.jpg",
    alt: "An orange McLaren head-on in a dark hall",
    zoom: 1,
    pos: [0.5, 0.5],
  },
  {
    brand: "Mercedes-AMG",
    src: "/site/marque-mercedes-amg.jpg",
    alt: "A Mercedes-AMG GT head-on in a dark hall",
    zoom: 1,
    pos: [0.5, 0.5],
  },
  {
    brand: "Maserati",
    src: "/site/marque-maserati.jpg",
    alt: "A Maserati GranTurismo head-on in a dark hall",
    zoom: 1,
    pos: [0.5, 0.5],
  },
];

// The wrapper geometry for a chapter's framing — see FRAMING above.
const frame = (c: Chapter): React.CSSProperties => ({
  width: `${c.zoom * 100}%`,
  height: `${c.zoom * 100}%`,
  left: `${-(c.zoom - 1) * c.pos[0] * 100}%`,
  top: `${-(c.zoom - 1) * c.pos[1] * 100}%`,
});

const byName = (name: string): Brand =>
  BRANDS.find((b) => b.name === name) ?? BRANDS[0];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
// Smoothstep — zero velocity at both ends, so nothing snaps into or out of hold.
const smooth = (v: number) => v * v * (3 - 2 * v);

// The statement, in the one place it is written. It appears twice — pinned inside
// the stage, and again at the head of the static reduced-motion telling — and
// those two must never drift apart.
function Statement({ className }: { className?: string }) {
  return (
    <div className={className}>
      <span className="block text-xs font-accent tracking-[0.24em] text-chrome-text-2">
        What We Carry
      </span>
      <span aria-hidden className="mx-auto mt-6 block h-0.5 w-12 bg-mark" />
      <h2 className="mt-7 font-title text-3xl font-bold tracking-[-0.02em] text-chrome-text-1 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] md:text-5xl">
        The marques on the floor
      </h2>
    </div>
  );
}

function Mark({ brand, className }: { brand: Brand; className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={logoSrc(brand, BRAND_LIT)}
      alt={brand.name}
      loading="lazy"
      style={{ transform: `scale(${brand.scale ?? 1})` }}
      className={
        "block max-h-full max-w-full object-contain opacity-90 " +
        "[filter:drop-shadow(0_0_18px_rgba(0,0,0,0.9))_drop-shadow(0_0_46px_rgba(0,0,0,0.7))] " +
        (className ?? "")
      }
    />
  );
}

export function ClosingBrands() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overtureRef = useRef<HTMLDivElement>(null);
  const carRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markRefs = useRef<(HTMLDivElement | null)[]>([]);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const title = titleRef.current;
    const overture = overtureRef.current;
    const portfolio = portfolioRef.current;
    const still = staticRef.current;
    if (!track || !stage || !scene || !title || !overture || !portfolio || !still)
      return;

    const cars = carRefs.current.filter(Boolean) as HTMLDivElement[];
    const lights = lightRefs.current.filter(Boolean) as HTMLDivElement[];
    const marks = markRefs.current.filter(Boolean) as HTMLDivElement[];
    const n = marks.length;
    if (!n) return;

    // Reduced motion is NOT the sequence played slowly, and it is not the ending
    // on its own either: it is the same story told as a page. The statement, the
    // six marques each with their car, the full floor, the link — in that order,
    // stacked, nothing moving. The hierarchy survives; only the pacing goes.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.display = "none";
      still.hidden = false;
      return;
    }

    let queued = false;
    const update = () => {
      queued = false;
      const screen = stage.offsetHeight;
      if (!screen) return;

      const travelled = clamp(
        -track.getBoundingClientRect().top,
        0,
        track.offsetHeight - screen
      );
      const at = travelled / screen;

      // The slot falls out of the track's own height, so the CSS and the JS can
      // never drift apart: whatever room the track has, the chapters divide what
      // is left after the intro and the hand-off.
      const usable = track.offsetHeight / screen - 1;
      const slot = Math.max(0.2, (usable - LEAD - OUTRO) / (n - 1));

      // The title: centred and large for the intro beat, then up to its working
      // position, then fixed for the rest of the scene. It never fades — that is
      // the whole point of it.
      // The overture leaves, then the statement climbs. They overlap slightly so
      // the ground is never holding nothing.
      const over = 1 - smooth(clamp(at / (LEAD * OVERTURE), 0, 1));
      overture.style.opacity = over.toFixed(3);
      overture.style.transform = `translate3d(0, ${(-(1 - over) * 0.07 * screen).toFixed(1)}px, 0) scale(${(0.96 + 0.04 * over).toFixed(3)})`;
      overture.style.visibility = over < 0.004 ? "hidden" : "visible";
      overture.style.pointerEvents = over > 0.85 ? "auto" : "none";

      // The statement needs its own fade, or both display lines are centred and
      // full strength at once and they print straight through each other. It
      // comes up as the overture goes down, then climbs — and once it is up it
      // never leaves again, which is the whole job of it.
      const titleIn = smooth(clamp((at - LEAD * OVERTURE * 0.55) / (LEAD * 0.34), 0, 1));
      const t = smooth(clamp((at - LEAD * OVERTURE * 0.8) / (LEAD * 0.5), 0, 1));
      title.style.opacity = titleIn.toFixed(3);
      title.style.visibility = titleIn < 0.004 ? "hidden" : "visible";
      title.style.transform =
        `translate3d(0, ${((1 - t) * (50 - TITLE_AXIS) * screen) / 100}px, 0)` +
        ` scale(${(1 + (1 - t) * 0.2).toFixed(3)})`;

      // The portfolio first, because the scene fades out under it.
      const last = LEAD + (n - 1) * slot;
      const p = clamp((at - (last + slot * 0.5)) / (OUTRO * 0.62), 0, 1);
      const pe = smooth(p);
      portfolio.style.opacity = pe.toFixed(3);
      portfolio.style.transform = `translate3d(0, ${((1 - pe) * 0.04 * screen).toFixed(1)}px, 0)`;
      portfolio.style.visibility = pe < 0.004 ? "hidden" : "visible";
      portfolio.style.pointerEvents = pe > 0.6 ? "auto" : "none";

      // THE OPENING. There is no separate intro picture: the first chapter is
      // already on screen, held far out of focus, and it pulls into focus over the
      // lead-in while the title climbs. So the section does not cut from a holding
      // frame into the sequence — it arrives at it.
      //
      // The slight scale-up rides along because a blurred layer samples past its
      // own edges: without it the frame shows a soft grey border while the blur is
      // heavy. It is not a zoom — by the time the picture is sharp it is gone.
      const entry = smooth(clamp(at / (LEAD * 0.82), 0, 1));
      const soft = (1 - entry) * OPEN_BLUR;
      scene.style.opacity = (1 - pe).toFixed(3);

      // Which car is on, and how far into the dissolve. car[k] stays opaque and
      // car[k+1] fades in over it, so the black underneath is never exposed
      // mid-swap the way two independent fades would expose it.
      const s = clamp((at - LEAD) / slot, 0, n - 1);
      const k = Math.min(n - 2, Math.floor(s));
      const raw = clamp((s - k - CAR_IN) / (CAR_OUT - CAR_IN), 0, 1);
      const f = smooth(raw);
      // A sine bell over the handover: zero at both ends, one in the middle, so
      // the defocus peaks exactly where the two photographs are half and half.
      const rack = SWAP_BLUR * Math.sin(Math.PI * raw);
      cars.forEach((el, i) => {
        const o = i < k ? 0 : i === k ? 1 : i === k + 1 ? f : 0;
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.004 ? "hidden" : "visible";
      });

      // Opening defocus and handover defocus are the same lens, so they take the
      // larger of the two rather than stacking into mush.
      const blurNow = Math.max(soft, rack);
      scene.style.filter = blurNow > 0.1 ? `blur(${blurNow.toFixed(1)}px)` : "none";
      scene.style.transform = `scale(${(1 + blurNow / 260).toFixed(4)})`;

      let lit = -1;
      let litStrength = 0;

      marks.forEach((el, i) => {
        const u = (at - (LEAD + i * slot)) / slot;
        const a = clamp((Math.abs(u) - DWELL) / (GONE - DWELL), 0, 1);
        const e = smooth(a); // 0 while held, 1 once gone
        const on = 1 - e;

        el.style.opacity = on.toFixed(3);
        el.style.transform =
          `translate3d(0, ${(-u * TRAVEL * screen).toFixed(1)}px, 0)` +
          ` scale(${(0.94 + 0.06 * on).toFixed(3)})`;
        el.style.filter = e > 0.001 ? `blur(${(e * BLUR).toFixed(2)}px)` : "none";
        el.style.visibility = on < 0.004 ? "hidden" : "visible";

        if (on > litStrength) {
          litStrength = on;
          lit = i;
        }
      });

      // One lamp up at a time, cross-fading through the handover. Squared, so the
      // light is already going while the mark is still readable — the colour must
      // never be the thing you notice.
      lights.forEach((el, i) => {
        const v = i === lit ? litStrength : 0;
        el.style.opacity = (AMBIENT * v * v).toFixed(4);
      });
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* The track is only scroll distance: a short intro, six chapters, and the
          hand-off to the portfolio. It was 5 screens and read as a march — the
          section in front of it had already spent most of a screen on a headline
          over nothing, so by the time the cars arrived the scroll had gone quiet
          for too long. Shorter, and the quiet part is gone rather than merely
          faster. */}
      <div ref={trackRef} className="relative h-[430svh] md:h-[480svh]">
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] w-full overflow-hidden"
        >
          {/* The scene: cars, one grade over all of them, and the marque's lamp.
              `isolation` keeps the lamp's blend inside this stack — it has to see
              the photograph to react to it, and must not reach the page. */}
          <div
            ref={sceneRef}
            aria-hidden
            className="absolute inset-0"
            style={{ opacity: 0, isolation: "isolate" }}
          >
            {CHAPTERS.map((c, i) => (
              <div
                key={c.brand}
                ref={(el) => {
                  carRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ opacity: 0, visibility: "hidden" }}
              >
                <div className="absolute" style={frame(c)}>
                  <Image
                    src={c.src}
                    alt=""
                    fill
                    quality={80}
                    sizes={`${Math.round(c.zoom * 100)}vw`}
                    className="object-cover object-center"
                    style={c.flip ? { transform: "scaleX(-1)" } : undefined}
                  />
                </div>
                {c.dim ? (
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: c.dim }}
                  />
                ) : null}
              </div>
            ))}

            {/* The grade. It was doing heavy lifting when the chapters came
                from six different rooms; the supplied campaign is one room shot
                six times, already low-key, so this is now only what seats the
                type — a light hand overall and a deeper fall at the top, where
                the title and the mark live. Every car sits below it. */}
            <div className="absolute inset-0 bg-black/26" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(72% 44% at 50% 30%, rgba(8,9,10,0.5) 0%, rgba(8,9,10,0.18) 58%, rgba(8,9,10,0) 88%)",
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-[62vh]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(9,10,11,0.82) 0%, rgba(9,10,11,0.54) 46%, rgba(9,10,11,0) 100%)",
              }}
            />

            {/* The lamps. `overlay` reads the picture beneath: the lit flanks and
                the wet floor take the colour, the black stays black. */}
            {CHAPTERS.map((c, i) => {
              const rgb = byName(c.brand).ambient ?? "140 150 160";
              return (
                <div
                  key={c.brand}
                  ref={(el) => {
                    lightRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{
                    opacity: 0,
                    mixBlendMode: "overlay",
                    background: `radial-gradient(66% 44% at 50% 72%, rgb(${rgb}) 0%, rgba(${rgb} / 0.44) 46%, rgba(0 0 0 / 0) 78%)`,
                  }}
                />
              );
            })}
          </div>

          {/* The overture. "Find yours" was a mass of its own — a display line
              alone on black for most of a screen, handing nothing to the display
              line alone on black that came next. Here it opens the same scene the
              marques run in, over the first car held out of focus, and hands over
              to the statement as the title climbs. One ground, two beats. */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
            <div ref={overtureRef} style={{ willChange: "transform, opacity" }}>
              <h2 className="title-mark mx-auto max-w-[14ch] text-balance font-title font-bold text-display-1 leading-[1.0] text-chrome-text-1">
                Find yours
              </h2>
              {/* Back, on Alex's call. It reads as a stutter against the
                  "Explore Inventory" that closes the section — two links to the
                  same place — but it is the only way into the inventory for a
                  reader who does not intend to scroll five screens, and that
                  reader is the one worth catching. Its pointer events are cut
                  the moment it starts to leave, so it can never be a target
                  that is half faded out. */}
              <Link
                href="/v4/inventory"
                className="group mt-10 inline-flex rounded-pill items-center gap-3 border border-white/35 px-9 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] md:text-[0.8rem] text-white transition-colors duration-300 hover:bg-white hover:text-chrome-bg md:px-11"
              >
                View the inventory
                <ChevronRight
                  className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.75}
                />
              </Link>
            </div>
          </div>

          {/* The title of the scene. Seated at its working height; the effect
              only moves the child, so the seating translate is never wiped. */}
          <div
            className="absolute inset-x-0 -translate-y-1/2 px-6 text-center"
            style={{ top: `${TITLE_AXIS}%` }}
          >
            <div
              ref={titleRef}
              style={{ willChange: "transform, opacity", opacity: 0 }}
              className="origin-center"
            >
              <Statement />
            </div>
          </div>

          {/* The marques. Same seating trick, one per chapter. */}
          {CHAPTERS.map((c, i) => {
            const b = byName(c.brand);
            return (
              <div
                key={c.brand}
                className="absolute inset-x-0 flex -translate-y-1/2 justify-center px-6"
                style={{ top: `${MARK_AXIS}%` }}
              >
                <div
                  ref={(el) => {
                    markRefs.current[i] = el;
                  }}
                  // Rendered in its resting state and only then driven by the
                  // effect — fail open. No JS and the marques are still here.
                  className="flex flex-col items-center"
                  style={{
                    willChange: "transform, opacity, filter",
                    ...(i === 0 ? null : { opacity: 0, visibility: "hidden" }),
                  }}
                >
                  {/* Nothing above the mark. It carried an "01 / 06" counter and
                      then the marque's name; both are gone. The counter turned a
                      procession into a progress meter, and the name was a caption
                      on a thing that does not need one — these are the most
                      recognised marks in the world, over their own cars. The name
                      still reaches a screen reader through the mark's alt text. */}

                  {/* The width is EXPLICIT and load-bearing — the trap the old
                      constellation fell into and left a note about. A flex column
                      with items-center gives its children a content-sized width,
                      and these marks are square svgs with a viewBox and no
                      intrinsic size: the box waits on the image, the image waits
                      on the box, and both settle at zero. Stating a width wider
                      than the height lets object-contain resolve the square to
                      the full height, which is what the optical scale is
                      calibrated against. */}
                  <div className="flex h-[clamp(78px,13vh,110px)] w-[min(78vw,290px)] items-center justify-center md:h-[clamp(126px,21vh,196px)] md:w-[500px]">
                    <Mark brand={b} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* The conclusion — the whole floor at once, under the same title that
              has been there all along, and this is where the four marques that
              never got a car of their own are seen. The marks drop back to the
              resting grey: the point of this frame is the SET, not any one. */}
          <div
            ref={portfolioRef}
            className="absolute inset-x-0 bottom-0 px-6"
            style={{ top: "27%", opacity: 0, visibility: "hidden" }}
          >
            {/* Anchored to the top of its band, not centred in it. Centring made
                the interval under the title a function of how tall the viewport
                happened to be — on a short screen it was fine, on a tall one the
                grid drifted far down and left a hole. Stated in svh, the interval
                is the same relationship everywhere. */}
            <div className="flex h-full flex-col items-center justify-start pt-[7svh] md:pt-[8svh]">
              <div className="grid w-full max-w-[1040px] grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-5 md:gap-x-10 md:gap-y-14">
                {BRANDS.map((b) => (
                  <div
                    key={b.name}
                    className="group relative flex h-12 items-center justify-center md:h-20"
                    title={b.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoSrc(b, BRAND_REST)}
                      alt={b.name}
                      loading="lazy"
                      style={{ transform: `scale(${b.scale ?? 1})` }}
                      className="block max-h-full w-auto object-contain opacity-65 transition-opacity duration-500 group-hover:opacity-0"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoSrc(b, BRAND_LIT)}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      style={{ transform: `scale(${b.scale ?? 1})` }}
                      className="absolute block max-h-full w-auto object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>

              {/* The resolution. Same pill the closing headline uses, so the
                  ending reads as one voice rather than a new component. */}
              <Link
                href="/v4/inventory"
                className="group mt-12 inline-flex rounded-pill items-center gap-3 border border-white/35 px-9 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white hover:text-chrome-bg md:mt-16 md:px-11 md:text-[0.8rem]"
              >
                Explore Inventory
                <ChevronRight
                  className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.75}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* The reduced-motion telling. Same story, same order, no motion: the
          statement, the six marques each over their own car, the whole floor,
          the link. Hidden until the effect finds the preference, so a visitor who
          has not asked for it never pays for the markup. */}
      <div ref={staticRef} hidden className="px-6 pb-4 pt-2">
        <Statement className="mx-auto max-w-[46rem] text-center" />

        <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
          {CHAPTERS.map((c) => {
            const b = byName(c.brand);
            return (
              <figure
                key={c.brand}
                className="relative aspect-[16/10] overflow-hidden rounded-md ring-1 ring-inset ring-white/[0.08]"
              >
                <div className="absolute" style={frame(c)}>
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    quality={78}
                    sizes="(min-width: 768px) 60vw, 120vw"
                    className="object-cover object-center"
                    style={c.flip ? { transform: "scaleX(-1)" } : undefined}
                  />
                </div>
                <div className="absolute inset-0 bg-black/45" />
                <figcaption className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4">
                  <div className="flex h-16 w-[min(60vw,220px)] items-center justify-center md:h-20">
                    <Mark brand={b} />
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="mx-auto mt-20 grid max-w-[1040px] grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-5 md:gap-x-10 md:gap-y-14">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="relative flex h-12 items-center justify-center md:h-20"
              title={b.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc(b, BRAND_REST)}
                alt={b.name}
                loading="lazy"
                style={{ transform: `scale(${b.scale ?? 1})` }}
                className="block max-h-full w-auto object-contain opacity-65"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/v4/inventory"
            className="group inline-flex rounded-pill items-center gap-3 border border-white/35 px-9 py-4 font-accent text-[0.75rem] font-medium tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white hover:text-chrome-bg md:px-11 md:text-[0.8rem]"
          >
            Explore Inventory
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>

      {/* No trailing spacer. The portfolio already sits with a quarter of a
          screen of air beneath it INSIDE the stage, so a hold out here only
          added a second helping of the same nothing before the footer. */}
    </>
  );
}
