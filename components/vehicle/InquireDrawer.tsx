"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { labelCls, inputCls } from "@/lib/formStyles";

const schema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Required"),
  message: z.string().min(5, "Tell us a little more"),
});
type FormValues = z.infer<typeof schema>;

export function InquireDrawer({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Any InquireButton on the page opens this drawer via a window event.
  useEffect(() => {
    const openDrawer = () => {
      setSent(false);
      setOpen(true);
    };
    window.addEventListener("inquire:open", openDrawer);
    return () => window.removeEventListener("inquire:open", openDrawer);
  }, []);

  const onSubmit = async (values: FormValues) => {
    // Placeholder: AAN wires the real backend. We log and show success state.
    console.log("[Inquire submission — placeholder]", {
      vehicle: vehicle.slug,
      ...values,
    });
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    reset();
  };

  return (
    <>
      {/* Floating CTA — desktop pill, mobile sticky bar */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <Button
          variant="accent"
          size="lg"
          onClick={() => {
            setSent(false);
            setOpen(true);
          }}
          withArrow
        >
          Inquire
        </Button>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-bg/95 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4">
        <p className="font-accent text-xs uppercase tracking-[0.18em] text-text-2">
          {formatPrice(vehicle.price)}
        </p>
        <Button
          variant="accent"
          onClick={() => {
            setSent(false);
            setOpen(true);
          }}
          withArrow
        >
          Inquire
        </Button>
      </div>

      {/* Drawer */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Inquire about this vehicle"
          className="fixed inset-0 z-[60] flex"
        >
          <button
            type="button"
            aria-label="Close inquiry"
            className="flex-1 bg-bg/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="w-full max-w-md bg-bg border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <p className="font-accent text-xs uppercase tracking-[0.22em] text-text-3">
                Inquire
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="text-text-2 hover:text-text-1"
              >
                <X size={20} strokeWidth={1.25} />
              </button>
            </div>

            <div className="px-8 py-8">
              <p className={labelCls}>
                {vehicle.year}
              </p>
              <h3 className="text-3xl font-semibold tracking-[-0.02em] text-text-1 mb-1">
                {vehicle.make} {vehicle.model}
              </h3>
              {vehicle.trim && (
                <p className="font-accent text-xs uppercase tracking-[0.16em] text-text-3 mb-6">
                  {vehicle.trim}
                </p>
              )}
              <p className="tabular-nums text-lg font-semibold tracking-[-0.01em] text-accent mb-10">
                {formatPrice(vehicle.price)}
              </p>

              {sent ? (
                <div className="space-y-4">
                  <p className="text-2xl font-semibold tracking-[-0.015em] text-text-1">
                    Thank you.
                  </p>
                  <p className="text-text-2 leading-relaxed">
                    A member of our team will be in touch within one business
                    day to arrange a viewing or call.
                  </p>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <Field label="Name" error={errors.name?.message}>
                    <input
                      {...register("name")}
                      type="text"
                      autoComplete="name"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Message" error={errors.message?.message}>
                    <textarea
                      {...register("message")}
                      rows={4}
                      defaultValue={`Hello — I'd like to learn more about the ${vehicle.year} ${vehicle.make} ${vehicle.model}.`}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    withArrow
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Sending…" : "Send Inquiry"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
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
