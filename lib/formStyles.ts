// The one place a form field's look is decided.
//
// Five forms on this site ask questions — the homepage starter (v2 and v3),
// /sell, /contact, and the inquiry drawer on a vehicle page — and each of them
// had its own copy of the same class string. They had already begun to drift.
//
// `tone` is which ground the field is standing on: "page" for the ordinary body
// grounds, "chrome" for a card sitting over a photograph, where a hairline in
// --border is invisible and every rule has to be drawn in white.

export type FormTone = "page" | "chrome";

/** Field labels. In the accent, because they are the one part of a form a
 *  person scans rather than reads — and in --mark-soft rather than --mark,
 *  which fails AA at this size on every ground the site has. One value for
 *  both tones: the soft mark clears 4.5:1 on paper, surface AND the chrome
 *  card, which is the whole reason that token exists. */
export const labelCls =
  "mb-2 block font-accent text-[0.65rem] uppercase tracking-[0.22em] text-mark-soft";

const base =
  "w-full border-0 border-b bg-transparent py-2.5 transition-colors focus:outline-none";

export function inputCls(tone: FormTone = "page"): string {
  return [
    base,
    tone === "chrome"
      ? "border-white/25 text-white placeholder:text-white/35 focus:border-white"
      : "border-border text-text-1 placeholder:text-text-3 focus:border-text-1",
  ].join(" ");
}

/** A native select, drawn like the inputs beside it. appearance-none removes
 *  the platform arrow; SelectShell puts ours back. pr-7 keeps a long option
 *  from running under it. */
export function selectCls(tone: FormTone = "page"): string {
  return [
    base,
    "cursor-pointer appearance-none pr-7",
    tone === "chrome"
      ? "border-white/25 text-white focus:border-white"
      : "border-border text-text-1 focus:border-text-1",
  ].join(" ");
}

/** Applied to every <option>. The popup is drawn by the OS, which does not
 *  inherit the page's colours — without this, a dark-theme form opens a white
 *  menu on some platforms. */
export const optionCls = "bg-surface text-text-1";

/** The empty first option reads as a prompt rather than as an answer. */
export function placeholderOptionCls(tone: FormTone = "page"): string {
  return tone === "chrome" ? "bg-surface text-white/45" : "bg-surface text-text-3";
}
