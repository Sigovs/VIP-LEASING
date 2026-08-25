"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// A full-screen photograph viewer: one image contained, arrows, a counter, and
// a strip to jump with.
//
// It exists because this is the THIRD place in the codebase that wants one. The
// Lookbook has had a lightbox since the beginning (components/home/Showcase.tsx,
// and again under v2, v3 and v4), and the vehicle gallery now needs the same
// thing for its "Full gallery" control. Copying it a fourth time would have been
// the easy move and the wrong one — four copies of a keyboard handler is four
// places for Escape to stop working in.
//
// The Lookbox copies are NOT yet folded into this. They carry one thing this
// does not: up/down arrows step between CARS, not photographs, so their key
// handler and header know about a car object. Folding them in is a real change
// to a working component and belongs in its own pass, not smuggled into a pill
// on a different page. This is the shared core they should adopt when that
// happens.
//
// It renders through a PORTAL, into document.body, and that is not decoration.
// A modal that lives where it was declared inherits every stacking context above
// it, and this one is declared inside a section carrying .atmosphere — which
// sets isolation: isolate. Trapped there, z-[100] is counted against its own
// little context, and the whole thing rendered UNDERNEATH the fixed header:
// site logo printed across the car's name, close button behind the Instagram
// icon. A portal is the only fix that stays fixed when someone adds a
// transform, a filter or an isolate to an ancestor next month.
//
// object-contain, not cover. The whole point of enlarging a photograph is to
// stop cropping it.
export function Lightbox({
  images,
  alt,
  title,
  index,
  onIndex,
  onClose,
}: {
  images: string[];
  alt: string;
  title?: string;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const total = images.length;

  const step = useCallback(
    (d: number) => onIndex((index + d + total) % total),
    [index, total, onIndex]
  );

  // The page behind must not scroll while this is up.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  // Portals need a DOM. A mounted flag would do it, but setting state from an
  // effect just to learn we are in a browser is a render for nothing — the
  // check itself is the answer, and every hook above has already run.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} gallery` : "Gallery"}
      className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-6 border-b border-white/10 px-5 py-4 md:px-10 md:py-6">
        <div className="min-w-0">
          {title && (
            <p className="truncate font-title text-base font-bold tracking-[-0.012em] text-white md:text-lg">
              {title}
            </p>
          )}
          {total > 1 && (
            <p className="mt-1 font-accent text-[0.7rem] uppercase tracking-[0.2em] tabular-nums text-white/60 md:text-[0.75rem]">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="-mr-2 p-2 text-white/80 transition-colors hover:text-white"
        >
          <X size={24} strokeWidth={1.25} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div className="relative mx-auto h-full w-full max-w-[1600px] px-4 md:px-16">
          <Image
            key={images[index]}
            src={images[index]}
            alt={`${alt} — photo ${index + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white md:left-6"
            >
              <ChevronLeft size={28} strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white md:right-6"
            >
              <ChevronRight size={28} strokeWidth={1.25} />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="scroll-gallery overflow-x-auto border-t border-white/10">
          <div className="flex gap-2 px-5 py-4 md:px-10">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={
                  "relative aspect-[3/2] h-14 shrink-0 overflow-hidden rounded-sm bg-paper transition-opacity md:h-16 " +
                  (i === index
                    ? "opacity-100 ring-2 ring-accent"
                    : "opacity-50 hover:opacity-100")
                }
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
