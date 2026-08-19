// Placeholder quotes for launch. Replace with real client quotes once
// collected — keep the shape (quote, name, context) so the component
// doesn't need to change.

export type Testimonial = {
  quote: string;
  name: string;
  context: string; // car bought, city, year, etc.
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Placeholder. A real client quote goes here — collected from an actual client, never written for them.",
    name: "Client name",
    context: "Car · City",
  },
  {
    quote:
      "Placeholder. Short, specific, and about the car or the transaction — never generic praise.",
    name: "Client name",
    context: "Car · City",
  },
  {
    quote:
      "Placeholder. Three is the sweet spot — enough to feel real, not so many it reads like padding.",
    name: "Client name",
    context: "Car · City",
  },
];
