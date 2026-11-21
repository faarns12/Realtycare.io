import type { Metadata } from "next";
import { termsSections } from "@/content/legal";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return <LegalPage title="Terms of service" sections={termsSections} />;
}
