import type { ReactNode } from "react";
import { Section, SectionHead } from "@/components/ui";

/** "From first inquiry to booked appointment": each step has a small UI preview (example data). */
const steps: { title: string; body: string; ui: ReactNode }[] = [
  {
    title: "Lead captured",
    body: "From your website, landing pages, Facebook lead ads or portals like Zillow. It lands in one inbox.",
    ui: (
      <MiniCard>
        <Row left={<Badge>Facebook</Badge>} right={<span className="text-muted">just now</span>} />
        <p className="mt-3 font-semibold">Marcus Reed</p>
        <p className="text-[13px] text-muted">“What’s my home worth?” · Westfield, IN</p>
      </MiniCard>
    ),
  },
  {
    title: "AI calls within 60 seconds*",
    body: "Your AI assistant calls, introduces itself as an AI and starts a natural conversation.",
    ui: (
      <MiniCard>
        <Row left={<span className="font-semibold">Calling Marcus…</span>} right={<span className="tabular font-mono text-sky-700">0:38</span>} />
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist">
          <div className="h-full w-2/3 rounded-full bg-sky-400" />
        </div>
        <p className="mt-2 text-[13px] text-muted">If no answer: text now, call again in 2 hours</p>
      </MiniCard>
    ),
  },
  {
    title: "Lead qualified",
    body: "Budget, timeline, location and pre-approval, asked the way you would ask them.",
    ui: (
      <MiniCard>
        <div className="flex flex-wrap gap-1.5">
          {["Selling in 60 days", "Owns home", "Also buying", "$520k est."].map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted">Lead score</p>
        <p className="font-display text-[22px] font-semibold">
          86<span className="text-[14px] font-medium text-muted"> / 100</span>
        </p>
      </MiniCard>
    ),
  },
  {
    title: "Appointment booked",
    body: "Qualified leads pick a time on your calendar, or get transferred to you live.",
    ui: (
      <MiniCard>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Thursday</p>
        <div className="mt-2 grid gap-1.5 text-[13px]">
          <div className="rounded-lg bg-mist px-3 py-2 text-muted">9:00 AM · Open</div>
          <div className="rounded-lg bg-sky-600 px-3 py-2 font-semibold text-white">11:30 AM · Listing consult, Marcus Reed</div>
          <div className="rounded-lg bg-mist px-3 py-2 text-muted">2:00 PM · Open</div>
        </div>
      </MiniCard>
    ),
  },
  {
    title: "Deal in your pipeline",
    body: "Every call, note and next step is in your CRM. Leads who aren’t ready stay on follow-up for 12 months.",
    ui: (
      <MiniCard>
        <div className="grid grid-cols-3 gap-2 text-[12px]">
          {[
            ["Qualified", "14"],
            ["Appointment", "6"],
            ["Closed", "2"],
          ].map(([k, v], i) => (
            <div key={k} className={`rounded-lg p-2.5 ${i === 1 ? "bg-sky-50" : "bg-mist"}`}>
              <p className="text-muted">{k}</p>
              <p className="font-display text-[20px] font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </MiniCard>
    ),
  },
];

export function Flow() {
  return (
    <Section className="bg-mist">
      <SectionHead
        eyebrow="How RealtyCare works"
        title={
          <>
            From first inquiry to booked appointment, <em className="accent">here’s the flow.</em>
          </>
        }
        intro="See how RealtyCare captures, calls and qualifies new leads while you keep working your business."
      />
      <ol className="relative mx-auto mt-14 grid max-w-5xl gap-10 sm:gap-6">
        <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-px bg-line-strong md:left-1/2" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative grid grid-cols-[40px_1fr] gap-5 md:grid-cols-[1fr_40px_1fr] md:gap-10">
            <div className={`hidden md:block ${i % 2 ? "md:order-3" : ""}`}>{s.ui}</div>
            <span className="tabular relative z-10 grid h-10 w-10 place-items-center self-start rounded-full bg-navy-900 font-display text-[15px] font-semibold text-white md:order-2 md:self-center">
              {i + 1}
            </span>
            <div className={`md:self-center ${i % 2 ? "md:order-1 md:text-right" : "md:order-3"}`}>
              <h3 className="text-[22px] font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{s.body}</p>
              <div className="mt-4 md:hidden">{s.ui}</div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-center text-[12px] text-muted">Previews use example data.</p>
    </Section>
  );
}

function MiniCard({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-line bg-paper p-4 text-left text-[14px] shadow-[var(--shadow-card)]">{children}</div>;
}
function Row({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      {left}
      {right}
    </div>
  );
}
function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-line bg-mist px-2.5 py-0.5 text-[12px] font-medium text-ink">{children}</span>;
}
