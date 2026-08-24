import type { Vehicle } from "@/types/vehicle";
import { formatNumber } from "@/lib/utils";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_1.2fr] gap-6 py-5 border-b border-border last:border-b-0">
      <dt className="font-accent text-[0.8125rem] uppercase tracking-[0.16em] text-text-2">
        {label}
      </dt>
      <dd className="text-base text-text-1 tabular-nums">{value}</dd>
    </div>
  );
}

export function SpecTable({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
      <dl>
        <Row label="Engine" value={vehicle.engine} />
        <Row label="Drivetrain" value={vehicle.drivetrain} />
        <Row label="Transmission" value={vehicle.transmission} />
        <Row label="Horsepower" value={`${formatNumber(vehicle.horsepower)} hp`} />
        <Row label="Torque" value={`${formatNumber(vehicle.torque)} lb-ft`} />
      </dl>
      <dl>
        <Row label="0–60 mph" value={`${vehicle.zeroToSixty.toFixed(1)} s`} />
        <Row label="Top Speed" value={`${formatNumber(vehicle.topSpeed)} mph`} />
        <Row label="Curb Weight" value={`${formatNumber(vehicle.weight)} lb`} />
        <Row label="Exterior" value={vehicle.exteriorColor} />
        <Row label="Interior" value={vehicle.interiorColor} />
      </dl>
    </div>
  );
}
