import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SHOWROOM } from "@/lib/showroom";
import { REVIEWS, AGGREGATE, type GoogleReview } from "@/lib/reviews";

// Social proof, as Google reviews.
//
// The quotes used to be set as editorial pull-quotes — our voice, our
// typography, our framing. That is the one thing social proof cannot be: a
// review carries weight because it came from somewhere the house does not
// control, and dressing it in the house style throws that away. So the block
// looks like what it is, and says who it is from.
//
// The stars are Google's amber, not the brand blue. It is the only foreign
// colour on the page and it is deliberate: the mark of a third party is the
// whole point of the section, and a blue star would read as decoration we chose
// rather than a rating somebody left.

const STAR_GOLD = "#fbbc04";

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill={i < rating ? STAR_GOLD : "#2a333b"}
          aria-hidden
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleMark() {
  // Google's own four colours. Same reasoning as the stars — an attribution
  // mark repainted in the site palette stops being an attribution.
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const initial = review.author_name.trim().charAt(0).toUpperCase();
  return (
    <figure className="flex h-full flex-col gap-4 rounded-md border border-border bg-surface p-6 md:p-7">
      <header className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-chrome-surface-2 text-sm font-semibold text-text-1"
        >
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.95rem] font-semibold text-text-1">
            {review.author_name}
          </p>
          <p className="text-xs text-text-3">
            {review.relative_time_description}
          </p>
        </div>
        <GoogleMark />
      </header>

      <Stars rating={review.rating} />

      <blockquote className="text-[0.98rem] leading-relaxed text-text-2">
        {review.text}
      </blockquote>

      {/* Cards in a row must end on one line even though reviews never run to
          one length — the shortest would otherwise float and break the row. */}
      <span aria-hidden className="mt-auto" />

    </figure>
  );
}

export function SocialProof() {
  return (
    <Container>
      {/* Positioning first, then the proof. The reference site tells an origin
          story here; this house has none to tell yet and will not invent one,
          so the column states what it does — in the client's own line. */}
      <div className="grid grid-cols-1 items-end gap-10 md:gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 className="font-title text-3xl font-bold leading-[1.15] text-text-1 md:text-5xl">
            Drive Luxury.
            <br />
            <span className="title-mark">Live VIP</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-text-2 md:mt-8 md:text-[1.1rem]">
            Luxury and exotic cars, sourced and delivered across {SHOWROOM.market}.
            Lease it, finance it, or buy it outright — the car is yours to
            choose, and the terms are built to fit.
          </p>
          <Link
            href="/v4/about"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-1 transition-colors hover:text-accent"
          >
            Our story
            <ChevronRight
              className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
              strokeWidth={1.75}
            />
          </Link>
        </Reveal>

        {/* Aggregate. Simulated along with the reviews (see lib/reviews.ts) —
            it renders only when the object exists, so an unconnected feed shows
            the block without a score rather than a score built from nothing. */}
        {AGGREGATE && (
          <Reveal className="lg:col-span-5 lg:flex lg:justify-end" delay={0.08}>
            {/* Hugs its content. Stretched across five columns the box was
                mostly empty, and empty inside a border is not air — it is an
                unfilled container. */}
            <div className="inline-flex w-fit items-center gap-4 rounded-md border border-border bg-surface px-7 py-5">
              <span className="font-title text-5xl font-bold leading-none text-text-1">
                {AGGREGATE.rating.toFixed(1)}
              </span>
              <span className="flex flex-col gap-1.5">
                <Stars rating={Math.round(AGGREGATE.rating)} />
                <span className="flex items-center gap-1.5 text-xs text-text-3">
                  <GoogleMark />
                  {AGGREGATE.total} Google reviews
                </span>
              </span>
            </div>
          </Reveal>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:gap-6 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <Reveal key={i} delay={(i % 3) * 0.06}>
            <ReviewCard review={r} />
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
