"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";

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

const inputCls =
  "w-full bg-transparent border-0 border-b border-border focus:border-text-1 focus:outline-none py-3 text-text-1 placeholder:text-text-3 transition-colors";

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
      <span className="font-accent text-[0.65rem] uppercase tracking-[0.22em] text-text-3 block mb-2">
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
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: Values) => {
    // Placeholder. AAN wires real backend.
    console.log("[Sell submission — placeholder]", v);
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    reset();
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
            <input {...register("year")} className={inputCls} placeholder="2023" />
          </Field>
          <Field label="Make" error={errors.make?.message}>
            <input {...register("make")} className={inputCls} placeholder="Porsche" />
          </Field>
          <Field label="Model" error={errors.model?.message} className="col-span-2 md:col-span-2">
            <input {...register("model")} className={inputCls} placeholder="911 GT3 Touring" />
          </Field>
          <Field label="Mileage" error={errors.mileage?.message}>
            <input {...register("mileage")} className={inputCls} placeholder="6,200" />
          </Field>
          <Field label="VIN (optional)">
            <input {...register("vin")} className={inputCls} />
          </Field>
          <Field label="Condition" error={errors.condition?.message}>
            <input
              {...register("condition")}
              className={inputCls}
              placeholder="Excellent"
            />
          </Field>
          <Field label="Asking (optional)">
            <input {...register("asking")} className={inputCls} placeholder="$285,000" />
          </Field>
        </div>
      </div>

      <div className="space-y-5">
        <p className="font-accent text-[0.72rem] uppercase tracking-[0.3em] text-text-1 border-b border-border pb-3">
          About you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Name" error={errors.name?.message}>
            <input {...register("name")} className={inputCls} autoComplete="name" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              className={inputCls}
              autoComplete="email"
            />
          </Field>
          <Field label="Phone" error={errors.phone?.message} className="md:col-span-2">
            <input
              {...register("phone")}
              type="tel"
              className={inputCls}
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
