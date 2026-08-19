// Canonical brand + showroom facts — the single source of truth for the name,
// address, phone, hours, and coordinates. Home, contact, about, the footer, and
// the layout JSON-LD all read from here so the details can never drift
// page-to-page (the interior pages once shipped a stale address because each
// page carried its own copy).
//
// Supplied by the client on their dealer intake form. Anything still marked
// `TBD` below has NOT been supplied and is a placeholder — written to look like
// one on purpose, because an invented-but-plausible value is the kind of thing
// that survives review and ships.

export const BRAND = {
  /** Display name — the mark drops the article. */
  name: "VIP Leasing",
  /** Registered name as filed on the intake form. Legal / formal use only. */
  legalName: "The Vip Leasing",
  domain: "thevipleasing.com",
  /** Their line, not ours — taken from their current site. */
  tagline: "Drive Luxury, Live VIP.",
  /** Intake form: "part of a group or other dealer" — No. Single house, no
   *  parent, no sister location. This is why the footer carries one mark
   *  rather than a group lockup. */
  isPartOfGroup: false,
} as const;

export const SHOWROOM = {
  name: BRAND.name,
  street: "1300 NW 29th Street",
  city: "Miami",
  region: "FL",
  postalCode: "33142",
  cityStateZip: "Miami, FL 33142",
  /** Marketing locality — the metro the brand speaks to. */
  market: "Miami",
  phoneDisplay: "(305) 321-0349",
  phoneHref: "tel:+13053210349",
  email: "thevipleasing@gmail.com",
  hours: [
    ["Mon – Fri", "10am – 7pm"],
    ["Saturday", "11am – 5pm"],
    ["Sunday", "By appointment"],
  ] as const, // TBD — client has not confirmed hours; these are carried over.
  /** One-line hours summary for tight spots (footer legal bar). */
  hoursShort: "Mon–Fri 10–7 · Sat 11–5 · Sun by appointment", // TBD — as above
  // Approximate, centred on the block — Allapattah, Miami. The keyless Google
  // embed geocodes from the address string above, so the pin on the live tile
  // is exact regardless; these coordinates only drive the Mapbox static image,
  // which needs verifying if a token is ever added.
  lng: -80.2364,
  lat: 25.8069,
} as const;

/** False while the address is a placeholder — components show the metro
 *  instead of printing "TBD" at a visitor. Now true; the cast keeps the guard
 *  compiling (`as const` narrows street to a literal, so TS calls the
 *  comparison unreachable) and keeps it working if the value ever goes back. */
export const HAS_ADDRESS: boolean = (SHOWROOM.street as string) !== "TBD";

export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${SHOWROOM.name}, ${SHOWROOM.street}, ${SHOWROOM.cityStateZip}`
)}`;
