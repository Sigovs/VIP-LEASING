import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SHOWROOM } from "@/lib/showroom";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { SpecTable } from "@/components/vehicle/SpecTable";
import { HistoryTimeline } from "@/components/vehicle/HistoryTimeline";
import { OptionsList } from "@/components/vehicle/OptionsList";
import { getActiveVehicles } from "@/lib/vehicles";

export const metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  { name: "bg", token: "var(--bg)" },
  { name: "surface", token: "var(--surface)" },
  { name: "paper", token: "var(--paper)" },
  { name: "border", token: "var(--border)" },
  { name: "text-1", token: "var(--text-1)" },
  { name: "text-2", token: "var(--text-2)" },
  { name: "text-3", token: "var(--text-3)" },
  { name: "accent", token: "var(--accent)" },
  { name: "accent-hover", token: "var(--accent-hover)" },
  { name: "chrome-bg", token: "var(--chrome-bg)" },
  { name: "chrome-text-1", token: "var(--chrome-text-1)" },
  { name: "chrome-text-3", token: "var(--chrome-text-3)" },
];

export default function StyleguidePage() {
  const sample = getActiveVehicles()[0];

  return (
    <Container className="py-32 md:py-40 space-y-24">
      <header className="space-y-3">
        <Eyebrow>Styleguide · internal only</Eyebrow>
        <DisplayHeading as="h1" size="xl">
          The system.
        </DisplayHeading>
      </header>

      <Section spacing="tight">
        <Eyebrow>Type · Display</Eyebrow>
        <div className="mt-8 space-y-8">
          <DisplayHeading size="xl">Performance, curated.</DisplayHeading>
          <DisplayHeading size="lg">The current collection.</DisplayHeading>
          <DisplayHeading size="md">A single showroom, one standard.</DisplayHeading>
          <DisplayHeading size="sm" as="h3">Service & ownership history.</DisplayHeading>
        </div>
      </Section>

      <Section spacing="tight">
        <Eyebrow>Type · Body & numerics</Eyebrow>
        <div className="mt-8 grid md:grid-cols-2 gap-12">
          <p className="text-text-2 leading-relaxed text-[1.05rem]">
            Body copy in the sans system. Generous leading, slightly muted
            color (text-2). Used for narrative paragraphs and long-form
            content. Comfortable measure around 60ch.
          </p>
          <div className="space-y-2">
            <p className="tabular-nums text-base font-semibold tracking-[-0.01em] text-accent">$379,000</p>
            <p className="tabular-nums text-base text-text-1">6,210 mi</p>
            <p className="tabular-nums text-base text-text-1">518 hp · 3.0 s</p>
            <p className="font-accent text-[0.65rem] uppercase tracking-[0.22em] text-text-3">
              Vehicle prices &amp; specs — sans, tabular numerals
            </p>
            <p className="font-mono text-sm text-text-1 pt-4">{SHOWROOM.phoneDisplay}</p>
            <p className="font-accent text-[0.65rem] uppercase tracking-[0.22em] text-text-3">
              Mono — contact &amp; data textures only
            </p>
          </div>
        </div>
      </Section>

      <Section spacing="tight">
        <Eyebrow>Color</Eyebrow>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {SWATCHES.map((s) => (
            <div key={s.name} className="border border-border">
              <div
                className="aspect-square"
                style={{ background: s.token }}
              />
              <div className="p-3 font-accent text-[0.65rem] uppercase tracking-[0.18em] text-text-2 flex justify-between">
                <span>{s.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="tight">
        <Eyebrow>Buttons</Eyebrow>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button variant="accent">Accent</Button>
          <Button variant="solid">Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="accent" size="lg" withArrow>Accent Large</Button>
          <ButtonLink href="/inventory" variant="outline" size="lg" withArrow>
            Link Button
          </ButtonLink>
        </div>
      </Section>

      {sample && (
        <>
          <Section spacing="tight">
            <Eyebrow>Vehicle Card · default</Eyebrow>
            <div className="mt-8 max-w-md">
              <VehicleCard vehicle={sample} />
            </div>
          </Section>

          <Section spacing="tight">
            <Eyebrow>Vehicle Card · feature</Eyebrow>
            <div className="mt-8">
              <VehicleCard vehicle={sample} variant="feature" />
            </div>
          </Section>

          <Section spacing="tight">
            <Eyebrow>Spec table</Eyebrow>
            <div className="mt-8">
              <SpecTable vehicle={sample} />
            </div>
          </Section>

          <Section spacing="tight">
            <Eyebrow>Options list</Eyebrow>
            <div className="mt-8">
              <OptionsList options={sample.options} />
            </div>
          </Section>

          <Section spacing="tight">
            <Eyebrow>History timeline</Eyebrow>
            <div className="mt-8">
              <HistoryTimeline events={sample.history} />
            </div>
          </Section>
        </>
      )}
    </Container>
  );
}
