import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

// The client asked for a Service tab. What sits under it is still open — they
// have not said whether this is detailing, maintenance, transport, sourcing, or
// something else — so the page ships as SHAPE ONLY, with the slots labelled as
// placeholders in the same explicit way lib/testimonials.ts handles quotes it
// does not have yet. Inventing three plausible services would read as finished
// and would be wrong in a way nobody would catch.
export const metadata: Metadata = {
  title: "Service",
  description:
    "Aftercare and support for the cars we place — service offering to be confirmed.",
};

const SLOTS = [
  {
    title: "Service one",
    body: "Placeholder. One line on what the house actually does here — the specific thing, not a category.",
  },
  {
    title: "Service two",
    body: "Placeholder. Three slots is the shape; fewer is fine, more starts reading as a list rather than a standard.",
  },
  {
    title: "Service three",
    body: "Placeholder. Say what the client gets, not how hard the work is.",
  },
];

export default function ServicePage() {
  return (
    <>
      <header className="border-b border-border pb-6 pt-24 md:pb-8 md:pt-32">
        <Container>
          <span aria-hidden className="mb-5 block h-px w-12 bg-accent md:mb-6" />
          <h1 className="title-dot font-title text-5xl font-bold leading-[1.0] text-text-1 md:text-7xl">
            Service
          </h1>
        </Container>
      </header>

      <Section spacing="tight" className="pt-10 md:pt-14">
        <Container>
          <Reveal>
            <p className="max-w-[62ch] text-[1.02rem] leading-relaxed text-text-2">
              The car is the start of the relationship, not the end of it. What
              belongs on this page is being written with the client.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px bg-border sm:grid-cols-3 md:mt-20">
            {SLOTS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="h-full bg-surface p-8 md:p-10">
                  <h2 className="font-title text-xl font-bold text-text-1 md:text-2xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-text-2">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <Link
              href="/contact"
              className="group mt-14 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-1 transition-colors hover:text-accent md:mt-20"
            >
              Talk to us
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
