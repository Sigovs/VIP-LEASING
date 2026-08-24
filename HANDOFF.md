# Handoff — VIP Leasing → WordPress

This document is the bridge between the Next.js prototype in this repo and the WordPress production build owned by All Auto Network (AAN). It maps every Next.js route to a WP template, defines the ACF schema that powers the vehicle data, and flags the parts of the build that will be lossy in the port.

## 1. Route → WP template mapping

| Next.js route                  | WP template                                     | Notes |
| ------------------------------ | ----------------------------------------------- | ----- |
| `/` (app/page.tsx)             | `front-page.php`                                 | Hero video + In Stock + editorial + Recently Acquired + Sell CTA |
| `/inventory`                   | `archive-vehicle.php`                            | Custom Post Type archive |
| `/inventory/[slug]`            | `single-vehicle.php`                             | The signature page — see §3 |
| `/sold`                        | `archive-vehicle-sold.php` (or filter `?sold=1`) | Reuse archive with a meta query |
| `/sell`                        | `page-sell.php`                                  | Custom page template, Gravity Forms or Fluent Forms for the form |
| `/financing`                   | `page-financing.php`                             | |
| `/about`                       | `page-about.php`                                 | |
| `/contact`                     | `page-contact.php`                               | |
| `/styleguide`                  | (do not port — dev tool)                         | Disallowed in robots.txt |

## 2. Required plugins

- **ACF Pro** — field groups for the `vehicle` CPT (see §3).
- **Gravity Forms** **or** **Fluent Forms** — for `/sell`, `/contact`, and the vehicle inquiry drawer.
- **Yoast SEO** or **Rank Math** — site-wide metadata + per-vehicle OG images.
- **Schema by Yoast** (or hand-rolled JSON-LD via theme) — `AutoDealer` site-wide and `Vehicle` on detail pages. The Next.js build already emits these (see `app/layout.tsx` and `app/inventory/[slug]/page.tsx`).
- **WP Rocket** + WebP/AVIF converter (e.g., **Imagify**) — match the perf targets in §10 of the brief.

## 3. Vehicle Custom Post Type — ACF schema

`data/vehicles.json` is the single source of truth for the data shape. Each top-level key becomes either a post-property or an ACF field. The schema below is a 1:1 mirror.

**CPT slug:** `vehicle`
**Permalink:** `/inventory/%postname%/`
**Supports:** `title`, `thumbnail`

### ACF Field Group — "Vehicle Details"

| ACF field name           | Type             | JSON key            | Notes |
| ------------------------ | ---------------- | ------------------- | ----- |
| `year`                   | Number           | `year`              | |
| `make`                   | Text             | `make`              | |
| `model`                  | Text             | `model`             | |
| `trim`                   | Text             | `trim`              | Optional |
| `price`                  | Number           | `price`             | USD, no formatting |
| `mileage`                | Number           | `mileage`           | |
| `exterior_color`         | Text             | `exteriorColor`     | |
| `interior_color`         | Text             | `interiorColor`     | |
| `vin`                    | Text             | `vin`               | |
| `transmission`           | Text             | `transmission`      | |
| `drivetrain`             | Text             | `drivetrain`        | |
| `engine`                 | Text             | `engine`            | |
| `horsepower`             | Number           | `horsepower`        | |
| `torque`                 | Number           | `torque`            | lb-ft |
| `zero_to_sixty`          | Number (decimal) | `zeroToSixty`       | seconds |
| `top_speed`              | Number           | `topSpeed`          | mph |
| `weight`                 | Number           | `weight`            | lb |
| `story`                  | Textarea         | `story`             | 2–4 sentence editorial intro |
| `hero_image`             | Image            | `heroImage`         | Use full size; theme applies sizing |
| `gallery`                | Gallery          | `gallery`           | 6–12 images |
| `carfax_url`             | URL              | `carfaxUrl`         | **Optional.** Leave empty and the theme builds the link from the VIN (`carfax.com/VehicleHistory/p/Report.cfx?vin=…`). Fill it only when Carfax has given the dealer a specific report URL for that car. Never rendered on a sold vehicle. |
| `is_sold`                | True/False       | `isSold`            | |
| `is_featured`            | True/False       | `isFeatured`        | Drives homepage "Recent" selection |
| `is_spotlight`           | True/False       | `isSpotlight`       | Optional. Marks the single hero car in the homepage Featured spotlight; first match wins. Falls back to first featured, then first active. |
| `acquired_date`          | Date Picker      | `acquiredDate`      | yyyy-mm-dd |
| `options` (repeater)     | Repeater         | `options[]`         | |
| &nbsp;&nbsp;`category`   | Select           | `options[].category`| Exterior \| Interior \| Performance \| Technology |
| &nbsp;&nbsp;`items`      | Textarea (one per line) | `options[].items[]` | |
| `history` (repeater)     | Repeater         | `history[]`         | |
| &nbsp;&nbsp;`date`       | Date Picker      | `history[].date`    | |
| &nbsp;&nbsp;`event`      | Text             | `history[].event`   | |
| &nbsp;&nbsp;`description`| Textarea         | `history[].description` | |

