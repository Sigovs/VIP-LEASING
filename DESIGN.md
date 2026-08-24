# Design Language — VIP Leasing

The source of truth for how this site looks, moves, and feels. Where this doc and
an older note (e.g. `DECISIONS.md`) disagree, **this doc wins** — the visual
language has evolved past the original brief.

## 1. The feeling

Dark-luxury editorial for a top-tier exotic dealer. It should read like an
expensive, deliberately-built site. Premium comes from **craft and restraint**,
not from adding more.

## 2. Two-zone canvas

- **Body** — cool near-black (`--bg #0c0d0f`), cool off-white text. Most of the
  page. The ground is deliberately **cool**, not warm graphite: warm charcoal
  plus a gold accent is the default "make it luxury" palette, and it reads as
  one. Cold ink under warm bodywork is what a lit showroom floor actually looks
  like.
- **Chrome zones** — deeper black (`--chrome-bg #08090a`) for the hero, masthead,
  footer, and signature blocks. Add the `.chrome` class to flip focus rings to
  the on-chrome variant.
- **Grain** — a fixed 5%-opacity noise layer (`body::after`) sits over the whole
  page. It is what keeps a flat dark field from reading as a screen fill and
  starts it reading as printed stock. Dropped under `prefers-reduced-motion`.

Lock: one theme. Sections never invert to a light mode mid-page.

## 3. The accent rule (the most important one)

Two metals, and they have different jobs. **Confusing them is the fastest way to
make this site look cheap.**

**Platinum (`--accent #c6ccd2`) is the working colour.** It carries every hover,
hairline, underline wipe and active state. It is quiet — it says "this is
interactive", not "look at me".

**Oxblood (`--signal #96252d`) is the signal.** It appears on roughly 5% of the
ink on any screen and it always *means* something. If it is decorative, it is
wrong.

Where platinum lives:

- **Hero wordmark** — a cold shine sweeps across the platinum mark.
- **Nav** — a platinum hairline wipes in under the hovered / active item.
- **CTA strip** — hover is a soft platinum wash (`--accent-soft`) + arrow +
  underline wipe.
- **Hero button** — neutral glass.
- **Vehicle card** — hover lights the title + a hairline along the image's
  bottom edge.
- **Rules** — the short `h-px w-12` hairline that leads a section title.

**The price is not coloured.** It was oxblood; made legible it read as a discount
tag, and a red price on a $1.75m car is the wrong signal — houses that sell cars
like this state the number and stop. Size and weight already make it the loudest
thing in the column.

Where oxblood lives (and nowhere else):

- **SOLD** badge over photography — a SOLID oxblood box with white caps, not tinted
  text on a scrim. It is the one place the signal colour becomes a field rather
  than ink, and it earns that: SOLD is a fact about the car, it has to survive
  being laid over any photograph, and on the white studio cyclorama the old
  tinted-text-on-black-scrim version simply vanished.
- **Keyboard focus ring.**
- **The `.title-mark` period** that closes a section title — the one place it
  appears in running type, and it is literally a full stop.

Never: an oxblood hover, an oxblood fill on a whole element, oxblood as a
background. A red hover on every link turns the page into a warning label.

## 3b. The corner language

This is where the site stops being a copy of the build it was forked from. That
one is razor-edged everywhere; here corners carry meaning, and the meaning is a
division of labour rather than a decoration:

| | Radius | What takes it |
|---|---|---|
| **Actions are soft** | `rounded-pill` (9999px) | Buttons, CTAs, filter chips, the SOLD badge, the map's "Get Directions" tag |
| **Surfaces are eased** | `rounded-md` (12px) | Vehicle cards, media frames, lookbook and Instagram tiles, the map |
| **Small surfaces** | `rounded-sm` (8px) | Gallery thumbnails, lightbox strips |
| **Structure stays sharp** | none | Hairline grids, section rules, full-bleed photo bands, the page edges |

Three values, no others. A fourth radius is how a system starts drifting.

**Why the split.** A pill reads as a control at a glance, before the label is
read — that is the whole point of rounding an action. Surfaces get a *small*
radius on purpose: a large radius on a large dark panel reads consumer-app, and
this is an editorial page. And structure keeps its corners because rounding it
would round the page itself — a `gap-px` hairline grid with rounded cells breaks
at every corner, and the grid is the architecture, not a component.

**Consequences worth knowing:**

- A pill needs more horizontal padding than a rectangle. The round ends eat into
  the optical padding, so `Button`'s sizes went `px-7 → px-8` and `px-9 → px-10`.
- `:focus-visible` must not set its own `border-radius`. It used to pin 2px onto
  whatever was focused — harmless while everything was square, and it would now
  flatten a pill the moment it took keyboard focus. `outline` follows the
  element's own radius, so the ring hugs a pill correctly with nothing declared.
