import type { Metadata } from "next";
import { site } from "@/content/site";
import { terms } from "@/content/plans";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="[DATE]"
      sections={[
        ["Agreement", [`These terms are between you and ${site.legalName} (“${site.name}”, “we”). By using our website or services you agree to them.`]],
        ["Plans and billing", [`Plans are billed monthly in US dollars. ${terms.startTerm}. Usage above your plan’s limits is billed at the rates on our pricing page. Ad budgets are paid by you directly to Meta or Google.`]],
        ["Your responsibilities", ["You confirm your lead forms collect valid consent to be contacted by phone and text, including by automated technology and AI voices, and that you’ll follow the laws that apply to you, including the TCPA, state telemarketing laws and real estate advertising rules."]],
        ["Results", ["Calculator figures and examples are estimates, not guarantees. Results depend on your market, ads and follow-up."]],
        ["Cancellation", ["After the initial term you can cancel with [30] days’ notice by email."]],
        ["Liability", ["[LIMITATION OF LIABILITY WORDING]"]],
        ["Governing law", ["[GOVERNING LAW AND JURISDICTION]"]],
      ]}
    />
  );
}
