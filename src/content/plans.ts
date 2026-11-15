/**
 * Plans and prices. The pricing page AND the calculator both read from this file,
 * so a price change here updates everywhere.
 */

export type PlanId = "solo" | "essentials" | "growth" | "pro" | "brokerage";

export type Plan = {
  id: PlanId;
  name: string;
  /** Monthly fee in USD. null = custom quote. */
  fee: number | null;
  /** Short line under the name on the pricing card. */
  pitch: string;
  /** Monthly usage included. null = custom. */
  limits: { leads: number | null; minutes: number | null; texts: number | null; emails: number | null };
  /** Does RealtyCare run the ads on this plan? */
  managesAds: boolean;
  /** Suggested minimum monthly ad budget (paid to Meta/Google). */
  suggestedAdBudget: number;
  followUp: string;
  recommended?: boolean;
  /** Bullets on the pricing card. */
  includes: string[];
  notIncluded?: string[];
  /** Rows in the comparison table. */
  table: {
    adsManaged: string;
    adDesigns: string;
    social: string;
    website: string;
    landingPages: string;
    crm: string;
    liveTransfer: string;
    reactivation: string;
    reporting: string;
  };
};

export const plans: Plan[] = [
  {
    id: "solo",
    name: "Solo",
    fee: 349,
    pitch: "10–50 leads a month. Every one gets a call.",
    limits: { leads: 50, minutes: 250, texts: 400, emails: 1000 },
    managesAds: false,
    suggestedAdBudget: 0,
    followUp: "6 months",
    includes: ["AI call within 60 seconds*", "Qualifying and booking", "6-month follow-up", "1 landing page", "CRM connection"],
    notIncluded: ["Full website", "Ad management", "Live transfer"],
    table: { adsManaged: "—", adDesigns: "—", social: "—", website: "Landing page only", landingPages: "1", crm: "Connect yours", liveTransfer: "—", reactivation: "—", reporting: "Monthly" },
  },
  {
    id: "essentials",
    name: "Essentials",
    fee: 799,
    pitch: "You have leads. We call every one.",
    limits: { leads: 150, minutes: 750, texts: 1500, emails: 5000 },
    managesAds: false,
    suggestedAdBudget: 0,
    followUp: "12 months",
    includes: ["Everything in Solo", "12-month follow-up", "Email follow-up", "5-page website", "Monthly report"],
    notIncluded: ["Ads management", "Live transfer"],
    table: { adsManaged: "—", adDesigns: "—", social: "—", website: "5 pages", landingPages: "1", crm: "Included", liveTransfer: "—", reactivation: "—", reporting: "Monthly" },
  },
  {
    id: "growth",
    name: "Growth",
    fee: 1499,
    pitch: "We run your ads and call every lead.",
    limits: { leads: 300, minutes: 1500, texts: 3000, emails: 10000 },
    managesAds: true,
    suggestedAdBudget: 1000,
    followUp: "12 months",
    recommended: true,
    includes: ["Everything in Essentials", "Facebook and Instagram ads", "4 ad designs a month", "Live transfer", "3 landing pages", "CRM setup and email nurture"],
    notIncluded: ["Google ads", "Social content"],
    table: { adsManaged: "Facebook + Instagram", adDesigns: "4 a month", social: "—", website: "5 pages", landingPages: "3", crm: "Set up for you", liveTransfer: "Yes", reactivation: "—", reporting: "Monthly" },
  },
  {
    id: "pro",
    name: "Pro",
    fee: 2999,
    pitch: "Every channel, content and an MLS site.",
    limits: { leads: 600, minutes: 3000, texts: 6000, emails: 25000 },
    managesAds: true,
    suggestedAdBudget: 2500,
    followUp: "12 months",
    includes: ["Everything in Growth", "Google ads", "8 ad designs a month", "Social posts and videos", "10-page site with MLS search", "Old-lead reactivation", "Weekly report"],
    table: { adsManaged: "Facebook, Instagram, Google", adDesigns: "8 a month", social: "12 posts + 2 videos", website: "10 pages + MLS", landingPages: "Unlimited", crm: "Set up for you", liveTransfer: "Yes", reactivation: "300 a month", reporting: "Weekly" },
  },
  {
    id: "brokerage",
    name: "Brokerage",
    fee: null,
    pitch: "Teams and brokerages with several agents.",
    limits: { leads: 1000, minutes: null, texts: null, emails: null },
    managesAds: true,
    suggestedAdBudget: 0,
    followUp: "12 months",
    includes: ["Everything in Pro", "Leads routed to each agent", "Custom AI voice and scripts", "Dedicated account manager"],
    table: { adsManaged: "All channels", adDesigns: "Custom", social: "Custom", website: "Team site", landingPages: "Unlimited", crm: "Team setup", liveTransfer: "Routed per agent", reactivation: "Custom", reporting: "Weekly + manager" },
  },
];

export const overage = { perLead: 2, perMinute: 0.4, perText: 0.04 };

export const terms = {
  setupFee: 0,
  startTerm: "3-month start, then month-to-month",
};

export const landingPageOffer = {
  price: 299,
  hosting: 29,
  extraPage: 199,
  description: "A home valuation, buyer guide or listing page, connected to your CRM. Add AI calling any time.",
};

export const websitePlans = [
  { name: "Essential", monthly: 99, buildOnce: 799, hosting: 49, features: ["5 pages", "Lead forms and CRM connection", "Basic SEO setup"] },
  { name: "Pro", monthly: 199, buildOnce: 1499, hosting: 79, features: ["Up to 10 pages", "MLS property search (provider fee extra)", "Blog and home valuation tool"] },
  { name: "Custom", monthly: 299, buildOnce: 2999, hosting: 99, from: true, features: ["Custom design, unlimited pages", "Team profiles", "Priority updates"] },
];

export const addOns = [
  { name: "Google Business Profile setup", price: 249 },
  { name: "Lead magnet (guide or valuation)", price: 199 },
  { name: "Email sequence, written for you", price: 249 },
  { name: "Social media starter kit", price: 299 },
  { name: "CRM setup and import", price: 299 },
  { name: "Extra ad designs", price: 249, monthly: true },
];

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
