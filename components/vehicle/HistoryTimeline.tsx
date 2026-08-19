import type { VehicleHistoryEvent } from "@/types/vehicle";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function HistoryTimeline({ events }: { events: VehicleHistoryEvent[] }) {
  return (
    <ol className="relative">
      {events.map((e, i) => (
        <li
          key={i}
          className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-12 py-8 border-b border-border last:border-b-0"
        >
          <div>
            <p className="font-accent text-[0.7rem] uppercase tracking-[0.22em] text-text-3">
              {formatDate(e.date)}
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xl font-semibold tracking-[-0.012em] text-text-1">
              {e.event}
            </h4>
            <p className="text-text-2 text-[0.95rem] leading-relaxed max-w-prose">
              {e.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
