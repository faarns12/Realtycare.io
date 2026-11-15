import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { Section, SectionHead } from "@/components/ui";

/** Hidden until `showTestimonials` is true AND there is at least one real testimonial. */
export function Testimonials() {
  if (!site.showTestimonials || testimonials.length === 0) return null;
  return (
    <Section>
      <SectionHead eyebrow="Clients" title={<>What realtors <em className="accent">say.</em></>} />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-[var(--radius-card)] border border-line bg-paper p-6 shadow-[var(--shadow-card)]">
            <blockquote className="text-[16px]">“{t.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.photo && <img src={t.photo} alt="" className="h-10 w-10 rounded-full object-cover" />}
              <span>
                <span className="block font-semibold">{t.name}</span>
                <span className="text-[13px] text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