The TypeScript types in `types/vehicle.ts` are the canonical contract — if a field is added, change both at once.

### Carfax links

The report link is **derived, not stored**, so there is no second copy of the
VIN to fall out of step with the first: `carfaxReportUrl()` in
`lib/vehicles.ts` returns `null` for a sold car, the `carfax_url` override when
one is set, and otherwise `carfax.com/VehicleHistory/p/Report.cfx?vin=<vin>`.
Port it as a template helper, not as a saved post meta field.

⚠️ **The VINs in the demo data are placeholders** — they end in `XXX`, so every
link currently resolves to Carfax's "no report for this VIN" page. They become
real the moment real VINs are entered, with no code change. Nothing needs
doing here except entering true VINs.

Active inventory only, per the client: a history report is read on the way to
a decision, and there is nothing left to decide on a car that has gone.

**⚠️ NEEDED FROM THE CLIENT — their CARFAX dealer account.** What ships today is
the current US corporate wordmark, taken from what carfax.com serves in its own
header, pointing at the public VIN lookup. That is a defensible placeholder and
it is not the finished thing:

0. **The file itself is fine to hold.** Wikimedia Commons carries the same
   generation of the mark under **PD-textlogo** — simple shapes, below the
   threshold of copyright — which settles any question about shipping the SVG.
   It settles nothing about *using* it; that is trademark, and the points below
   still stand. The Commons copy also has no ®, which is why the file here comes
   from carfax.com's own header instead.
1. **The badge should come from the dealer portal**, not from us. US dealers are
   issued their own assets — "SHOW ME THE CARFAX" and per-vehicle badges — and
   the mark is licensed to subscribers. `carfaxonline.com` /
   `carfaxfordealers.com` is where they live; both are behind a login, so the
   usage guide could not be read from outside and the rules below are inference,
   not quotation.
2. **The link should be the dealer's own report URL**, not the public
   `Report.cfx?vin=` lookup. A subscriber's link opens the report they have paid
   for; ours opens a sales page.
3. **Per-vehicle badges are per-vehicle.** "CARFAX 1-Owner" and "No Accidents
   Reported" are findings about one car, from that car's report. Several of the
   SVGs sitting in other projects on this machine carry those panels baked in —
   using one of those across an inventory asserts things nobody has checked.
   Only the plain wordmark is safe to apply uniformly.

Until the account exists, leave it as it is. Everything above is a swap of one
file and one URL builder (`carfaxReportUrl` in `lib/vehicles.ts`).

## 4. Animation port — GSAP

All scroll-triggered animation is implemented as vanilla GSAP timelines (registered with ScrollTrigger). The React-specific wrapper around them is thin and exists only to call `gsap.registerPlugin` + scope the elements via refs.

To port:

