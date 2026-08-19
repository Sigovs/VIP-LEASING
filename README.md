# VIP Leasing

Next.js 16 marketing site for **VIP Leasing**, a South Florida luxury and exotic
car house. Dark editorial aesthetic. Built to hand off to a WordPress agency
without losing craft.

Forked from the reference build the client pointed at, then rebranded. What
carried over is the system — grid, type roles, motion grammar, component set.
What did not carry over is the other house's identity, history, partners or
claims; see `PLAN.md` for the record of what changed and why.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript strict
- Tailwind CSS v4 (CSS-variable tokens)
- GSAP + ScrollTrigger · Lenis · Framer Motion
- react-hook-form + zod
- next/font · next/image (AVIF / WebP)

## Layout

```
app/                   routes — homepage, /inventory, /inventory/[slug], etc.
components/
  ui/                  Button, Container, Section, Eyebrow, DisplayHeading
  layout/              Header, Footer, PageTransition
  motion/              LenisProvider, Reveal, ParallaxImage
  vehicle/             VehicleCard, VehicleHero, VehicleGallery, SpecTable, …
  home/                HeroVideo, FinancingBand, SocialProof, ClosingCTA, …
data/vehicles.json     Mock data — 1:1 with the eventual ACF schema
types/vehicle.ts       Canonical Vehicle type
lib/                   utils.ts, vehicles.ts, showroom.ts (brand + facts)
```

## Routes

`/` · `/inventory` · `/inventory/[slug]` · `/sold` · `/sell` · `/financing` ·
`/service` · `/about` · `/contact` · `/styleguide` (internal, noindex)

## Two things to know before editing

**Facts live in one file.** Name, address, phone, hours and coordinates are in
`lib/showroom.ts` (`BRAND`, `SHOWROOM`). Nothing else may hardcode them. Every
value still marked `TBD` is a placeholder the client has not supplied — they are
written to look like placeholders on purpose. `HAS_ADDRESS` lets components show
the metro instead of printing `TBD` at a visitor.

**Leasing and financing are not in-house.** Terms are arranged through outside
lenders. No copy anywhere may imply the house lends its own money, and no lender
is named until the client names one.

## Imagery is not in this repo

`public/showcase/`, `public/ilusso/`, `public/inventory/` and the video files are
git-ignored. They are placeholder photography carried over from the reference
build — another dealership's shoot — and they are due to be replaced with this
client's own imagery. A fresh clone runs, but the vehicle photography will be
missing until real assets land.

## Read these next

- **`PLAN.md`** — the brief, the decisions, current state, and what is still open.
- **`DESIGN.md`** — the design language: tokens, type system, motion principles.
- **`HANDOFF.md`** — WordPress port guide: ACF schema, template mapping.
- **`AGENTS.md`** — gotchas that have already cost time once.

## Build

```bash
npm run build
```

## Client preview

```bash
npm run preview
```

Builds a static export and force-pushes it to this repo's `gh-pages` branch,
which GitHub Pages serves at **https://sigovs.github.io/VIP-LEASING/**. The
branch is a publishing target, not a history — it is replaced each time.

Note that the preview publishes the placeholder photography that is git-ignored
on `main`; a static export has to carry its own images.
