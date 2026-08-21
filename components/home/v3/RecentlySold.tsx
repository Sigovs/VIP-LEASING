import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { getSoldVehicles } from "@/lib/vehicles";

// Small "Recently Sold" strip. Renders nothing if there are no sold
// vehicles yet — important since the FL store isn't open. Once cars
// flip to isSold:true in data/vehicles.json, this fills in automatically.
const LIMIT = 3;

export function RecentlySold() {
  const sold = getSoldVehicles()
    .sort(
      (a, b) =>
        new Date(b.acquiredDate).getTime() -
        new Date(a.acquiredDate).getTime()
    )
    .slice(0, LIMIT);

  if (sold.length === 0) return null;

  return (
    <Section spacing="tight" className="bg-paper">
      <Container>
        <div className="mb-10 md:mb-14 flex items-end justify-between gap-6 border-b border-border pb-5 md:pb-6">
          <h2 className="title-mark font-title text-3xl md:text-5xl font-bold text-text-1 leading-[1.0]">
            Recently Sold
          </h2>
          <Link
            href="/sold"
            className="group hidden sm:inline-flex items-center gap-2 pb-1 text-xs font-accent tracking-[0.16em] text-text-2 hover:text-accent transition-colors"
          >
            View Sold
            <ChevronRight
              className="h-3.5 w-3.5 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
              strokeWidth={1.75}
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-x-10 md:gap-y-12">
          {sold.map((v, i) => (
            <Reveal key={v.slug} delay={(i % 3) * 0.05}>
              <VehicleCard vehicle={v} showPrice={false} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
