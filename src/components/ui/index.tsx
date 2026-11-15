/**
 * Small shared building blocks. Change spacing, radius or button style here once.
 */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ---------- Layout ---------- */

/** Centres content and keeps a 16px+ side gutter on phones. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Small label above a heading. */
export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] ${
        dark ? "border-white/15 text-sky-300" : "border-line-strong bg-paper text-sky-700"
      }`}
    >
      {children}
    </p>
  );
}

/** Heading + intro, centred or left-aligned. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${dark ? "on-dark" : ""}`}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2 className={`text-[34px] font-semibold sm:text-[48px] ${dark ? "text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-4 text-[17px] ${dark ? "text-navy-300" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}

/* ---------- Buttons ---------- */

type ButtonVariant = "primary" | "bright" | "dark" | "outline" | "ghost-dark";
const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-sky-600 text-white hover:bg-sky-700",
  bright: "bg-sky-400 text-navy-900 hover:bg-sky-300", // for navy backgrounds
  dark: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "border border-line-strong bg-paper text-ink hover:border-ink",
  "ghost-dark": "border border-white/20 text-white hover:bg-white/10",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  arrow?: boolean;
}) {
  const external = href.startsWith("http");
  const cls = `inline-flex min-h-11 whitespace-nowrap items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors ${buttonStyles[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      {...rest}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check({ className = "h-4 w-4 text-sky-600" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Cross({ className = "h-4 w-4 text-muted" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  );
}

/* ---------- Cards ---------- */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[var(--radius-card)] border border-line bg-paper shadow-[var(--shadow-card)] ${className}`}>{children}</div>;
}

export function DarkCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`on-dark rounded-[var(--radius-card)] bg-navy-900 text-white ${className}`}>{children}</div>;
}