- An active pill inverts (`bg-text-1 text-bg`) rather than relying on a hairline.
  Anything *inside* it that was set in platinum has to change too — on the light
  ground platinum disappears. The inventory rail's tally uses `text-bg/55` when
  selected for exactly this reason.
- A card that clips its image needs the radius on the clipping parent, not on the
  image; `overflow-hidden` on the shell does the rest.

## 4. Type system

Two faces, each with one job (registered in `app/layout.tsx`, configured in
`app/globals.css`):

| Token | Face | Use |
| --- | --- | --- |
| `--font-sans` | **Archivo** | The voice. Body, nav, UI, numerics, and every heading below display rank. Sentence case, tracked tight (`-0.02em`) where it goes large. |
| `--font-title` | **Bodoni Moda** | The display cut and nothing else. A didone's hairlines vanish below about 28px, so subheads belong to Archivo. |
| `--font-accent` / `--font-mono` | **IBM Plex Mono** | The data texture: eyebrows, ceremonial labels, phone, address, spec keys, figures that want a machine voice. |

⚠️ This table was wrong for months — it still named **Inter Tight and Oswald**,
which the build stopped using when the display face changed. If you are reading
it to answer a question, check `app/layout.tsx` too: a stale system document is
worse than none, because it looks authoritative.

Retired along the way: **Cardo, Cinzel, Manrope, JetBrains Mono, Inter Tight,
Oswald**. A classical small-caps serif over a warm-gold dark theme is the house
style of every "premium" template on the internet, and four faces on one
marketing site reads as a font sampler.

Rule: **vehicle prices, mileage, and specs are set in Inter Tight with the
`tabular-nums` utility** — figures align in columns without a monospace texture.
Oswald survives only as the ALL-CAPS data texture (phone, address, eyebrows,
spec keys) — never on a price value.

### 4a. The size floor — 14px, and 12px for tracked caps

**Nothing that carries meaning is set below 14px. Nothing at all is set below
12px.**

Two sizes, and the reason they differ:

- **14px (`text-sm`) is the floor for anything a person reads to decide** —
  field labels, spec labels, spec values, engine lines, prices, body copy,
  control labels. If losing the words would cost the reader something, it is at
  least 14px.
- **12px (`text-[0.75rem]`) is the absolute floor, and only tracked uppercase
  micro-labels may use it** — "VIEW", "SOLD", a breadcrumb, a section eyebrow.
  Caps at wide tracking read a size smaller than their number suggests, and
  these are labels you glance at rather than read.

**Why this is written down.** The inventory surfaces had drifted to 9.6px on the
listing card and 9.9px on the vehicle page — a spec label at 9.9px standing next
to its own value at 28px, a ratio of 1 : 2.8. Contrast passed AA on paper
(4.6–4.9:1), which is exactly the trap: AA is defined for 14px and up, so a
passing number on nine-pixel type guarantees nothing. Alex caught it from a
screenshot; the audit found twenty-five instances across five files.

The cause was never one careless value. It was that `text-[0.6rem]` and
`text-[0.62rem]` and `text-[0.65rem]` all looked reasonable in isolation, in
five different files, with no floor written anywhere to measure them against.

**How to check.** In the console on any page:

```js
[...document.querySelectorAll('body *')]
  .filter(e => e.children.length === 0 && e.textContent.trim().length > 1
            && parseFloat(getComputedStyle(e).fontSize) < 12)
```

An empty array is the passing result.

**What went with it.** Two content faults surfaced in the same pass and are
recorded here because they are the same species — furniture that survived
because nobody measured it:

- The card's **photo counter** read "1" on all ten cards, because every gallery
  holds one image. Ten cards in a row telling a buyer we have one photograph of
  each car. Removed until real galleries arrive.
- Both **colour names were clipped on every card** — "Bianco Avus with Giallo
  Modena Stripe" became "Bianco Avus with Gi…". On an exotic the colour name is
  not a label, it is the spec the buyer came for. The tidy 2×2 grid became two
  short facts on one row and a full width row for each colour.

## 5. Motion principles

- **Content surfaces, it does not fade in.** The reveal is a long rise from
  below (90–160px), from slightly oversized (`scale 1.04`) and out of focus
  (`blur 14px`), settling on a 1.6s `expo.out` curve. The blur is what sells it
  — a plain fade-and-lift is the motion every template ships with.
  (`components/motion/Reveal.tsx`)
- **Photographs arrive soft and sharpen.** `ParallaxImage` runs two triggers: the
  vertical travel is scrubbed to the scrollbar (it must track the finger), while
  the focus pull runs once on its own clock, so it reads as a lens settling
  rather than a slider being dragged.
- **Reveals fail open.** Content renders visible in SSR; the motion is layered on
  by JS only for elements still below the fold. No JS, slow JS, or a JS error
  means content is always shown. Never gate content behind an animation.
- **Respect `prefers-reduced-motion`** everywhere — collapse to static / instant,
  and drop the grain.
