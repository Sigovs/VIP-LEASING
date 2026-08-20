// The handoff between the homepage's short starter and the full form on /sell.
//
// The starter asks for four things. If the visitor then had to retype those
// four on the next page, asking for them at all would be worse than not asking
// — so the values travel.
//
// sessionStorage rather than a query string, for three reasons: the site is a
// static export (no server to read params), `useSearchParams` would drag a
// Suspense boundary into the form, and the URL stays clean of a half-filled
// car. It is a convenience, never a dependency: if it fails, the visitor lands
// on an empty form, which is exactly where every "Sell Your Car" link on the
// site lands them anyway.
//
// ⚠️ Read, do NOT consume. The first version deleted the entry the moment the
// form read it, and the fields came out empty: the form mounts, fills, and is
// then remounted about a second into the route transition, and the second
// mount had nothing left to read. So the entry survives the read and is
// cleared on submit instead — with a TTL, so a visitor who wanders back to
// /sell an hour later does not find a stale car sitting in the fields.
export const SELL_PREFILL_KEY = "vip:sell-prefill";

/** How long a carried-over car stays worth restoring. */
export const SELL_PREFILL_TTL_MS = 30 * 60 * 1000;

export type SellPrefillValues = {
  year?: string;
  make?: string;
  model?: string;
  mileage?: string;
};

type Stash = { v: SellPrefillValues; t: number };

export function writeSellPrefill(values: SellPrefillValues): void {
  try {
    // Only stash what was actually typed — an empty string written into the
    // full form would look like an answer the visitor gave.
    const v = Object.fromEntries(
      Object.entries(values).filter(([, val]) => val),
    ) as SellPrefillValues;
    if (Object.keys(v).length === 0) return;
    const stash: Stash = { v, t: Date.now() };
    sessionStorage.setItem(SELL_PREFILL_KEY, JSON.stringify(stash));
  } catch {
    // Private mode, storage disabled, quota. The handoff must never stand
    // between the visitor and the page.
  }
}

export function readSellPrefill(): SellPrefillValues | null {
  try {
    const raw = sessionStorage.getItem(SELL_PREFILL_KEY);
    if (!raw) return null;
    const stash = JSON.parse(raw) as Stash;
    if (!stash?.v || typeof stash.t !== "number") return null;
    if (Date.now() - stash.t > SELL_PREFILL_TTL_MS) {
      clearSellPrefill();
      return null;
    }
    return stash.v;
  } catch {
    return null;
  }
}

export function clearSellPrefill(): void {
  try {
    sessionStorage.removeItem(SELL_PREFILL_KEY);
  } catch {
    /* nothing to do — see writeSellPrefill */
  }
}
