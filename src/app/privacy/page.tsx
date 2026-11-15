import type { Metadata } from "next";
import { site } from "@/content/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="[DATE]"
      sections={[
        ["Who we are", [`${site.name} is operated by ${site.legalName} (company no. ${site.companyNumber}), ${site.address}. Contact: ${site.contactEmail}.`]],
        ["What we collect", ["Details you enter in our forms: name, email, phone number, business details and calculator figures. Basic technical data such as pages visited, browser type and campaign tags (for example utm_source)."]],
        ["How we use it", ["To reply to you, arrange calls, send the information you asked for and improve our service. If you ask for a demo call, we call or text the number you give us, including with an AI voice."]],
        ["Calls and texts", ["We only call or text you if you agreed to it. Reply STOP to any text to opt out, or email us. Message and data rates may apply."]],
        ["Who we share it with", ["Service providers that help us run the business, such as hosting (Vercel), Google Workspace (Google Sheets), our calling provider (Vapi) and telephony carriers. We don’t sell your personal information."]],
        ["How long we keep it", ["[RETENTION PERIOD, e.g. 24 months after our last contact], unless the law requires longer."]],
        ["Your rights", ["Depending on where you live (including under UK GDPR and US state laws such as the CCPA), you can ask to access, correct or delete your data, or opt out of marketing. Email us to make a request."]],
        ["Changes", ["We’ll post any changes on this page with a new date."]],
      ]}
    />
  );
}