- **Slow beats fast.** The wordmark shine is ~4s; the reveal is 1.6s. One
  motivated motion per moment, never motion for its own sake.
- Animate `transform`, `opacity` and `filter` only — and hand back `will-change`
  once an element has landed, or every revealed block keeps a compositor layer
  alive for the life of the page.

## 6. Component idioms (reuse these)

- **Shimmer wordmark** (`components/ui/ShimmerWordmark.tsx`) — the logo SVG masks
  a two-layer background (platinum base + cold highlight band) animated via
  `background-position`. Pure CSS. Reuse the mask technique for any logo-shaped
  metal / shine.
- **Platinum underline wipe** — `absolute inset-x-0 -bottom-0.5 h-px origin-left
  scale-x-0 bg-accent transition-transform group-hover:scale-x-100`. Used in the
  nav, CTA strip, and cards. GPU-friendly, no layout shift.
- **Glass button** — `border-white/25 bg-white/[0.06] backdrop-blur-md
  shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]`, brightening on hover. For CTAs
  over photographic / dark backgrounds.
- **Hairline grid** — `grid gap-px bg-border` with `bg-surface` cells gives clean
  1px dividers in every direction and handles responsive column counts for free.
- **Header float to frost** — transparent over the hero (with a top scrim for
  legibility), frosting to a solid bar on scroll (`components/layout/Header.tsx`).
- **Responsive labels** — long CTA labels carry a `short` field for the narrow
  mobile layout (`md:hidden` swap).

## 7. Build gotchas (Tailwind v4 + Turbopack / Lightning CSS)

Lightning CSS **silently drops a whole CSS rule** (no error in the dev log) when
it dislikes a declaration. Confirmed triggers — avoid both in `globals.css`:

1. The `mask` / `-webkit-mask` **shorthand with a `/`**. Use longhand
   (`mask-image`, `mask-size`, `mask-position`, `mask-repeat`, plus `-webkit-`
   pairs).
2. A `var(--x)` reference **inside a `linear-gradient()`** color stop. Inline the
   literal color instead.

Debug: if a class is present in `globals.css` but its styles are missing at
runtime, search `document.styleSheets[*].cssRules` — a dropped rule won't be
there even though the source looks fine.

## 8. Verifying design work

Run the app and look — screenshots beat assumptions. `npm run dev` (Turbopack),
then check the **resting and hover/scroll states**, and confirm both
`prefers-reduced-motion` and a no-JS load still show all content.

**Gotcha — full-page screenshots lie on Reveal pages.** `components/motion/Reveal.tsx`
uses GSAP ScrollTrigger, so a section only fades in once it scrolls into view. A
full-page capture (e.g. `agent-browser screenshot --full`) keeps the scroll at
the top, so every below-the-fold `Reveal` stays at `opacity: 0` and the shot
shows huge **blank** regions — the content is fine, it just never triggered. Do
NOT read that as a broken page (the VDP looks empty this way). To verify a long
page, scroll each section into view (`scrollIntoView`) and capture the viewport,
or temporarily force-reveal. The blank-capture is expected behaviour, not a bug.

## 9. Two rules this page learned the hard way

Both were promoted into the DNA (`design_dna` — TASTE.md §2c and
`content-provenance` CP7). They are repeated here because this is the page that
broke on them, and the next edit to it can break the same way.

### 9a. Read the page's asks, not just its intervals

Every section already differs on ground, type, borders, image treatment and
motion. That is not enough. Write down what each one **wants from the visitor**
— *nothing · read · browse · act* — and read the column down the page.

The homepage got to `featured car → sell us yours → lease it → the lineup`:
four masses, four asks in a row. Nothing in the section-by-section review
caught it, because each section was fine and the run was the problem. It reads
as a sales floor.

**Interval does not fix it.** More air between three offers spaces them; the
third is still the third thing wanting something. What separates them is being
a different *kind* of mass, so the change of register is the pause:

| section | kind | ask |
|---|---|---|
| Featured | photograph | browse |
| Sell Your Car | working surface — flat `paper` ground, type + form, no picture | act |
| Lease it or finance it | cinema — full-bleed photo band | read |

That is why `SellOffer` has no photograph and sits a tone lower than its
neighbours. Putting an image in it would collapse it back into the run.

### 9b. A slot with no asset of its own is a composition problem

Do not move a photograph under a name it does not belong to. It looks like
reuse and it is the same lie as inventing content, told with a real file. The
tell is that **the slot came first**.

It has cost this repo twice:

- A Carrera GT shipped over a photograph that was not it, after
  `public/showcase/` was deleted and orphaned the only car pointing there. Fixed
  by removing the entry, not by finding a lookalike. `scripts/check-assets.mjs`
  exists because of this.
- The closing marque wall was asked for as 3×3. Six `public/site/marque-*.jpg`
  exist, so it was built 3×2 with the remaining four marques as marks — and
  later as marks only.

If a grid wants nine and six exist, the grid is wrong. Change the composition.
