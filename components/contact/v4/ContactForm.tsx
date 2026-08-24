"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { labelCls, inputCls } from "@/lib/formStyles";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5),
});
type Values = z.infer<typeof schema>;


export function ContactForm({
  heading = "Tell us what you're looking for.",
  defaultMessage = "",
}: {
  // The /contact page swaps these on ?intent= (viewing / financing) so a CTA
  // like "Book a Viewing" lands on a form already framed for that ask.
  heading?: string;
  defaultMessage?: string;
}) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { message: defaultMessage },
  });

  const onSubmit = async (v: Values) => {
    console.log("[Contact submission — placeholder]", v);
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
    reset();
  };

  return (
    <div>
      <DisplayHeading as="h2" size="lg" className="mb-12 max-w-[22ch]">
        {heading}
      </DisplayHeading>
      {sent ? (
        <div className="space-y-4">
          <p className="text-3xl font-semibold tracking-[-0.02em] text-text-1">Thank you.</p>
          <p className="text-text-2 leading-relaxed">
            We&apos;ll be in touch within one business day.
          </p>
          <Button variant="outline" onClick={() => setSent(false)}>
            Send another
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
              <span className={labelCls}>
                Name
              </span>
              <input {...register("name")} className={inputCls()} autoComplete="name" />
              {errors.name && (
                <span className="block mt-1.5 font-accent text-[0.7rem] uppercase tracking-[0.16em] text-text-2">
                  {errors.name.message}
                </span>
              )}
            </label>
            <label>
              <span className={labelCls}>
                Email
              </span>
              <input {...register("email")} type="email" className={inputCls()} autoComplete="email" />
              {errors.email && (
                <span className="block mt-1.5 font-accent text-[0.7rem] uppercase tracking-[0.16em] text-text-2">
                  {errors.email.message}
                </span>
              )}
            </label>
          </div>
          <label className="block">
            <span className={labelCls}>
              Phone
            </span>
            <input {...register("phone")} type="tel" className={inputCls()} autoComplete="tel" />
          </label>
          <label className="block">
            <span className={labelCls}>
              Message
            </span>
            <textarea {...register("message")} rows={5} className={`${inputCls()} min-h-[9rem] resize-y leading-relaxed`} />
            {errors.message && (
              <span className="block mt-1.5 font-accent text-[0.7rem] uppercase tracking-[0.16em] text-text-2">
                {errors.message.message}
              </span>
            )}
          </label>
          <Button type="submit" variant="accent" size="lg" withArrow disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send"}
          </Button>
        </form>
      )}
    </div>
  );
}
