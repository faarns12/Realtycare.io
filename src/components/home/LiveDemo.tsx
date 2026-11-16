import { DemoCallForm } from "@/components/forms/DemoCallForm";
import { Section, SectionHead } from "@/components/ui";

const log = [
  ["7:42:03 PM", "Lead submits a Facebook lead ad"],
  ["7:42:04 PM", "Consent and Do Not Call checked"],
  ["7:42:05 PM", "Lead added to your CRM"],
  ["7:42:45 PM", "AI call connects, 42 seconds after the form"],
  ["7:44:10 PM", "Qualified: pre-approved, moving in 3 months"],
  ["7:44:32 PM", "Showing booked for Tue 10:00 AM"],
  ["7:44:33 PM", "You get a text with the summary"],
];

export function LiveDemo() {
  return (
    <Section id="demo">
      <SectionHead
        eyebrow="Try it"
        title={
          <>
            Watch one lead go from <em className="accent">form to booked.</em>
          </>
        }
        intro="Enter your number and our assistant calls you the way it would call a new lead. Ask it anything."
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="on-dark rounded-[var(--radius-card)] bg-navy-900 p-5 text-white sm:p-7">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Event log</p>
            <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[12px] text-navy-300">Example run</span>
          </div>
          <ol className="mt-5 grid">
            {log.map(([t, e], i) => (
              <li key={t} className="grid grid-cols-[92px_1fr] gap-3 border-t border-white/10 py-3 text-[14px]">
                <span className="tabular font-sans text-[12.5px] text-navy-300">{t}</span>
                <span className={i === 5 ? "font-semibold text-gold-400" : "text-white/90"}>{e}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-card)] sm:p-7">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
            </svg>
          </span>
          <h3 className="mt-4 text-[24px] font-semibold">Get called by the AI</h3>
          <p className="mb-6 mt-1 text-[14.5px] text-muted">During calling hours it rings within 60 seconds, asks what you’d ask a lead and offers to book a showing.</p>
          <DemoCallForm />
        </div>
      </div>
    </Section>
  );
}
