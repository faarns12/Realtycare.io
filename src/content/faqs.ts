export type Faq = { q: string; a: string };

export const homeFaqs: Faq[] = [
  {
    q: "How quickly does RealtyCare contact new leads?",
    a: "For leads from your connected forms and Facebook lead ads, our AI assistant calls within 60 seconds during calling hours in the lead’s time zone. After hours it sends a text right away and calls when calling hours start.",
  },
  {
    q: "What happens if a lead doesn’t answer?",
    a: "The assistant texts, then tries again on a set schedule over the next days and weeks. Leads who aren’t ready stay on follow-up for up to 12 months, depending on your plan.",
  },
  {
    q: "Can the AI qualify leads and book appointments?",
    a: "Yes. It asks your questions (timeline, budget, pre-approval, area, property type), books serious leads straight onto your calendar, or transfers them to you live on Growth and above.",
  },
  {
    q: "Do I get a CRM and pipeline?",
    a: "Yes. Every lead, call recording, summary and next step is saved. You can use our pipeline or connect the CRM you already have.",
  },
  {
    q: "Is it legal to call leads with AI?",
    a: "We only call leads who agreed to be contacted, check Do Not Call lists, respect calling hours and the assistant says it’s an AI. Your lead forms need clear consent wording, and we help you set that up.",
  },
  {
    q: "Is there a contract or setup fee?",
    a: "No setup fee. Plans start with a 3-month term so the ads and follow-up have time to work, then go month-to-month.",
  },
];

export const pricingFaqs: Faq[] = [
  {
    q: "What do I pay besides the monthly fee?",
    a: "Only your ad budget, which you pay directly to Meta or Google, and any usage over your plan’s limits. We never mark up your ad spend.",
  },
  { q: "Is there a setup fee?", a: "No. Plans start with a 3-month term, then go month-to-month." },
  {
    q: "What if I get more leads than my plan covers?",
    a: "Extra leads are $2 each, extra call minutes $0.40 and extra texts $0.04. We tell you before you go over, and suggest a bigger plan if it would cost less.",
  },
  {
    q: "What happens to my website if I cancel?",
    a: "If you bought the site with a one-time build fee, it’s yours and we can hand it over. Sites included in a monthly plan stay online while the plan is active.",
  },
];
