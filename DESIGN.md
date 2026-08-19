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
- **The `.title-dot` period** that closes a section title — the one place it
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

| Role         | Face            | Use                                             |
| ------------ | --------------- | ----------------------------------------------- |
| Display / titles / body / UI | Inter Tight | section titles, display headings, body copy, nav, buttons, labels, **numerics** — set in sentence case, tracked tight (`-0.02em`) at display sizes |
| Condensed caps | Oswald        | ALL-CAPS only: eyebrows, ceremonial labels, phone / address, spec keys. The site's single data texture — and the only face allowed to shout. |

Retired this build: **Cardo, Cinzel, Manrope, JetBrains Mono**. A classical
small-caps serif over a warm-gold dark theme is the house style of every
"premium" template on the internet; four faces on one marketing site reads as a
font sampler, not a house style. One grotesk worked hard across its weight
range, with a single condensed voice for caps, is the harder and better system.

Rule: **vehicle prices, mileage, and specs are set in Inter Tight with the
`tabular-nums` utility** — figures align in columns without a monospace texture.
Oswald survives only as the ALL-CAPS data texture (phone, address, eyebrows,
spec keys) — never on a price value.

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
