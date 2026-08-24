import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CreditApplication } from "@/components/financing/CreditApplication";
import { SHOWROOM } from "@/lib/showroom";

export const metadata: Metadata = {
  title: "Credit Application",
  description:
    "Apply for financing on any car in the lineup. Terms are arranged through our lending partners.",
};

// The credit application, at the client's request: the financing CTAs used to
// land on the general contact form, and now they land here.
//
// No hero photograph and no cinematic band, which every other interior page
// opens with. This is a long form asking for a date of birth and an income, and
// a page like that should look like a document, not like an advertisement — the
// register change is the point. It carries the site's furniture (the display
// heading, the title mark, the mono labels) and nothing that sells.
//
// ⚠️ Nothing is transmitted. See the header of CreditApplication.tsx for what
// has to be true before this can go live.
export default function CreditApplicationPage() {
  return (
    <>
      <Section className="pt-28 md:pt-36" spacing="tight">
        <Container>
          <Reveal>
            <Link
              href="/financing"
              className="group inline-flex items-center gap-2 font-accent text-[0.75rem] uppercase tracking-[0.2em] text-text-3 transition-colors hover:text-text-1"
            >
              <ChevronLeft
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={1.75}
              />
              Financing
            </Link>

            <h1 className="title-mark mt-7 font-title text-4xl font-bold leading-[1.0] text-text-1 md:text-6xl">
              Credit Application
            </h1>

            {/* The house arranges terms and lends nothing itself. Every line on
                this page has to hold that — no rates, no terms, no approvals. */}
            <p className="mt-8 max-w-[58ch] text-[1.05rem] leading-relaxed text-text-2 md:text-[1.15rem]">
              One application, taken to our lending partners. {SHOWROOM.name}{" "}
              does not lend and does not make the decision — we put your
              application in front of the people who do, and come back to you
              with what they say.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section id="application" spacing="tight" className="border-t border-border bg-paper">
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
            {/* What happens next, held beside the form on desktop so it is
                readable while the form is being filled rather than before it. */}
            <Reveal className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              <p className="font-accent text-[0.8125rem] uppercase tracking-[0.28em] text-text-1">
                What Happens Next
              </p>
              <ol className="mt-8 space-y-7">
                {[
                  ["01", "We read it", "If something is missing we call you before it goes anywhere."],
                  ["02", "Our partners review it", "The lenders decide, not us. Usually inside one business day."],
                  ["03", "You hear from us directly", "We bring back what they offered and walk you through it."],
                ].map(([n, t, b]) => (
                  <li key={n} className="flex gap-5">
                    <span
                      aria-hidden
                      className="font-title text-2xl font-bold leading-none tabular-nums text-mark md:text-3xl"
                    >
                      {n}
                    </span>
                    <span className="block">
                      <span className="block text-base font-semibold text-text-1">
                        {t}
                      </span>
                      <span className="mt-1.5 block max-w-[34ch] text-sm leading-relaxed text-text-2">
                        {b}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-10 border-t border-border pt-8 text-sm leading-relaxed text-text-3">
                Rather do this over the phone?{" "}
                <a
                  href={SHOWROOM.phoneHref}
                  className="font-mono text-text-1 transition-colors hover:text-accent"
                >
                  {SHOWROOM.phoneDisplay}
                </a>
              </p>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-8">
              <CreditApplication />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
