import { Section } from "@/components/ui";
import { ConversationShowcase } from "./ConversationShowcase";

const steps = [
  { title: "Calls in under 60 seconds*", body: "The AI says it’s your assistant and confirms what the lead asked about." },
  { title: "Asks your questions", body: "Timeline, budget, pre-approval, area and property type. You choose the script." },
  { title: "Books or transfers", body: "Serious leads go on your calendar, or straight to you while they’re still on the line." },
  { title: "Logs everything", body: "Summary, recording and next step saved to your CRM." },
];

export function CallDemo() {
  return (
    <Section id="how">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <ConversationShowcase />

        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">What the AI does</p>
          <h2 className="text-[clamp(2rem,4vw,2.875rem)] font-bold">
            A real conversation, <span className="accent">not a robocall.</span>
          </h2>
          <ol className="mt-8 grid gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
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
