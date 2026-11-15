/**
 * Site-wide settings. Most day-to-day edits happen in this folder (src/content).
 * Anything in [BRACKETS] is a placeholder you still need to fill in.
 */
export const site = {
  name: "RealtyCare.io",
  shortName: "RealtyCare",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://realtycare.io",
  description:
    "The all-in-one platform for realtors and brokerages. We run your ads, call every lead within 60 seconds, follow up for months and set the appointment.",

  /** Paste your Calendly (or similar) link here. When empty, "Book a call" buttons open the /book form. */
  bookingUrl: "",

  contactEmail: "hello@realtycare.io", // [CONFIRM]
  legalName: "[UK COMPANY NAME] Ltd", // shown in the footer and legal pages
  companyNumber: "[COMPANY NUMBER]",
  address: "[REGISTERED ADDRESS], United Kingdom",

  social: {
    instagram: "", // full URLs; empty ones are hidden
    facebook: "",
    linkedin: "",
  },

  /**
   * Turn on only when you have real, written permission from real clients.
   * Fake testimonials break FTC rules in the US. Edit them in content/testimonials.ts.
   */
  showTestimonials: false,
} as const;

export const nav = [
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Calculator", href: "/calculator" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const footerLinks = [
  { label: "AI calling and follow-up", href: "/product#calling" },
  { label: "CRM and pipeline", href: "/product#crm" },
  { label: "Facebook, Instagram and Google ads", href: "/product#ads" },
  { label: "Websites and landing pages", href: "/pricing#websites" },
  { label: "Pricing", href: "/pricing" },
  { label: "Ad budget calculator", href: "/calculator" },
] as const;

/** The 60-second claim must always carry this footnote. */
export const sixtySecondFootnote =
  "*For leads from connected forms and Facebook lead ads, during calling hours in the lead’s time zone, who agreed to be contacted.";

/** "Book a call" target: your booking link if set, otherwise the on-site form. */
export const bookHref = site.bookingUrl || "/book";
