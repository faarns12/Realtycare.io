import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="py-28 text-center">
      <Container>
        <p className="tabular font-sans font-bold text-[96px] leading-none text-sky-600">404</p>
        <h1 className="mt-4 text-[36px] font-semibold">This page doesn’t exist.</h1>
        <p className="mt-3 text-muted">It may have moved. Try the home page or the calculator.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/calculator" variant="outline">Calculator</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
