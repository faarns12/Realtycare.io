import { DashboardShowcase } from "./DashboardShowcase";
import { bookHref } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";

export function Hero() {
  return (
    <section className="hero-surface relative pb-16 pt-10 sm:pb-24 sm:pt-16">
      <Container className="text-center">
        <p className="hero-badge mx-auto mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full px-4 py-3 text-[12px] font-medium leading-snug text-navy-900 sm:gap-3 sm:px-6 sm:text-[16px]">
          <svg className="h-5 w-5 shrink-0 text-sky-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m13 4 2.2 5.8L21 12l-5.8 2.2L13 20l-2.2-5.8L5 12l5.8-2.2L13 4Z" fill="currentColor" />
            <path d="m5 2 .9 2.1L8 5l-2.1.9L5 8l-.9-2.1L2 5l2.1-.9L5 2Z" fill="currentColor" opacity=".55" />
            <path d="m4 16 .9 2.1L7 19l-2.1.9L4 22l-.9-2.1L1 19l2.1-.9L4 16Z" fill="currentColor" opacity=".7" />
          </svg>
          <span>Every lead called within <span className="font-semibold">60 seconds*</span></span>
        </p>
        <h1 className="mx-auto max-w-[1100px] text-[clamp(2rem,5vw,4.5rem)] font-bold">
          You close the deals.
          <br />
          <span className="accent hero-accent">We do everything before that.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] text-muted sm:text-[19px]">
          The all-in-one platform for realtors and brokerages. We run your ads, call every lead, follow up for months and set the appointment.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={bookHref} arrow>
            Book a strategy call
          </ButtonLink>
          <ButtonLink href="/#demo" variant="outline">
            Hear the AI call you
          </ButtonLink>
        </div>
      </Container>

      <Container className="mt-14 sm:mt-20">
        <DashboardShowcase />
        <BudgetPreview />
      </Container>
    </section>
  );
}

function BudgetPreview() {
  const rows = [
    { k: "Monthly ad budget", v: "$1,500" },
    { k: "Leads it brings", v: "≈ 286" },
    { k: "Likely new clients", v: "4–6" },
  ];
  return (
    <div className="mx-auto mt-10 grid max-w-[1080px] gap-5 rounded-[var(--radius-card)] border border-line bg-linear-to-br from-white to-sky-50/50 p-5 text-left sm:p-7 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-8">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">What your ad budget turns into</p>
        <dl className="mt-4 grid gap-0 sm:grid-cols-3 sm:gap-6">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline justify-between border-b border-line py-3 sm:block sm:border-b-0 sm:py-0">
              <dt className="text-[14px] text-muted">{r.k}</dt>
              <dd className="tabular font-display text-[22px] font-semibold sm:mt-1 sm:text-[26px]">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-2xl bg-gold-50 p-4">
        <p className="text-[13px] font-medium text-gold-800">Likely commission at $8,000 a deal</p>
        <p className="tabular font-sans text-[40px] font-bold leading-none">$38,171</p>
      </div>
    </div>
  );
}
