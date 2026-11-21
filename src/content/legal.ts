/**
 * Privacy policy and terms text. Company details, contact info and dates come from
 * `site` (src/content/site.ts), so update them there and both pages follow.
 */
import { site } from "./site";
import { terms } from "./plans";

export type LegalSection = { heading: string; paragraphs: string[] };

const { legal } = site;

/** "RealtyCare.io (company no. 123), 1 High St" — empty fields are left out. */
const entity = [
  legal.entityName,
  legal.companyNumber && `(company no. ${legal.companyNumber})`,
].filter(Boolean).join(" ") + (legal.address ? `, ${legal.address}` : "");

const contactLine = `email ${site.contactEmail} or call ${site.phone.display}`;

export const privacySections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `${site.name} is operated by ${entity} (“${site.shortName}”, “we”, “us”). We help realtors and brokerages run ads, call and follow up with leads, and book appointments.`,
      `Questions about this policy or your data: ${contactLine}.`,
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "Details you enter in our forms: name, email, phone number, business details and calculator figures.",
      "Basic technical data such as pages visited, device and browser type, approximate location from your IP address, and campaign tags (for example utm_source).",
      "If you are a client, the lead and contact data you or your ad accounts send to us so we can call, text and follow up on your behalf.",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: [
      "To reply to you, arrange calls, send the information you asked for, provide our service to clients and improve it.",
      "If you ask for a demo call, we call or text the number you give us, including with an AI voice. Calls may be recorded and transcribed for quality and to keep notes in the CRM.",
    ],
  },
  {
    heading: "Calls and texts",
    paragraphs: [
      `We only call or text you if you agreed to it. Reply STOP to any text to opt out, or ${contactLine}. Message and data rates may apply. Message frequency varies.`,
      "We don’t share your phone number or text-messaging consent with third parties for their own marketing.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "Service providers that help us run the business, such as hosting (Vercel), Google Workspace (Google Sheets), our calling provider (Vapi), telephony carriers, and Meta and Google for ad campaigns. They may only use your data to provide their service to us.",
      "We don’t sell your personal information. We may disclose data if the law requires it.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      `We keep your data for ${legal.retentionMonths} months after our last contact with you, unless the law requires us to keep it longer. Then we delete or anonymise it.`,
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "We use access controls, encrypted connections (HTTPS) and reputable providers to protect your data. No system is perfectly secure, so please contact us straight away if you think your data has been put at risk.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Depending on where you live (including under UK GDPR and US state laws such as the CCPA), you can ask to access, correct or delete your data, object to how we use it, or opt out of marketing.",
      `To make a request, ${contactLine}. We’ll reply within 30 days. In the UK you can also complain to the Information Commissioner’s Office (ico.org.uk).`,
    ],
  },
  {
    heading: "Changes",
    paragraphs: ["We’ll post any changes on this page with a new “last updated” date."],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: "Agreement",
    paragraphs: [
      `These terms are between you and ${entity} (“${site.shortName}”, “we”, “us”). By using our website or services you agree to them.`,
    ],
  },
  {
    heading: "Our services",
    paragraphs: [
      "We provide ad management, AI calling and follow-up, CRM and pipeline tools, and websites and landing pages for realtors and brokerages, as described on our product and pricing pages.",
    ],
  },
  {
    heading: "Plans and billing",
    paragraphs: [
      `Plans are billed monthly in US dollars, in advance. ${terms.startTerm}. Usage above your plan’s limits is billed at the rates on our pricing page. Ad budgets are paid by you directly to Meta or Google.`,
    ],
  },
  {
    heading: "Your responsibilities",
    paragraphs: [
      "You confirm your lead forms collect valid consent to be contacted by phone and text, including by automated technology and AI voices, and that you’ll follow the laws that apply to you, including the TCPA, state telemarketing laws, Do Not Call rules and real estate advertising rules.",
      "You’re responsible for the accuracy of the listings, offers and information you ask us to advertise.",
    ],
  },
  {
    heading: "Results",
    paragraphs: [
      "Calculator figures and examples are estimates, not guarantees. Results depend on your market, ads, budget and follow-up.",
    ],
  },
  {
    heading: "Cancellation",
    paragraphs: [
      `After the initial term you can cancel with ${legal.cancellationNoticeDays} days’ notice: ${contactLine}. We may suspend the service if payments are overdue.`,
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "We provide our services with reasonable care and skill. We aren’t liable for indirect or consequential losses, such as lost profits, lost deals or ad platform decisions outside our control.",
      "Our total liability to you in any 12-month period is limited to the fees you paid us in that period. Nothing in these terms limits liability that the law doesn’t allow us to limit.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      `These terms are governed by the laws of ${legal.governingLaw}, and its courts have jurisdiction over any dispute.`,
    ],
  },
  {
    heading: "Contact",
    paragraphs: [`Questions about these terms: ${contactLine}.`],
  },
];
