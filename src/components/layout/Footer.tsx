import Link from "next/link";
import { footerLinks, site } from "@/content/site";
import { ConsultForm } from "@/components/forms/ConsultForm";
import { Container } from "@/components/ui";
import { Logo } from "./Logo";

const socials = [
  { key: "instagram", label: "Instagram", d: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.5-1.5h.01" },
  { key: "facebook", label: "Facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { key: "linkedin", label: "LinkedIn", d: "M4 9h4v11H4zM6 4a2 2 0 110 4 2 2 0 010-4zm5 5h4v1.6c.6-1 1.9-1.9 3.6-1.9 3 0 3.4 2 3.4 4.6V20h-4v-5.3c0-1.3 0-2.9-1.8-2.9S13 13.2 13 14.6V20h-4z" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark mt-3 overflow-hidden rounded-t-[var(--radius-sheet)] bg-navy-900 text-white">
      <Container className="grid gap-12 pb-10 pt-16 lg:grid-cols-[1.1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-8">
          <Logo tone="dark" />
          <p className="font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[48px]">
            Let’s grow <em className="accent">together.</em>
          </p>
          <div className="flex gap-3">
            {socials.map((s) =>
              site.social[s.key] ? (
                <a key={s.key} href={site.social[s.key]} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={s.d} />
                  </svg>
                </a>
              ) : null,
            )}
          </div>
        </div>

        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-300">What we do</p>
          <ul className="grid gap-2.5 text-[15px]">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/85 hover:text-sky-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-1 font-display text-[22px] font-semibold tracking-[-0.02em]">Book a strategy call</p>
          <p className="mb-5 text-[14px] text-navy-300">Leave your details and we’ll reply within one business day.</p>
          <ConsultForm />
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-white/10 py-6 text-[13px] text-navy-300 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}.
        </p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </div>
      </Container>

      <div aria-hidden="true" className="select-none px-4 text-center font-display text-[19vw] font-bold leading-[0.78] tracking-[-0.06em] text-navy-800 sm:px-6">
        RealtyCare
      </div>
    </footer>
  );
}
