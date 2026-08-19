import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { getSoldVehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Recently Sold",
  description:
    "A record of the cars VIP Leasing has placed with their next owners.",
};

export default function SoldPage() {
  // Most recent placements first, matching the home Recently Sold strip.
  const sold = getSoldVehicles().sort(
    (a, b) =>
      new Date(b.acquiredDate).getTime() - new Date(a.acquiredDate).getTime()
  );

  return (
    <>
      <header className="pt-24 md:pt-32 pb-6 md:pb-8 border-b border-border">
        <Container>
          <span aria-hidden className="block h-0.5 w-12 bg-mark mb-5 md:mb-6" />
          <h1 className="title-mark font-title text-5xl md:text-7xl font-bold text-text-1 leading-[1.0]">
            Recently Sold
          </h1>
        </Container>
      </header>

      <Section spacing="tight" className="pt-10 md:pt-14">
        <Container>
          {sold.length > 0 ? (
            // Sold cars run price-free — the number belonged to the deal, the
            // card is the proof. Same discreet treatment as the home strip.
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-10 md:gap-y-16">
              {sold.map((v, i) => (
                <Reveal key={v.slug} delay={(i % 3) * 0.05}>
                  <VehicleCard vehicle={v} showPrice={false} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="border border-border bg-surface px-8 py-20 text-center">
              <p className="font-sans text-2xl md:text-3xl font-bold text-text-1">
                The first placements are in motion.
              </p>
              <p className="mx-auto mt-3 max-w-[44ch] text-text-2 leading-relaxed">
                Sold cars will appear here as deals close. In the meantime, the
                showroom floor is live.
              </p>
              <Link
                href="/inventory"
                className="group mt-8 inline-flex items-center gap-2 font-accent text-[0.75rem] uppercase tracking-[0.22em] text-text-1 hover:text-accent transition-colors"
              >
                View the inventory
                <ChevronRight
                  className="h-4 w-4 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  strokeWidth={1.75}
                />
              </Link>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
