import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleBuyPanel } from "@/components/vehicle/v4/VehicleBuyPanel";
import { VehicleGallery } from "@/components/vehicle/v4/VehicleGallery";
import { SpecTable } from "@/components/vehicle/v4/SpecTable";
import { PaymentEstimator } from "@/components/vehicle/v4/PaymentEstimator";
import { OptionsList } from "@/components/vehicle/v4/OptionsList";
import { InquireDrawer } from "@/components/vehicle/v4/InquireDrawer";
import { InquireButton } from "@/components/vehicle/v4/InquireButton";
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

// Section headings, in the house face.
//
// They used to be a gold hairline and a mono micro-label — a heading system
// belonging to no other page on this site, and the last piece of the reference
// build's furniture on the VDP. Everywhere else a section is announced in
// Bodoni.
//
// NOT with the title-mark, though, and not at homepage scale. This page has six
// sections; the signature bar drawn six times down one page stops reading as a
// signature and starts reading as a rule. Same face, lower rank, no ceremony —
// which is what a chapter heading inside one document should be.
function SectionEyebrow({ label }: { label: string }) {
  return (
    <h2 className="mb-9 font-title text-2xl font-bold leading-[1.1] tracking-[-0.015em] text-text-1 md:text-3xl">
      {label}
    </h2>
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

      {/* Two columns, top to bottom: the car on the left, the panel that sells
          it on the right, riding along.

          What this replaces is the reference build's opening — one hero image
          beside a panel, a sticky sub-nav of tabs under it, and the sections in
          a stack below. That arrangement is on every exotic dealer site there
          is, and it is what made this page recognisable.

          What it fixes, besides the resemblance: the panel used to scroll away
          with the hero, so the page carried a floating Inquire button and a tab
          rail to get you back to it. Both are gone — nothing to get back to
          when the price never left. */}
      <Section className="pt-24 md:pt-32" spacing="tight">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 font-accent text-[0.75rem] uppercase tracking-[0.2em] text-text-3"
          >
            <Link href="/v4/inventory" className="transition-colors hover:text-accent">
              Inventory
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate text-text-2">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              {/* The photographs are the spine. They used to be a horizontal
                  drag rail buried as the fourth section — the main evidence
                  about a car, behind a gesture most desktop visitors never
                  make. Stacked in the reading column they are simply there. */}
              <VehicleGallery
                images={vehicle.gallery}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              />

              <div className="mt-16 md:mt-20">
                <SectionEyebrow label="Overview" />
                <p className="max-w-[62ch] text-lg leading-relaxed text-text-2 md:text-xl">
                  {vehicle.story}
                </p>

                <dl className="mt-12 grid grid-cols-1 gap-x-10 border-t border-border sm:grid-cols-3">
                  {[
                    ["Horsepower", `${formatNumber(vehicle.horsepower)} hp`],
                    ["0–60 mph", `${vehicle.zeroToSixty.toFixed(1)} s`],
                    ["Top speed", `${formatNumber(vehicle.topSpeed)} mph`],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-border py-5">
                      <dt className="font-accent text-[0.875rem] uppercase tracking-[0.16em] text-text-2">
                        {k}
                      </dt>
                      <dd className="mt-2 text-2xl font-semibold tracking-[-0.01em] tabular-nums text-text-1 md:text-[1.75rem]">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-16 md:mt-20">
                <SectionEyebrow label="Specifications" />
                <SpecTable vehicle={vehicle} />
              </div>

              {/* The payment estimator, borrowed from Prestige and Vegas. It
                  quotes nothing — see the header of PaymentEstimator. */}
              {!vehicle.isSold && (
                <div className="mt-16 md:mt-20">
                  <SectionEyebrow label="Estimate a Payment" />
                  <PaymentEstimator price={vehicle.price} />
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <VehicleBuyPanel vehicle={vehicle} />
            </div>
          </div>
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
