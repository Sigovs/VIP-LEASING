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

const inputCls =
  "w-full border-0 border-b border-border bg-transparent py-3 text-text-1 transition-colors placeholder:text-text-3 focus:border-text-1 focus:outline-none";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-2 block font-accent text-[0.65rem] uppercase tracking-[0.22em] text-text-3">
        {label}
      </span>
      {children}
    </label>
  );
}

export function QuickOfferForm() {
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
        <Field label="Year">
          <input name="year" inputMode="numeric" autoComplete="off" className={inputCls} placeholder="2023" />
        </Field>
        <Field label="Make">
          <input name="make" autoComplete="off" className={inputCls} placeholder="Porsche" />
        </Field>
        <Field label="Model">
          <input name="model" autoComplete="off" className={inputCls} placeholder="911 Turbo S" />
        </Field>
        <Field label="Mileage">
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
