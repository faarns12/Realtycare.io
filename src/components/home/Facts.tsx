import { Container } from "@/components/ui";

/** Product facts (not results), so they stay true from day one. */
const facts = [
  { value: "60 sec", label: "to call a new lead*" },
  { value: "12 mo", label: "of follow-up for every lead" },
  { value: "8am–9pm", label: "calls in the lead’s time zone" },
  { value: "1 bill", label: "for ads, calling, CRM and site" },
];

export function Facts() {
  return (
    <section aria-label="What you get" className="border-y border-line bg-mist">
      <Container className="grid grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <div key={f.label} className={`px-2 py-7 sm:px-6 ${i % 2 === 1 ? "border-l border-line" : ""} ${i === 2 ? "lg:border-l" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""}`}>
            <p className="font-display text-[30px] font-semibold tracking-[-0.03em] sm:text-[36px]">{f.value}</p>
            <p className="mt-1 text-[14px] text-muted">{f.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
