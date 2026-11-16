import type { Metadata } from "next";
import { sixtySecondFootnote } from "@/content/site";
import { Calculator } from "@/components/calculator/Calculator";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ad budget calculator for realtors",
  description: "See how many leads, clients and commission your ad budget brings, and what follow-up costs the usual way compared with RealtyCare.io.",
};

const calcFaqs = [
  { q: "Where do the lead and client numbers come from?", a: "By default, about $5.25 per lead (so $1,500 brings about 280–300 leads), and 4–6 clients for every 300 leads. Your market may be different, so change them under “Fine-tune the assumptions.”" },
  { q: "Where do “the usual way” costs come from?", a: "Callers: about $1,988 a month for an offshore inside sales agent and $5,500+ for a US-based one. CRM: Follow Up Boss lists $69 per user plus $39 for its dialer. Texting, email and agency fees are typical estimates. Edit any of them to match what you pay." },
  { q: "Is this a guarantee?", a: "No. It’s an estimate to help you compare. Real results depend on your market, your ads and how leads are handled." },
];

export default function CalculatorPage() {
  return (
    <>
      <section className="pb-8 pt-10 sm:pt-14">
        <Container className="grid items-end gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">Realtor calculator</p>
            <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold">
              What will your ad budget <em className="accent">turn into?</em>
            </h1>
          </div>
          <p className="text-[16px] text-muted">Enter your ad spend and what you earn per closing. You’ll see likely leads, clients and commission, and what follow-up costs the usual way compared with RealtyCare.io.</p>
        </Container>
      </section>
      <section className="pb-16 sm:pb-24">
        <Container>
          <Calculator />
        </Container>
      </section>
      <section className="pb-16 sm:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <h2 className="text-[38px] font-semibold sm:text-[48px]">
            How these numbers <em className="accent">work</em>
          </h2>
          <FaqList items={calcFaqs} />
        </Container>
      </section>
      <CtaBand title={<>Want these numbers <em className="accent">for your market?</em></>} />
      <p className="px-4 pb-8 text-center text-[12px] text-muted">{sixtySecondFootnote}</p>
    </>
  );
}
