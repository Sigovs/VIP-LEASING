"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SelectShell } from "@/components/ui/SelectShell";
import {
  labelCls,
  inputCls,
  selectCls,
  optionCls,
  placeholderOptionCls,
  type FormTone,
} from "@/lib/formStyles";
import {
  YEARS,
  MAKES_HOUSE,
  MAKES_OTHER,
  MAKE_FALLBACK,
  MILEAGE_BANDS,
} from "@/lib/vehicleOptions";
import { writeSellPrefill } from "@/lib/sellPrefill";

// The four-field starter. Deliberately NOT the /sell form in miniature: the
// full one asks eleven questions because it has to produce a number, and eleven
// questions is not something to put in front of somebody three screens into a
// homepage. This one asks what identifies a car and then gets out of the way —
// the rest is asked on the page it hands off to.
//
// Three of the four are now menus. A make typed by hand arrives as "Mercedes",
// "Mercedes-Benz" and "mercedes benz"; a mileage typed by hand implies a
// precision nobody has while standing in a car park. Only the model has to stay
// open, because no list can hold every one. See lib/vehicleOptions.ts.
//
// It never blocks. There is no validation and no required field, so the button
// works as a plain "Continue" for anyone who ignores the menus, and whatever
// WAS chosen travels with them. A starter form that refuses you is a worse door
// than no door.

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

export function QuickOfferForm({ onChrome = false }: { onChrome?: boolean }) {
  const tone: FormTone = onChrome ? "chrome" : "page";
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
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <Field label="Year">
          <SelectShell tone={tone}>
            <select name="year" defaultValue="" className={selectCls(tone)}>
              <option value="" className={placeholderOptionCls(tone)}>
                Select
              </option>
              {YEARS.map((y) => (
                <option key={y} value={y} className={optionCls}>
                  {y}
                </option>
              ))}
            </select>
          </SelectShell>
        </Field>

        <Field label="Make">
          <SelectShell tone={tone}>
            <select name="make" defaultValue="" className={selectCls(tone)}>
              <option value="" className={placeholderOptionCls(tone)}>
                Select
              </option>
              <optgroup label="We carry">
                {MAKES_HOUSE.map((m) => (
                  <option key={m} value={m} className={optionCls}>
                    {m}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other marques">
                {MAKES_OTHER.map((m) => (
                  <option key={m} value={m} className={optionCls}>
                    {m}
                  </option>
                ))}
                <option value={MAKE_FALLBACK} className={optionCls}>
                  {MAKE_FALLBACK}
                </option>
              </optgroup>
            </select>
          </SelectShell>
        </Field>

        <Field label="Model">
          <input
            name="model"
            autoComplete="off"
            className={inputCls(tone)}
            placeholder="911 Turbo S"
          />
        </Field>

        <Field label="Mileage">
          <SelectShell tone={tone}>
            <select name="mileage" defaultValue="" className={selectCls(tone)}>
              <option value="" className={placeholderOptionCls(tone)}>
                Select
              </option>
              {MILEAGE_BANDS.map((m) => (
                <option key={m} value={m} className={optionCls}>
                  {m}
                </option>
              ))}
            </select>
          </SelectShell>
        </Field>
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        withArrow
        disabled={busy}
        className="w-full"
      >
        Continue
      </Button>
    </form>
  );
}
