import type { Metadata } from "next";
import { site } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = { title: "Thanks", robots: { index: false } };

export default function ThankYouPage() {
  return (
    <section className="py-24 text-center sm:py-32">
      <Container>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sky-50 text-sky-700">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h1 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] font-bold">
          Got it. <em className="accent">Talk soon.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[17px] text-muted">We’ll email you within one business day with times for your strategy call.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {site.bookingUrl && (
            <ButtonLink href={site.bookingUrl} arrow>
              Pick a time now
            </ButtonLink>
          )}
          <ButtonLink href="/calculator" variant="outline">
            Run your numbers meanwhile
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
