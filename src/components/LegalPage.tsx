import { Container } from "@/components/ui";

/** Simple layout for legal text. Sections: [heading, paragraphs[]]. */
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: [string, string[]][] }) {
  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div className="max-w-[760px]">
        <p className="mb-6 rounded-xl border border-gold-400/50 bg-gold-50 px-4 py-3 text-[14px]">
          Draft template. Have a lawyer review this page before launch and replace every item in [brackets].
        </p>
        <h1 className="text-[42px] font-semibold sm:text-[54px]">{title}</h1>
        <p className="mt-3 text-[14px] text-muted">Last updated: {updated}</p>
        <div className="mt-10 grid gap-8">
          {sections.map(([h, ps]) => (
            <div key={h}>
              <h2 className="text-[22px] font-semibold">{h}</h2>
              {ps.map((p, i) => (
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
