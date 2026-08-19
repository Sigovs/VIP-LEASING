"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// Save / favorite a vehicle — a standard exotic-dealer conversion affordance
// ("My Garage" on Chicago Motor Cars). Persisted to localStorage so the saved
// set survives reloads without any backend; the WP port can swap this for a
// logged-in wishlist (see HANDOFF.md §inventory). Rendered as a sibling of the
// card's <Link> (never nested inside the anchor) so it stays valid + clickable.
const KEY = "vip:saved";

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function SaveButton({
  slug,
  label,
  className,
}: {
  slug: string;
  label: string;
  className?: string;
}) {
  // Resolve the persisted state after mount to avoid an SSR/client mismatch —
  // the heart renders unselected on the server, then reconciles on the client.
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // localStorage can't be read during SSR, so this one-time reconcile on mount
    // is intentional (matches HeroVideo's capability check).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(readSaved().includes(slug));
    const sync = () => setSaved(readSaved().includes(slug));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [slug]);

  const toggle = () => {
    const next = saved
      ? readSaved().filter((s) => s !== slug)
      : [...readSaved(), slug];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable (private mode) — degrade to in-session only */
    }
    setSaved(!saved);
    // notify other SaveButtons on the page
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from saved` : `Save ${label}`}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/60",
        className
      )}
    >
      <Heart
        size={16}
        strokeWidth={1.75}
        className={cn(
          "transition-colors duration-200",
          saved ? "fill-accent text-accent" : "text-white"
        )}
      />
    </button>
  );
}
