import Link from "next/link";
import { bookHref, sixtySecondFootnote } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16">
      <Container className="text-center">
        <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-mist px-3 py-1 text-[13px] font-medium text-muted">
          <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
          Every lead called within 60 seconds*
        </p>
        <h1 className="mx-auto max-w-4xl text-[44px] font-semibold sm:text-[68px] lg:text-[80px]">
          You close the deals.
          <br />
          <em className="accent">We do everything before that.</em>
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
        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <LeadTimeline />
          <BudgetPreview />
        </div>
        <p className="mt-4 text-center text-[12px] text-muted">Example lead and numbers for illustration. {sixtySecondFootnote}</p>
      </Container>
    </section>
  );
}

/** A single lead moving from form to booked appointment. Example data. */
function LeadTimeline() {
  const steps = [
    { t: "0:00", title: "New Facebook lead", body: "Jessica Lane · interested in 3-bed homes in Ann Arbor" },
    { t: "0:42", title: "AI assistant calls", body: "Confirms timeline (3 months), pre-approved, budget $450k" },
    { t: "3:15", title: "Appointment booked", body: "Tuesday 10:00 AM with you · added to your calendar" },
    { t: "3:16", title: "Saved to your CRM", body: "Call summary, recording and next step logged" },
  ];
  return (
    <div className="on-dark rounded-[var(--radius-card)] bg-navy-900 p-5 text-left text-white shadow-[var(--shadow-pop)] sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-300">One lead, start to finish</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/15 px-2.5 py-1 text-[12px] font-medium text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden="true" /> Example
        </span>
      </div>
      <ol className="mt-6 grid gap-0">
        {steps.map((s, i) => (
          <li key={s.t} className="grid grid-cols-[56px_20px_1fr] gap-3">
            <span className="tabular pt-0.5 font-mono text-[13px] text-sky-300">{s.t}</span>
            <span className="relative flex justify-center" aria-hidden="true">
              <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${i === 2 ? "bg-gold-400" : "bg-sky-400"}`} />
              {i < steps.length - 1 && <span className="absolute top-5 bottom-0 w-px bg-white/15" />}
            </span>
            <div className="pb-6">
              <p className="font-display text-[17px] font-semibold tracking-[-0.01em]">{s.title}</p>
              <p className="mt-0.5 text-[14px] text-navy-300">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BudgetPreview() {
  const rows = [
    { k: "Monthly ad budget", v: "$1,500" },
    { k: "Leads it brings", v: "≈ 286" },
    { k: "Likely new clients", v: "4–6" },
  ];
  return (
    <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-mist p-5 text-left sm:p-7">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">What your ad budget turns into</p>
      <dl className="mt-5 grid gap-0">
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline justify-between border-b border-line py-3">
            <dt className="text-[15px] text-muted">{r.k}</dt>
            <dd className="tabular font-display text-[22px] font-semibold">{r.v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 rounded-2xl bg-gold-50 p-4">
        <p className="text-[13px] font-medium text-gold-800">Likely commission at $8,000 a deal</p>
        <p className="tabular font-serif text-[44px] leading-none">$38,171</p>
      </div>
      <Link href="/calculator" className="mt-auto inline-flex items-center gap-2 pt-5 text-[15px] font-semibold text-sky-700 hover:underline">
        Try it with your numbers →
      </Link>
    </div>
  );
}
