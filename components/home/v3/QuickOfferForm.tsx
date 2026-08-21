"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { writeSellPrefill } from "@/lib/sellPrefill";

// The four-field starter. Deliberately NOT the /sell form in miniature: the
// full one asks eleven questions because it has to produce a number, and eleven
// questions is not something to put in front of somebody three screens into a
// homepage. This one asks what identifies a car and then gets out of the way —
// the rest is asked on the page it hands off to.
//
// It never blocks. There is no validation and no required field, so the button
// works as a plain "Get an offer" for anyone who ignores the inputs, and
// whatever WAS typed travels with them. A starter form that refuses you is a
// worse door than no door.

// Two palettes. The form used to sit on flat page ground; in v3 its card sits
// on a photograph, and a hairline in --border is invisible against a lit
// showroom showing through 5% of a plate. `onChrome` swaps to white-based
// rules and labels, which is the same treatment the rest of the chrome zone
// uses over imagery.
const inputBase =
  "w-full border-0 border-b bg-transparent py-3 transition-colors focus:outline-none";
const inputTone = {
  page: "border-border text-text-1 placeholder:text-text-3 focus:border-text-1",
  chrome: "border-white/25 text-white placeholder:text-white/35 focus:border-white",
};
const labelTone = {
  page: "text-text-3",
  chrome: "text-white/55",
};

function Field({
  label,
  tone,
  children,
  className,
}: {
  label: string;
  tone: "page" | "chrome";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span
        className={`mb-2 block font-accent text-[0.65rem] uppercase tracking-[0.22em] ${labelTone[tone]}`}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

export function QuickOfferForm({ onChrome = false }: { onChrome?: boolean }) {
  const tone = onChrome ? "chrome" : "page";
  const inputCls = `${inputBase} ${inputTone[tone]}`;
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);

    const data = new FormData(e.currentTarget);
    writeSellPrefill({
      year: String(data.get("year") ?? "").trim(),
      make: String(data.get("make") ?? "").trim(),
      model: String(data.get("model") ?? "").trim(),
      mileage: String(data.get("mileage") ?? "").trim(),
    });

    router.push("/sell#offer-form");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Year" tone={tone}>
          <input name="year" inputMode="numeric" autoComplete="off" className={inputCls} placeholder="2023" />
        </Field>
        <Field label="Make" tone={tone}>
          <input name="make" autoComplete="off" className={inputCls} placeholder="Porsche" />
        </Field>
        <Field label="Model" tone={tone}>
          <input name="model" autoComplete="off" className={inputCls} placeholder="911 Turbo S" />
        </Field>
        <Field label="Mileage" tone={tone}>
          <input name="mileage" inputMode="numeric" autoComplete="off" className={inputCls} placeholder="12,400" />
        </Field>
      </div>

      {/* "Continue", not "Get an offer" — the card is already headed that, and
          the same words twice in one small card read as a stutter. It is also
          the truer label: this button does not produce an offer, it carries
          what has been typed through to the rest of the questions. */}
      <Button type="submit" variant="accent" size="lg" withArrow disabled={busy} className="w-full">
        Continue
      </Button>
    </form>
  );
}
