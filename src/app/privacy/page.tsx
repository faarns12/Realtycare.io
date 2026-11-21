import type { Metadata } from "next";
import { privacySections } from "@/content/legal";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" sections={privacySections} />;
}
