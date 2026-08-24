"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { SelectShell } from "@/components/ui/SelectShell";
import { SHOWROOM } from "@/lib/showroom";
import {
  labelCls,
  inputCls,
  selectCls,
  optionCls,
  placeholderOptionCls,
} from "@/lib/formStyles";

// The credit application.
//
// ⚠️ MOCKUP. Nothing is transmitted. `onSubmit` below is the same placeholder
// every other form on this site carries — it waits, then shows the sent state.
// That is deliberate at this stage and it is also the only reason this page is
// safe to publish, because of what it asks for.
//
// ⚠️ BEFORE THIS GOES LIVE — the two things that must be true, both recorded in
// HANDOFF.md §5:
//
//   1. The submission is encrypted end to end and lands somewhere access
//      controlled. A credit application carries a date of birth, an address
//      history and — in the real thing — a social security number. Plain email
//      is not a transport for that, and "send the completed form to
//      sales@thevipleasing.com" cannot be implemented as a mailto or an
//      unencrypted form-to-email relay.
//   2. sales@thevipleasing.com exists. The client said themselves it does not
//      yet. It lives in lib/showroom.ts, so the day it does, nothing here
//      changes.
//
// ⚠️ NO SSN FIELD, on purpose. A real application asks for one; this one asks
// for everything else and stops there. A social security number typed into a
// preview that posts nowhere is a real number sitting in a real browser's
// autofill for no reason at all. It belongs in the step that happens after a
// secure channel exists, and the note under the form says so.
//
// ⚠️ NOT IN-HOUSE. The house arranges terms through outside lenders and lends
// nothing itself — every line here has to hold that. No rates, no terms, no
// approvals, no promises about a decision.

const schema = z.object({
  // The car
  vehicle: z.string().optional(),
  amount: z.string().optional(),
  down: z.string().optional(),
  // The applicant
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Check this"),
  phone: z.string().min(7, "Required"),
  dob: z.string().min(4, "Required"),
  // Where they live
  street: z.string().min(4, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  zip: z.string().min(5, "Required"),
  housing: z.string().min(2, "Required"),
  housingPayment: z.string().optional(),
  yearsAtAddress: z.string().min(1, "Required"),
  // What they earn
  employer: z.string().min(2, "Required"),
  occupation: z.string().optional(),
  yearsEmployed: z.string().min(1, "Required"),
  income: z.string().min(1, "Required"),
  otherIncome: z.string().optional(),
  notes: z.string().optional(),
  consent: z.literal(true, {
    message: "We need your authorization to continue",
  }),
});
type Values = z.infer<typeof schema>;

const STATES = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");
const HOUSING = ["Own", "Rent", "Live with family", "Other"];
const YEARS = ["Under 1 year", "1–2 years", "3–5 years", "6–10 years", "Over 10 years"];

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className={labelCls}>{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 block font-accent text-[0.75rem] uppercase tracking-[0.14em] text-signal">
          {error}
        </span>
      )}
    </label>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <p className="border-b border-border pb-3 font-accent text-[0.8125rem] uppercase tracking-[0.28em] text-text-1">
        {title}
      </p>
      {children}
    </div>
  );
}

