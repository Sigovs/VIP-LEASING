// Canonical brand + showroom facts — the single source of truth for the name,
// address, phone, hours, and coordinates. Home, contact, about, the footer, and
// the layout JSON-LD all read from here so the details can never drift
// page-to-page (the interior pages once shipped a stale address because each
// page carried its own copy).
//
// ⚠️ EVERYTHING MARKED `TBD` IS A PLACEHOLDER, NOT A FACT. The client has not
// supplied an address, phone, e-mail, hours or handle yet. They are written as
// obvious placeholders on purpose: an invented-but-plausible address is the kind
// of thing that survives review and ships. Update here once, and every page
// follows.

export const BRAND = {
  /** Display name. Their own stub site sets it without the article. */
  name: "VIP Leasing",
  /** Domain carries the article; the mark does not. */
  domain: "thevipleasing.com",
  /** Their line, not ours — taken from the current site. */
  tagline: "Drive Luxury, Live VIP.",
} as const;

export const SHOWROOM = {
  name: BRAND.name,
  street: "TBD", // TBD — client to supply
  city: "TBD", // TBD — client to supply
  region: "FL",
  postalCode: "TBD", // TBD — client to supply
  cityStateZip: "TBD", // TBD — client to supply
  /** Marketing locality — the metro the brand speaks to. */
  market: "South Florida",
  phoneDisplay: "+1 (000) 000-0000", // TBD — client to supply
  phoneHref: "tel:+10000000000", // TBD — client to supply
  email: "hello@thevipleasing.com", // TBD — confirm the real inbox
  hours: [
    ["Mon – Fri", "10am – 7pm"],
    ["Saturday", "11am – 5pm"],
    ["Sunday", "By appointment"],
  ] as const, // TBD — client to confirm
  /** One-line hours summary for tight spots (footer legal bar). */
  hoursShort: "Mon–Fri 10–7 · Sat 11–5 · Sun by appointment", // TBD
  // TBD — placeholder centred on the metro, not on a real address. Verify
  // before the Mapbox pin goes live.
  lng: -80.1918,
  lat: 25.7617,
} as const;

/** False while the address is a placeholder — components show the metro
 *  instead of printing "TBD" at a visitor. */
export const HAS_ADDRESS: boolean = SHOWROOM.street !== "TBD";

export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${SHOWROOM.name}, ${SHOWROOM.street}, ${SHOWROOM.cityStateZip}`
)}`;
