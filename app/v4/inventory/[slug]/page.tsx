import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleHero } from "@/components/vehicle/v4/VehicleHero";
import { VehicleGallery } from "@/components/vehicle/v4/VehicleGallery";
import { SpecTable } from "@/components/vehicle/v4/SpecTable";
import { OptionsList } from "@/components/vehicle/v4/OptionsList";
import { InquireDrawer } from "@/components/vehicle/v4/InquireDrawer";
import { InquireButton } from "@/components/vehicle/v4/InquireButton";
import { DetailSubNav } from "@/components/vehicle/v4/DetailSubNav";
import { VehicleCard } from "@/components/vehicle/v4/VehicleCard";
import {
  getAllVehicles,
  getSimilarVehicles,
  getVehicleBySlug,
} from "@/lib/vehicles";
import { SHOWROOM, SITE_URL } from "@/lib/showroom";
import { formatNumber } from "@/lib/utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllVehicles().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicleBySlug(slug);
  if (!v) return { title: "Not found" };
  const title = `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ""}`;
  const description = `${title} · ${v.mileage.toLocaleString()} mi · ${v.exteriorColor}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: v.heroImage }],
    },
  };
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span aria-hidden className="h-px w-8 bg-accent" />
      <span className="font-accent text-[0.75rem] uppercase tracking-[0.24em] text-text-3">
        {label}
      </span>
    </div>
  );
}

export default async function VehiclePage({ params }: Params) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();
  const similar = getSimilarVehicles(slug, 3);

  // Canonical base — matches app/layout.tsx metadataBase.

  const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Vehicle",
        name,
        brand: { "@type": "Brand", name: vehicle.make },
        model: vehicle.model,
        vehicleModelDate: vehicle.year,
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: vehicle.mileage,
          unitCode: "SMI",
        },
        vehicleIdentificationNumber: vehicle.vin,
        color: vehicle.exteriorColor,
        vehicleTransmission: vehicle.transmission,
        driveWheelConfiguration: vehicle.drivetrain,
        offers: {
          "@type": "Offer",
          price: vehicle.price,
          priceCurrency: "USD",
          availability: vehicle.isSold
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          itemCondition: "https://schema.org/UsedCondition",
        },
        image: vehicle.gallery,
      },
      {
        // Home > Inventory > {vehicle}. No make-hub level — make landing pages
        // live in the WP port (HANDOFF.md §7a), not as Next routes, so we don't
        // emit a breadcrumb link to a path that 404s here.
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Inventory",
            item: `${SITE_URL}/inventory`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: `${SITE_URL}/inventory/${vehicle.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VehicleHero vehicle={vehicle} />
      <DetailSubNav />

      {/* Overview — the written story + performance highlights */}
      <Section id="overview" spacing="tight">
        <Container>
          <Reveal>
            <SectionEyebrow label="Overview" />
          </Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className="max-w-[56ch] text-lg md:text-xl leading-relaxed text-text-2">
                {vehicle.story}
              </p>
            </Reveal>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <dl className="border-t border-border">
                {[
                  ["Horsepower", `${formatNumber(vehicle.horsepower)} hp`],
                  ["0–60 mph", `${vehicle.zeroToSixty.toFixed(1)} s`],
                  ["Top speed", `${formatNumber(vehicle.topSpeed)} mph`],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-6 border-b border-border py-4"
                  >
                    <dt className="font-accent text-[0.875rem] uppercase tracking-[0.16em] text-text-2">
                      {k}
                    </dt>
                    <dd className="tabular-nums text-2xl md:text-[1.75rem] font-semibold tracking-[-0.01em] text-text-1">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      <Section id="gallery" spacing="tight">
        <Container>
          <Reveal>
            <SectionEyebrow label="Gallery" />
          </Reveal>
        </Container>
        <VehicleGallery
          images={vehicle.gallery}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        />
      </Section>

      {/* Specifications */}
      <Section id="specifications" spacing="tight">
        <Container>
          <Reveal>
            <SectionEyebrow label="Specifications" />
          </Reveal>
          <Reveal>
            <SpecTable vehicle={vehicle} />
          </Reveal>
        </Container>
      </Section>

      {/* Options */}
      <Section id="options" spacing="tight">
        <Container>
          <Reveal>
            <SectionEyebrow label="Options & Equipment" />
          </Reveal>
          <Reveal>
            <OptionsList options={vehicle.options} />
          </Reveal>
        </Container>
      </Section>

      {/* Similar */}
      {similar.length > 0 && (
        <Section spacing="tight">
          <Container>
            <Reveal>
              <SectionEyebrow label="Also in Stock" />
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {similar.map((v) => (
                <VehicleCard key={v.slug} vehicle={v} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Inquire — closing CTA */}
      <Section id="inquire" spacing="tight">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start gap-8 border border-border bg-surface px-8 py-12 md:flex-row md:items-center md:justify-between md:px-14 md:py-14">
              <div>
                <SectionEyebrow label="Inquire" />
                <p className="max-w-[22ch] text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-text-1">
                  Interested in this {vehicle.make} {vehicle.model}?
                </p>
                <p className="mt-3 max-w-[46ch] text-text-2 leading-relaxed">
                  Reach out for full details, more photography, or to arrange a
                  private viewing.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <InquireButton size="lg" />
                <ButtonLink
                  href={SHOWROOM.phoneHref}
                  variant="outline"
                  size="lg"
                >
                  Call {SHOWROOM.phoneDisplay}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <InquireDrawer vehicle={vehicle} />
    </>
  );
}
