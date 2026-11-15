import { bookHref } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";

export function CtaBand({
  title = (
    <>
      Ready to stop <em className="accent">losing leads?</em>
    </>
  ),
  body = "Book a 15-minute call. We’ll look at your lead sources and recommend the right plan.",
}: {
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <div className="on-dark grid gap-6 rounded-[var(--radius-sheet)] bg-navy-900 px-6 py-10 text-white sm:px-10 sm:py-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-[32px] font-semibold text-white sm:text-[42px]">{title}</h2>
            <p className="mt-3 max-w-xl text-navy-300">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={bookHref} variant="bright" arrow>
              Book a call
            </ButtonLink>
            <ButtonLink href="/calculator" variant="ghost-dark">
              Try the calculator
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
