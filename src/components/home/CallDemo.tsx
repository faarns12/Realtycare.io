import { Section } from "@/components/ui";

const steps = [
  { title: "Calls in under 60 seconds*", body: "The AI says it’s your assistant and confirms what the lead asked about." },
  { title: "Asks your questions", body: "Timeline, budget, pre-approval, area and property type. You choose the script." },
  { title: "Books or transfers", body: "Serious leads go on your calendar, or straight to you while they’re still on the line." },
  { title: "Logs everything", body: "Summary, recording and next step saved to your CRM." },
];

const transcript = [
  { who: "ai", text: "Hi Jessica, I’m the AI assistant for Sarah Lane Realty. Are you hoping to move soon?" },
  { who: "lead", text: "In the next 3 months. I’m pre-approved." },
  { who: "ai", text: "Great. Sarah can show it Tuesday at 10 AM. Shall I book it?" },
];

export function CallDemo() {
  return (
    <Section id="how">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="on-dark rounded-[var(--radius-card)] bg-navy-900 p-5 text-white shadow-[var(--shadow-pop)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-700 font-display font-semibold">JL</span>
              <div>
                <p className="font-semibold">Jessica Lane</p>
                <p className="text-[13px] text-navy-300">Facebook lead · 412 Maple Ave</p>
              </div>
            </div>
            <span className="tabular inline-flex items-center gap-1.5 rounded-full bg-sky-400/15 px-2.5 py-1 text-[12px] font-medium text-sky-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" aria-hidden="true" /> Live 00:42
            </span>
          </div>

          <Waveform />

          <div className="mt-2 grid gap-3">
            {transcript.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14.5px] ${m.who === "ai" ? "bg-navy-800" : "ml-auto bg-sky-400 text-navy-900"}`}>
                <p className={`mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${m.who === "ai" ? "text-sky-300" : "text-navy-900/70"}`}>
                  {m.who === "ai" ? "AI assistant" : "Jessica"}
                </p>
                {m.text}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-[12px] font-medium">
            <span className="rounded-full border border-white/15 px-3 py-1">Timeline: 3 months</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Pre-approved</span>
            <span className="rounded-full bg-gold-400 px-3 py-1 text-navy-900">Hot lead</span>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">What the AI does</p>
          <h2 className="text-[34px] font-semibold sm:text-[46px]">
            A real conversation, <em className="accent">not a robocall.</em>
          </h2>
          <ol className="mt-8 grid gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[44px_1fr] gap-4">
                <span className="tabular grid h-11 w-11 place-items-center rounded-full border border-line-strong font-display font-semibold text-sky-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[19px] font-semibold">{s.title}</h3>
                  <p className="mt-1 text-[15px] text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function Waveform() {
  const bars = [6, 14, 22, 12, 28, 18, 34, 20, 10, 26, 16, 30, 12, 22, 8, 18, 28, 14, 24, 10, 20, 32, 16, 8, 22, 12, 26, 18, 10, 14];
  return (
    <svg viewBox="0 0 300 40" className="my-5 h-10 w-full" aria-hidden="true">
      {bars.map((h, i) => (
        <rect key={i} x={i * 10 + 2} y={20 - h / 2} width="4" height={h} rx="2" fill={i < 18 ? "#00C2FF" : "#34557A"} />
      ))}
    </svg>
  );
}