1. Drop the GSAP + ScrollTrigger libs into the WP theme (CDN or local bundle). Use the same versions in `package.json`.
2. Replace each React component with the equivalent timeline initialized on `DOMContentLoaded`.

| React component                       | GSAP behavior                                       |
| ------------------------------------- | --------------------------------------------------- |
| `components/motion/LenisProvider.tsx` | Lenis smooth-scroll, `lerp: 0.12` |
| `components/motion/Reveal.tsx`        | `opacity 0 → 1`, `y 24 → 0`, 600ms ease-out, ScrollTrigger `start: top 85%` |
| `components/motion/ParallaxImage.tsx` | `yPercent -6 → 6` scrubbed across viewport |
| `components/layout/PageTransition.tsx`| Framer Motion fade — in WP, replace with a barba.js or a simple body-class fade on link clicks |

Framer Motion is used in two places only — `PageTransition` and the inquire drawer. Both can be replaced with vanilla CSS transitions in WP without visual change.

## 5. Form handling

- All three forms (`/sell`, `/contact`, vehicle inquiry drawer) are placeholder implementations that log to `console` and show a success state after a simulated 500ms.
- In WP, wire each form to Gravity/Fluent Forms with email notifications to the sales team alias.
- Vehicle inquiry form should auto-populate the vehicle slug + display name from the page context.

### The credit application — read this before wiring it

`/financing/apply` is a **mockup**. `CreditApplication.tsx` submits to a
`console.log` like every other form here, and that is currently the only reason
the page is safe to have published.

**Two things must be true before it goes live:**

1. **A real, encrypted transport.** The brief says "completed form can be sent
   to sales@thevipleasing.com". That cannot be a `mailto:` or a form-to-email
   relay. The form carries a date of birth, a home address history and income —
   plain SMTP is not a channel for it. Post to an endpoint over TLS, store or
   forward it somewhere access-controlled, and notify sales@ that something
   arrived rather than mailing the contents.
2. **sales@thevipleasing.com has to exist.** The client said it does not yet. It
   lives in `lib/showroom.ts`; nothing else needs editing when it does.

**No SSN field, deliberately.** A real application asks for one. This one asks
for everything else and says so on the page: *"We never ask for a social
security number on this page. If a lender needs one, they will ask you directly
over their own secure channel."* A number typed into a preview that posts
nowhere is a real SSN sitting in a real browser's autofill for nothing. If the
lender flow genuinely needs it collected here, it comes after point 1, not
before.

**The Regulation B line is not decoration.** *"Alimony, child support, or
separate maintenance income need not be revealed…"* sits under the income
fields because an applicant may not be required to disclose it. Do not drop it
in the port.

**Nothing on the page may imply the house lends.** It arranges terms through
outside lenders and makes no credit decision — no rates, no terms, no
approvals. The authorization checkbox says so explicitly and must keep saying
so.

### Text to phone — the fourth form, and the only one that needs a vendor

`VehicleActions.tsx` on the VDP offers **Save · Share · Text to phone**. Save is
`localStorage` and Share is `navigator.share` / clipboard — both are real and
need nothing. **Text to phone is the mockup:** it takes a mobile number, says
"On its way", and posts nowhere.

Making it real needs two things the other forms do not:

1. **An SMS gateway** — Twilio, MessageBird, or whatever the dealer's CRM
   already carries. A form-to-email relay cannot send a text.
2. **A number the dealer owns and has registered.** US A2P 10DLC registration is
   mandatory for application-to-person messaging; unregistered traffic is
   filtered by the carriers, so the messages simply do not arrive and nothing
   reports an error. Budget days, not minutes, for this.

The message body is the vehicle's canonical URL and its name — nothing else.
Add the STOP/HELP language the gateway requires; do not send a second message
to a number that has not asked for one.

**If the dealer will not carry a gateway, delete the control.** A button that
collects a phone number and does nothing with it is worse than an absent
feature — it takes a real number and gives back a promise. Removing it is one
`<Action>` and one dialog block in `components/vehicle/v4/VehicleActions.tsx`;
Save and Share are independent and stay.

