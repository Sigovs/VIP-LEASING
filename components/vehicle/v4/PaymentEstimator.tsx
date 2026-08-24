"use client";

import { useMemo, useState } from "react";
import { SelectShell } from "@/components/ui/SelectShell";
import { labelCls, inputCls, selectCls, optionCls } from "@/lib/formStyles";
import { formatPrice } from "@/lib/utils";
import { SHOWROOM } from "@/lib/showroom";

// A payment estimator, borrowed from the pattern on Prestige and Vegas — and
// more apt here than on either, because leasing and financing are the whole
// proposition of this house and its vehicle page said nothing about them.
//
// ⚠️ IT QUOTES NOTHING. The buyer supplies the rate and the term; we supply the
// price. That is the only construction this business can carry: the house does
// not lend, does not set rates and does not decide anything — terms are
// arranged through outside lenders. A calculator that filled in an APR would be
// quoting one, which is exactly the line that must never be crossed.
//
// So the output is an arithmetic result of the visitor's own assumptions,
// labelled as an estimate, next to a sentence saying where a real number comes
// from. Both references do it the same way, with the rate as an input.

const TERMS = [24, 36, 48, 60, 72, 84];

function money(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** Standard amortising payment. A zero rate divides evenly rather than by zero. */
function monthlyPayment(principal: number, apr: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = apr / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function PaymentEstimator({ price }: { price: number }) {
  const [down, setDown] = useState(() => Math.round(price * 0.2));
  const [apr, setApr] = useState<string>("");
  const [term, setTerm] = useState(60);

  const financed = Math.max(0, price - (Number.isFinite(down) ? down : 0));
  const aprNum = apr === "" ? null : Number(apr);

  const payment = useMemo(() => {
    if (aprNum == null || !Number.isFinite(aprNum)) return null;
    return monthlyPayment(financed, aprNum, term);
  }, [financed, aprNum, term]);

  return (
    <div className="rounded-md border border-border bg-surface p-7 md:p-9">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Vehicle price</span>
          <input
            value={money(price)}
            readOnly
            aria-readonly
            className={`${inputCls()} cursor-default text-text-2`}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Down payment</span>
          <input
            value={money(down)}
            inputMode="numeric"
            onChange={(e) => {
              const n = Number(e.target.value.replace(/[^\d]/g, ""));
              setDown(Number.isFinite(n) ? Math.min(n, price) : 0);
            }}
            className={inputCls()}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Rate (APR %)</span>
          <input
            value={apr}
            inputMode="decimal"
            placeholder="Your lender's rate"
            onChange={(e) => setApr(e.target.value.replace(/[^\d.]/g, ""))}
            className={inputCls()}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Term</span>
          <SelectShell>
            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className={selectCls()}
            >
              {TERMS.map((t) => (
                <option key={t} value={t} className={optionCls}>
                  {t} months
                </option>
              ))}
            </select>
          </SelectShell>
        </label>
      </div>

      {/* No rule above this. Every field ends in an underline already, so a
          divider directly beneath them was a second line in a row saying the
          same thing. Space separates it instead. */}
      <div className="mt-12 flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <p className={labelCls}>Estimated monthly</p>
          {/* Nothing until a rate is entered. A figure standing there under a
              blank rate field would be read as ours. */}
          <p className="font-title text-4xl font-bold tabular-nums text-text-1 md:text-5xl">
            {payment == null ? "—" : `$${money(Math.round(payment))}`}
          </p>
        </div>
        <div className="text-right">
          <p className={labelCls}>Amount financed</p>
          <p className="text-xl font-semibold tabular-nums text-text-2">
            {formatPrice(financed)}
          </p>
        </div>
      </div>

      <p className="mt-7 max-w-[62ch] text-sm leading-relaxed text-text-3">
        An estimate from the numbers you entered, not an offer of credit.{" "}
        {SHOWROOM.name} does not lend and does not set rates — terms are arranged
        through our lending partners, and the figure they give you is the one
        that counts.
      </p>
    </div>
  );
}
