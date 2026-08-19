import type { VehicleOptionGroup } from "@/types/vehicle";

// Watch-spec-sheet treatment: items render as plain rows with hairline dividers
// inside a 2-col layout per group. Tighter than pill tags, more scannable.
export function OptionsList({ options }: { options: VehicleOptionGroup[] }) {
  return (
    <div className="space-y-14">
      {options.map((group) => (
        <div key={group.category}>
          <h4 className="font-accent text-[0.7rem] uppercase tracking-[0.22em] text-text-3 mb-5 pb-3 border-b border-border">
            {group.category}
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {group.items.map((item) => (
              <li
                key={item}
                className="border-b border-border py-3 text-[0.95rem] text-text-1 flex items-baseline gap-3"
              >
                <span className="text-accent text-xs" aria-hidden>·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