## 6. Image handling

- Dev uses Unsplash CDN URLs. AAN: replace with WP media library. The `next.config.ts` `remotePatterns` block can be deleted; the WP theme uses native `wp_get_attachment_image()`.
- Vehicle cards request AVIF/WebP responsive variants via `next/image`. In WP, generate equivalent sizes via `add_image_size()` and `picture`/`srcset`.
- Hero image LCP target: < 1.5s on mobile 4G. The vehicle hero uses `priority` on the first paint — set `fetchpriority="high"` and `preload` on the WP equivalent.

## 7. SEO

- Per-page `generateMetadata` → WP equivalent is Yoast field overrides per CPT.
- JSON-LD: the `AutoDealer` payload is in `app/layout.tsx`; the VDP `@graph` (`Vehicle` + `Offer` + `BreadcrumbList`) is in `app/inventory/[slug]/page.tsx`; the archive `@graph` (`CollectionPage` + `BreadcrumbList` + `ItemList` of `Car`/`Offer`) is in `app/inventory/page.tsx` (see §7a). All should be ported as theme template code, not plugin output, because they pull from ACF fields.
- Sitemap: `app/sitemap.ts` enumerates static routes + every vehicle slug. Let Yoast/Rank Math handle this in WP — same data source.

### 7a. Inventory listing page (`archive-vehicle.php`) — SEO & sales spec

Benchmarked against top exotic dealers, three of which run **this same AAN theme** — Chicago Motor Cars, Marshall Goldman, One Exotics. Their live inventory pages share two **reproducible AAN defects**; the Next.js reference fixes both, and the WP port must too:

1. **Empty `<h1>`.** Those sites ship `<h1></h1>` on the archive (heading is styled non-h1 text). The reference uses a real `<h1>` ("Inventory" display heading in `app/inventory/page.tsx`). **Keep a single, real, keyword-bearing `<h1>` on the archive and every facet landing page.**
2. **No per-vehicle structured data.** Their cards are AJAX-injected, so the archive emits only `AutoDealer` + `BreadcrumbList` — no item-level schema. The reference **server-renders an `ItemList` of `Car` + `Offer` objects** (see the `listingJsonLd` block in `app/inventory/page.tsx`) plus `CollectionPage` + `BreadcrumbList`. **Port this as PHP template code that loops the queried posts** (not a plugin) so the markup is in the initial HTML, not injected by JS. Required per car: `name`, `image`, `offers.price`, `offers.priceCurrency`; recommended: `vehicleIdentificationNumber` (VIN), `mileageFromOdometer`, `vehicleTransmission`, `driveWheelConfiguration`, `brand`, `offers.availability`, `offers.itemCondition`. (Note: Google deprecated the dedicated *Vehicle-listing* rich result in Sept 2025 — the durable path is `Product`/`Car`+`Offer`; keep the vehicle vocabulary for semantics + AI/LLM legibility regardless.)

**Faceted navigation (the make-or-break SEO decision).** AAN's real strength on Chicago Motor Cars is **static, crawlable facet landing pages** — `/coupe-inventory/`, `/suv-inventory/`, `/convertible-inventory/`, location pages like `/used-naperville-inventory-chicago-il/`, and `/sold-inventory/`, interlinked sitewide. Replicate that pattern for VIP Leasing:

