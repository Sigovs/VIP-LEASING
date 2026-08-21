import { ChevronDown } from "lucide-react";
import type { FormTone } from "@/lib/formStyles";

// Wraps a native <select> so it can carry the site's own chevron.
//
// Native, deliberately: on a phone this opens the platform picker, it needs no
// JavaScript, and it survives the static export. The only thing wrong with it
// is the platform arrow, which is why the select sets appearance-none and this
// draws the replacement.
//
// The chevron is pointer-events-none so the whole field stays clickable, and
// aria-hidden because the select already announces itself.
export function SelectShell({
  children,
  tone = "page",
}: {
  children: React.ReactNode;
  tone?: FormTone;
}) {
  return (
    <span className="relative block">
      {children}
      <ChevronDown
        aria-hidden
        strokeWidth={1.75}
        className={`pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 ${
          tone === "chrome" ? "text-white/45" : "text-text-3"
        }`}
      />
    </span>
  );
}
