/**
 * Only add real testimonials from real clients who agreed in writing.
 * They appear on the home page when `showTestimonials` is true in content/site.ts.
 *
 * `photo` is a path inside /public, e.g. "/testimonials/jane.jpg".
 */
export type Testimonial = { name: string; role: string; quote: string; photo?: string };

export const testimonials: Testimonial[] = [
  // {
  //   name: "Client name",
  //   role: "Realtor, City, State",
  //   quote: "What changed for them, in their words.",
  //   photo: "/testimonials/client.jpg",
  // },
];
