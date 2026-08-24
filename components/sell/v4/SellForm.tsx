"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { SelectShell } from "@/components/ui/SelectShell";
import {
  labelCls,
  inputCls,
  selectCls,
  optionCls,
  placeholderOptionCls,
} from "@/lib/formStyles";
import {
  YEARS,
  MAKES_HOUSE,
  MAKES_OTHER,
  MAKE_FALLBACK,
  MILEAGE_BANDS,
  CONDITIONS,
} from "@/lib/vehicleOptions";
import { clearSellPrefill, readSellPrefill } from "@/lib/sellPrefill";

const schema = z.object({
  year: z.string().min(4),
  make: z.string().min(2),
  model: z.string().min(1),
  mileage: z.string().min(1),
  vin: z.string().optional(),
  condition: z.string().min(2),
  asking: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  notes: z.string().optional(),
});
type Values = z.infer<typeof schema>;

function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className={labelCls}>
        {label}
      </span>
      {children}
      {error && (
        <span className="block mt-1.5 font-accent text-[0.7rem] uppercase tracking-[0.16em] text-text-2">
          {error}
        </span>
      )}
    </label>
  );
}

export function SellForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<Values>({ resolver: zodResolver(schema) });

  // Pick up whatever the homepage's short starter collected (v2). Runs after
  // mount rather than as defaultValues, because sessionStorage does not exist
  // during the static export.
  //
  // The entry is read but NOT consumed: this form gets remounted about a
  // second into the route transition, and an entry deleted on first read left
  // the second mount with empty fields. It is cleared on submit, and expires
  // on its own (see lib/sellPrefill.ts).
  useEffect(() => {
    const stashed = readSellPrefill();
    if (!stashed) return;
    (["year", "make", "model", "mileage"] as const).forEach((k) => {
      const v = stashed[k];
      if (v) setValue(k, v);
    });
  }, [setValue]);

  const onSubmit = async (v: Values) => {
    // Placeholder. AAN wires real backend.
    console.log("[Sell submission — placeholder]", v);
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    reset();
    // The car has been submitted; nothing left to carry over.
    clearSellPrefill();
  };

  if (sent) {
    return (
      <div className="space-y-5">
        <p className="text-3xl font-semibold tracking-[-0.02em] text-text-1">Got it.</p>
        <p className="text-text-2 leading-relaxed max-w-prose">
          We&apos;ll review the details and follow up directly — usually within
          a few hours during business days. Thank you.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      <div className="space-y-5">
        <p className="font-accent text-[0.72rem] uppercase tracking-[0.3em] text-text-1 border-b border-border pb-3">
          The Car
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Field label="Year" error={errors.year?.message}>
            <SelectShell>
              <select {...register("year")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>
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
          <Field label="Make" error={errors.make?.message}>
            <SelectShell>
              <select {...register("make")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>
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
          <Field label="Model" error={errors.model?.message} className="col-span-2 md:col-span-2">
            <input {...register("model")} className={inputCls()} placeholder="911 GT3 Touring" />
          </Field>
          <Field label="Mileage" error={errors.mileage?.message}>
            <SelectShell>
              <select {...register("mileage")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>
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
          <Field label="VIN (optional)">
            <input {...register("vin")} className={inputCls()} />
          </Field>
          <Field label="Condition" error={errors.condition?.message}>
            <SelectShell>
              <select {...register("condition")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>
                  Select
                </option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c} className={optionCls}>
                    {c}
                  </option>
                ))}
              </select>
            </SelectShell>
          </Field>
          <Field label="Asking (optional)">
            <input {...register("asking")} className={inputCls()} placeholder="$285,000" />
          </Field>
        </div>
      </div>

      <div className="space-y-5">
        <p className="font-accent text-[0.72rem] uppercase tracking-[0.3em] text-text-1 border-b border-border pb-3">
          About you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Name" error={errors.name?.message}>
            <input {...register("name")} className={inputCls()} autoComplete="name" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              className={inputCls()}
              autoComplete="email"
            />
          </Field>
          <Field label="Phone" error={errors.phone?.message} className="md:col-span-2">
            <input
              {...register("phone")}
              type="tel"
              className={inputCls()}
              autoComplete="tel"
            />
          </Field>
          <Field label="Anything else" className="md:col-span-2">
            <textarea {...register("notes")} rows={3} className={`${inputCls} resize-none`} />
          </Field>
        </div>
      </div>

      <Button type="submit" variant="accent" size="lg" withArrow disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
