"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/contact/v4/ContactForm";

// ?intent= presets — the interior CTAs ("Book a viewing", the financing links)
// land here with the form already framed for the ask. Unknown values fall
// through to the default open-ended form.
//
// This is read on the CLIENT, not the server. Reading searchParams in the page's
// server component marked /contact as dynamic (server-rendered per request),
// which a static export cannot produce — and the GitHub Pages preview is a static
// export. The query string is a client concern anyway: it changes the form's
// framing, nothing the server needs to know about.
//
// Must sit under a <Suspense> boundary — useSearchParams suspends during
// prerender.
const INTENTS: Record<string, { heading: string; message: string }> = {
  viewing: {
    heading: "Book a private viewing.",
    message: "I'd like to book a private viewing. The car I'm interested in: ",
  },
  financing: {
    heading: "Let's structure your terms.",
    message:
      "I'd like to talk lease and finance options. The car I have in mind: ",
  },
  // Service links land pre-framed. The template is the point: a service desk
  // cannot answer "get in touch", and asking for the car, the work and a date
  // up front saves the round trip that would otherwise be the first reply.
  service: {
    heading: "Book the car in.",
    message:
      "Car: \nService needed: \nPreferred date: \nDrop-off or collection: ",
  },
};

export function IntentContactForm() {
  const intent = useSearchParams().get("intent");
  const preset = intent ? INTENTS[intent] : undefined;

  return (
    <ContactForm heading={preset?.heading} defaultMessage={preset?.message} />
  );
}
