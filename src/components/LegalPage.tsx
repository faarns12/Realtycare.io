import { Container } from "@/components/ui";
import { site } from "@/content/site";
import type { LegalSection } from "@/content/legal";

/** Simple layout for legal text, with the company's contact details up top. */
export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div className="max-w-[760px]">
          <h1 className="text-[clamp(2rem,4.5vw,3.375rem)] font-bold">{title}</h1>
          <p className="mt-3 text-[14px] text-muted">Last updated: {site.legal.lastUpdated}</p>

          <div className="mt-8 grid gap-3 rounded-2xl border border-line bg-mist p-5 text-[15px] sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Email</p>
              <a href={`mailto:${site.contactEmail}`} className="font-medium text-ink hover:underline">
                {site.contactEmail}
              </a>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Phone</p>
              <a href={`tel:${site.phone.tel}`} className="font-medium text-ink hover:underline">
                {site.phone.display}
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-8">
            {sections.map(({ heading, paragraphs }) => (
              <div key={heading}>
                <h2 className="text-[22px] font-semibold">{heading}</h2>
                {paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-[15.5px] text-muted">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