- Build **indexable landing pages only where search demand exists**: per-make (`/inventory/porsche`, `/inventory/ferrari`, `/inventory/lamborghini`, `/inventory/mclaren`), optionally make+model (`/inventory/ferrari-488` — strongest exotic long-tail), body-style, and price-tier. Each gets a **unique `<title>`, `<h1>`, ~100–150 word intro above the grid**, self-canonical, and a sitemap entry. The reference's marque rail (`components/inventory/InventoryGrid.tsx`) is the internal-linking model — wire those to the landing-page URLs in WP.
- **Keep everything else out of the index.** Free-text search, sort orders, and slider/range + multi-facet filter combinations (color, mileage, price, year, transmission, drivetrain) should be **`?param` query URLs that `rel=canonical` back to the base archive** (or the relevant make hub). Do **not** mint a crawlable page per filter combo — that's crawl-budget bloat.
- **Return 404 on empty filter combinations** (don't redirect to a shared empty page).

**Title / H1 / meta templates:**
- Archive — Title: `Exotic & Luxury Cars for Sale in Fort Lauderdale, FL | VIP Leasing`; H1: `Inventory`; meta: handpicked-selection + makes + by-appointment.
- Make hub — Title: `{Make} for Sale in Fort Lauderdale, FL | VIP Leasing`; H1: `{Make} for Sale`.
- Make+model hub — H1: `{Make} {Model} for Sale in Fort Lauderdale, FL`.

**Image alts:** every thumbnail uses `YEAR MAKE MODEL [TRIM]` (the reference card does this — `imageAlt` in `VehicleCard.tsx`). Universal across the benchmarked dealers.

**Sold vehicles:** keep the VDP live with `availability: SoldOut` + a related-inventory module while it has equity/demand; `301` to a close replacement if one exists; `410` only when neither applies. Never blanket-redirect sold VDPs to the homepage (reads as soft-404). A `/sold-inventory/` archive doubles as social proof (matches Chicago Motor Cars / One Exotics).

**Sales / conversion (card + archive):**
- **Show price on every card** — listings with a visible price get materially more VDP views; "call for price" adds friction (and FTC CARS-Rule risk). For a genuine POA car, omit `offers.price` from schema rather than faking it. The reference shows real prices.
- Per-card **Save/favorite** (reference: `components/vehicle/SaveButton.tsx`, localStorage — swap for a logged-in wishlist / "My Garage" in WP) and a clear **View** action. Keep the scannable **performance line** (mileage · hp · 0–60) — it's the spec set exotic buyers scan.
- Prominent **results count** + per-marque counts (reference has both). Sticky **tap-to-call** on mobile; keep the primary CTA out from under the photo stack.
- Lead paths: prefer **"Request Private Viewing / Concierge"** over generic "Get ePrice"; few form fields; offer call + text. Exotic buyers often purchase remotely — lean on photography/video on the VDP.

## 8. What will be lossy in the port

These are the items that may degrade in WP. Plan for them up front.

- **Page transitions** — Framer Motion's mode="wait" fade between routes does not translate to a multi-page WP site without a JS router (barba.js). Acceptable to skip; the rest of the design carries the experience.
- **Lenis smooth-scroll** — works fine in WP, but disable it for any page with a long form or a modal that scrolls internally (use `data-lenis-prevent`).
- **Connection-aware hero video** — port the `saveData` / `effectiveType` check as inline JS in `header.php`. Don't lose this — it materially affects mobile LCP.
- **Form-field focus state** — relies on `:focus-visible` + custom outline. WP themes often re-introduce browser default outlines via base stylesheets. Audit `style.css` for any `outline: none`.
- **`prefers-reduced-motion`** — implemented via CSS media query in `globals.css` + JS guards in motion components. Keep the CSS rule verbatim and add equivalent JS guards in the GSAP init code.

## 9. Performance budget

Mirror the targets in §10 of the brief. The Next.js prototype was built to hit them; WP will only hit them with caching + WebP + lazy-loading discipline:

- LCP < 1.5s mobile 4G — preload the hero image, defer the video element.
- CLS < 0.05 — set explicit `width`/`height` on every image.
- Total JS shipped to homepage < 200KB gz — avoid jQuery dependencies for inventory filters; the InventoryGrid client component is React-only here.

## 10. Where to start

1. Build the `vehicle` CPT + ACF group from §3.
2. Import the 12 records from `data/vehicles.json` (or supply real cars — same field shape).
3. Port `front-page.php` first; the homepage is the most visible deliverable.
4. Port `single-vehicle.php` second; this is the page that has to break the category.
5. Port the archive + remaining pages.
6. Wire forms last — everything else can be reviewed visually without them.
