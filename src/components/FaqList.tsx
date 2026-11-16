import type { Faq } from "@/content/faqs";

/** Accordion that works without JavaScript (native <details>). */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="grid gap-3">
      {items.map((f) => (
        <details key={f.q} className="group rounded-2xl border border-line bg-paper px-5 shadow-[0_1px_2px_rgb(15_30_46/0.04)] open:shadow-[var(--shadow-card)]">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-sky-700 transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="pb-5 text-[15px] text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection({ id = "faq", title, items }: { id?: string; title: React.ReactNode; items: Faq[] }) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:px-8">
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">FAQ</p>
          <h2 className="text-[clamp(1.875rem,4vw,3.125rem)] font-bold">{title}</h2>
          <p className="mt-4 max-w-sm text-[15.5px] text-muted">Can’t find your answer? Book a call and ask us directly.</p>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}
