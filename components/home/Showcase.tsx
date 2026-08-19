"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ShowcaseCar } from "@/lib/showcase";

type Props = { cars: ShowcaseCar[] };

export function Showcase({ cars }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? cars[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        {cars.map((car, i) => (
          <button
            key={car.slug}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[3/2] overflow-hidden bg-paper text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Open ${car.name} gallery (${car.photos.length} photos)`}
          >
            <Image
              src={car.photos[0]}
              alt={car.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.018em] text-white">
                  {car.name}
                </h3>
                <p className="mt-2 text-[0.75rem] font-accent tracking-[0.18em] text-white/70">
                  {car.photos.length} {car.photos.length === 1 ? "photo" : "photos"}
                </p>
              </div>
              <ArrowUpRight
                className="h-5 w-5 text-white shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </div>
          </button>
        ))}
      </div>

      {open && (
        <Lightbox
          car={open}
          onClose={() => setOpenIndex(null)}
          onPrev={() =>
            setOpenIndex((i) => (i === null ? null : (i - 1 + cars.length) % cars.length))
          }
          onNext={() =>
            setOpenIndex((i) => (i === null ? null : (i + 1) % cars.length))
          }
        />
      )}
    </>
  );
}

function Lightbox({
  car,
  onClose,
  onPrev,
  onNext,
}: {
  car: ShowcaseCar;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const total = car.photos.length;

  // Reset to the first photo when the car changes. Done during render (the
  // React-idiomatic prop-change reset) rather than in an effect.
  const [prevSlug, setPrevSlug] = useState(car.slug);
  if (car.slug !== prevSlug) {
    setPrevSlug(car.slug);
    setPhotoIndex(0);
  }

  const prevPhoto = useCallback(
    () => setPhotoIndex((i) => (i - 1 + total) % total),
    [total]
  );
  const nextPhoto = useCallback(
    () => setPhotoIndex((i) => (i + 1) % total),
    [total]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") nextPhoto();
      else if (e.key === "ArrowLeft") prevPhoto();
      else if (e.key === "ArrowUp") onPrev();
      else if (e.key === "ArrowDown") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPhoto, prevPhoto, onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${car.name} gallery`}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-6 px-5 md:px-10 py-4 md:py-6 border-b border-white/10">
        <div>
          <h2 className="text-base md:text-lg font-semibold tracking-[-0.012em] text-white">
            {car.name}
          </h2>
          <p className="mt-1 text-[0.7rem] md:text-[0.75rem] uppercase tracking-[0.2em] text-white/60 tabular-nums">
            {photoIndex + 1} / {total}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="text-white/80 hover:text-white transition-colors p-2 -mr-2"
        >
          <X size={24} strokeWidth={1.25} />
        </button>
      </div>

      {/* Photo stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-[1600px] mx-auto px-4 md:px-16">
          <Image
            key={car.photos[photoIndex]}
            src={car.photos[photoIndex]}
            alt={`${car.name} — photo ${photoIndex + 1}`}
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
              onClick={prevPhoto}
              aria-label="Previous photo"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors"
            >
              <ChevronLeft size={28} strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Next photo"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors"
            >
              <ChevronRight size={28} strokeWidth={1.25} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="border-t border-white/10 overflow-x-auto scroll-gallery">
          <div className="flex gap-2 px-5 md:px-10 py-4">
            {car.photos.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setPhotoIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === photoIndex ? "true" : undefined}
                className={`relative h-14 md:h-16 aspect-[3/2] shrink-0 overflow-hidden bg-paper transition-opacity ${
                  i === photoIndex
                    ? "opacity-100 ring-2 ring-accent"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
