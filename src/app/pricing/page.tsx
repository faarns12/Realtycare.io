import type { Metadata } from "next";
import { addOns, landingPageOffer, money, websitePlans } from "@/content/plans";
import { pricingFaqs } from "@/content/faqs";
import { bookHref, sixtySecondFootnote } from "@/content/site";
import { PlanCards } from "@/components/pricing/PlanCards";
import { CompareTable } from "@/components/pricing/CompareTable";
import { FaqSection } from "@/components/FaqList";
import { CtaBand } from "@/components/CtaBand";
import { ButtonLink, Check, Container, Section, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Five plans with the prices on the page. Every plan includes 60-second AI calling. No setup fees.",
};

export default function PricingPage() {
  return (
    <>
      <section className="pb-10 pt-10 text-center sm:pt-16">
        <Container>
          <h1 className="text-[44px] font-semibold sm:text-[68px]">
            Know what you pay.
            <br />
            <em className="accent">Know what you get.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[17px] text-muted">Five plans with the prices on the page. Every plan includes 60-second AI calling.* No setup fees; a 3-month start, then month-to-month.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={bookHref} arrow>
              Book a strategy call
            </ButtonLink>
            <ButtonLink href="/calculator" variant="outline">
              Try the calculator
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <PlanCards />
          <p className="mt-6 text-[13px] text-muted">Ad budget is paid directly to Meta or Google, never marked up. Extra leads above your plan are $2 each.</p>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <CompareTable />
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="on-dark grid gap-6 rounded-[var(--radius-sheet)] bg-navy-900 p-6 text-white sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-400">Not ready for a plan?</p>
              <h2 className="mt-2 text-[30px] font-semibold text-white sm:text-[38px]">Start with a {money(landingPageOffer.price)} landing page.</h2>
              <p className="mt-2 max-w-xl text-navy-300">{landingPageOffer.description}</p>
            </div>
            <div className="md:text-right">
              <p className="tabular font-serif text-[64px] leading-none text-gold-400">{money(landingPageOffer.price)}</p>
              <p className="mt-1 text-[14px] text-navy-300">
                one time · hosting ${landingPageOffer.hosting}/mo · extra pages ${landingPageOffer.extraPage}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section id="websites" className="bg-mist">
        <SectionHead
          align="left"
          eyebrow="Website only"
          title={
            <>
              Just need a <em className="accent">website?</em>
            </>
          }
          intro="Websites come with every plan except Solo. Want only the site? Pay monthly, or build it once."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {websitePlans.map((w) => (
            <div key={w.name} className="rounded-[var(--radius-card)] border border-line bg-paper p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-[20px] font-semibold">{w.name}</h3>
              <p className="tabular mt-3 font-display text-[34px] font-semibold tracking-[-0.03em]">
                {w.from && <span className="text-[16px] font-medium text-muted">from </span>}${w.monthly}
                <span className="text-[14px] font-medium tracking-normal text-muted">/mo · 12-month minimum</span>
              </p>
              <p className="mt-1 text-[13.5px] text-muted">
                or build once: {w.from ? "from " : ""}
                {money(w.buildOnce)} + ${w.hosting}/mo hosting
              </p>
              <ul className="mt-5 grid gap-2 border-t border-line pt-5 text-[14px]">
                {w.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-sky-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="add-ons">
        <SectionHead align="left" eyebrow="Add-ons" title="Extras, when you need them." intro="One-time unless marked monthly. Add them to any plan." />
        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {addOns.map((a) => (
            <li key={a.name} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
              <span className="text-[15.5px]">{a.name}</span>
              <span className="tabular whitespace-nowrap font-semibold">
                {money(a.price)}
                {a.monthly ? <span className="font-normal text-muted">/mo</span> : ""}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection
        id="pricing-faq"
        items={pricingFaqs}
        title={
          <>
            Pricing <em className="accent">questions.</em>
          </>
        }
      />
      <CtaBand />
      <p className="px-4 pb-8 text-center text-[12px] text-muted">{sixtySecondFootnote}</p>
    </>
  );
}