export function CreditApplication() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: Values) => {
    // Placeholder, like every form here. AAN wires the real transport — and it
    // has to be a real one; see the note at the top of this file.
    console.log("[Credit application — placeholder, nothing sent]", v);
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    reset();
  };

  if (sent) {
    return (
      <div className="space-y-5">
        <p className="font-title text-3xl font-bold tracking-[-0.02em] text-text-1 md:text-4xl">
          Received.
        </p>
        <p className="max-w-prose leading-relaxed text-text-2">
          We&apos;ll take it to our lending partners and come back to you
          directly — usually within one business day. If anything is missing
          we&apos;ll call before we send it anywhere.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Start another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12" noValidate>
      <Fieldset title="The Car">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Field label="Vehicle of interest" className="md:col-span-2">
            <input
              {...register("vehicle")}
              className={inputCls()}
              placeholder="2024 Ferrari SF90 Spider"
            />
          </Field>
          <Field label="Amount to finance">
            <input {...register("amount")} className={inputCls()} placeholder="$" />
          </Field>
          <Field label="Down payment">
            <input {...register("down")} className={inputCls()} placeholder="$" />
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="About You">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Field label="First name" error={errors.firstName?.message} className="md:col-span-2">
            <input {...register("firstName")} className={inputCls()} autoComplete="given-name" />
          </Field>
          <Field label="Last name" error={errors.lastName?.message} className="md:col-span-2">
            <input {...register("lastName")} className={inputCls()} autoComplete="family-name" />
          </Field>
          <Field label="Email" error={errors.email?.message} className="md:col-span-2">
            <input {...register("email")} type="email" className={inputCls()} autoComplete="email" />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <input {...register("phone")} type="tel" className={inputCls()} autoComplete="tel" />
          </Field>
          <Field label="Date of birth" error={errors.dob?.message}>
            <input {...register("dob")} type="date" className={inputCls()} />
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="Where You Live">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Field label="Street address" error={errors.street?.message} className="md:col-span-4">
            <input {...register("street")} className={inputCls()} autoComplete="street-address" />
          </Field>
          <Field label="City" error={errors.city?.message} className="md:col-span-2">
            <input {...register("city")} className={inputCls()} autoComplete="address-level2" />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <SelectShell>
              <select {...register("state")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>Select</option>
                {STATES.map((s) => (
                  <option key={s} value={s} className={optionCls}>{s}</option>
                ))}
              </select>
            </SelectShell>
          </Field>
          <Field label="ZIP" error={errors.zip?.message}>
            <input {...register("zip")} className={inputCls()} inputMode="numeric" autoComplete="postal-code" />
          </Field>
          <Field label="Housing" error={errors.housing?.message}>
            <SelectShell>
              <select {...register("housing")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>Select</option>
                {HOUSING.map((h) => (
                  <option key={h} value={h} className={optionCls}>{h}</option>
                ))}
              </select>
            </SelectShell>
          </Field>
          <Field label="Monthly payment">
            <input {...register("housingPayment")} className={inputCls()} placeholder="$" />
          </Field>
          <Field label="Time at address" error={errors.yearsAtAddress?.message} className="md:col-span-2">
            <SelectShell>
              <select {...register("yearsAtAddress")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>Select</option>
                {YEARS.map((y) => (
                  <option key={y} value={y} className={optionCls}>{y}</option>
                ))}
              </select>
            </SelectShell>
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="Work & Income">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Field label="Employer" error={errors.employer?.message} className="md:col-span-2">
            <input {...register("employer")} className={inputCls()} autoComplete="organization" />
          </Field>
          <Field label="Occupation" className="md:col-span-2">
            <input {...register("occupation")} className={inputCls()} />
          </Field>
          <Field label="Time employed" error={errors.yearsEmployed?.message} className="md:col-span-2">
            <SelectShell>
              <select {...register("yearsEmployed")} defaultValue="" className={selectCls()}>
                <option value="" className={placeholderOptionCls()}>Select</option>
                {YEARS.map((y) => (
                  <option key={y} value={y} className={optionCls}>{y}</option>
                ))}
              </select>
            </SelectShell>
          </Field>
          <Field label="Gross monthly income" error={errors.income?.message}>
            <input {...register("income")} className={inputCls()} placeholder="$" />
          </Field>
          <Field label="Other monthly income">
            <input {...register("otherIncome")} className={inputCls()} placeholder="$" />
          </Field>
        </div>
        {/* Regulation B, and it is not optional wording. An applicant may not be
            required to disclose these, so the form has to say so where it asks
            about income. */}
        <p className="max-w-[68ch] text-sm leading-relaxed text-text-3">
          Alimony, child support, or separate maintenance income need not be
          revealed if you do not wish it considered as a basis for repaying this
          obligation.
        </p>
      </Fieldset>

      <Fieldset title="Anything Else">
        <Field label="Notes">
          <textarea {...register("notes")} rows={3} className={inputCls()} />
        </Field>
      </Fieldset>

      <div className="space-y-6 border-t border-border pt-9">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            {...register("consent")}
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--mark)]"
          />
          <span className="max-w-[70ch] text-sm leading-relaxed text-text-2">
            I authorize {SHOWROOM.name} to submit this application to its
            lending partners, and to obtain a consumer credit report in
            connection with it. {SHOWROOM.name} does not lend and does not make
            credit decisions — terms are offered by the lender, and nothing here
            is an approval or an offer of credit.
          </span>
        </label>
        {errors.consent && (
          <p className="font-accent text-[0.75rem] uppercase tracking-[0.14em] text-signal">
            {errors.consent.message}
          </p>
        )}

        {/* Said out loud rather than left to the reader. A form asking for a
            date of birth and an income owes the person a sentence about what
            happens to it. */}
        <p className="max-w-[70ch] text-sm leading-relaxed text-text-3">
          We never ask for a social security number on this page. If a lender
          needs one, they will ask you directly over their own secure channel.
          Questions before you send anything?{" "}
          <a
            href={SHOWROOM.phoneHref}
            className="font-mono text-text-1 transition-colors hover:text-accent"
          >
            {SHOWROOM.phoneDisplay}
          </a>
        </p>

        <Button type="submit" variant="accent" size="lg" withArrow disabled={isSubmitting}>
          Submit application
        </Button>
      </div>
    </form>
  );
}
