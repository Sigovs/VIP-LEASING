import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SHOWROOM } from "@/lib/showroom";
import { TESTIMONIALS } from "@/lib/testimonials";

// Social proof: a positioning statement + a 3-up testimonial grid. The
// reference build runs a sister-dealership story in the left column; this house
// has one location and no group, so the column states what it does instead.
// Quotes are placeholder until real client copy is collected.
export function SocialProof() {
  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* Positioning. The reference site tells an origin story here (Toronto,
            second showroom). We have no history to tell yet and will not invent
            one, so this states what the house does instead — and it does it in
            the client's own line, which is the one piece of voice they have
            already written for themselves. */}
        <Reveal className="lg:col-span-5">
          <span aria-hidden className="block h-0.5 w-12 bg-mark mb-8" />
          <h2 className="font-title text-3xl md:text-5xl font-bold text-text-1 leading-[1.15]">
            Drive Luxury.
            <br />
            <span className="title-mark">Live VIP</span>
          </h2>
          <p className="mt-6 md:mt-8 max-w-[44ch] text-text-2 leading-relaxed text-[1.05rem] md:text-[1.1rem]">
            Luxury and exotic cars, sourced and delivered across {SHOWROOM.market}.
            Lease it, finance it, or buy it outright — the car is yours to
            choose, and the terms are built to fit.
          </p>
          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-1 hover:text-accent transition-colors"
          >
            Our story
            <ChevronRight
              className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
              strokeWidth={1.75}
            />
          </Link>
        </Reveal>

        {/* Testimonials */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={i}
              delay={(i % 2) * 0.06}
              className={i === 0 ? "sm:col-span-2" : ""}
            >
              <figure className="h-full bg-paper border border-border p-7 md:p-9 flex flex-col justify-between gap-6">
                <blockquote className="text-[1.05rem] md:text-[1.1rem] leading-relaxed text-text-1">
                  <span aria-hidden className="text-accent mr-1">&ldquo;</span>
                  {t.quote}
                  <span aria-hidden className="text-accent ml-0.5">&rdquo;</span>
                </blockquote>
                <figcaption className="text-xs uppercase tracking-[0.18em] text-text-2">
                  <span className="text-text-1">{t.name}</span>
                  <span className="mx-2 text-text-3">·</span>
                  <span>{t.context}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Container>
  );
}
