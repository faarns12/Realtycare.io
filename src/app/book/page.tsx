import type { Metadata } from "next";
import { site } from "@/content/site";
import { BookForm } from "@/components/forms/BookForm";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book a strategy call",
  description: "A 15-minute call to look at your lead sources and recommend the right RealtyCare.io plan.",
};

const agenda = [
  ["Your leads today", "Where they come from, how fast they get a call and what happens after."],
  ["Your numbers", "We run the calculator with your real ad budget and commission."],
  ["The right plan", "A straight recommendation, including if you don’t need us yet."],
];

export default function BookPage() {
  return (
    <section className="pb-20 pt-10 sm:pt-16">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">Strategy call · 15 minutes</p>
          <h1 className="text-[44px] font-semibold sm:text-[60px]">
            Let’s look at <em className="accent">your leads.</em>
          </h1>
          <p className="mt-5 text-[17px] text-muted">Tell us a little about your business. We’ll reply within one business day with times that suit you.</p>
          <ol className="mt-10 grid gap-6">
            {agenda.map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[40px_1fr] gap-4">
                <span className="tabular grid h-10 w-10 place-items-center rounded-full bg-navy-900 font-display text-[15px] font-semibold text-white">{i + 1}</span>
                <div>
                  <h2 className="text-[19px] font-semibold">{t}</h2>
                  <p className="mt-1 text-[15px] text-muted">{b}</p>
                </div>
              </li>
            ))}
          </ol>
          {site.bookingUrl && (
            <div className="mt-10 rounded-2xl border border-line bg-mist p-5">
              <p className="font-semibold">Prefer to pick a time now?</p>
              <ButtonLink href={site.bookingUrl} variant="outline" className="mt-3" arrow>
                Open the calendar
              </ButtonLink>
            </div>
          )}
          <p className="mt-10 text-[14px] text-muted">
            Or email us: <span className="select-all font-medium text-ink">{site.contactEmail}</span>
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-pop)] sm:p-8">
          <BookForm />
        </div>
      </Container>
    </section>
  );
}
