// Google reviews.
//
// The shape below is the Google Places API's `reviews` entry, field for field:
// author_name, profile_photo_url, rating, relative_time_description, text. That
// is deliberate — connecting the real feed should be swapping where this array
// comes from, not rewriting the component that renders it.
//
// ⚠️ SIMULATED CONTENT. Every entry is written, not collected. It exists so the
// block can be judged as a design with real-length text in it, which is what a
// client presentation needs. NOTHING HERE IS A REVIEW SOMEBODY LEFT.
//
// Each entry carries `placeholder: true`. That flag is the thing standing
// between a mockup and a page that publishes invented five-star reviews under
// invented names — do not strip it to "clean up the data". It clears itself
// when the real feed replaces the array.
//
// To connect the real thing:
//   1. Get the place id for the showroom (Places "Find Place" by name/address).
//   2. Places Details with fields=rating,user_ratings_total,reviews.
//   3. Cache the response server-side — the endpoint is billed per call and
//      returns at most five reviews.
//   4. Map it onto GoogleReview[] and set AGGREGATE from rating /
//      user_ratings_total.

export type GoogleReview = {
  author_name: string;
  profile_photo_url?: string;
  rating: number; // 1–5
  relative_time_description: string;
  text: string;
  /** True while the entry is written rather than collected. */
  placeholder?: boolean;
};

/** Aggregate shown beside the heading. Simulated, like the reviews — replace
 *  with `rating` / `user_ratings_total` straight from the Places response. */
export const AGGREGATE: {
  rating: number;
  total: number;
  /** Simulated, like the reviews. A grep for "placeholder" finds every invented
   *  value on the site at once, and this is one of them. */
  placeholder?: boolean;
} | null = {
  rating: 4.9,
  total: 63,
  placeholder: true,
};

export const REVIEWS: GoogleReview[] = [
  {
    author_name: "Marcus D.",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Leased through them after two dealers wasted a month of my time. Terms came back the same day, the numbers were exactly what we discussed, and the car was on my driveway in Coral Gables that Friday. No games.",
    placeholder: true,
  },
  {
    author_name: "Elena R.",
    rating: 5,
    relative_time_description: "a month ago",
    text: "I had questions about financing versus leasing and they walked me through both without pushing either one. Ended up financing. The paperwork was ready when I arrived — I was out in under an hour.",
    placeholder: true,
  },
  {
    author_name: "Andre P.",
    rating: 5,
    relative_time_description: "3 months ago",
    text: "Second car from them. They found the spec I wanted, sent photos and the report before I committed, and handled delivery up to Palm Beach. Communication is what sets them apart — you always know where things stand.",
    placeholder: true,
  },
];
